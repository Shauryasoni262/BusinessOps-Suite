const { supabase } = require('../config/database');

const Analytics = {
  // Get overview statistics for dashboard cards
  getOverviewStats: async (userId) => {
    try {
      // Get total users count
      const { count: totalUsers, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw new Error(`Users count error: ${usersError.message}`);

      // Get active projects count
      const { count: activeProjects, error: projectsError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', userId)
        .in('status', ['active', 'planning']);

      if (projectsError) throw new Error(`Projects count error: ${projectsError.message}`);

      // Get total revenue
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('total_amount, status, created_at')
        .eq('created_by', userId)
        .eq('status', 'paid');

      if (invoicesError) throw new Error(`Invoices error: ${invoicesError.message}`);

      const totalRevenue = invoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);

      // Calculate revenue growth (compare current month to last month)
      const currentMonth = new Date().getMonth();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      
      const currentMonthRevenue = invoices
        .filter(inv => new Date(inv.created_at).getMonth() === currentMonth)
        .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);

      const lastMonthRevenue = invoices
        .filter(inv => new Date(inv.created_at).getMonth() === lastMonth)
        .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);

      const revenueGrowth = lastMonthRevenue > 0 
        ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0;

      // Get user growth
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { count: newUsers, error: newUsersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sixMonthsAgo.toISOString());

      if (newUsersError) throw new Error(`New users error: ${newUsersError.message}`);

      const { count: oldUsers, error: oldUsersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', sixMonthsAgo.toISOString());

      if (oldUsersError) throw new Error(`Old users error: ${oldUsersError.message}`);

      const userGrowth = oldUsers > 0 ? ((newUsers / oldUsers) * 100) : 0;

      // Calculate average response time (mock for now - based on messages)
      const avgResponseTime = 2.4; // hours

      return {
        totalUsers: totalUsers || 0,
        userGrowth: Math.round(userGrowth * 100) / 100,
        activeProjects: activeProjects || 0,
        projectGrowth: 12, // Mock - can be calculated similar to revenue
        revenue: Math.round(totalRevenue),
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        avgResponseTime,
        responseTimeChange: -5 // Mock - negative means improvement
      };
    } catch (error) {
      console.error('Error getting overview stats:', error.message);
      throw error;
    }
  },

  // Get project analytics with optional date filtering
  getProjectAnalytics: async (userId, startDate = null, endDate = null) => {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .eq('owner_id', userId);

      if (startDate) {
        query = query.gte('created_at', startDate);
      }
      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      const { data: projects, error } = await query;

      if (error) throw new Error(`Database error: ${error.message}`);

      // Calculate project status distribution
      const statusDistribution = projects.reduce((acc, project) => {
        const status = project.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Calculate completion rate
      const completedProjects = projects.filter(p => p.status === 'completed').length;
      const completionRate = projects.length > 0 
        ? (completedProjects / projects.length) * 100 
        : 0;

      // Calculate average project duration
      const completedWithDates = projects.filter(p => 
        p.status === 'completed' && p.created_at && p.updated_at
      );
      
      const avgDuration = completedWithDates.length > 0
        ? completedWithDates.reduce((sum, p) => {
            const duration = (new Date(p.updated_at) - new Date(p.created_at)) / (1000 * 60 * 60 * 24);
            return sum + duration;
          }, 0) / completedWithDates.length
        : 0;

      // Get tasks for these projects
      const projectIds = projects.map(p => p.id);
      
      let tasksQuery = supabase
        .from('tasks')
        .select('*');

      if (projectIds.length > 0) {
        tasksQuery = tasksQuery.in('project_id', projectIds);
      }

      const { data: tasks, error: tasksError } = await tasksQuery;

      if (tasksError) throw new Error(`Tasks error: ${tasksError.message}`);

      // Calculate task distribution
      const taskStats = {
        total: tasks?.length || 0,
        completed: tasks?.filter(t => t.status === 'completed').length || 0,
        in_progress: tasks?.filter(t => t.status === 'in_progress').length || 0,
        pending: tasks?.filter(t => t.status === 'pending').length || 0
      };

      // Calculate delivery metrics
      const onTimeProjects = projects.filter(p => {
        if (p.status !== 'completed' || !p.deadline || !p.updated_at) return false;
        return new Date(p.updated_at) <= new Date(p.deadline);
      }).length;

      const projectsWithDeadlines = projects.filter(p => 
        p.status === 'completed' && p.deadline
      ).length;

      const onTimeRate = projectsWithDeadlines > 0 
        ? (onTimeProjects / projectsWithDeadlines) * 100 
        : 0;

      return {
        summary: {
          totalProjects: projects.length,
          completedProjects,
          completionRate: Math.round(completionRate * 100) / 100,
          avgDuration: Math.round(avgDuration * 100) / 100,
          onTimeRate: Math.round(onTimeRate * 100) / 100
        },
        statusDistribution: {
          active: statusDistribution.active || 0,
          completed: statusDistribution.completed || 0,
          planning: statusDistribution.planning || 0,
          on_hold: statusDistribution.on_hold || 0,
          cancelled: statusDistribution.cancelled || 0
        },
        taskStats
      };
    } catch (error) {
      console.error('Error getting project analytics:', error.message);
      throw error;
    }
  },

  // Get financial analytics with optional date filtering
  getFinancialAnalytics: async (userId, startDate = null, endDate = null) => {
    try {
      let query = supabase
        .from('invoices')
        .select('*')
        .eq('created_by', userId);

      if (startDate) {
        query = query.gte('invoice_date', startDate);
      }
      if (endDate) {
        query = query.lte('invoice_date', endDate);
      }

      const { data: invoices, error } = await query;

      if (error) throw new Error(`Database error: ${error.message}`);

      // Calculate revenue trends by month
      const monthlyRevenue = {};
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = months[date.getMonth()];
        monthlyRevenue[monthKey] = { revenue: 0, expenses: 0, invoices: 0 };
      }

      // Calculate actual revenue
      invoices.forEach(invoice => {
        const month = months[new Date(invoice.invoice_date).getMonth()];
        if (monthlyRevenue[month]) {
          if (invoice.status === 'paid') {
            monthlyRevenue[month].revenue += parseFloat(invoice.total_amount);
            monthlyRevenue[month].expenses += parseFloat(invoice.total_amount) * 0.6; // 60% expenses
          }
          monthlyRevenue[month].invoices += 1;
        }
      });

      const revenueData = Object.entries(monthlyRevenue).map(([month, data]) => ({
        month,
        revenue: Math.round(data.revenue),
        expenses: Math.round(data.expenses),
        invoiceCount: data.invoices
      }));

      // Calculate payment status breakdown
      const statusBreakdown = {
        paid: invoices.filter(i => i.status === 'paid').length,
        pending: invoices.filter(i => i.status === 'pending').length,
        overdue: invoices.filter(i => i.status === 'overdue').length,
        cancelled: invoices.filter(i => i.status === 'cancelled').length
      };

      // Calculate top clients
      const clientRevenue = {};
      invoices.forEach(invoice => {
        if (invoice.status === 'paid') {
          if (!clientRevenue[invoice.client_name]) {
            clientRevenue[invoice.client_name] = {
              name: invoice.client_name,
              revenue: 0,
              invoices: 0
            };
          }
          clientRevenue[invoice.client_name].revenue += parseFloat(invoice.total_amount);
          clientRevenue[invoice.client_name].invoices += 1;
        }
      });

      const topClients = Object.values(clientRevenue)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(client => ({
          ...client,
          revenue: Math.round(client.revenue)
        }));

      // Calculate summary stats
      const totalRevenue = invoices
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + parseFloat(i.total_amount), 0);

      const pendingAmount = invoices
        .filter(i => i.status === 'pending')
        .reduce((sum, i) => sum + parseFloat(i.total_amount), 0);

      return {
        summary: {
          totalRevenue: Math.round(totalRevenue),
          pendingAmount: Math.round(pendingAmount),
          totalInvoices: invoices.length,
          paidInvoices: statusBreakdown.paid,
          avgInvoiceAmount: invoices.length > 0 ? Math.round(totalRevenue / statusBreakdown.paid) : 0
        },
        revenueData,
        statusBreakdown,
        topClients
      };
    } catch (error) {
      console.error('Error getting financial analytics:', error.message);
      throw error;
    }
  },

  // Get team analytics
  getTeamAnalytics: async (userId, startDate = null, endDate = null) => {
    try {
      // Get all projects for the user
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id')
        .eq('owner_id', userId);

      if (projectsError) throw new Error(`Projects error: ${projectsError.message}`);

      const projectIds = projects.map(p => p.id);

      // Get team members
      let membersQuery = supabase
        .from('project_members')
        .select(`
          user_id,
          users!inner(id, name, email)
        `);

      if (projectIds.length > 0) {
        membersQuery = membersQuery.in('project_id', projectIds);
      }

      const { data: members, error: membersError } = await membersQuery;

      if (membersError) throw new Error(`Members error: ${membersError.message}`);

      // Get unique team members
      const uniqueMembers = Array.from(
        new Map(members.map(m => [m.user_id, m.users])).values()
      );

      // Get tasks for team members
      const teamProductivity = await Promise.all(
        uniqueMembers.map(async (member) => {
          let tasksQuery = supabase
            .from('tasks')
            .select('*')
            .eq('assigned_to', member.id);

          if (projectIds.length > 0) {
            tasksQuery = tasksQuery.in('project_id', projectIds);
          }
          if (startDate) {
            tasksQuery = tasksQuery.gte('created_at', startDate);
          }
          if (endDate) {
            tasksQuery = tasksQuery.lte('created_at', endDate);
          }

          const { data: tasks, error: tasksError } = await tasksQuery;

          if (tasksError) {
            console.error(`Error fetching tasks for ${member.name}:`, tasksError);
            return null;
          }

          const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
          const totalTasks = tasks?.length || 0;

          return {
            userId: member.id,
            name: member.name,
            tasksCompleted: completedTasks,
            totalTasks,
            completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
          };
        })
      );

      // Filter out nulls and sort by tasks completed
      const validProductivity = teamProductivity
        .filter(p => p !== null)
        .sort((a, b) => b.tasksCompleted - a.tasksCompleted);

      // Get chat activity
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('user_id, username, timestamp');

      // Calculate messages per user
      const chatActivity = {};
      messages?.forEach(msg => {
        if (!chatActivity[msg.user_id]) {
          chatActivity[msg.user_id] = {
            username: msg.username,
            messageCount: 0
          };
        }
        chatActivity[msg.user_id].messageCount += 1;
      });

      const chatStats = Object.entries(chatActivity)
        .map(([userId, data]) => ({
          userId,
          username: data.username,
          messageCount: data.messageCount
        }))
        .sort((a, b) => b.messageCount - a.messageCount)
        .slice(0, 10);

      return {
        teamSize: uniqueMembers.length,
        productivity: validProductivity,
        chatActivity: chatStats
      };
    } catch (error) {
      console.error('Error getting team analytics:', error.message);
      throw error;
    }
  },

  // Get performance metrics (KPIs)
  getPerformanceMetrics: async (userId, startDate = null, endDate = null) => {
    try {
      // Get projects for task completion rate
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, status, created_at, updated_at, deadline')
        .eq('owner_id', userId);

      if (projectsError) throw new Error(`Projects error: ${projectsError.message}`);

      const projectIds = projects.map(p => p.id);

      // Get tasks
      let tasksQuery = supabase
        .from('tasks')
        .select('*');

      if (projectIds.length > 0) {
        tasksQuery = tasksQuery.in('project_id', projectIds);
      }
      if (startDate) {
        tasksQuery = tasksQuery.gte('created_at', startDate);
      }
      if (endDate) {
        tasksQuery = tasksQuery.lte('created_at', endDate);
      }

      const { data: tasks, error: tasksError } = await tasksQuery;

      if (tasksError) throw new Error(`Tasks error: ${tasksError.message}`);

      // Calculate task completion rate
      const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
      const totalTasks = tasks?.length || 0;
      const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      // Calculate on-time delivery rate
      const completedProjects = projects.filter(p => p.status === 'completed' && p.deadline);
      const onTimeProjects = completedProjects.filter(p => 
        new Date(p.updated_at) <= new Date(p.deadline)
      ).length;
      const onTimeDeliveryRate = completedProjects.length > 0 
        ? (onTimeProjects / completedProjects.length) * 100 
        : 0;

      // Mock client satisfaction (can be added to database later)
      const clientSatisfaction = 4.8; // out of 5

      return {
        taskCompletionRate: Math.round(taskCompletionRate),
        onTimeDeliveryRate: Math.round(onTimeDeliveryRate),
        clientSatisfaction,
        avgResponseTime: 2.4 // hours - from overview stats
      };
    } catch (error) {
      console.error('Error getting performance metrics:', error.message);
      throw error;
    }
  },

  // Get user growth data
  getUserGrowth: async (months = 6) => {
    try {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const growthData = [];

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const { count, error } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString());

        if (error) throw new Error(`User growth error: ${error.message}`);

        growthData.push({
          month: monthNames[date.getMonth()],
          newUsers: count || 0,
          // Calculate cumulative total
          totalUsers: 0 // Will be calculated below
        });
      }

      // Calculate cumulative totals
      let cumulative = 0;
      for (let i = 0; i < growthData.length; i++) {
        cumulative += growthData[i].newUsers;
        growthData[i].totalUsers = cumulative;
      }

      return growthData;
    } catch (error) {
      console.error('Error getting user growth:', error.message);
      throw error;
    }
  }
};

module.exports = Analytics;

