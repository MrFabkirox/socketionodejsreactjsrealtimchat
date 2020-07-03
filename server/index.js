const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom }
  = require('./users.js');

const PORT  = process.env.PORT  || 5000;
const router = require('./router');
const app = express();
const server = http.createServer(app);

// // handling cors error
// app.use((req, res, next) => {
//   res.header('Access-Controller-Allow-Origin', '*');
//   res.header('Access-Controller-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   );
//   if(req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//     return res.status(200).json({
//       // header: res.header // to try later
//     });
//   }
//   console.log("______cors_____")
//   next();
// });

const io = socketio(server)

io.on('connection', (socket) => {
  console.log("1_______ socket [%o]", socket.handshake);

  socket.on('join', ({ name, room }, callback) => {
    console.log("2_______ room [%o]", room);

    const { error, user } = addUser({
      id: socket.id, name, room
    });
    console.log("3_______ addUser [%o]", addUser);

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
    console.log('4________server index io on join user/room', name, room);

    io.to(user.room).emit('roomData', {
      room: user.room, users: getUsersInRoom(user.room)})

    callback();
  });

  // 1
  // const error = true;

  // // received client/src/components/Chat/Chat.js socket.emit('join'
  // if(error == true) {
  //   callback({ error: 'err'});
  // };

  // we wait expected message on the back from front
  socket.on('sendMessage', () => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', {
      user: user.name,
      text: message
    });
    io.to(user.room).emit('roomData', {
      room: user.room,
      text: message
    });
    callback();
  });

  socket.on('disconnect', () => {
    console.log('user left');

    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', {
        user: 'admin',
        text: `${user.name} had left`})
    }
  });
});

app.use(router);
app.use(cors());

server.listen(PORT, () => {
  console.log(`Server at ${PORT}`)
})
