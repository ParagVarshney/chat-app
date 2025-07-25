const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const Message = require('./models/Message');
const User = require('./models/User');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/messages', require('./routes/messageRoutes'));

let users = [];

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinRoom', async ({ username, room }) => {
    socket.join(room);
    const user = { username, socketId: socket.id, room };
    users.push(user);

    await User.create(user);

    const roomUsers = users.filter(u => u.room === room);
    io.to(room).emit('onlineUsers', roomUsers);

    const welcomeMsg = {
      sender: 'Server',
      text: `${username} has joined the room.`,
      room
    };
    io.to(room).emit('chatMessage', welcomeMsg);
  });

  socket.on('chatMessage', async ({ sender, text, room }) => {
    const newMsg = await Message.create({ sender, text, room });
    io.to(room).emit('chatMessage', newMsg);
  });

  socket.on('typing', ({ room, username }) => {
    socket.to(room).emit('typing', username);
  });

  socket.on('disconnect', async () => {
    const user = users.find(u => u.socketId === socket.id);
    if (user) {
      users = users.filter(u => u.socketId !== socket.id);
      await User.deleteOne({ socketId: socket.id });
      io.to(user.room).emit('onlineUsers', users.filter(u => u.room === user.room));
      io.to(user.room).emit('chatMessage', {
        sender: 'Server',
        text: `${user.username} has left the room.`,
        room: user.room
      });
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

