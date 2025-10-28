const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

// Webhook route (no auth required) - must be defined BEFORE auth middleware
router.post('/razorpay/webhook', paymentController.handleRazorpayWebhook);

// Apply authentication middleware to all subsequent routes
router.use(authenticateToken);

// Payment routes
router.post('/', paymentController.createPayment);
router.get('/stats', paymentController.getPaymentStats);
router.get('/gateway/:gatewayId', paymentController.getPaymentByGatewayId);
router.put('/:paymentId/status', paymentController.updatePaymentStatus);

// Razorpay routes
router.post('/razorpay/order', paymentController.createRazorpayOrder);
router.post('/razorpay/verify', paymentController.verifyRazorpayPayment);

module.exports = router;
