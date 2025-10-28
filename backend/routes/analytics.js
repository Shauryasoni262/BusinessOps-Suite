const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Overview statistics (dashboard cards)
router.get('/overview', analyticsController.getOverviewStats);

// Project analytics with date filtering
router.get('/projects', analyticsController.getProjectAnalytics);

// Financial analytics with date filtering
router.get('/financial', analyticsController.getFinancialAnalytics);

// Team analytics with date filtering
router.get('/team', analyticsController.getTeamAnalytics);

// Performance metrics (KPIs)
router.get('/performance', analyticsController.getPerformanceMetrics);

// User growth data
router.get('/user-growth', analyticsController.getUserGrowth);

// Export analytics data
router.post('/export', analyticsController.exportAnalytics);

module.exports = router;

