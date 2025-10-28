const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');

// Initialize Razorpay (optional - only if credentials are provided)
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('✅ Razorpay initialized successfully');
} else {
  console.warn('⚠️  Razorpay credentials not found. Payment gateway features will be disabled.');
}

// ============================================================================
// GENERAL PAYMENT OPERATIONS
// ============================================================================

const paymentController = {
  // Create payment record
  createPayment: async (req, res) => {
    try {
      const paymentData = req.body;

      // Validate required fields
      if (!paymentData.invoice_id || !paymentData.amount || !paymentData.payment_method) {
        return res.status(400).json({
          success: false,
          message: 'Invoice ID, amount, and payment method are required'
        });
      }

      const payment = await Payment.create(paymentData);

      res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error creating payment:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to create payment',
        error: error.message
      });
    }
  },

  // Update payment status
  updatePaymentStatus: async (req, res) => {
    try {
      const { paymentId } = req.params;
      const { status, transaction_id } = req.body;

      const payment = await Payment.updateStatus(paymentId, status, transaction_id);

      res.json({
        success: true,
        message: 'Payment status updated successfully',
        data: payment
      });
    } catch (error) {
      console.error('Error updating payment status:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to update payment status',
        error: error.message
      });
    }
  },

  // Get payment by gateway ID (for webhooks)
  getPaymentByGatewayId: async (req, res) => {
    try {
      const { gatewayId } = req.params;
      const payment = await Payment.findByGatewayId(gatewayId);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      res.json({
        success: true,
        data: payment
      });
    } catch (error) {
      console.error('Error fetching payment:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payment',
        error: error.message
      });
    }
  },

  // Get payment statistics
  getPaymentStats: async (req, res) => {
    try {
      const userId = req.user.id;
      const stats = await Payment.getPaymentStats(userId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching payment stats:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payment statistics',
        error: error.message
      });
    }
  },

  // ============================================================================
  // RAZORPAY GATEWAY OPERATIONS
  // ============================================================================

  // Create Razorpay order
  createRazorpayOrder: async (req, res) => {
    try {
      if (!razorpay) {
        return res.status(503).json({
          success: false,
          message: 'Razorpay payment gateway is not configured'
        });
      }

      const { invoice_id, amount, currency = 'INR' } = req.body;
      const userId = req.user.id;

      // Verify invoice belongs to user
      const invoice = await Invoice.findById(invoice_id);
      if (!invoice || invoice.created_by !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this invoice'
        });
      }

      // Create Razorpay order
      const orderOptions = {
        amount: Math.round(amount * 100), // Convert to paise
        currency: currency,
        receipt: `invoice_${invoice_id}`,
        notes: {
          invoice_id: invoice_id,
          user_id: userId
        }
      };

      const order = await razorpay.orders.create(orderOptions);

      // Create payment record
      const paymentData = {
        invoice_id,
        amount,
        currency,
        payment_method: 'razorpay',
        payment_gateway_id: order.id,
        payment_status: 'pending'
      };

      const payment = await Payment.create(paymentData);

      res.json({
        success: true,
        message: 'Order created successfully',
        data: {
          order_id: order.id,
          amount: order.amount,
          currency: order.currency,
          payment_id: payment.id
        }
      });
    } catch (error) {
      console.error('Error creating Razorpay order:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to create payment order',
        error: error.message
      });
    }
  },

  // Verify Razorpay payment
  verifyRazorpayPayment: async (req, res) => {
    try {
      if (!razorpay) {
        return res.status(503).json({
          success: false,
          message: 'Razorpay payment gateway is not configured'
        });
      }

      const { payment_id, order_id, signature } = req.body;

      // Verify signature
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${order_id}|${payment_id}`)
        .digest('hex');

      if (signature !== expectedSignature) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment signature'
        });
      }

      // Get payment details from Razorpay
      const payment = await razorpay.payments.fetch(payment_id);

      if (payment.status === 'captured') {
        // Update payment status in database
        const dbPayment = await Payment.findByGatewayId(order_id);
        if (dbPayment) {
          await Payment.updateStatus(dbPayment.id, 'completed', payment_id);
        }

        res.json({
          success: true,
          message: 'Payment verified successfully',
          data: {
            payment_id: payment_id,
            amount: payment.amount / 100, // Convert from paise
            currency: payment.currency,
            status: 'completed'
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Payment not captured'
        });
      }
    } catch (error) {
      console.error('Error verifying payment:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to verify payment',
        error: error.message
      });
    }
  },

  // Handle Razorpay webhook
  handleRazorpayWebhook: async (req, res) => {
    try {
      const signature = req.headers['x-razorpay-signature'];
      const body = JSON.stringify(req.body);

      // Verify webhook signature
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      if (signature !== expectedSignature) {
        return res.status(400).json({
          success: false,
          message: 'Invalid webhook signature'
        });
      }

      const event = req.body;

      // Handle different webhook events
      switch (event.event) {
        case 'payment.captured':
          await handlePaymentCaptured(event.payload.payment.entity);
          break;
        case 'payment.failed':
          await handlePaymentFailed(event.payload.payment.entity);
          break;
        default:
          console.log('Unhandled webhook event:', event.event);
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error handling webhook:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to handle webhook',
        error: error.message
      });
    }
  }
};

// ============================================================================
// WEBHOOK HELPER FUNCTIONS
// ============================================================================

async function handlePaymentCaptured(payment) {
  try {
    const dbPayment = await Payment.findByGatewayId(payment.order_id);
    if (dbPayment) {
      await Payment.updateStatus(dbPayment.id, 'completed', payment.id);
      console.log(`✅ Payment ${payment.id} marked as completed`);
    }
  } catch (error) {
    console.error('Error handling payment captured:', error.message);
  }
}

async function handlePaymentFailed(payment) {
  try {
    const dbPayment = await Payment.findByGatewayId(payment.order_id);
    if (dbPayment) {
      await Payment.updateStatus(dbPayment.id, 'failed', payment.id);
      console.log(`❌ Payment ${payment.id} marked as failed`);
    }
  } catch (error) {
    console.error('Error handling payment failed:', error.message);
  }
}

module.exports = paymentController;
