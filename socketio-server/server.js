const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer();
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your client's URL
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  socket.on('sendMessage', (message) => {
    io.to(message.chatId).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.SOCKET_IO_PORT || 4000; // Use a different port from your main server
server.listen(PORT, () => console.log(`Socket.IO server running on port ${PORT}`));
