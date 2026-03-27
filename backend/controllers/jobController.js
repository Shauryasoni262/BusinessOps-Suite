const Job = require('../models/Job');

const jobController = {
  // Public: Get all open jobs
  getPublicJobs: async (req, res) => {
    try {
      const { department, type } = req.query;
      const filter = { status: 'open' };
      if (department) filter.department = department;
      if (type) filter.job_type = type;

      const jobs = await Job.getAll(filter);
      res.status(200).json({
        success: true,
        count: jobs.length,
        jobs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching jobs',
        error: error.message
      });
    }
  },

  // Public: Get single job details
  getJobDetails: async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job opening not found'
        });
      }

      res.status(200).json({
        success: true,
        job
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching job details',
        error: error.message
      });
    }
  },

  // Admin: Get all jobs (regardless of status)
  getAllJobsAdmin: async (req, res) => {
    try {
      const jobs = await Job.getAll();
      res.status(200).json({
        success: true,
        count: jobs.length,
        jobs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching admin jobs list',
        error: error.message
      });
    }
  },

  // Admin: Create new job
  createJob: async (req, res) => {
    try {
      const jobData = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };

      const job = await Job.create(jobData);
      res.status(201).json({
        success: true,
        message: 'Job posting created successfully',
        job
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating job posting',
        error: error.message
      });
    }
  },

  // Admin: Update job
  updateJob: async (req, res) => {
    try {
      const job = await Job.update(req.params.id, {
        ...req.body,
        updated_at: new Date()
      });

      res.status(200).json({
        success: true,
        message: 'Job posting updated successfully',
        job
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating job posting',
        error: error.message
      });
    }
  },
  // Admin: Delete job
  deleteJob: async (req, res) => {
    try {
      await Job.delete(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Job posting deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting job posting',
        error: error.message
      });
    }
  },

  // Admin: Generate AI-powered job description
  generateJobDescription: async (req, res) => {
    console.log('🤖 AI Job Description [v2.0 - Arcee] Request received:', req.body);
    try {
      const { title, department, location, job_type, salary_range } = req.body;
      if (!title || !department) {
        return res.status(400).json({
          success: false,
          message: 'Title and department are required'
        });
      }

      const prompt = `Write a professional, detailed job description for a "${title}" position.
Context:
- Department: ${department}
- Location: ${location || 'Not specified'}
- Job Type: ${job_type || 'Full-time'}
- Salary: ${salary_range || 'Competitive'}

Include:
1. Role Summary
2. Key Responsibilities (4-5 bullet points)
3. Key Requirements & Qualifications (4-5 bullet points)

Tone: Professional, modern, and engaging.
Format: HTML or Markdown with clear headings.
Requirement: Just return the job description text itself. No introductory or concluding chatter.`;

      const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'arcee-ai/trinity-large-preview:free',
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await aiResponse.json();
      if (!aiResponse.ok) throw new Error(data.error?.message || 'AI request failed');

      const description = data.choices?.[0]?.message?.content || 'No description generated.';

      res.status(200).json({
        success: true,
        description
      });
    } catch (error) {
      console.error('AI Job Description Generation Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate job description',
        error: error.message
      });
    }
  }
};

module.exports = jobController;
