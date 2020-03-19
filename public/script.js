const socket = io('http://localhost:3000');

const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const messageContainer = document.getElementById('message-container');
const roomContainer = document.getElementById('room-container');

if(messageForm != null){
  const name = prompt('Enter name:');
  appendMsg('You Joined'); 
  socket.emit('new-user', roomName, name);


messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageInput.value;
  appendMsg(`You: ${message}`);
  socket.emit('send-chat-message', roomName, message);
  messageInput.value = '';
});
  
}


socket.on('chat-message', (msg) => {
  appendMsg(`${msg.name}: ${msg.msg}`);
});

socket.on('user-connected', (user) => {
  appendMsg(`${user} connected..`);
});

socket.on('user-disconnected', (user) => {
  appendMsg(`${user} disconnected..`);
});

socket.on('room-created', data => {
  const rootElement = document.createElement('div');
  rootElement.innerText = data;
  const rootLink = document.createElement('a');
  rootLink.href = `/${data}`;
  rootLink.innerText = 'Join';
  roomContainer.append(rootElement);
  roomContainer.append(rootLink);
})

function appendMsg(message){ 
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}