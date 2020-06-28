const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom }
  = require('./users.js');

const cors = require('cors')

const PORT  = process.env.PORT  || 5000;

const router = require('./router');

const app = express();
app.use(cors())

const server = http.createServer(app);
const io = socketio(server)

io.on('connection', (socket) => {
  console.log('new connection');

  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({
      id: socket.id, name, room
    });
      
    if(error) return callback(error);
    // emit from the back to the frontend
    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome to the room ${user.room}`
    });
    socket.broadcast.to(user.room).emit('message', {
      user: 'admin',
      text: `${user.name}, has joined`
    })

    socket.join(user.room);

    callback();
  });
  console.log(name, room);

  // 1
  // const error = true;

  // // received client/src/components/Chat/Chat.js socket.emit('join'
  // if(error == true) {
  //   callback({ error: 'err'});
  // };
});

// we wait expected message on the back from front
socket.on('sendMessage', () => {
  const user = getUser(socket.id);

  io.to(user.room).emit('message', {
    user: user.name,
    text: message
  });
  callback();
});

socket.on('disconnect', () => {
  console.log('user left');
});

app.use(router);

server.listen(PORT, () => {
  console.log(`Server at ${PORT}`)
})
