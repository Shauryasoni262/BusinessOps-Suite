const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const googleAuthRoutes = require('./routes/googleAuth');

// Import database initialization
const { initializeDatabase, createDefaultAdmin } = require('./config/initDatabase');

// Import Message model
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to BusinessOps Suite API',
    version: '1.0.0',
    status: 'Server is running!',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      dashboard: '/api/dashboard'
    }
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Initialize Message model
const messageModel = new Message();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);
  
  // When a user joins a chat room
  socket.on('join_room', async (data) => {
    const room = data.room || data; // Support both string and object formats
    const username = data.username || `User_${socket.id.substring(0, 6)}`; // Default username
    
    socket.join(room);
    socket.username = username; // Store username for this socket
    socket.currentRoom = room; // Store current room
    
    console.log(`👤 User ${username} (${socket.id}) joined room: ${room}`);
    
    // Load message history for the room
    try {
      const messageHistory = await messageModel.getRoomMessages(room, 50);
      
      // Send message history to the user who just joined
      socket.emit('message_history', {
        room: room,
        messages: messageHistory
      });
      
      // Notify others in the room
      socket.to(room).emit('user_joined', {
        message: `${username} joined the room`,
        username: username,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Error loading message history:', error.message);
      socket.emit('error', { message: 'Failed to load message history' });
    }
  });
  
  // When a user sends a message
  socket.on('send_message', async (data) => {
    try {
      const room = data.room || socket.currentRoom;
      const message = data.message;
      const username = socket.username || `User_${socket.id.substring(0, 6)}`;
      
      if (!room || !message) {
        socket.emit('error', { message: 'Room and message are required' });
        return;
      }
      
      console.log(`💬 Message from ${username} in room ${room}:`, message);
      
      // Save message to database
      const savedMessage = await messageModel.saveMessage(room, socket.id, username, message);
      
      // Broadcast the message to everyone in the room (including sender)
      io.to(room).emit('receive_message', {
        id: savedMessage.id,
        userId: socket.id,
        username: username,
        message: message,
        timestamp: savedMessage.timestamp,
        room: room
      });
      
    } catch (error) {
      console.error('❌ Error sending message:', error.message);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
  
  // When a user disconnects
  socket.on('disconnect', () => {
    const username = socket.username || `User_${socket.id.substring(0, 6)}`;
    const room = socket.currentRoom;
    
    console.log(`🔌 User ${username} (${socket.id}) disconnected`);
    
    // Notify others in the room
    if (room) {
      socket.to(room).emit('user_left', {
        message: `${username} left the room`,
        username: username,
        timestamp: new Date().toISOString()
      });
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🚀 Starting BusinessOps Suite API Server...');
    
    // Initialize database
    const dbInitialized = await initializeDatabase();
    
    if (dbInitialized) {
      // Create messages table
      try {
        console.log('📝 Creating messages table...');
        await messageModel.createTable();
        console.log('✅ Messages table ready');
      } catch (error) {
        console.error('❌ Error creating messages table:', error.message);
        throw error;
      }
      
      // Create default admin user
      await createDefaultAdmin();
      
      // Start server
      server.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`📡 API available at http://localhost:${PORT}`);
        console.log(`🔌 Socket.IO server ready for real-time chat`);
        console.log(`🏥 Health check at http://localhost:${PORT}/api/health`);
        console.log(`🔐 Auth routes at http://localhost:${PORT}/api/auth`);
        console.log(`📊 Dashboard routes at http://localhost:${PORT}/api/dashboard`);
        console.log('');
        console.log('🔧 Test endpoints:');
        console.log(`   POST ${PORT}/api/auth/register - Register new user`);
        console.log(`   POST ${PORT}/api/auth/login - Login user`);
        console.log(`   GET  ${PORT}/api/auth/profile - Get user profile (requires token)`);
        console.log(`   GET  ${PORT}/api/auth/users - Get all users (admin only)`);
      });
    } else {
      console.log('❌ Failed to initialize database. Please check your configuration.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;
