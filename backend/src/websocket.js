const uuid = require('uuid')
const WebSocket = require('ws');
const {generateKeyPairSync} = require('crypto');
const wss = new WebSocket.Server({noServer: true});
const sshpk = require('sshpk');

const clients = {};

wss.on('connection', function connection(ws, client) {
    clients[client.uuid].ws = ws;
    console.log('New client connected: ' + clients[client.uuid].uuid);
    ws.send(JSON.stringify({
        transactionId: '0',
        event: 'INIT',
        payload: 'Welcome New Client your UUID: ' + clients[client.uuid].uuid
    }));

    ws.on('message', function incoming(message) {
        try {
            const data = JSON.parse(message);
            // console.log(`received:\ntransactionId: ${data.transactionId}, event: ${data.event}, payload: ${data.payload}`);
            ws.send(JSON.stringify({
                transactionId: ws.uuid,
                event: 'EXECUTION',
                payload: `Received: ${data.payload}`
            }));
        } catch (e) {
            console.log('Something went wrong: %s', e);
        }
        // console.log('received: %s', message);
        // console.log(`Received: ${message.payload}`);
    });
    ws.on('close', function close() {
        clients[client.uuid].ws = undefined;
    });
    // ws.send('something');
});

const createClient = function () {
    const {sshPublicKey, privateKey} = genPublicPrivateKey();
    const newClient = uuid.v4();
    clients[newClient] = {
        uuid: newClient,
        privateKey: privateKey,
        sshPublicKey: sshPublicKey
    };
    return clients[newClient];
}

const getClient = function (uuid) {
    return clients[uuid];
};
const sendMessage = function (msgObject, wsClient) {
    if (wsClient && wsClient.ws) {
        if (wsClient.ws.readyState === WebSocket.OPEN) {
            wsClient.ws.send(JSON.stringify(msgObject));
        }
    }
};

// todo: piv and pub keygen for client-onj
const genPublicPrivateKey = function () {

    const privateKey = sshpk.generatePrivateKey('ed25519');
    const publicKey = privateKey.toPublic();
    publicKey.comment = 'k8s@cloudical.io';
    // console.log(privateKey.toString('pkcs1'));
    const sshPublicKey = publicKey.toString('ssh');
    const privateAltKeyNew = '';
    return {sshPublicKey, privateKey};
}

module.exports = {wss, sendMessage, getClient, createClient};
