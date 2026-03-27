console.log('⚡ Careers Router Loading...');
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticateToken } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// ── Public Routes ──
router.get('/jobs', jobController.getPublicJobs);
router.get('/jobs/:id', jobController.getJobDetails);

// ── Admin Routes (Requires Authentication & Admin Role) ──
router.use(authenticateToken);
router.use(adminOnly);

router.get('/admin/list', jobController.getAllJobsAdmin);
router.post('/admin/create', jobController.createJob);
router.post('/admin/ai-gen', jobController.generateJobDescription);
router.patch('/admin/update/:id', jobController.updateJob);
router.delete('/admin/delete/:id', jobController.deleteJob);

module.exports = router;
