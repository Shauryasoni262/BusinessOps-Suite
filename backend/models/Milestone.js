const { supabase } = require('../config/database');

// Milestone model functions for PostgreSQL
const Milestone = {
  // Create new milestone
  create: async (milestoneData) => {
    try {
      const { project_id, title, description, deadline, event_type = 'milestone', display_order = 0 } = milestoneData;
      
      const { data, error } = await supabase
        .from('milestones')
        .insert([
          {
            project_id,
            title,
            description,
            deadline,
            event_type,
            display_order,
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
      console.error('Error creating milestone:', error.message);
      throw error;
    }
  },

  // Get milestone by ID
  findById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code === 'PGRST116') {
        return null; // Milestone not found
      }
      
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error finding milestone by ID:', error.message);
      throw error;
    }
  },

  // Get all milestones for a project
  findByProjectId: async (projectId) => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('display_order', { ascending: true })
        .order('deadline', { ascending: true });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      // Update status based on deadline
      const updatedMilestones = data.map(milestone => {
        const now = new Date();
        const deadline = new Date(milestone.deadline);
        
        if (milestone.status !== 'completed') {
          if (now > deadline) {
            milestone.status = 'overdue';
          }
        }
        
        return milestone;
      });

      return updatedMilestones;
    } catch (error) {
      console.error('Error finding milestones by project ID:', error.message);
      throw error;
    }
  },

  // Update milestone
  update: async (id, updateData) => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating milestone:', error.message);
      throw error;
    }
  },

  // Delete milestone
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting milestone:', error.message);
      throw error;
    }
  },

  // Get milestone statistics for a project
  getProjectMilestoneStats: async (projectId) => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('status, deadline')
        .eq('project_id', projectId);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      const now = new Date();
      let stats = {
        total: data.length,
        pending: 0,
        completed: 0,
        overdue: 0
      };

      data.forEach(milestone => {
        if (milestone.status === 'completed') {
          stats.completed++;
        } else {
          const deadline = new Date(milestone.deadline);
          if (now > deadline) {
            stats.overdue++;
          } else {
            stats.pending++;
          }
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting milestone stats:', error.message);
      throw error;
    }
  },

  // Mark milestone as completed
  markCompleted: async (id) => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .update({ status: 'completed' })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error marking milestone as completed:', error.message);
      throw error;
    }
  },

  // Get upcoming milestones (next 30 days)
  getUpcomingMilestones: async (projectId = null) => {
    try {
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));

      let query = supabase
        .from('milestones')
        .select(`
          *,
          project:project_id(name)
        `)
        .gte('deadline', now.toISOString())
        .lte('deadline', thirtyDaysFromNow.toISOString())
        .in('status', ['pending', 'overdue']);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('deadline', { ascending: true });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting upcoming milestones:', error.message);
      throw error;
    }
  }
};

module.exports = Milestone;
