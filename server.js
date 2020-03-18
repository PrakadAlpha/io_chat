const express = require('express');
const io = require('socket.io')(3000);

let users = {};

io.on('connection', socket =>{
  socket.on('new-user', user => {
    users[socket.id] = user;
    socket.broadcast.emit('user-connected', user)
  })
  socket.on('send-chat-message', msg => {
    socket.broadcast.emit('chat-message', {msg: msg, name: users[socket.id]});
  })

  socket.on('disconnect', user => {
    socket.broadcast.emit('user-disconnected', user[socket.id]);    
    delete users[socket.id];
  })
})
