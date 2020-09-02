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

const sendMessage = function (msgObject, wsClient) {
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

module.exports = {wss, sendMessage};
