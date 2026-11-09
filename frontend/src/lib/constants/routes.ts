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

// Helper to determine the API base URL dynamically for localhost or production
export const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return 'https://businessops-suite-backend.onrender.com/api';
    }
  }
  return 'http://localhost:5002/api';
};

// API routes
export const API_ROUTES = {
  get BASE(): string {
    return getApiBaseUrl();
  },
  AUTH: '/auth',
  PROJECTS: '/projects',
  TASKS: '/tasks',
  MILESTONES: '/milestones',
  FILES: '/files',
  INVOICES: '/invoices',
  PAYMENTS: '/payments',
  ANALYTICS: '/analytics',
} as const;

