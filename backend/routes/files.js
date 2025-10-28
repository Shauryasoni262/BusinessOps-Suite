const express = require('express');
const router = express.Router();

// Import controllers
const fileController = require('../controllers/fileController');

// Import middleware
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Global file routes (not specific to a project)
router.get('/recent', fileController.getRecentFiles);

module.exports = router;
