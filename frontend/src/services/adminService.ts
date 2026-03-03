import { API_BASE_URL } from '@/lib/config/api';
import {
  EnhancedStats, GrowthDataPoint, RevenueTrendPoint, ProjectDistribution,
  AdminProject, AdminInvoice, AdminPayment, ChatStats, ApiLog, ApiLogStats,
  AdminActivityLog, UserDetails
} from '@/types/admin';
import { User } from '@/types/user';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const apiFetch = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}/admin${endpoint}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || `HTTP ${response.status}`);
  }
  const result = await response.json();
  return result.data;
};

export const adminService = {
  // ── Dashboard ──
  getEnhancedStats: (): Promise<EnhancedStats> => apiFetch('/stats/enhanced'),
  getDashboardStats: (): Promise<EnhancedStats> => apiFetch('/stats/enhanced'),

  // ── Charts ──
  getUserGrowth: (months = 6): Promise<GrowthDataPoint[]> => apiFetch(`/analytics/growth?months=${months}`),
  getRevenueTrend: (months = 6): Promise<RevenueTrendPoint[]> => apiFetch(`/analytics/revenue?months=${months}`),
  getProjectDistribution: (): Promise<ProjectDistribution[]> => apiFetch('/analytics/projects'),

  // ── Users ──
  getUsers: (): Promise<User[]> => apiFetch('/users'),
  getUserDetails: (id: string): Promise<UserDetails> => apiFetch(`/users/${id}/details`),
  updateUser: async (id: string, data: { role?: string; status?: string }): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update user');
    const result = await response.json();
    return result.data;
  },

  // ── Projects ──
  getAllProjects: (limit = 100, offset = 0): Promise<{ projects: AdminProject[]; total: number }> =>
    apiFetch(`/projects?limit=${limit}&offset=${offset}`),

  // ── Finance ──
  getAllInvoices: (limit = 100, offset = 0): Promise<{ invoices: AdminInvoice[]; total: number }> =>
    apiFetch(`/invoices?limit=${limit}&offset=${offset}`),
  getAllPayments: (limit = 100, offset = 0): Promise<{ payments: AdminPayment[]; total: number }> =>
    apiFetch(`/payments?limit=${limit}&offset=${offset}`),

  // ── Chat ──
  getChatStats: (): Promise<ChatStats> => apiFetch('/chat/stats'),

  // ── Logs ──
  getApiLogs: (limit = 50, offset = 0): Promise<{ logs: ApiLog[]; total: number }> =>
    apiFetch(`/logs?limit=${limit}&offset=${offset}`),
  getApiLogStats: (): Promise<ApiLogStats> => apiFetch('/logs/stats'),

  // ── Activity ──
  getAdminActivity: (limit = 50, offset = 0): Promise<{ activities: AdminActivityLog[]; total: number }> =>
    apiFetch(`/activity?limit=${limit}&offset=${offset}`)
};
