const WebSocket = require('ws');
const proc = require('child_process');
const uuid = require('uuid');
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

const getKeyPair = function () {

    const execOptions = {
        cwd: '/usr/workdir/src',
        env: null
    }

    try {
        let data = proc.execSync("sh keygen.sh", execOptions);
        data = data.toString().replace(/(\r\n|\n|\r)/gm, "").split(';_;');
        const privateKey = data[1];
        const publicKey = data[2];
        return {privateKey, publicKey};
    } catch (e) {
        console.log(e);
        return undefined;
    }
}

const connectionCheck = function (transactionId, wsClient) {
    const wsMsg = {
        event: 'INIT',
        transactionId: transactionId,
        payload: ''
    }
    sendMessage(wsMsg, wsClient);
    const spawnOptions = {
        cwd: '/usr/workdir/src',
        env: null,
        detached: false
    };
    // console.log(wsClient);
    const ans = proc.spawn(
        'ansible-playbook',
        ['test-playbook.yaml', '-e host=localhost'],
        spawnOptions
    );
    // const ans = proc.spawn('ls', ['-lha'], spawnOptions);

    ans.stdout.on('data', stdout => {
        // console.log(stdout.toString());
        wsMsg.event = 'EXECUTION';
        wsMsg.payload = stdout.toString();
        sendMessage(wsMsg, wsClient);
    });

    ans.stderr.on('data', stderr => {
        // console.log(stderr.toString());
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
};

module.exports = {wss, sendMessage, getClient, createClient, connectionCheck};
