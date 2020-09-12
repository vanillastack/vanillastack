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
    const location = '/tmp'
    console.log(randPassword(4, 4, 8));
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

const connectionCheck = function (transactionId, nodes, wsClient, dryRun) {
    const wsMsg = {
        event: 'INIT',
        transactionId: transactionId,
        payload: ''
    }
    // Send init msg through ws
    sendMessage(wsMsg, wsClient);


    const dir = `/tmp/${wsClient.uuid}`;
    try {
        fs.mkdirSync(dir, {recursive: true});
        fs.writeFileSync(`${dir}/key.pem`, wsClient.privateKey, {mode: 400});

        const hostsYaml = {
            all: {
                hosts: {}
            }
        };

        nodes.forEach((node, i) => {
            hostsYaml.all.hosts[`node-${i}`] = {
                ansible_ssh_host: node.host,
                ansible_user: node.user,
                ansible_ssh_private_key_file: `${dir}/key.pem`
            }
        });

        fs.writeFileSync(`${dir}/hosts.yml`, yaml.safeDump(hostsYaml));

        // Exec ansible connection test
        if (!Boolean(dryRun)) {
            const spawnOptions = {
                cwd: dir,
                env: null,
                detached: false
            };

            const ans = proc.spawn(
                'ansible',
                ['all', '-i', 'hosts.yml', '-m', 'setup'],
                spawnOptions
            );
            // todo: filtering response object for raw, freeDiskSpace
            ans.stdout.on('data', stdout => {
                const out = stdout.toString().substring(stdout.toString().indexOf('{'));
                console.log(out);
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

                // Cleanup
                try {
                    fs.rmdirSync(dir, {recursive: true});
                    console.log(`${transactionId} Cleanup done`);
                    console.log(`${transactionId} Connection check completed`);
                } catch (cleaningError) {
                    console.log('Cleaning up gone wrong: ', cleaningError);
                }
            });
        } else {
            console.log(`${transactionId} Connection check running in dry-run-mode`);
            nodes.forEach((node) => {
                node.avail = true;
                node.raw = true;
                node.feediskspace = '30'

                wsMsg.event = 'EXECUTION';
                wsMsg.payload = JSON.stringify(node);
                sendMessage(wsMsg, wsClient);

            });
            wsMsg.event = 'DONE';
            wsMsg.payload = '0';
            sendMessage(wsMsg, wsClient);
            console.log(`${transactionId} Dry-run complete continuing with cleanup`);
            // Cleanup
            try {
                fs.rmdirSync(dir, {recursive: true});
                console.log(`${transactionId} Cleanup done`);
                console.log(`${transactionId} Connection check completed`);
            } catch (cleaningError) {
                console.log('Cleaning up gone wrong: ', cleaningError);
            }
        }
    } catch (e) {
        console.log(`Something went wrong: ${e}`);
        wsMsg.event = 'DONE';
        wsMsg.payload = '-1';
        sendMessage(wsMsg, wsClient);

        // Cleanup
        try {
            fs.rmdirSync(dir, {recursive: true});
            console.log(`${transactionId} Cleanup done`);
        } catch (cleaningError) {
            console.log('Cleaning up gone wrong: ', cleaningError);
        }
    }
};

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

// invoke like so: randPassword(5,3,2);

module.exports = {wss, sendMessage, getClient, createClient, setNewKeyPair, connectionCheck};
