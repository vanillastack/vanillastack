const WebSocket = require('ws');
const proc = require('child_process');
const uuid = require('uuid');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const wss = new WebSocket.Server({noServer: true});
const clients = {};

wss.on('connection', function connection(ws, client) {
    const wsClient = getClient(client.uuid);
    wsClient.ws = ws;
    console.log('New client connected: ' + wsClient.uuid);
    ws.send(JSON.stringify({
        transactionId: '0',
        event: 'INIT',
        payload: 'Welcome New Client your UUID: ' + wsClient.uuid
    }));

    ws.on('message', function incoming(message) {
        try {
            const data = JSON.parse(message);
            ws.send(JSON.stringify({
                transactionId: ws.uuid,
                event: 'EXECUTION',
                payload: `Received: ${data.payload}`
            }));
        } catch (e) {
            console.log('Something went wrong: %s', e);
        }
    });
    ws.on('close', function close() {
        wsClient.ws = undefined;
        console.log('Client disconnected: ' + wsClient.uuid);
    });
    // ws.send('something');
});

const sendMessage = function (msgObject, wsClient, debug) {
    // console.log(wsClient);
    if (wsClient.ws) {
        if (wsClient.ws.readyState === WebSocket.OPEN) {
            if (debug) {
                console.log(`${msgObject.transactionId}: Sending Message`);
            }
            wsClient.ws.send(JSON.stringify(msgObject));
            return true;
        }
    }
    if (debug) {
        console.log(`${msgObject.transactionId}: Client not Connected`);
    }
    return false;
};

const createClient = function () {
    const {privateKey, publicKey} = getKeyPair();
    const newClient = uuid.v4();
    clients[newClient] = {
        uuid: newClient,
        privateKey: privateKey,
        sshPublicKey: publicKey
    };
    return clients[newClient];
}

const getClient = function (uuid) {
    return clients[uuid];
};

const setNewKeyPair = function (uuid) {
    const client = getClient(uuid);
    if (client) {
        const {privateKey, publicKey} = getKeyPair();
        client.privateKey = privateKey;
        client.sshPublicKey = publicKey;
        return client;
    }
}

const getKeyPair = function () {
    const location = '/tmp'
    // console.log(randPassword(4, 4, 8));
    const execOptions = {
        cwd: `${location}`,
        env: null
    }
    let privateKey;
    let publicKey;
// ssh-keygen -f 'temp.key' -t rsa -b 2048 -N '' -C "$COMMENT"
    try {
        const comment = 'k8s@cloudical.io'
        proc.execSync(`ssh-keygen -f 'temp.key' -t rsa -b 2048 -N '' -C ${comment}`, execOptions);
        // data = data.toString().split(';_;'); // .replace(/(\r\n|\n|\r)/gm, "").split(';_;');
        try {
            privateKey = fs.readFileSync(path.join(location, 'temp.key'), 'utf8'); // data[1];
            publicKey = fs.readFileSync(path.join(location, 'temp.key.pub'), 'utf8').replace(/(\r\n|\n|\r)/gm, ""); // data[2].replace(/(\r\n|\n|\r)/gm, "");
        } catch (e) {
            console.log('Reading KeyPair gone wrong: ', e);
        } finally {
            try {
                fs.unlinkSync(path.join(location, 'temp.key'));
                fs.unlinkSync(path.join(location, 'temp.key.pub'));
            } catch (e) {
                console.log('Cleaning up gone wrong: ', e);
            }
        }
        return {privateKey, publicKey};
    } catch (e) {
        console.log(e);
        return undefined;
    }
}

