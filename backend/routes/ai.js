const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');

// Test Ollama connection
router.get('/test', authenticateToken, aiController.testConnection);

// Chat with AI
router.post('/chat', authenticateToken, aiController.chat);

// Stream chat with AI
router.post('/stream', authenticateToken, aiController.streamChat);

// Get available models
router.get('/models', authenticateToken, aiController.getModels);

// Change model
router.post('/model', authenticateToken, aiController.changeModel);

module.exports = router;
