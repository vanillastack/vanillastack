const uuid = require('uuid')
const WebSocket = require('ws');
const {generateKeyPairSync} = require('crypto');
const wss = new WebSocket.Server({noServer: true});
const forge = require('node-forge');

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
    const {publicKey, privateKey} = genPublicPrivateKey();
    const newClient = uuid.v4();
    clients[newClient] = {
        uuid: newClient,
        publicKey: publicKey,
        privateKey: privateKey
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
    // const keypair = forge.pki.rsa.generateKeyPair({bits: 2048, e: 0x10001});
    // // console.log(keypair.publicKey);
    // // const forgePublicKey = forge.pki.setRsaPublicKey(keypair.privateKey.n, keypair.privateKey.e);
    // // const sshAltPublicKey = forge.ssh.publicKeyToOpenSSH(forgePublicKey);
    // const sshPublicKeyNew = forge.ssh.publicKeyToOpenSSH(keypair.publicKey, 'admin@braceyourselv.es');
    // // const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);
    // // console.log(sshAltPublicKey);
    // // console.log(sshPublicKey);
    //
    // // const {generateKeyPairSync} = require('crypto');
    // // const {publicKey, privateKey} = generateKeyPairSync('rsa', {
    // //     modulusLength: 4096,
    // //     publicKeyEncoding: {
    // //         type: 'spki',
    // //         format: 'pem'
    // //     },
    // //     privateKeyEncoding: {
    // //         type: 'pkcs8',
    // //         format: 'pem',
    // //         cipher: 'aes-256-cbc',
    // //         passphrase: ''
    // //     }
    // // });
    // // const publicKeyNew = forge.pki.publicKeyFromPem(publicKey);
    // // const sshPublicKeyNew = forge.ssh.publicKeyToOpenSSH(publicKeyNew);
    // // console.log(publicKey);
    // console.log(sshPublicKeyNew);
    const sshPublicKey = '';
    const privateKeyNew = '';
    return {sshPublicKey, privateKeyNew};
}

module.exports = {wss, sendMessage, getClient, createClient};
