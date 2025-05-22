const express = require('express');
const http = require('http'); 
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Middleware to parse JSON body
app.use(express.json());
app.use(cors("*"));

const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO connection listener (should be outside routes)
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// HTTP POST route
app.post('/send', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send('Message is required');
  }

  console.log('Received message:', message);

  io.emit('PushNotification', { message });
  res.status(200).send('Message sent');
});

// Start server
server.listen(8000, () => {
  console.log('Server is running on port 8000');
});
