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

export interface PerformanceMetrics {
  taskCompletionRate: number;
  onTimeDeliveryRate: number;
  clientSatisfaction: number;
  avgResponseTime: number;
}

export interface UserGrowthData {
  month: string;
  newUsers: number;
  totalUsers: number;
}

export type DateRangePreset = '7days' | '30days' | '6months' | 'all';
export type ExportFormat = 'csv' | 'pdf';
export type AnalyticsType = 'projects' | 'financial' | 'team' | 'performance';