const connectionCheck = function (transactionId, nodes, wsClient, dryRun, debug) {
    const wsMsg = {
        event: 'INIT',
        transactionId: transactionId,
        payload: ''
    }
    // Send init msg through ws
    sendMessage(wsMsg, wsClient, debug);


    const dir = `/tmp/${wsClient.uuid}`;
    try {
        fs.mkdirSync(dir, {recursive: true});
        fs.writeFileSync(`${dir}/key.pem`, wsClient.privateKey, {mode: 400});
        wsClient.verifiedNodes = null;
        const hostsYaml = {
            all: {
                hosts: {}
            }
        };

        nodes.forEach((node) => {
            hostsYaml.all.hosts[node.host] = {
                ansible_host: node.host,
                ansible_user: node.user,
                ansible_ssh_private_key_file: `${dir}/key.pem`
            }
        });
        // todo: switch from yaml to json
        fs.writeFileSync(`${dir}/hosts.yml`, yaml.safeDump(hostsYaml));

        // Exec ansible connection test
        if (!JSON.parse(dryRun)) {

            wsClient.dryRun = false;

            const options = {
                cwd: dir,
                env: null
            };

            // Setting up ENV
            process.env.ANSIBLE_TIMEOUT = 3;
            process.env.ANSIBLE_HOST_KEY_CHECKING = false;
            process.env.ANSIBLE_LOAD_CALLBACK_PLUGINS = true;
            process.env.ANSIBLE_STDOUT_CALLBACK = 'json';

            proc.exec('ansible all -i hosts.yml -m setup', options, (err, stdout, stderr) => {
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
                            console.log(`${transactionId} connecting to: ${node.host} failed`);
                            node.avail = false;
                            node.freeDiskSpace = '0';
                            node.memory = '0';
                            node.raw = false;
                        } else {
                            node.avail = true;
                            // Setting verified nodes with hostnames
                            wsClient.verifiedNodes[node.host] = ansibleFacts[node.host].ansible_facts.ansible_hostname;
                            if (debug) {
                                console.log(`Hostname ${wsClient.verifiedNodes[node.host]} set for IP: ${node.host}`);
                            }
                            // Adding CPU count
                            node.cpus = ansibleFacts[node.host].ansible_facts.ansible_processor_vcpus;

                            // Searching for raw devices
                            const devices = ansibleFacts[node.host].ansible_facts.ansible_devices;
                            // todo: expand list to match all possible excluded devices
                            const filterList = ['dm', 'sr', 'nbd', 'rbd', 'loop'];
                            for (const [key, value] of Object.entries(devices)) {
                                let raw = true;
                                for (const filter of filterList) {
                                    // filter for raw devices dm* sr* nbd* rbd* loop* devices.holder.length == 0 && partitions empty-object -> raw
                                    if (!key.toString().indexOf(filter)) {
                                        raw = false;
                                    } else {
                                        if (!isEmptyObject(value.partitions) || value.holders.length !== 0) {
                                            raw = false;
                                        }
                                    }
                                }
                                if (raw) {
                                    if (debug) {
                                        console.log(`${transactionId} Found RAW Device: ${key} on ${node.host}`);
                                    }
                                    const size = value.size.split(" ");
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
            });
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

const setup = function (transactionId, basePath, dryRun, wsClient, hostsJson, extraVars, fail, debug) {

    const wsMsg = {
        event: 'INIT',
        transactionId: transactionId,
        payload: ''
    }

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
        fs.mkdirSync(`${dir}/group_vars/all`, {recursive: true});

        const varDir = `${basePath}/group_vars.testing/all/`;
        try {
            const defaultVars = fs.readdirSync(varDir);

            // files object contains all files names
            // log them on console
            defaultVars.forEach(defaultVar => {
                if (debug) {
                    console.log(`${transactionId} Copy default Vars for ${defaultVar}`);
                }
                fs.copyFileSync(`${varDir}${defaultVar}`, `${dir}/group_vars/all/${defaultVar}`);
            });

        } catch (err) {
            console.log(err);
        }

        fs.writeFileSync(`${dir}/key.pem`, wsClient.privateKey, {mode: 400});
        fs.writeFileSync(`${dir}/hosts.json`, JSON.stringify(hostsJson));
        fs.writeFileSync(`${dir}/extra_vars.json`, JSON.stringify(extraVars));

        wsClient.ansibleConfig = hostsJson;
        wsClient.ansibleConfig.all.vars = extraVars;

        if (!JSON.parse(dryRun)) { //&& (process.env.DOCKER || process.env.DOCKER != null)
            const options = {
                cwd: `${basePath}`,
                env: null
            };

            let ans;
            if (debug) {
                console.log(`${transactionId} Calling Ansible with Debug enabled`);
                ans = proc.spawn('ansible-playbook',
                    ['-i', `${dir}/hosts.json`,
                        `${basePath}/type_vanillastack_deploy.yaml`,
                        "-vvvv",
                        "--extra-vars", `@${dir}/extra_vars.json`],
                    options
                );
            } else {
                console.log(`${transactionId} Calling Ansible with Debug disabled`);
                ans = proc.spawn('ansible-playbook',
                    ['-i', `${dir}/hosts.json`,
                        `${basePath}/type_vanillastack_deploy.yaml`,
                        "--extra-vars", `@${dir}/extra_vars.json`],
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

            ans.on('close', code => {
                // todo: fail safety missing
                if (code === 0) {
                    if (debug) {
                        console.log(`${transactionId} Setup completed with Status Code ${code}`);
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
                        console.log(`${transactionId} Setup failed with Status Code ${code}`);
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
                    env: null
                };

                dryExec = proc.spawn('sh',
                    [path.join(dryRunScriptsPath, 'dry-run_setup.sh'), path.join(dryRunScriptsPath, 'helper.txt')], // 'type_vanillastack_deploy.yaml'
                    options
                );
            } else {
                const options = {
                    cwd: `${basePath}`,
                    env: null
                };
                dryExec = proc.spawn('ansible-playbook',
                    ['-i', 'localhost',
                        `${basePath}/type_fail.yaml`],
                    options
                );
            }

            dryExec.stdout.on('data', data => {
                if (debug) {
                    console.log(`${transactionId} Dry-Run STDOUT: ${data.toString()}`);
                }
                wsMsg.event = 'EXECUTION';
                wsMsg.payload = data.toString();
                sendMessage(wsMsg, wsClient, debug);
            });

            dryExec.stderr.on('data', data => {
                if (debug) {
                    console.log(`${transactionId} Dry-Run STDERR: ${data.toString()}`);
                }
                wsMsg.event = 'EXECUTION';
                wsMsg.payload = data.toString();
                sendMessage(wsMsg, wsClient, debug);
            });

            dryExec.on('close', code => {
                // todo: read kubeconfig kubeadm.conf
                if (code === 0) {
                    console.log(`${transactionId} Setup dry-run complete with Status Code ${code}`);
                    const kubeConfTemplate = path.join(__dirname, 'templates/admin.conf.template');
                    if (fs.existsSync(kubeConfTemplate)) {
                        wsClient.setup = fs.readFileSync(kubeConfTemplate, 'utf8');
                    }
                    wsMsg.event = 'DONE';
                    wsMsg.payload = code;
                    sendMessage(wsMsg, wsClient, debug);
                    console.log(`${transactionId} Setup dry-run reading KubeConfig complete`);
                } else {
                    console.log(`${transactionId} Setup dry-run failed with Status Code ${code}`);
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
}

const downloadFile = function (uuid, filename, data) {
    const dir = `/tmp/${uuid}`;
    try {
        fs.mkdirSync(dir, {recursive: true});
        fs.writeFileSync(path.join(dir, filename), data);
    } catch (e) {
        console.log(e);
    }
    return dir
}

// invoke like so: randPassword(5,3,2);
function randPassword(letters, numbers, either) {
    const chars = [
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", // letters
        "0123456789", // numbers
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" // either
    ];

    return [letters, numbers, either].map(function (len, i) {
        return Array(len).fill(chars[i]).map(function (x) {
            return x[Math.floor(Math.random() * x.length)];
        }).join('');
    }).concat().join('').split('').sort(function () {
        return 0.5 - Math.random();
    }).join('')
}

const isEmptyObject = function (obj) {
    return (Object.keys(obj).length === 0 && obj.constructor === Object);
}

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
}

const cleanUpPath = function (debug, transactionId, baseDir, files) {
    try {
        // process.env.ANSIBLE_HOST_KEY_CHECKING = '';
        process.env.ANSIBLE_LOAD_CALLBACK_PLUGINS = false;
        process.env.ANSIBLE_STDOUT_CALLBACK = 'default';
        if (fs.existsSync(baseDir)) {
            if (files != null) {
                files.forEach((file) => {
                    const filePath = path.join(baseDir, file);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    } else {
                        if (debug) {
                            console.error(`${file} does not exist`);
                        }
                    }
                });
            }
            fs.rmdirSync(baseDir, {recursive: true});
        } else {
            if (debug) {
                console.error(`${baseDir} does not exist`);
            }
        }
        if (debug) {
            console.log(`${(transactionId == null) ? '' : transactionId} Cleanup done`);
        }
    } catch (cleaningError) {
        if (debug) {
            console.log('Cleaning up gone wrong: ', cleaningError);
        }
    }
}

const genTransactionId = function () {
    return Math.floor(Math.random() * (999999999 - 100000000)) + 100000000;
};

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

module.exports = {
    wss,
    sendMessage,
    getClient,
    createClient,
    setNewKeyPair,
    connectionCheck,
    setup,
    sleep,
    genTransactionId,
    randPassword,
    downloadFile,
    cleanUpPath
};
