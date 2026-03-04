export interface ApiLog {
  id: string;
  user_id: string | null;
  method: string;
  path: string;
  status_code: number;
  response_time: number;
  ip_address: string;
  user_agent: string;
  created_at: string;
  users?: { name: string; email: string };
}

export interface EnhancedStats {
  totalUsers: number;
  newUsersThisMonth: number;
  adminCount: number;
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  totalInvoices: number;
  totalRevenue: number;
  pendingRevenue: number;
  apiRequests24h: number;
  totalMessages: number;
}

export interface PlatformStats {
  totalUsers: number;
  totalProjects: number;
  totalApiRequests24h: number;
  totalRevenue: number;
}

export interface GrowthDataPoint {
  month: string;
  count: number;
}

export interface RevenueTrendPoint {
  month: string;
  revenue: number;
  pending: number;
}

export interface ProjectDistribution {
  status: string;
  count: number;
}

export interface AdminProject {
  id: string;
  name: string;
  description: string;
  priority: string;
  deadline: string;
  status: string;
  owner_id: string;
  created_at: string;
  users?: { name: string; email: string };
}

export interface AdminInvoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  amount: number;
  total_amount: number;
  currency: string;
  status: string;
  invoice_date: string;
  due_date: string;
  created_at: string;
  users?: { name: string; email: string };
}

export interface AdminPayment {
  id: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  transaction_id: string;
  payment_date: string;
  created_at: string;
  invoices?: { invoice_number: string; client_name: string };
}

export interface ChatStats {
  totalMessages: number;
  totalRooms: number;
  recentMessages: ChatMessage[];
  rooms: string[];
}

export interface ChatMessage {
  id: number;
  room: string;
  user_id: string;
  username: string;
  message: string;
  timestamp: string;
}

export interface ApiLogStats {
  totalRequests: number;
  avgResponseTime: number;
  errorCount: number;
  errorRate: number;
  methodDistribution: { method: string; count: number }[];
  topEndpoints: { path: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
}

export interface AdminActivityLog {
  id: string;
  admin_id: string;
  action: string;
  target_id: string;
  target_type: string;
  details: Record<string, unknown>;
  created_at: string;
  users?: { name: string; email: string };
}

export interface UserDetails {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  projectsOwned: number;
  tasksAssigned: number;
  invoicesCreated: number;
}
