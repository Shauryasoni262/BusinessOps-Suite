const { supabase } = require('../config/database');

/**
 * Model for administrative logs, platform-wide analytics, and auditing
 */
const AdminLog = {
  // ──────────────────────────────────────────────
  // ENHANCED DASHBOARD STATS
  // ──────────────────────────────────────────────

  /**
   * Get comprehensive platform-wide metrics for the admin dashboard
   */
  getEnhancedStats: async () => {
    try {
      // 1. Total Users
      const { count: totalUsers } = await supabase
        .from('users').select('id', { count: 'exact', head: true });

      // 2. New users this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const { count: newUsersThisMonth } = await supabase
        .from('users').select('id', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      // 3. Admin count
      const { count: adminCount } = await supabase
        .from('users').select('id', { count: 'exact', head: true })
        .eq('role', 'admin');

      // 4. Total Projects
      const { count: totalProjects } = await supabase
        .from('projects').select('id', { count: 'exact', head: true });

      // 5. Active Projects
      const { count: activeProjects } = await supabase
        .from('projects').select('id', { count: 'exact', head: true })
        .eq('status', 'active');

      // 6. Total Tasks
      const { count: totalTasks } = await supabase
        .from('tasks').select('id', { count: 'exact', head: true });

      // 7. Completed Tasks
      const { count: completedTasks } = await supabase
        .from('tasks').select('id', { count: 'exact', head: true })
        .eq('status', 'completed');

      // 8. Total Invoices
      const { count: totalInvoices } = await supabase
        .from('invoices').select('id', { count: 'exact', head: true });

      // 9. Revenue (paid invoices)
      const { data: paidInvoices } = await supabase
        .from('invoices').select('total_amount').eq('status', 'paid');
      const totalRevenue = paidInvoices
        ? paidInvoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0)
        : 0;

      // 10. Pending Revenue
      const { data: pendingInvoices } = await supabase
        .from('invoices').select('total_amount').eq('status', 'pending');
      const pendingRevenue = pendingInvoices
        ? pendingInvoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0)
        : 0;

      // 11. API requests 24h
      const oneDayAgo = new Date();
      oneDayAgo.setHours(oneDayAgo.getHours() - 24);
      const { count: apiRequests24h } = await supabase
        .from('api_logs').select('id', { count: 'exact', head: true })
        .gt('created_at', oneDayAgo.toISOString());

      // 12. Total messages
      let totalMessages = 0;
      try {
        const { count } = await supabase
          .from('messages').select('id', { count: 'exact', head: true });
        totalMessages = count || 0;
      } catch (e) { /* table may not exist */ }

      return {
        totalUsers: totalUsers || 0,
        newUsersThisMonth: newUsersThisMonth || 0,
        adminCount: adminCount || 0,
        totalProjects: totalProjects || 0,
        activeProjects: activeProjects || 0,
        totalTasks: totalTasks || 0,
        completedTasks: completedTasks || 0,
        totalInvoices: totalInvoices || 0,
        totalRevenue,
        pendingRevenue,
        apiRequests24h: apiRequests24h || 0,
        totalMessages
      };
    } catch (error) {
      console.error('Error fetching enhanced stats:', error.message);
      throw error;
    }
  },

  // ──────────────────────────────────────────────
  // USER GROWTH CHART DATA
  // ──────────────────────────────────────────────

  getUserGrowth: async (months = 6) => {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const { data: users, error } = await supabase
        .from('users')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyData = {};

      for (let i = months - 1; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        monthlyData[key] = 0;
      }

      (users || []).forEach(u => {
        const d = new Date(u.created_at);
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        if (monthlyData[key] !== undefined) monthlyData[key]++;
      });

      return Object.entries(monthlyData).map(([month, count]) => ({ month, count }));
    } catch (error) {
      console.error('Error fetching user growth:', error.message);
      throw error;
    }
  },

  // ──────────────────────────────────────────────
  // REVENUE TREND CHART DATA
  // ──────────────────────────────────────────────

  getRevenueTrend: async (months = 6) => {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('total_amount, status, created_at')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyData = {};

      for (let i = months - 1; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = `${monthNames[d.getMonth()]}`;
        monthlyData[key] = { revenue: 0, pending: 0 };
      }

      (invoices || []).forEach(inv => {
        const d = new Date(inv.created_at);
        const key = monthNames[d.getMonth()];
        if (monthlyData[key]) {
          if (inv.status === 'paid') {
            monthlyData[key].revenue += parseFloat(inv.total_amount);
          } else {
            monthlyData[key].pending += parseFloat(inv.total_amount);
          }
        }
      });

      return Object.entries(monthlyData).map(([month, data]) => ({
        month,
        revenue: Math.round(data.revenue),
        pending: Math.round(data.pending)
      }));
    } catch (error) {
      console.error('Error fetching revenue trend:', error.message);
      throw error;
    }
  },

  // ──────────────────────────────────────────────
  // GLOBAL PROJECT & TASK DATA
  // ──────────────────────────────────────────────

  getAllProjects: async (limit = 100, offset = 0) => {
    try {
      const { data, error, count } = await supabase
        .from('projects')
        .select('*, users!projects_owner_id_fkey(name, email)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { projects: data || [], total: count || 0 };
    } catch (error) {
      console.error('Error fetching all projects:', error.message);
      throw error;
    }
  },

  getProjectStatusDistribution: async () => {
    try {
      const statuses = ['active', 'completed', 'on_hold', 'cancelled'];
      const distribution = [];

      for (const status of statuses) {
        const { count } = await supabase
          .from('projects').select('id', { count: 'exact', head: true })
          .eq('status', status);
        distribution.push({ status, count: count || 0 });
      }

      return distribution;
    } catch (error) {
      console.error('Error fetching project distribution:', error.message);
      throw error;
    }
  },

  // ──────────────────────────────────────────────
  // FINANCIAL DATA (INVOICES + PAYMENTS)
  // ──────────────────────────────────────────────

  getAllInvoices: async (limit = 100, offset = 0) => {
    try {
      const { data, error, count } = await supabase
        .from('invoices')
        .select('*, users!invoices_created_by_fkey(name, email)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { invoices: data || [], total: count || 0 };
    } catch (error) {
      console.error('Error fetching all invoices:', error.message);
      throw error;
    }
  },

  getAllPayments: async (limit = 100, offset = 0) => {
    try {
      const { data, error, count } = await supabase
        .from('payments')
        .select('*, invoices(invoice_number, client_name)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { payments: data || [], total: count || 0 };
    } catch (error) {
      console.error('Error fetching all payments:', error.message);
      throw error;
    }
  },

  // ──────────────────────────────────────────────
  // CHAT / MESSAGES
  // ──────────────────────────────────────────────

  getChatStats: async () => {
    try {
      const { count: totalMessages } = await supabase
        .from('messages').select('id', { count: 'exact', head: true });

      const { data: recentMessages } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      // Get unique rooms
      const { data: rooms } = await supabase
        .from('messages')
        .select('room')
        .limit(500);

      const uniqueRooms = rooms ? [...new Set(rooms.map(r => r.room))] : [];

      return {
        totalMessages: totalMessages || 0,
        totalRooms: uniqueRooms.length,
        recentMessages: recentMessages || [],
        rooms: uniqueRooms
      };
    } catch (error) {
      console.error('Error fetching chat stats:', error.message);
      return { totalMessages: 0, totalRooms: 0, recentMessages: [], rooms: [] };
    }
  },

  // ──────────────────────────────────────────────
  // API LOG ANALYTICS
  // ──────────────────────────────────────────────

  getApiLogStats: async () => {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setHours(oneDayAgo.getHours() - 24);

      const { data: logs24h } = await supabase
        .from('api_logs')
        .select('method, path, status_code, response_time')
        .gt('created_at', oneDayAgo.toISOString());

      const allLogs = logs24h || [];
      const totalRequests = allLogs.length;
      const avgResponseTime = totalRequests > 0
        ? Math.round(allLogs.reduce((sum, l) => sum + (l.response_time || 0), 0) / totalRequests)
        : 0;
      const errorCount = allLogs.filter(l => l.status_code >= 400).length;
      const errorRate = totalRequests > 0 ? Math.round((errorCount / totalRequests) * 100) : 0;

      // Method distribution
      const methodCounts = {};
      allLogs.forEach(l => { methodCounts[l.method] = (methodCounts[l.method] || 0) + 1; });

      // Top endpoints
      const endpointCounts = {};
      allLogs.forEach(l => { endpointCounts[l.path] = (endpointCounts[l.path] || 0) + 1; });
      const topEndpoints = Object.entries(endpointCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([path, count]) => ({ path, count }));

      // Status distribution
      const statusCounts = {};
      allLogs.forEach(l => {
        const group = `${Math.floor(l.status_code / 100)}xx`;
        statusCounts[group] = (statusCounts[group] || 0) + 1;
      });

      return {
        totalRequests,
        avgResponseTime,
        errorCount,
        errorRate,
        methodDistribution: Object.entries(methodCounts).map(([method, count]) => ({ method, count })),
        topEndpoints,
        statusDistribution: Object.entries(statusCounts).map(([status, count]) => ({ status, count }))
      };
    } catch (error) {
      console.error('Error fetching API log stats:', error.message);
      return { totalRequests: 0, avgResponseTime: 0, errorCount: 0, errorRate: 0, methodDistribution: [], topEndpoints: [], statusDistribution: [] };
    }
  },

  // ──────────────────────────────────────────────
  // PAGINATED API LOGS
  // ──────────────────────────────────────────────

  getApiLogs: async (limit = 100, offset = 0) => {
    try {
      const { data, error, count } = await supabase
        .from('api_logs')
        .select('*, users(name, email)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { logs: data, total: count };
    } catch (error) {
      console.error('Error fetching API logs:', error.message);
      throw error;
    }
  },

  // ──────────────────────────────────────────────
  // ADMIN ACTIVITY AUDIT TRAIL
  // ──────────────────────────────────────────────

  getAdminActivityLogs: async (limit = 50, offset = 0) => {
    try {
      const { data, error, count } = await supabase
        .from('admin_activity_logs')
        .select('*, users!admin_activity_logs_admin_id_fkey(name, email)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { activities: data || [], total: count || 0 };
    } catch (error) {
      console.error('Error fetching admin activities:', error.message);
      return { activities: [], total: 0 };
    }
  },

  logAdminActivity: async (adminId, action, targetId, targetType, details = {}) => {
    try {
      const { error } = await supabase
        .from('admin_activity_logs')
        .insert([{ admin_id: adminId, action, target_id: targetId, target_type: targetType, details }]);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error logging admin activity:', error.message);
      return false;
    }
  },

  // ──────────────────────────────────────────────
  // USER DETAILS (DRILL-DOWN)
  // ──────────────────────────────────────────────

  getUserDetails: async (userId) => {
    try {
      const { data: user } = await supabase
        .from('users').select('*').eq('id', userId).single();

      const { count: projectsOwned } = await supabase
        .from('projects').select('id', { count: 'exact', head: true }).eq('owner_id', userId);

      const { count: tasksAssigned } = await supabase
        .from('tasks').select('id', { count: 'exact', head: true }).eq('assigned_to', userId);

      const { count: invoicesCreated } = await supabase
        .from('invoices').select('id', { count: 'exact', head: true }).eq('created_by', userId);

      return {
        ...user,
        projectsOwned: projectsOwned || 0,
        tasksAssigned: tasksAssigned || 0,
        invoicesCreated: invoicesCreated || 0
      };
    } catch (error) {
      console.error('Error fetching user details:', error.message);
      throw error;
    }
  }
};

module.exports = AdminLog;
