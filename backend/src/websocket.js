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

const sendMessage = function (msgObject, wsClient) {
    // console.log(wsClient);
    if (wsClient.ws) {
        if (wsClient.ws.readyState === WebSocket.OPEN) {
            console.log(`${msgObject.transactionId}: Sending Message`);
            wsClient.ws.send(JSON.stringify(msgObject));
            return true;
        }
    }
    console.log(`${msgObject.transactionId}: Client not Connected`);
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
    const location = '/usr/workdir/src'
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

const connectionCheck = function (transactionId, node, wsClient, dryRun) {
    const wsMsg = {
        event: 'INIT',
        transactionId: transactionId,
        payload: ''
    }

    const dir = createDir(`/tmp/${wsClient.uuid}`);
    sendMessage(wsMsg, wsClient);

    fs.writeFileSync(`${dir}/private.key`, wsClient.privateKey, function (err, file) {
        if (err) throw err;
        console.log('saved file', file);
    });

    const hostsYaml = {
        all: {
            hosts: {
                test_node: {
                    ansible_ssh_host: node.host,
                    ansible_ssh_private_key_file: `${dir}/private.key`
                }
            }
        }
    }

    writeYaml(`${dir}/hosts.yml`, hostsYaml);

    if (!dryRun) {
        const spawnOptions = {
            cwd: dir,
            env: null,
            detached: false
        };

        const ans = proc.spawn(
            'ansible',
            ['all', '-i', 'hosts.yml', '-u', node.user, '-m ping'],
            spawnOptions
        );

        ans.stdout.on('data', stdout => {
            console.log(stdout.toString());
            wsMsg.event = 'EXECUTION';
            wsMsg.payload = stdout.toString();
            sendMessage(wsMsg, wsClient);
        });
        ans.stderr.on('data', stderr => {
            console.log(stderr.toString());
            wsMsg.event = 'EXECUTION';
            wsMsg.payload = stderr.toString();
            sendMessage(wsMsg, wsClient);
        });

        ans.on('close', code => {
            console.log(`${wsMsg.transactionId}: Return Code: ${code}`);
            wsMsg.event = 'DONE';
            wsMsg.payload = 'Execution completed';
            sendMessage(wsMsg, wsClient);
        });
    }
};

const createDir = function (path) {
    try {
        return fs.mkdirSync(path, {recursive: true});
    } catch (e) {
        console.error('Something went wrong: ', e);
    }
}

const writeFile = function (location, data) {
    try {
        // const template = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'templates/hosts.temp.yml')));
        fs.writeFileSync(location, data, function (err, file) {
            if (err) throw err;
            return file;
        })
    } catch (e) {
        console.log(e);
    }
}

const writeYaml = function (location, data) {
    try {
        // const template = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'templates/hosts.temp.yml')));
        fs.writeFileSync(location, yaml.safeDump(data), function (err, file) {
            if (err) throw err;
            return file;
        })
    } catch (e) {
        console.log(e);
    }
}

module.exports = {wss, sendMessage, getClient, createClient, setNewKeyPair, connectionCheck, writeYaml};
