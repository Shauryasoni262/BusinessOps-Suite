const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// All routes require authentication AND admin role
router.use(authenticateToken);
router.use(adminOnly);

// ── Dashboard ──
router.get('/stats/enhanced', adminController.getEnhancedStats);

// ── Charts / Analytics ──
router.get('/analytics/growth', adminController.getUserGrowth);
router.get('/analytics/revenue', adminController.getRevenueTrend);
router.get('/analytics/projects', adminController.getProjectDistribution);

// ── Users ──
router.get('/users', adminController.getUsers);
router.get('/users/:id/details', adminController.getUserDetails);
router.patch('/users/:id', adminController.updateUser);

// ── Projects ──
router.get('/projects', adminController.getAllProjects);

// ── Finance ──
router.get('/invoices', adminController.getAllInvoices);
router.get('/payments', adminController.getAllPayments);

// ── Chat ──
router.get('/chat/stats', adminController.getChatStats);

// ── System Logs ──
router.get('/logs', adminController.getApiLogs);
router.get('/logs/stats', adminController.getApiLogStats);

// ── Admin Activity Audit ──
router.get('/activity', adminController.getAdminActivity);

module.exports = router;
