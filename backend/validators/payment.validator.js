const { PAYMENT_STATUS, INVOICE_STATUS } = require('../constants');
const { ValidationError } = require('../utils/error');

/**
 * Validate payment creation data
 */
const validateCreatePayment = (data) => {
  const errors = [];

  // Validate invoice_id
  if (!data.invoice_id) {
    errors.push('Invoice ID is required');
  }

  // Validate amount
  if (!data.amount) {
    errors.push('Amount is required');
  } else if (isNaN(parseFloat(data.amount))) {
    errors.push('Amount must be a valid number');
  } else if (parseFloat(data.amount) <= 0) {
    errors.push('Amount must be greater than 0');
  }

  // Validate payment method
  if (!data.payment_method || !data.payment_method.trim()) {
    errors.push('Payment method is required');
  }

  // Validate status (if provided)
  if (data.status && !Object.values(PAYMENT_STATUS).includes(data.status)) {
    errors.push(`Invalid payment status. Must be one of: ${Object.values(PAYMENT_STATUS).join(', ')}`);
  }

  if (errors.length > 0) {
    throw new ValidationError('Payment validation failed', errors);
  }

  return true;
};

/**
 * Validate payment update data
 */
const validateUpdatePayment = (data) => {
  const errors = [];

  // Validate amount (if provided)
  if (data.amount !== undefined) {
    if (isNaN(parseFloat(data.amount))) {
      errors.push('Amount must be a valid number');
    } else if (parseFloat(data.amount) <= 0) {
      errors.push('Amount must be greater than 0');
    }
  }

  // Validate status (if provided)
  if (data.status && !Object.values(PAYMENT_STATUS).includes(data.status)) {
    errors.push(`Invalid payment status. Must be one of: ${Object.values(PAYMENT_STATUS).join(', ')}`);
  }

  if (errors.length > 0) {
    throw new ValidationError('Payment update validation failed', errors);
  }

  return true;
};

/**
 * Validate invoice creation data
 */
const validateCreateInvoice = (data) => {
  const errors = [];

  // Validate project_id
  if (!data.project_id) {
    errors.push('Project ID is required');
  }

  // Validate client_id
  if (!data.client_id) {
    errors.push('Client ID is required');
  }

  // Validate amount
  if (!data.amount) {
    errors.push('Amount is required');
  } else if (isNaN(parseFloat(data.amount))) {
    errors.push('Amount must be a valid number');
  } else if (parseFloat(data.amount) <= 0) {
    errors.push('Amount must be greater than 0');
  }

  // Validate due_date
  if (data.due_date) {
    const dueDate = new Date(data.due_date);
    if (isNaN(dueDate.getTime())) {
      errors.push('Invalid due date format');
    }
  }

  // Validate status (if provided)
  if (data.status && !Object.values(INVOICE_STATUS).includes(data.status)) {
    errors.push(`Invalid invoice status. Must be one of: ${Object.values(INVOICE_STATUS).join(', ')}`);
  }

  if (errors.length > 0) {
    throw new ValidationError('Invoice validation failed', errors);
  }

  return true;
};

/**
 * Validate invoice update data
 */
const validateUpdateInvoice = (data) => {
  const errors = [];

  // Validate amount (if provided)
  if (data.amount !== undefined) {
    if (isNaN(parseFloat(data.amount))) {
      errors.push('Amount must be a valid number');
    } else if (parseFloat(data.amount) <= 0) {
      errors.push('Amount must be greater than 0');
    }
  }

  // Validate due_date (if provided)
  if (data.due_date) {
    const dueDate = new Date(data.due_date);
    if (isNaN(dueDate.getTime())) {
      errors.push('Invalid due date format');
    }
  }

  // Validate status (if provided)
  if (data.status && !Object.values(INVOICE_STATUS).includes(data.status)) {
    errors.push(`Invalid invoice status. Must be one of: ${Object.values(INVOICE_STATUS).join(', ')}`);
  }

  if (errors.length > 0) {
    throw new ValidationError('Invoice update validation failed', errors);
  }

  return true;
};

/**
 * Validate Razorpay order creation
 */
const validateRazorpayOrder = (data) => {
  const errors = [];

  // Validate invoice_id
  if (!data.invoice_id) {
    errors.push('Invoice ID is required');
  }

  // Validate amount
  if (!data.amount) {
    errors.push('Amount is required');
  } else if (isNaN(parseFloat(data.amount))) {
    errors.push('Amount must be a valid number');
  } else if (parseFloat(data.amount) <= 0) {
    errors.push('Amount must be greater than 0');
  }

  // Validate currency (if provided)
  if (data.currency && typeof data.currency !== 'string') {
    errors.push('Currency must be a string');
  }

  if (errors.length > 0) {
    throw new ValidationError('Razorpay order validation failed', errors);
  }

  return true;
};

module.exports = {
  validateCreatePayment,
  validateUpdatePayment,
  validateCreateInvoice,
  validateUpdateInvoice,
  validateRazorpayOrder
};

