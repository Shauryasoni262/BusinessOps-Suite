const express = require('express');
const router = express.Router();

// Import controllers
const milestoneController = require('../controllers/milestoneController');

// Import middleware
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Global milestone routes (not specific to a project)
router.get('/upcoming', milestoneController.getUpcomingMilestones);

module.exports = router;
