const express = require('express');
const router = express.Router();

// Import controllers
const taskController = require('../controllers/taskController');

// Import middleware
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Global task routes (not specific to a project)
router.get('/user', taskController.getUserTasks);
router.get('/overdue', taskController.getOverdueTasks);

module.exports = router;
