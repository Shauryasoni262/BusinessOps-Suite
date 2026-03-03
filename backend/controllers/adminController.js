const AdminLog = require('../models/AdminLog');
const User = require('../models/User');

/**
 * Controller for comprehensive administrative functions
 */
const adminController = {
  /**
   * Enhanced dashboard stats — all entities
   */
  getEnhancedStats: async (req, res) => {
    try {
      const stats = await AdminLog.getEnhancedStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve platform statistics' });
    }
  },

  /**
   * User growth chart data
   */
  getUserGrowth: async (req, res) => {
    try {
      const months = parseInt(req.query.months) || 6;
      const data = await AdminLog.getUserGrowth(months);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve user growth data' });
    }
  },

  /**
   * Revenue trend chart data
   */
  getRevenueTrend: async (req, res) => {
    try {
      const months = parseInt(req.query.months) || 6;
      const data = await AdminLog.getRevenueTrend(months);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve revenue trend data' });
    }
  },

  /**
   * Project status distribution
   */
  getProjectDistribution: async (req, res) => {
    try {
      const data = await AdminLog.getProjectStatusDistribution();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve project distribution' });
    }
  },

  /**
   * Get all users with management info
   */
  getUsers: async (req, res) => {
    try {
      const users = await User.getAll();
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve users' });
    }
  },

  /**
   * Get detailed user profile
   */
  getUserDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await AdminLog.getUserDetails(id);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve user details' });
    }
  },

  /**
   * Update a user's role or status
   */
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { role, status } = req.body;
      const updatedUser = await User.update(id, { role, status });

      await AdminLog.logAdminActivity(req.user.id, 'UPDATE_USER', id, 'user', { role, status });

      res.json({ success: true, data: updatedUser, message: 'User updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update user' });
    }
  },

  /**
   * Get all projects (global view)
   */
  getAllProjects: async (req, res) => {
    try {
      const { limit = 100, offset = 0 } = req.query;
      const data = await AdminLog.getAllProjects(parseInt(limit), parseInt(offset));
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve projects' });
    }
  },

  /**
   * Get all invoices (global view)
   */
  getAllInvoices: async (req, res) => {
    try {
      const { limit = 100, offset = 0 } = req.query;
      const data = await AdminLog.getAllInvoices(parseInt(limit), parseInt(offset));
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve invoices' });
    }
  },

  /**
   * Get all payments (global view)
   */
  getAllPayments: async (req, res) => {
    try {
      const { limit = 100, offset = 0 } = req.query;
      const data = await AdminLog.getAllPayments(parseInt(limit), parseInt(offset));
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve payments' });
    }
  },

  /**
   * Get chat/message statistics
   */
  getChatStats: async (req, res) => {
    try {
      const data = await AdminLog.getChatStats();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve chat statistics' });
    }
  },

  /**
   * Get API log analytics
   */
  getApiLogStats: async (req, res) => {
    try {
      const data = await AdminLog.getApiLogStats();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve API analytics' });
    }
  },

  /**
   * Get paginated API logs
   */
  getApiLogs: async (req, res) => {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const data = await AdminLog.getApiLogs(parseInt(limit), parseInt(offset));
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve system logs' });
    }
  },

  /**
   * Get admin activity audit trail
   */
  getAdminActivity: async (req, res) => {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const data = await AdminLog.getAdminActivityLogs(parseInt(limit), parseInt(offset));
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve admin activity logs' });
    }
  }
};

module.exports = adminController;
