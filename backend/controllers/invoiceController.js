const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');

const invoiceController = {
  // Create new invoice
  createInvoice: async (req, res) => {
    try {
      const userId = req.user.id;
      const invoiceData = {
        ...req.body,
        created_by: userId
      };

      // Validate required fields
      if (!invoiceData.client_name || !invoiceData.client_email || !invoiceData.amount) {
        return res.status(400).json({
          success: false,
          message: 'Client name, email, and amount are required'
        });
      }

      const invoice = await Invoice.create(invoiceData);

      res.status(201).json({
        success: true,
        message: 'Invoice created successfully',
        data: invoice
      });
    } catch (error) {
      console.error('Error creating invoice:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to create invoice',
        error: error.message
      });
    }
  },

  // Get all invoices for user
  getUserInvoices: async (req, res) => {
    try {
      const userId = req.user.id;
      const invoices = await Invoice.findByUserId(userId);

      res.json({
        success: true,
        data: invoices
      });
    } catch (error) {
      console.error('Error fetching invoices:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch invoices',
        error: error.message
      });
    }
  },

  // Get invoice by ID
  getInvoiceById: async (req, res) => {
    try {
      const { invoiceId } = req.params;
      const invoice = await Invoice.findById(invoiceId);

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }

      // Get payments for this invoice
      const payments = await Payment.findByInvoiceId(invoiceId);

      res.json({
        success: true,
        data: {
          ...invoice,
          payments
        }
      });
    } catch (error) {
      console.error('Error fetching invoice:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch invoice',
        error: error.message
      });
    }
  },

  // Update invoice
  updateInvoice: async (req, res) => {
    try {
      const { invoiceId } = req.params;
      const updateData = req.body;

      const invoice = await Invoice.update(invoiceId, updateData);

      res.json({
        success: true,
        message: 'Invoice updated successfully',
        data: invoice
      });
    } catch (error) {
      console.error('Error updating invoice:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to update invoice',
        error: error.message
      });
    }
  },

  // Delete invoice
  deleteInvoice: async (req, res) => {
    try {
      const { invoiceId } = req.params;
      await Invoice.delete(invoiceId);

      res.json({
        success: true,
        message: 'Invoice deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting invoice:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to delete invoice',
        error: error.message
      });
    }
  },

  // Get financial statistics
  getFinancialStats: async (req, res) => {
    try {
      const userId = req.user.id;
      const stats = await Invoice.getFinancialStats(userId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching financial stats:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch financial statistics',
        error: error.message
      });
    }
  },

  // Get revenue data for charts
  getRevenueData: async (req, res) => {
    try {
      const userId = req.user.id;
      console.log('📊 Fetching revenue data for user:', userId);
      
      const revenueData = await Invoice.getRevenueData(userId);
      
      console.log('✅ Revenue data fetched successfully:', revenueData.length, 'months');

      res.json({
        success: true,
        data: revenueData
      });
    } catch (error) {
      console.error('❌ Error fetching revenue data:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch revenue data',
        error: error.message
      });
    }
  }
};

module.exports = invoiceController;
