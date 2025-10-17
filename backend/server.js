const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const googleAuthRoutes = require('./routes/googleAuth');

// Import database initialization
const { initializeDatabase, createDefaultAdmin } = require('./config/initDatabase');

const app = express();
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
      // Create default admin user
      await createDefaultAdmin();
      
      // Start server
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`📡 API available at http://localhost:${PORT}`);
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
