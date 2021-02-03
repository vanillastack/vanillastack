const { cleanUpPath } = require('./helper');
const { sendMessage } = require('./websocket');
const { getClient, createClient } = require('./users');
const fs = require('fs');
const path = require('path');
const proc = require('child_process');
const yaml = require('js-yaml');

const connectionCheck = function (
  transactionId,
  nodes,
  wsClient,
  dryRun,
  debug
) {
  const wsMsg = {
    event: 'INIT',
    transactionId: transactionId,
    payload: '',
  };
  // Send init msg through ws
  sendMessage(wsMsg, wsClient, debug);

  const dir = `/tmp/${wsClient.uuid}`;
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(`${dir}/key.pem`, wsClient.privateKey, { mode: 400 });
    wsClient.verifiedNodes = null;
    const hostsYaml = {
      all: {
        hosts: {},
      },
    };

    nodes.forEach((node) => {
      hostsYaml.all.hosts[node.host] = {
        ansible_host: node.host,
        ansible_user: node.user,
        ansible_ssh_private_key_file: `${dir}/key.pem`,
      };
    });
    // todo: switch from yaml to json
    fs.writeFileSync(`${dir}/hosts.yml`, yaml.safeDump(hostsYaml));

    // Exec ansible connection test
    if (!JSON.parse(dryRun)) {
      wsClient.dryRun = false;

      const options = {
        cwd: dir,
        env: null,
      };

      // Setting up ENV
      process.env.ANSIBLE_TIMEOUT = 3;
      process.env.ANSIBLE_HOST_KEY_CHECKING = false;
      process.env.ANSIBLE_LOAD_CALLBACK_PLUGINS = true;
      process.env.ANSIBLE_STDOUT_CALLBACK = 'json';

      proc.exec(
        'ansible all -i hosts.yml -m setup',
        options,
        (err, stdout, stderr) => {
          if (err) {
            if (err.code !== 4) {
              console.error(err);
              wsClient.verifiedNodes = null;
              wsMsg.event = 'ERROR';
              wsMsg.payload = '-1';
              sendMessage(wsMsg, wsClient, debug);
              cleanUpPath(debug, transactionId, dir, ['hosts.yml', 'key.pem']);
              return;
            }
          }
          if (stdout) {
            wsClient.verifiedNodes = {};
            const ansibleFacts = JSON.parse(stdout).plays[0].tasks[0].hosts;
            const ansibleStats = JSON.parse(stdout).stats;
            nodes.forEach((node) => {
              // console.log(stdoutJson[node.host]);
              if (ansibleStats[node.host].unreachable) {
                console.log(
                  `${transactionId} connecting to: ${node.host} failed`
                );
                node.avail = false;
                node.freeDiskSpace = '0';
                node.memory = '0';
                node.raw = false;
              } else {
                node.avail = true;
                // Setting verified nodes with hostnames
                wsClient.verifiedNodes[node.host] =
                  ansibleFacts[node.host].ansible_facts.ansible_hostname;
                if (debug) {
                  console.log(
                    `Hostname ${
                      wsClient.verifiedNodes[node.host]
                    } set for IP: ${node.host}`
                  );
                }
                // Adding CPU count
                node.cpus =
                  ansibleFacts[node.host].ansible_facts.ansible_processor_vcpus;

                // Searching for raw devices
                const devices =
                  ansibleFacts[node.host].ansible_facts.ansible_devices;
                // todo: expand list to match all possible excluded devices
                const filterList = ['dm', 'sr', 'nbd', 'rbd', 'loop'];
                for (const [key, value] of Object.entries(devices)) {
                  let raw = true;
                  for (const filter of filterList) {
                    // filter for raw devices dm* sr* nbd* rbd* loop* devices.holder.length == 0 && partitions empty-object -> raw
                    if (!key.toString().indexOf(filter)) {
                      raw = false;
                    } else {
                      if (
                        !isEmptyObject(value.partitions) ||
                        value.holders.length !== 0
                      ) {
                        raw = false;
                      }
                    }
                  }
                  if (raw) {
                    if (debug) {
                      console.log(
                        `${transactionId} Found RAW Device: ${key} on ${node.host}`
                      );
                    }
                    const size = value.size.split(' ');
                    node.raw = true;
                    node.diskSpace = convertSizeToGib(size[0], size[1]);
                  }
                }
                if (!node.raw) {
                  node.raw = false;
                  node.diskSpace = 0;
                }
              }
              wsMsg.event = 'EXECUTION';
              wsMsg.payload = JSON.stringify(node);
              sendMessage(wsMsg, wsClient, debug);
            });
          }
          if (stderr) {
            if (debug) {
              console.log(`An Error occurred, STDERR:\n${stderr}`);
            }
            wsMsg.event = 'EXECUTION';
            wsMsg.payload = JSON.stringify(stderr);
            sendMessage(wsMsg, wsClient, debug);
          }
          //CleanUp
          cleanUpPath(debug, transactionId, dir, ['hosts.yml', 'key.pem']);
          wsMsg.event = 'DONE';
          wsMsg.payload = '0';
          sendMessage(wsMsg, wsClient, debug);
        }
      );
    } else {
      wsClient.dryRun = true;
      console.log(`${transactionId} Connection check running in dry-run-mode`);
      wsClient.verifiedNodes = null;
      nodes.forEach((node) => {
        node.avail = true;
        node.cpus = 4;
        node.raw = true;
        node.freeDiskSpace = '30';
        node.memory = '2';

        wsMsg.event = 'EXECUTION';
        wsMsg.payload = JSON.stringify(node);
        sendMessage(wsMsg, wsClient, debug);
      });
      wsMsg.event = 'DONE';
      wsMsg.payload = '0';
      sendMessage(wsMsg, wsClient, debug);
      console.log(`${transactionId} Dry-run complete continuing with cleanup`);
      // Cleanup
      cleanUpPath(debug, transactionId, dir, ['hosts.json', 'key.pem']);
    }
  } catch (e) {
    console.log(`Something went wrong: ${e}`);
    wsMsg.event = 'DONE';
    wsMsg.payload = '-1';
    sendMessage(wsMsg, wsClient, debug);

    // Cleanup
    cleanUpPath(debug, transactionId, dir, ['hosts.yml', 'key.pem']);
  }
};

const isEmptyObject = function (obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

const convertSizeToGib = function (size, format) {
  if (format === 'GB') {
    return parseInt(size, 10) / 1.073741824;
  } else if (format === 'MB') {
    return parseInt(size, 10) / 1073.741824;
  } else if (format === 'TB') {
    return parseInt(size, 10) / 0.001073741824;
  } else if (format === 'KB') {
    return parseInt(size, 10) / 1073741824;
  } else {
    return parseInt(size, 10);
  }
};

module.exports = {
  connectionCheck,
};
