const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Date range helper functions
export const getDateRange = (preset: string): { startDate: string | null; endDate: string | null } => {
  const now = new Date();
  const end = now.toISOString();
  
  switch (preset) {
    case '7days':
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
      return { startDate: sevenDaysAgo.toISOString(), endDate: end };
    
    case '30days':
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      return { startDate: thirtyDaysAgo.toISOString(), endDate: end };
    
    case '6months':
      const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
      return { startDate: sixMonthsAgo.toISOString(), endDate: end };
    
    case 'all':
    default:
      return { startDate: null, endDate: null };
  }
};

export const formatDateForAPI = (date: Date): string => {
  return date.toISOString();
};

// API call helper
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// Overview Stats Types
export interface OverviewStats {
  totalUsers: number;
  userGrowth: number;
  activeProjects: number;
  projectGrowth: number;
  revenue: number;
  revenueGrowth: number;
  avgResponseTime: number;
  responseTimeChange: number;
}

// Project Analytics Types
export interface ProjectAnalytics {
  summary: {
    totalProjects: number;
    completedProjects: number;
    completionRate: number;
    avgDuration: number;
    onTimeRate: number;
  };
  statusDistribution: {
    active: number;
    completed: number;
    planning: number;
    on_hold: number;
    cancelled: number;
  };
  taskStats: {
    total: number;
    completed: number;
    in_progress: number;
    pending: number;
  };
}

// Financial Analytics Types
export interface FinancialAnalytics {
  summary: {
    totalRevenue: number;
    pendingAmount: number;
    totalInvoices: number;
    paidInvoices: number;
    avgInvoiceAmount: number;
  };
  revenueData: Array<{
    month: string;
    revenue: number;
    expenses: number;
    invoiceCount: number;
  }>;
  statusBreakdown: {
    paid: number;
    pending: number;
    overdue: number;
    cancelled: number;
  };
  topClients: Array<{
    name: string;
    revenue: number;
    invoices: number;
  }>;
}

// Team Analytics Types
export interface TeamAnalytics {
  teamSize: number;
  productivity: Array<{
    userId: string;
    name: string;
    tasksCompleted: number;
    totalTasks: number;
    completionRate: number;
  }>;
  chatActivity: Array<{
    userId: string;
    username: string;
    messageCount: number;
  }>;
}

// Performance Metrics Types
export interface PerformanceMetrics {
  taskCompletionRate: number;
  onTimeDeliveryRate: number;
  clientSatisfaction: number;
  avgResponseTime: number;
}

// User Growth Types
export interface UserGrowthData {
  month: string;
  newUsers: number;
  totalUsers: number;
}

// Analytics Service
export const analyticsService = {
  // Get overview statistics
  getOverviewStats: async (): Promise<OverviewStats> => {
    const response = await apiCall('/analytics/overview');
    return response.data;
  },

  // Get project analytics with optional date range
  getProjectAnalytics: async (startDate?: string, endDate?: string): Promise<ProjectAnalytics> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiCall(`/analytics/projects?${params.toString()}`);
    return response.data;
  },

  // Get financial analytics with optional date range
  getFinancialAnalytics: async (startDate?: string, endDate?: string): Promise<FinancialAnalytics> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiCall(`/analytics/financial?${params.toString()}`);
    return response.data;
  },

  // Get team analytics with optional date range
  getTeamAnalytics: async (startDate?: string, endDate?: string): Promise<TeamAnalytics> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiCall(`/analytics/team?${params.toString()}`);
    return response.data;
  },

  // Get performance metrics with optional date range
  getPerformanceMetrics: async (startDate?: string, endDate?: string): Promise<PerformanceMetrics> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiCall(`/analytics/performance?${params.toString()}`);
    return response.data;
  },

  // Get user growth data
  getUserGrowth: async (months: number = 6): Promise<UserGrowthData[]> => {
    const response = await apiCall(`/analytics/user-growth?months=${months}`);
    return response.data;
  },

  // Export analytics data
  exportAnalytics: async (type: string, format: 'csv' | 'pdf', startDate?: string, endDate?: string): Promise<Blob> => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/analytics/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify({
        type,
        format,
        startDate: startDate || null,
        endDate: endDate || null
      })
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  },

  // Download exported file
  downloadExport: async (type: string, format: 'csv' | 'pdf', startDate?: string, endDate?: string) => {
    const blob = await analyticsService.exportAnalytics(type, format, startDate, endDate);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-analytics.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};

export default analyticsService;

