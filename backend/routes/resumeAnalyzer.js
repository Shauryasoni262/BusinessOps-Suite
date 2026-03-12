// ============================================================================
// RESUME ANALYZER ROUTES
// ============================================================================
//
// 🧠 ROUTE STRUCTURE:
// These routes are mounted at /api/resume-analyzer in server.js
//
// POST /api/resume-analyzer/upload  → Upload a PDF resume
// POST /api/resume-analyzer/chat    → Ask questions about the resume
//
// Both routes are protected by authenticateToken — the user must be logged in.
//
// The upload route uses multer middleware to handle file uploads.
// We use memoryStorage so the file stays in RAM (no temp files on disk).
// We limit file size to 10MB.
//
// ============================================================================

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');
const { uploadResume, chatWithResume } = require('../controllers/resumeAnalyzerController');

// Configure multer for PDF uploads (store in memory, not disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

// Upload resume PDF for analysis
router.post('/upload', authenticateToken, upload.single('resume'), uploadResume);

// Chat with the uploaded resume
router.post('/chat', authenticateToken, chatWithResume);

module.exports = router;
