/**
 * Helper functions for common operations
 */

/**
 * Format date to ISO string
 */
const formatDate = (date) => {
  return date ? new Date(date).toISOString() : null;
};

/**
 * Sanitize user input
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim();
};

/**
 * Generate a random string
 */
const generateRandomString = (length = 10) => {
  return Math.random().toString(36).substring(2, length + 2);
};

/**
 * Check if value is empty
 */
const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim().length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (Array.isArray(value) && value.length === 0)
  );
};

/**
 * Paginate array
 */
const paginate = (array, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return {
    data: array.slice(offset, offset + limit),
    pagination: {
      page,
      limit,
      total: array.length,
      totalPages: Math.ceil(array.length / limit)
    }
  };
};

/**
 * Calculate percentage
 */
const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

module.exports = {
  formatDate,
  sanitizeInput,
  generateRandomString,
  isEmpty,
  paginate,
  calculatePercentage
};

