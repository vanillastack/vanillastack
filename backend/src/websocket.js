const uuid = require('uuid')
const WebSocket = require('ws');
const wss = new WebSocket.Server({noServer: true});

const clients = {};
const clientArray = [];

wss.on('connection', function connection(ws) {
    console.log('New client connected')
    ws.uuid = uuid.v4();
    ws.send(JSON.stringify({
        transactionId: ws.uuid,
        event: 'INIT',
        payload: 'Welcome New Client your UUID: ' + ws.uuid
    }));
    clients[ws.uuid] = ws;
    clientArray.push(ws);
    ws.on('message', function incoming(message) {
        try {
            const data = JSON.parse(message);
            console.log(`received:\ntransactionId: ${data.transactionId}, event: ${data.event}, payload: ${data.payload}`);
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

    // ws.send('something');
});

const getClients = function () {
    return clients;
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
//
// {
//     "transactionId": number
//     "event": INIT/EXECUTION/DONE
//     "payload":
// }

// module.exports = {sendMessage, wss, clients};
// module.exports = WebSocket;
module.exports = {wss, sendMessage, getClients, clients, clientArray};
