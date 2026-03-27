const { supabase } = require('../config/database');

const Job = {
  // Get all jobs (optionally filter by status)
  getAll: async (filter = {}) => {
    try {
      let query = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter.status) {
        query = query.eq('status', filter.status);
      }

      if (filter.department) {
        query = query.eq('department', filter.department);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting all jobs:', error.message);
      throw error;
    }
  },

  // Get job by ID
  findById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code === 'PGRST116') {
        return null; // Job not found
      }
      
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error finding job by ID:', error.message);
      throw error;
    }
  },

  // Create new job
  create: async (jobData) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([jobData])
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating job:', error.message);
      throw error;
    }
  },

  // Update job
  update: async (id, updateData) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating job:', error.message);
      throw error;
    }
  },

  // Delete job
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting job:', error.message);
      throw error;
    }
  }
};

module.exports = Job;
