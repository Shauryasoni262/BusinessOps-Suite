const { supabase } = require('../config/database');

// Invoice model functions for PostgreSQL
const Invoice = {
  // Create new invoice
  create: async (invoiceData) => {
    try {
      const { 
        client_name, 
        client_email, 
        client_address,
        description, 
        amount, 
        currency = 'USD',
        tax_rate = 0,
        invoice_date, 
        due_date, 
        notes,
        created_by 
      } = invoiceData;

      // Calculate tax and total
      const tax_amount = (amount * tax_rate) / 100;
      const total_amount = amount + tax_amount;

      // Generate invoice number
      let invoiceNumber;
      try {
        const { data, error } = await supabase.rpc('generate_invoice_number');
        if (error) {
          console.warn('Could not generate invoice number from DB function, using fallback');
          invoiceNumber = `INV-${Date.now()}`;
        } else {
          invoiceNumber = data;
        }
      } catch (error) {
        console.warn('Error calling generate_invoice_number function:', error.message);
        // Fallback: Use timestamp-based invoice number
        invoiceNumber = `INV-${Date.now()}`;
      }

      const { data, error } = await supabase
        .from('invoices')
        .insert([
          {
            invoice_number: invoiceNumber,
            client_name,
            client_email,
            client_address,
            description,
            amount,
            currency,
            tax_rate,
            tax_amount,
            total_amount,
            invoice_date,
            due_date,
            notes,
            created_by,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating invoice:', error.message);
      throw error;
    }
  },

  // Get all invoices for a user
  findByUserId: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching invoices:', error.message);
      throw error;
    }
  },

  // Get invoice by ID
  findById: async (invoiceId) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching invoice:', error.message);
      throw error;
    }
  },

  // Update invoice
  update: async (invoiceId, updateData) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', invoiceId)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating invoice:', error.message);
      throw error;
    }
  },

  // Delete invoice
  delete: async (invoiceId) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting invoice:', error.message);
      throw error;
    }
  },

  // Get financial statistics
  getFinancialStats: async (userId) => {
    try {
      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('total_amount, status, created_at')
        .eq('created_by', userId);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      // Calculate statistics
      const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);

      const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;

      const pendingAmount = invoices
        .filter(inv => inv.status === 'pending')
        .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);

      const pendingCount = invoices.filter(inv => inv.status === 'pending').length;

      // Calculate monthly growth (simplified)
      const currentMonth = new Date().getMonth();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      
      const currentMonthRevenue = invoices
        .filter(inv => inv.status === 'paid' && new Date(inv.created_at).getMonth() === currentMonth)
        .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);

      const lastMonthRevenue = invoices
        .filter(inv => inv.status === 'paid' && new Date(inv.created_at).getMonth() === lastMonth)
        .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);

      const monthlyGrowth = lastMonthRevenue > 0 
        ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0;

      return {
        totalRevenue,
        paidInvoices,
        pendingAmount,
        pendingCount,
        monthlyGrowth: Math.round(monthlyGrowth * 100) / 100
      };
    } catch (error) {
      console.error('Error calculating financial stats:', error.message);
      throw error;
    }
  },

  // Get revenue data for charts (last 6 months)
  getRevenueData: async (userId) => {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      console.log('📊 Querying invoices for user:', userId, 'since:', sixMonthsAgo.toISOString());

      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('total_amount, status, created_at')
        .eq('created_by', userId)
        .gte('created_at', sixMonthsAgo.toISOString());

      if (error) {
        console.error('❌ Database error in getRevenueData:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('✅ Retrieved', invoices?.length || 0, 'invoices for revenue calculation');

      // Group by month
      const monthlyData = {};
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = months[date.getMonth()];
        monthlyData[monthKey] = { revenue: 0, expenses: 0 };
      }

      // Calculate revenue and expenses by month
      invoices.forEach(invoice => {
        const month = months[new Date(invoice.created_at).getMonth()];
        if (invoice.status === 'paid') {
          monthlyData[month].revenue += parseFloat(invoice.total_amount);
        }
        // For now, assume expenses are 60% of revenue (you can make this more sophisticated)
        monthlyData[month].expenses = monthlyData[month].revenue * 0.6;
      });

      return Object.entries(monthlyData).map(([month, data]) => ({
        month,
        revenue: Math.round(data.revenue),
        expenses: Math.round(data.expenses)
      }));
    } catch (error) {
      console.error('Error fetching revenue data:', error.message);
      throw error;
    }
  }
};

module.exports = Invoice;
