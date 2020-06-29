const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => {
    user.room === room &&
    user.name === name
  });
  // senddynamic error if error socketon join server index.js
  if(existingUser) {
    return { error: 'Username is taken' }
  }
  const user = { id, name, room };

  users.push(user);

  return { user }
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) {
    return users.splice(index, 1)[0]
  }
}

const getUser = (id) => {
  users.find((users) => user.id === id);
}

const getUsersInRoom = () => {
  users.filter((user) => user.room === room);
}

module.export = {
  addUser, removeUser, getUser, getUsersInRoom
}