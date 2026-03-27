const express = require('express');
const router = express.Router();
const salarySlipController = require('../controllers/salarySlipController');
const { authenticateToken } = require('../middleware/auth');

// All routes are protected
router.use(authenticateToken);

router.post('/', salarySlipController.createSalarySlip);
router.get('/', salarySlipController.getMySalarySlips);
router.get('/:id', salarySlipController.getSalarySlip);
router.delete('/:id', salarySlipController.deleteSalarySlip);

module.exports = router;
