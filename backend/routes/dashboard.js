const express = require('express');
const router = express.Router();

// Dashboard routes
router.get('/test', (req, res) => {
  res.json({
    message: 'Dashboard routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Analytics route (placeholder)
router.get('/analytics', (req, res) => {
  res.json({
    message: 'Analytics endpoint - coming soon!',
    data: {
      totalUsers: 0,
      totalProjects: 0,
      totalRevenue: 0
    }
  });
});

// Projects route (placeholder)
router.get('/projects', (req, res) => {
  res.json({
    message: 'Projects endpoint - coming soon!',
    projects: []
  });
});

module.exports = router;
