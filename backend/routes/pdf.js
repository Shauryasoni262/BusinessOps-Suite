const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware
router.use(authenticateToken);

// PDF routes
router.get('/invoice/:invoiceId', pdfController.generateInvoicePDF);

module.exports = router;
