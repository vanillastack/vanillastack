// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:3000');

// Open a connection
socket.addEventListener('open', function (event) {
  console.log('Connected to WS');
});

// Listen for messages
var msgInput = document.getElementById('msgBox');

// Responding to the ENTER key
msgInput.addEventListener('keydown', function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById('msgSendButton').click();
  }
});

// EventListener for response from Server
socket.addEventListener('message', function (event) {
  console.log('Message from server ', event.data);
  const liNode = document.createElement('LI');
  liNode.classList.add('received');
  const msgNode = document.createTextNode(event.data);
  liNode.appendChild(msgNode);
  document.getElementById('messages').appendChild(liNode);
});

// Sending a message to the server
// TODO: Is this really required?
const sendMessage = () => {
  socket.send(document.getElementById('msgBox').value);
  const liNode = document.createElement('LI');
  liNode.classList.add('send');
  const msgNode = document.createTextNode(
          document.getElementById('msgBox').value
  );

  liNode.appendChild(msgNode);
  document.getElementById('messages').appendChild(liNode);
  document.getElementById('msgBox').value = '';
};