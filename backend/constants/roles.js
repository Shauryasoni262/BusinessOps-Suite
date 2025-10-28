// User roles
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  CLIENT: 'client'
};

// Project member roles
const PROJECT_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer'
};

// Permissions for different roles
const PERMISSIONS = {
  ADMIN: [
    'user:read',
    'user:create',
    'user:update',
    'user:delete',
    'project:read',
    'project:create',
    'project:update',
    'project:delete',
    'payment:read',
    'payment:create',
    'payment:update',
    'analytics:read'
  ],
  USER: [
    'project:read',
    'project:create',
    'project:update',
    'task:read',
    'task:create',
    'task:update',
    'payment:read'
  ],
  CLIENT: [
    'project:read',
    'payment:read',
    'invoice:read'
  ]
};

// Project permissions by role
const PROJECT_PERMISSIONS = {
  OWNER: [
    'project:read',
    'project:update',
    'project:delete',
    'member:add',
    'member:remove',
    'task:all',
    'milestone:all',
    'file:all'
  ],
  ADMIN: [
    'project:read',
    'project:update',
    'member:add',
    'task:all',
    'milestone:all',
    'file:all'
  ],
  MEMBER: [
    'project:read',
    'task:read',
    'task:create',
    'task:update',
    'milestone:read',
    'file:read',
    'file:upload'
  ],
  VIEWER: [
    'project:read',
    'task:read',
    'milestone:read',
    'file:read'
  ]
};

module.exports = {
  USER_ROLES,
  PROJECT_ROLES,
  PERMISSIONS,
  PROJECT_PERMISSIONS
};

