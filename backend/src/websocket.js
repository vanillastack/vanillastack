const uuid = require('uuid')
const WebSocket = require('ws');
const wss = new WebSocket.Server({noServer: true});

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
    const newClient = uuid.v4();
    clients[newClient] = {uuid: newClient};
    return clients[newClient];
}

const getClient = function (uuid) {
    return clients[uuid];
};
const sendMessage = function (msgObject, clientUuid) {

    wss.clients.forEach((client) => {
        if (clientUuid === client.uuid) {
            if (client.readyState === WebSocket.OPEN) { // check this
                client.send(JSON.stringify(msgObject));
            }
        }
    });
};

module.exports = {wss, sendMessage, getClient, createClient};
