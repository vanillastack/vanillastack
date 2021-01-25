const { cleanUpPath } = require('./helper');
const { sendMessage } = require('./websocket');
const { getClient, createClient } = require('./users');
const fs = require('fs');
const path = require('path');
const proc = require('child_process');
const yaml = require('js-yaml');

const setup = function (
  transactionId,
  basePath,
  dryRun,
  wsClient,
  hostsJson,
  extraVars,
  fail,
  debug
) {
  const wsMsg = {
    event: 'INIT',
    transactionId: transactionId,
    payload: '',
  };

  // Send init msg through ws
  sendMessage(wsMsg, wsClient, debug);
  const dir = `${basePath}/${wsClient.uuid}`;

  try {
    console.log(`${transactionId} Setup started`);

    // create ansible env
    process.env.ANSIBLE_HOST_KEY_CHECKING = false;
    process.env.ANSIBLE_LOAD_CALLBACK_PLUGINS = false;
    process.env.ANSIBLE_STDOUT_CALLBACK = 'default';
    process.env.ANSIBLE_HASH_BEHAVIOUR = 'merge';

    // Copy necessary files for Ansible
    fs.mkdirSync(`${dir}/group_vars/all`, { recursive: true });

    const varDir = `${basePath}/group_vars.testing/all/`;
    try {
      const defaultVars = fs.readdirSync(varDir);

      // files object contains all files names
      // log them on console
      defaultVars.forEach((defaultVar) => {
        if (debug) {
          console.log(`${transactionId} Copy default Vars for ${defaultVar}`);
        }
        fs.copyFileSync(
          `${varDir}${defaultVar}`,
          `${dir}/group_vars/all/${defaultVar}`
        );
      });
    } catch (err) {
      console.log(err);
    }

    fs.writeFileSync(`${dir}/key.pem`, wsClient.privateKey, { mode: 400 });
    fs.writeFileSync(`${dir}/hosts.json`, JSON.stringify(hostsJson));
    fs.writeFileSync(`${dir}/extra_vars.json`, JSON.stringify(extraVars));

    wsClient.ansibleConfig = hostsJson;
    wsClient.ansibleConfig.all.vars = extraVars;

    if (!JSON.parse(dryRun)) {
      //&& (process.env.DOCKER || process.env.DOCKER != null)
      const options = {
        cwd: `${basePath}`,
        env: null,
      };

      let ans;
      if (debug) {
        console.log(`${transactionId} Calling Ansible with Debug enabled`);
        ans = proc.spawn(
          'ansible-playbook',
          [
            '-i',
            `${dir}/hosts.json`,
            `${basePath}/type_vanillastack_deploy.yaml`,
            '-vvvv',
            '--extra-vars',
            `@${dir}/extra_vars.json`,
          ],
          options
        );
      } else {
        console.log(`${transactionId} Calling Ansible with Debug disabled`);
        ans = proc.spawn(
          'ansible-playbook',
          [
            '-i',
            `${dir}/hosts.json`,
            `${basePath}/type_vanillastack_deploy.yaml`,
            '--extra-vars',
            `@${dir}/extra_vars.json`,
          ],
          options
        );
      }

      ans.stdout.on('data', (data) => {
        if (debug) {
          console.log(`${transactionId} STDOUT: ${data.toString()}`);
        }
        wsMsg.event = 'EXECUTION';
        wsMsg.payload = data.toString();
        sendMessage(wsMsg, wsClient, debug);
      });

      ans.stderr.on('data', (data) => {
        if (debug) {
          console.log(`${transactionId} STDERR: ${data.toString()}`);
        }
        wsMsg.event = 'EXECUTION';
        wsMsg.payload = data.toString();
        sendMessage(wsMsg, wsClient, debug);
      });

      ans.on('close', (code) => {
        // todo: fail safety missing
        if (code === 0) {
          if (debug) {
            console.log(
              `${transactionId} Setup completed with Status Code ${code}`
            );
          }
          if (fs.existsSync(`${dir}/admin.conf`)) {
            console.log(`${transactionId} Reading Kube Config`);
            wsClient.setup = fs.readFileSync(`${dir}/admin.conf`, 'utf8');
            wsMsg.event = 'DONE';
            wsMsg.payload = code;
            sendMessage(wsMsg, wsClient, debug);
          } else {
            console.log(`${transactionId} Kube Config not found`);
            wsClient.setup = null;
            wsMsg.event = 'ERROR';
            wsMsg.payload = -1;
            sendMessage(wsMsg, wsClient, debug);
          }
        } else {
          if (debug) {
            console.log(
              `${transactionId} Setup failed with Status Code ${code}`
            );
          }
          wsMsg.event = 'ERROR';
          wsMsg.payload = -1;
          sendMessage(wsMsg, wsClient, debug);
        }
        if (!debug) {
          cleanUpPath(debug, transactionId, dir, ['hosts.json', 'key.pem']);
        }
      });
    } else {
      console.log(`${transactionId} Setup running in dry-run-mode`);
      wsClient.dryRun = true;
      let dryExec;

      if (!fail) {
        const dryRunScriptsPath = path.join(__dirname, '../templates');
        const options = {
          cwd: dryRunScriptsPath,
          env: null,
        };

        dryExec = proc.spawn(
          'sh',
          [
            path.join(dryRunScriptsPath, 'dry-run_setup.sh'),
            path.join(dryRunScriptsPath, 'helper.txt'),
          ], // 'type_vanillastack_deploy.yaml'
          options
        );
      } else {
        const options = {
          cwd: `${basePath}`,
          env: null,
        };
        dryExec = proc.spawn(
          'ansible-playbook',
          ['-i', 'localhost', `${basePath}/type_fail.yaml`],
          options
        );
      }

      dryExec.stdout.on('data', (data) => {
        if (debug) {
          console.log(`${transactionId} Dry-Run STDOUT: ${data.toString()}`);
        }
        wsMsg.event = 'EXECUTION';
        wsMsg.payload = data.toString();
        sendMessage(wsMsg, wsClient, debug);
      });

      dryExec.stderr.on('data', (data) => {
        if (debug) {
          console.log(`${transactionId} Dry-Run STDERR: ${data.toString()}`);
        }
        wsMsg.event = 'EXECUTION';
        wsMsg.payload = data.toString();
        sendMessage(wsMsg, wsClient, debug);
      });

      dryExec.on('close', (code) => {
        // todo: read kubeconfig kubeadm.conf
        if (code === 0) {
          console.log(
            `${transactionId} Setup dry-run complete with Status Code ${code}`
          );
          const kubeConfTemplate = path.join(
            __dirname,
            'templates/admin.conf.template'
          );
          if (fs.existsSync(kubeConfTemplate)) {
            wsClient.setup = fs.readFileSync(kubeConfTemplate, 'utf8');
          }
          wsMsg.event = 'DONE';
          wsMsg.payload = code;
          sendMessage(wsMsg, wsClient, debug);
          console.log(
            `${transactionId} Setup dry-run reading KubeConfig complete`
          );
        } else {
          console.log(
            `${transactionId} Setup dry-run failed with Status Code ${code}`
          );
          wsMsg.event = 'ERROR';
          wsMsg.payload = code;
          sendMessage(wsMsg, wsClient, debug);
        }

        // Cleanup
        if (!debug) {
          cleanUpPath(debug, transactionId, dir, ['hosts.json', 'key.pem']);
        }
      });
    }
  } catch (error) {
    console.log(`Something went wrong: ${error}`);
    wsMsg.event = 'ERROR';
    wsMsg.payload = '-1';
    sendMessage(wsMsg, wsClient, debug);

    // Cleanup
    if (!debug) {
      cleanUpPath(debug, transactionId, dir, ['hosts.yml', 'key.pem']);
    }
  }
};

const downloadFile = function (uuid, filename, data) {
  const dir = `/tmp/${uuid}`;
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), data);
  } catch (e) {
    console.log(e);
  }
  return dir;
};

module.exports = {
  setup,
  downloadFile,
};
