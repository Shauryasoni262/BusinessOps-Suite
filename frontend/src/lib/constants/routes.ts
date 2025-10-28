// Authentication routes
export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  GOOGLE_SUCCESS: '/auth/google-success',
  GOOGLE_ERROR: '/auth/google-error',
} as const;

// Dashboard routes
export const DASHBOARD_ROUTES = {
  HOME: '/dashboard',
  ANALYTICS: '/dashboard/analytics',
  PROJECTS: '/dashboard/projects',
  PROJECT_DETAIL: (id: string) => `/dashboard/projects/${id}`,
  PAYMENTS: '/dashboard/payments',
  CHAT: '/dashboard/chat',
  AI_ASSISTANT: '/dashboard/ai-assistant',
  PROFILE: '/profile',
} as const;

// API routes
export const API_ROUTES = {
  BASE: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  AUTH: '/auth',
  PROJECTS: '/projects',
  TASKS: '/tasks',
  MILESTONES: '/milestones',
  FILES: '/files',
  INVOICES: '/invoices',
  PAYMENTS: '/payments',
  ANALYTICS: '/analytics',
} as const;

