const Application = require('../models/Application');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const applicationController = {
  // Submit Job Application
  submitApplication: async (req, res) => {
    try {
      const jobId = req.params.id;
      const { full_name, email, phone } = req.body;
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Resume file is required'
        });
      }

      // In a real production app, we would upload to S3 or Supabase Storage.
      // For this implementation, we'll store locally and return the relative path.
      const resumeUrl = `/uploads/resumes/${req.file.filename}`;

      const applicationData = {
        job_id: jobId,
        full_name,
        email,
        phone,
        resume_url: resumeUrl,
        status: 'pending'
      };

      const application = await Application.create(applicationData);

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully! Our team will review it soon.',
        application
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit application',
        error: error.message
      });
    }
  },

  // Admin: Get applications for a job
  getJobApplications: async (req, res) => {
    try {
      const applications = await Application.getByJobId(req.params.id);
      res.status(200).json({
        success: true,
        applications
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching applications',
        error: error.message
      });
    }
  },

  // Admin: Update application status
  updateApplicationStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const application = await Application.updateStatus(req.params.id, status);
      res.status(200).json({
        success: true,
        message: 'Application status updated',
        application
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating status',
        error: error.message
      });
    }
  }
};

module.exports = applicationController;
