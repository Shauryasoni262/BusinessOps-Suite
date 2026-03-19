const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Import route
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const googleAuthRoutes = require('./routes/googleAuth');
const aiRoutes = require('./routes/ai');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const milestoneRoutes = require('./routes/milestones');
const fileRoutes = require('./routes/files');
const invoiceRoutes = require('./routes/invoices');
const paymentRoutes = require('./routes/payments');
const pdfRoutes = require('./routes/pdf');
const analyticsRoutes = require('./routes/analytics');
const offerLetterRoutes = require('./routes/offerLetters');
const resumeAnalyzerRoutes = require('./routes/resumeAnalyzer');

const adminRoutes = require('./routes/admin');
const apiLogger = require('./middleware/apiLogger');

// Import database initialization
const { initializeDatabase, createDefaultAdmin } = require('./config/initDatabase');

// Import socket initialization
const { initializeSockets } = require('./sockets');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global API Logging Middleware (runs before all routes)
app.use(apiLogger);

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to BusinessOps Suite API',
    version: '1.0.0',
    status: 'Server is running!',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      admin: '/api/admin',
      dashboard: '/api/dashboard',
      ai: '/api/ai',
      projects: '/api/projects',
      tasks: '/api/tasks',
      milestones: '/api/milestones',
      files: '/api/files',
      invoices: '/api/invoices',
      payments: '/api/payments',
      analytics: '/api/analytics',
      offerLetters: '/api/offer-letters'
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
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/offer-letters', offerLetterRoutes);
app.use('/api/resume-analyzer', resumeAnalyzerRoutes);

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
      // Initialize Socket.IO handlers
      const { messageModel, projectSocketEvents } = initializeSockets(io);
      
      // Make Socket.IO and events available globally
      global.io = io;
      global.projectSocketEvents = projectSocketEvents;
      
      // Create default admin user
      await createDefaultAdmin();
      
      // Start server - listen on 0.0.0.0 for Railway deployment
      const HOST = process.env.HOST || '0.0.0.0';
      server.listen(PORT, HOST, () => {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🚀 Server is running on ${HOST}:${PORT}`);
        console.log(`${'='.repeat(60)}`);
        console.log(`📡 API available at http://${HOST}:${PORT}`);
        console.log(`🔌 Socket.IO server ready for real-time updates`);
        console.log(`🏥 Health check at http://${HOST}:${PORT}/api/health`);
        console.log(`\n📚 Available Routes:`);
        console.log(`   🔐 Auth:        /api/auth`);
        console.log(`   📊 Dashboard:   /api/dashboard`);
        console.log(`   📁 Projects:    /api/projects`);
        console.log(`   ✅ Tasks:       /api/tasks`);
        console.log(`   🎯 Milestones:  /api/milestones`);
        console.log(`   📎 Files:       /api/files`);
        console.log(`   📄 Invoices:    /api/invoices`);
        console.log(`   💳 Payments:    /api/payments`);
        console.log(`   📈 Analytics:   /api/analytics`);
        console.log(`   🤖 AI:          /api/ai`);
        console.log(`   📝 PDF:         /api/pdf`);
        console.log(`${'='.repeat(60)}\n`);
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

// Export for testing
module.exports = { app, io };
