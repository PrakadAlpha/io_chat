const express = require('express');
const ejs = require('ejs');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));

const rooms = {};

app.get('/', (req, res) => {
  res.render('index', {rooms: rooms})
})

app.post('/:room', (req, res) => {

  if(rooms[req.body.room] != null){
    return res.redirect('/');
  }
  rooms[req.body.room] = {users: {}};
  res.redirect(req.body.room);
  io.emit('room-created', req.body.room);
});

app.get('/:room', (req, res) => {
  if(rooms[req.params.room] == null){
    return res.redirect('/');
  }
  res.render('room', {roomName: req.params.room});
})

io.on('connection', socket =>{
  socket.on('new-user', (roomName, user) => {
    socket.join(roomName);
    rooms[roomName].users[socket.id] = user;
    socket.to(roomName).broadcast.emit('user-connected', user)
  })
  socket.on('send-chat-message', (roomName,msg) => {
    socket.to(roomName).broadcast.emit('chat-message', {msg: msg, name: rooms[roomName].users[socket.id]});
  })

  socket.on('disconnect', () => {
    getUserRoom(socket).forEach(room => {
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id]);    
      delete rooms[room].users[socket.id];  
    });
  })
})

function getUserRoom(socket){
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if(room.users[socket.id] != null) names.push(name);
    return names;
  }, []);
}

server.listen(3000);
