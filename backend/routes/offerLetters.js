const express = require('express');
const router = express.Router();

// Import controllers
const offerLetterController = require('../controllers/offerLetterController');

// Import middleware
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Offer Letter routes
router.get('/', offerLetterController.getOfferLetters);
router.post('/', offerLetterController.createOfferLetter);
router.get('/:id', offerLetterController.getOfferLetter);
router.put('/:id', offerLetterController.updateOfferLetter);
router.delete('/:id', offerLetterController.deleteOfferLetter);

// Preview routes
router.post('/:id/preview', offerLetterController.previewOfferLetter);

// PDF generation routes
router.post('/:id/generate-pdf', offerLetterController.generatePDF);

// Email sending routes
router.post('/:id/send', offerLetterController.sendOfferLetter);

// Template routes
router.get('/templates/list', offerLetterController.getTemplates);
router.post('/templates', offerLetterController.uploadTemplate);
router.delete('/templates/:templateId', offerLetterController.deleteTemplate);

// Analyze route
router.post('/analyze', offerLetterController.analyzeOfferLetter);

module.exports = router;

