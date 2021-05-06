const { json } = require('body-parser');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use('/js', express.static('js'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

const nickNames = {}
io.on('connection', (socket) => {
  io.emit('connection status', 'a user connected')
  socket.on('disconnect', () => {
    io.emit('connection status', 'a user disconnected')
    delete nickNames[socket.id];
    io.emit('online users', Object.values(nickNames)); 
  });
  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', `${nickNames[socket.id]}: ${msg}`);
  });
  socket.on('set nickname', (nick) => {
    nickNames[socket.id] = nick;
    io.emit('online users', Object.values(nickNames));
  });
  socket.on('typing status', (status) => {
    if(status) {
      socket.broadcast.emit('typing status', 'other is typing ....' )
    } if(!status) {
      socket.broadcast.emit('typing status', '' )
    };
  });
});

// console.log(Object.keys(io));
console.log(nickNames);