const { PROJECT_STATUS, PRIORITY } = require('../constants');
const { ValidationError } = require('../utils/error');

/**
 * Validate project creation data
 */
const validateCreateProject = (data) => {
  const errors = [];

  // Validate name
  if (!data.name || !data.name.trim()) {
    errors.push('Project name is required');
  } else if (data.name.trim().length < 3) {
    errors.push('Project name must be at least 3 characters long');
  } else if (data.name.trim().length > 100) {
    errors.push('Project name must not exceed 100 characters');
  }

  // Validate description (optional but has max length)
  if (data.description && data.description.length > 1000) {
    errors.push('Description must not exceed 1000 characters');
  }

  // Validate priority
  if (data.priority && !Object.values(PRIORITY).includes(data.priority)) {
    errors.push(`Invalid priority. Must be one of: ${Object.values(PRIORITY).join(', ')}`);
  }

  // Validate status
  if (data.status && !Object.values(PROJECT_STATUS).includes(data.status)) {
    errors.push(`Invalid status. Must be one of: ${Object.values(PROJECT_STATUS).join(', ')}`);
  }

  // Validate deadline (if provided)
  if (data.deadline) {
    const deadline = new Date(data.deadline);
    if (isNaN(deadline.getTime())) {
      errors.push('Invalid deadline date format');
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('Project validation failed', errors);
  }

  return true;
};

/**
 * Validate project update data
 */
const validateUpdateProject = (data) => {
  const errors = [];

  // Validate name (if provided)
  if (data.name !== undefined) {
    if (!data.name || !data.name.trim()) {
      errors.push('Project name cannot be empty');
    } else if (data.name.trim().length < 3) {
      errors.push('Project name must be at least 3 characters long');
    } else if (data.name.trim().length > 100) {
      errors.push('Project name must not exceed 100 characters');
    }
  }

  // Validate description (if provided)
  if (data.description !== undefined && data.description && data.description.length > 1000) {
    errors.push('Description must not exceed 1000 characters');
  }

  // Validate priority (if provided)
  if (data.priority && !Object.values(PRIORITY).includes(data.priority)) {
    errors.push(`Invalid priority. Must be one of: ${Object.values(PRIORITY).join(', ')}`);
  }

  // Validate status (if provided)
  if (data.status && !Object.values(PROJECT_STATUS).includes(data.status)) {
    errors.push(`Invalid status. Must be one of: ${Object.values(PROJECT_STATUS).join(', ')}`);
  }

  // Validate deadline (if provided)
  if (data.deadline) {
    const deadline = new Date(data.deadline);
    if (isNaN(deadline.getTime())) {
      errors.push('Invalid deadline date format');
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('Project update validation failed', errors);
  }

  return true;
};

/**
 * Validate task data
 */
const validateTask = (data, isUpdate = false) => {
  const errors = [];

  // Validate title
  if (!isUpdate || data.title !== undefined) {
    if (!data.title || !data.title.trim()) {
      errors.push('Task title is required');
    } else if (data.title.trim().length < 3) {
      errors.push('Task title must be at least 3 characters long');
    } else if (data.title.trim().length > 200) {
      errors.push('Task title must not exceed 200 characters');
    }
  }

  // Validate description
  if (data.description && data.description.length > 2000) {
    errors.push('Task description must not exceed 2000 characters');
  }

  if (errors.length > 0) {
    throw new ValidationError('Task validation failed', errors);
  }

  return true;
};

/**
 * Validate milestone data
 */
const validateMilestone = (data, isUpdate = false) => {
  const errors = [];

  // Validate title
  if (!isUpdate || data.title !== undefined) {
    if (!data.title || !data.title.trim()) {
      errors.push('Milestone title is required');
    } else if (data.title.trim().length < 3) {
      errors.push('Milestone title must be at least 3 characters long');
    } else if (data.title.trim().length > 200) {
      errors.push('Milestone title must not exceed 200 characters');
    }
  }

  // Validate due date
  if (data.due_date) {
    const dueDate = new Date(data.due_date);
    if (isNaN(dueDate.getTime())) {
      errors.push('Invalid due date format');
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('Milestone validation failed', errors);
  }

  return true;
};

module.exports = {
  validateCreateProject,
  validateUpdateProject,
  validateTask,
  validateMilestone
};

