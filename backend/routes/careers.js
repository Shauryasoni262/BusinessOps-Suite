console.log('⚡ Careers Router Loading...');
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const applicationController = require('../controllers/applicationController');
const { authenticateToken } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads/resumes';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) return cb(null, true);
    cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed!'));
  }
});

// ── Public Routes ──
router.get('/jobs', jobController.getPublicJobs);
router.get('/jobs/:id', jobController.getJobDetails);
router.post('/jobs/:id/apply', upload.single('resume'), applicationController.submitApplication);

// ── Admin Routes (Requires Authentication & Admin Role) ──
router.use(authenticateToken);
router.use(adminOnly);

router.get('/admin/list', jobController.getAllJobsAdmin);
router.post('/admin/create', jobController.createJob);
router.post('/admin/ai-gen', jobController.generateJobDescription);
router.get('/admin/jobs/:id/applications', applicationController.getJobApplications);
router.patch('/admin/applications/:id/status', applicationController.updateApplicationStatus);
router.patch('/admin/update/:id', jobController.updateJob);
router.delete('/admin/delete/:id', jobController.deleteJob);

module.exports = router;
