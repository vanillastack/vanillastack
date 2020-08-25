const uuid = require('uuid')
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

const clients = {};
const clientArray = [];

wss.on('connection', function connection(ws) {
    console.log('New client connected')
    ws.uuid = uuid.v4();
    ws.send(`Welcome New Client your UUID: ${ws.uuid}`)
    clients[ws.uuid] = ws;
    clientArray.push(ws);
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        console.log(ws.uuid);
        ws.send(`Received: ${message}`);
    });

    // ws.send('something');
});

const getClients = function (){
    return clients;
};
const sendMessage = function (uuid, msg){
    wss.clients.forEach((client) => {
        if (uuid === client.uuid) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg);
            }
        }
    });
}

// module.exports = {sendMessage, wss, clients};
// module.exports = WebSocket;
module.exports = {wss, sendMessage, getClients, clients, clientArray};
