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

io.on('connection', (socket) => {
  console.log('a user connected');
  io.emit('chat message', 'a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('chat message', 'a user disconnected')
  });
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    socket.broadcast.emit('chat message', msg);
  });
});

// console.log(Object.keys(io));