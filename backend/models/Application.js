const { supabase } = require('../config/database');

const Application = {
  // Create new application
  create: async (applicationData) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating job application:', error.message);
      throw error;
    }
  },

  // Get applications for a specific job (Admin)
  getByJobId: async (jobId) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', jobId)
        .order('applied_at', { ascending: false });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching applications for job:', error.message);
      throw error;
    }
  },

  // Update application status (Admin)
  updateStatus: async (id, status) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating application status:', error.message);
      throw error;
    }
  }
};

module.exports = Application;
