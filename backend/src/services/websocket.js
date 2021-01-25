const WebSocket = require('ws');
const proc = require('child_process');
const uuid = require('uuid');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const { getClient, createClient } = require('./users');
const { cleanUpPath } = require('./helper');

const wss = new WebSocket.Server({ noServer: true });

// todo: ws object in user objects needs to be reformed to an array, as currently a new session overrides an old session
wss.on('connection', function connection(ws, client) {
  const wsClient = getClient(client.uuid);
  wsClient.ws = ws;
  console.log('New client connected: ' + wsClient.uuid);
  ws.send(
    JSON.stringify({
      transactionId: '0',
      event: 'INIT',
      payload: 'Welcome New Client your UUID: ' + wsClient.uuid,
    })
  );

  ws.on('message', function incoming(message) {
    try {
      const data = JSON.parse(message);
      ws.send(
        JSON.stringify({
          transactionId: ws.uuid,
          event: 'EXECUTION',
          payload: `Received: ${data.payload}`,
        })
      );
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

module.exports = {
  wss,
  sendMessage,
};
