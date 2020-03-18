const socket = io('http://localhost:3000');

const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const messageContainer = document.getElementById('message-container');

const name = prompt('Enter name:');
appendMsg('You Joined'); 
socket.emit('new-user', name);

socket.on('chat-message', (msg) => {
  appendMsg(`${msg.name}: ${msg.msg}`);
});

socket.on('user-connected', (user) => {
  appendMsg(`${user} connected..`);
});

socket.on('user-disconnected', (user) => {
  appendMsg(`${user} disconnected..`);
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageInput.value;
  appendMsg(`You: ${message}`);
  socket.emit('send-chat-message', message);
  messageInput.value = '';
});

function appendMsg(message){ 
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}