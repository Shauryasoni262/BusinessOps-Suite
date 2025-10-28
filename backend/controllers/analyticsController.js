const Analytics = require('../models/Analytics');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

const analyticsController = {
  // Get overview statistics for dashboard cards
  getOverviewStats: async (req, res) => {
    try {
      const userId = req.user.id;
      const stats = await Analytics.getOverviewStats(userId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching overview stats:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch overview statistics',
        error: error.message
      });
    }
  },

  // Get project analytics with optional date filtering
  getProjectAnalytics: async (req, res) => {
    try {
      const userId = req.user.id;
      const { startDate, endDate } = req.query;

      const analytics = await Analytics.getProjectAnalytics(
        userId,
        startDate || null,
        endDate || null
      );

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Error fetching project analytics:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch project analytics',
        error: error.message
      });
    }
  },

  // Get financial analytics with optional date filtering
  getFinancialAnalytics: async (req, res) => {
    try {
      const userId = req.user.id;
      const { startDate, endDate } = req.query;

      const analytics = await Analytics.getFinancialAnalytics(
        userId,
        startDate || null,
        endDate || null
      );

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Error fetching financial analytics:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch financial analytics',
        error: error.message
      });
    }
  },

  // Get team analytics with optional date filtering
  getTeamAnalytics: async (req, res) => {
    try {
      const userId = req.user.id;
      const { startDate, endDate } = req.query;

      const analytics = await Analytics.getTeamAnalytics(
        userId,
        startDate || null,
        endDate || null
      );

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Error fetching team analytics:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch team analytics',
        error: error.message
      });
    }
  },

  // Get performance metrics (KPIs)
  getPerformanceMetrics: async (req, res) => {
    try {
      const userId = req.user.id;
      const { startDate, endDate } = req.query;

      const metrics = await Analytics.getPerformanceMetrics(
        userId,
        startDate || null,
        endDate || null
      );

      res.json({
        success: true,
        data: metrics
      });
    } catch (error) {
      console.error('Error fetching performance metrics:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch performance metrics',
        error: error.message
      });
    }
  },

  // Get user growth data
  getUserGrowth: async (req, res) => {
    try {
      const { months = 6 } = req.query;
      const growthData = await Analytics.getUserGrowth(parseInt(months));

      res.json({
        success: true,
        data: growthData
      });
    } catch (error) {
      console.error('Error fetching user growth:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user growth data',
        error: error.message
      });
    }
  },

  // Export analytics data
  exportAnalytics: async (req, res) => {
    try {
      const userId = req.user.id;
      const { type, format, startDate, endDate } = req.body;

      // Validate format
      if (!['csv', 'pdf'].includes(format)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid format. Must be csv or pdf'
        });
      }

      // Fetch data based on type
      let data;
      let title;
      
      switch (type) {
        case 'projects':
          data = await Analytics.getProjectAnalytics(userId, startDate, endDate);
          title = 'Project Analytics';
          break;
        case 'financial':
          data = await Analytics.getFinancialAnalytics(userId, startDate, endDate);
          title = 'Financial Analytics';
          break;
        case 'team':
          data = await Analytics.getTeamAnalytics(userId, startDate, endDate);
          title = 'Team Analytics';
          break;
        case 'performance':
          data = await Analytics.getPerformanceMetrics(userId, startDate, endDate);
          title = 'Performance Metrics';
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid type'
          });
      }

      if (format === 'csv') {
        // Export as CSV
        let csvData;
        
        if (type === 'financial' && data.revenueData) {
          csvData = data.revenueData;
        } else if (type === 'team' && data.productivity) {
          csvData = data.productivity;
        } else if (type === 'projects') {
          csvData = [data.summary];
        } else {
          csvData = [data];
        }

        const parser = new Parser();
        const csv = parser.parse(csvData);

        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', `attachment; filename="${type}-analytics.csv"`);
        res.send(csv);
      } else {
        // Export as PDF
        const doc = new PDFDocument();
        
        res.header('Content-Type', 'application/pdf');
        res.header('Content-Disposition', `attachment; filename="${type}-analytics.pdf"`);
        
        doc.pipe(res);

        // Add title
        doc.fontSize(20).text(title, { align: 'center' });
        doc.moveDown();
        
        // Add date range if provided
        if (startDate || endDate) {
          doc.fontSize(12).text(
            `Date Range: ${startDate || 'Beginning'} to ${endDate || 'Present'}`,
            { align: 'center' }
          );
          doc.moveDown();
        }

        // Add data
        doc.fontSize(14).text('Summary', { underline: true });
        doc.moveDown();
        doc.fontSize(10).text(JSON.stringify(data, null, 2));

        doc.end();
      }
    } catch (error) {
      console.error('Error exporting analytics:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to export analytics',
        error: error.message
      });
    }
  }
};

module.exports = analyticsController;

