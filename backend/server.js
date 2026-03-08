// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIO = require('socket.io');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Initialize Express and Socket.IO
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://zyra-steel.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://zyra-steel.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/conversations', require('./routes/conversationRoutes'));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Socket.IO Events
const User = require('./models/User');
const Message = require('./models/Message');

// Store online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // User comes online
  socket.on('user:online', async (userId) => {
    try {
      onlineUsers.set(userId, socket.id);
      
      // Update user online status in database
      await User.findByIdAndUpdate(userId, { 
        isOnline: true, 
        lastSeen: new Date() 
      });

      // Broadcast to all users
      io.emit('user:status', { userId, isOnline: true });
      console.log(`User ${userId} is online`);
    } catch (error) {
      console.error('Error in user:online:', error);
    }
  });

  // Join conversation room
  socket.on('conversation:join', (conversationId) => {
    socket.join(`conversation:${conversationId}`);
    console.log(`User ${socket.id} joined conversation: ${conversationId}`);
  });

  // Leave conversation room
  socket.on('conversation:leave', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
  });

  // Send message through socket
  socket.on('message:send', async (data) => {
    try {
      const { conversationId, senderId, content, media } = data;
      
      // Create message in database
      const message = new Message({
        conversationId,
        sender: senderId,
        content,
        media: media || [],
        status: 'delivered',
      });
      
      await message.save();
      await message.populate('sender', 'username profilePicture');

      // Broadcast to conversation room
      io.to(`conversation:${conversationId}`).emit('message:received', {
        _id: message._id,
        conversationId,
        sender: message.sender,
        content,
        media: message.media,
        status: 'delivered',
        createdAt: message.createdAt,
      });

      console.log(`Message sent in conversation: ${conversationId}`);
    } catch (error) {
      console.error('Error in message:send:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Typing indicator
  socket.on('user:typing', (data) => {
    const { conversationId, userId, isTyping } = data;
    io.to(`conversation:${conversationId}`).emit('user:typing', {
      userId,
      isTyping,
    });
  });

  // Mark message as read
  socket.on('message:read', async (data) => {
    try {
      const { messageId, conversationId } = data;
      
      await Message.findByIdAndUpdate(messageId, {
        isRead: true,
        readAt: new Date(),
        status: 'read',
      });

      io.to(`conversation:${conversationId}`).emit('message:read', {
        messageId,
        status: 'read',
      });
    } catch (error) {
      console.error('Error in message:read:', error);
    }
  });

  // User goes offline
  socket.on('disconnect', async () => {
    try {
      // Find user by socket id and set offline
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          
          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: new Date(),
          });

          io.emit('user:status', { userId, isOnline: false });
          console.log(`User ${userId} is offline`);
          break;
        }
      }
    } catch (error) {
      console.error('Error in disconnect:', error);
    }
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
