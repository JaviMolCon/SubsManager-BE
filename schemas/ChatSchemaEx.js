const chatMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

//!Chat example
// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const mongoose = require('mongoose');
// const ChatMessage = require('./models/ChatMessage'); // Assuming the schema is saved in models/ChatMessage.js

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/chat', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('sendMessage', async (data) => {
//     try {
//       const chatMessage = new ChatMessage({
//         sender: data.senderId,
//         receiver: data.receiverId,
//         message: data.message
//       });
//       await chatMessage.save();
//       io.emit('receiveMessage', data); // Broadcast the message to all connected clients
//     } catch (error) {
//       console.error('Error saving message:', error);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

// server.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });
