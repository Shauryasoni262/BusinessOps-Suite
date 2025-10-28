const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Invoice routes
router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.getUserInvoices);
router.get('/stats', invoiceController.getFinancialStats);
router.get('/revenue', invoiceController.getRevenueData);
router.get('/:invoiceId', invoiceController.getInvoiceById);
router.put('/:invoiceId', invoiceController.updateInvoice);
router.delete('/:invoiceId', invoiceController.deleteInvoice);

module.exports = router;
