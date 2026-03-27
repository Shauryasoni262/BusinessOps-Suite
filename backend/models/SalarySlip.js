const { supabase } = require('../config/database');

const SalarySlip = {
  // Create new salary slip
  create: async (slipData) => {
    try {
      const {
        employee_name,
        employee_id,
        designation,
        month_year,
        bank_name,
        account_number,
        pan_number,
        earnings,
        deductions,
        gross_earnings,
        total_deductions,
        net_pay,
        net_pay_words,
        created_by
      } = slipData;

      const { data, error } = await supabase
        .from('salary_slips')
        .insert([
          {
            employee_name,
            employee_id,
            designation,
            month_year,
            bank_name,
            account_number,
            pan_number,
            earnings,
            deductions,
            gross_earnings,
            total_deductions,
            net_pay,
            net_pay_words,
            currency: slipData.currency || '$',
            created_by,
            status: 'generated'
          }
        ])
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating salary slip:', error.message);
      throw error;
    }
  },

  // Get all salary slips for a user
  findByUserId: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('salary_slips')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching salary slips:', error.message);
      throw error;
    }
  },

  // Get by ID
  findById: async (slipId) => {
    try {
      const { data, error } = await supabase
        .from('salary_slips')
        .select('*')
        .eq('id', slipId)
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching salary slip:', error.message);
      throw error;
    }
  },

  // Delete
  delete: async (slipId) => {
    try {
      const { error } = await supabase
        .from('salary_slips')
        .delete()
        .eq('id', slipId);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting salary slip:', error.message);
      throw error;
    }
  }
};

module.exports = SalarySlip;
