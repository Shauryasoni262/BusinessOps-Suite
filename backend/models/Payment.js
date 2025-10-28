const { supabase } = require('../config/database');

// Payment model functions for PostgreSQL
const Payment = {
  // Create new payment
  create: async (paymentData) => {
    try {
      const { 
        invoice_id, 
        amount, 
        currency, 
        payment_method, 
        payment_gateway_id,
        payment_status = 'pending',
        transaction_id,
        notes 
      } = paymentData;

      const { data, error } = await supabase
        .from('payments')
        .insert([
          {
            invoice_id,
            amount,
            currency,
            payment_method,
            payment_gateway_id,
            payment_status,
            transaction_id,
            notes
          }
        ])
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating payment:', error.message);
      throw error;
    }
  },

  // Get payments for an invoice
  findByInvoiceId: async (invoiceId) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('invoice_id', invoiceId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching payments:', error.message);
      throw error;
    }
  },

  // Update payment status
  updateStatus: async (paymentId, status, transactionId = null) => {
    try {
      const updateData = {
        payment_status: status,
        updated_at: new Date().toISOString()
      };

      if (transactionId) {
        updateData.transaction_id = transactionId;
      }

      if (status === 'completed') {
        updateData.payment_date = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', paymentId)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating payment status:', error.message);
      throw error;
    }
  },

  // Get payment by gateway ID (for Razorpay webhooks)
  findByGatewayId: async (gatewayId) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('payment_gateway_id', gatewayId)
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching payment by gateway ID:', error.message);
      throw error;
    }
  },

  // Get payment statistics
  getPaymentStats: async (userId) => {
    try {
      // Get all payments for user's invoices
      const { data: payments, error } = await supabase
        .from('payments')
        .select(`
          *,
          invoices!inner(created_by)
        `)
        .eq('invoices.created_by', userId);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      // Calculate statistics
      const totalPayments = payments.length;
      const completedPayments = payments.filter(p => p.payment_status === 'completed').length;
      const pendingPayments = payments.filter(p => p.payment_status === 'pending').length;
      const failedPayments = payments.filter(p => p.payment_status === 'failed').length;

      const totalAmount = payments
        .filter(p => p.payment_status === 'completed')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);

      const averagePayment = totalAmount / completedPayments || 0;

      return {
        totalPayments,
        completedPayments,
        pendingPayments,
        failedPayments,
        totalAmount,
        averagePayment: Math.round(averagePayment * 100) / 100
      };
    } catch (error) {
      console.error('Error calculating payment stats:', error.message);
      throw error;
    }
  }
};

module.exports = Payment;
