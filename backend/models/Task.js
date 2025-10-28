const { supabase } = require('../config/database');

// Task model functions for PostgreSQL
const Task = {
  // Create new task
  create: async (taskData) => {
    try {
      const { project_id, title, description, assigned_to, priority, due_date } = taskData;
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            project_id,
            title,
            description,
            assigned_to,
            priority: priority || 'medium',
            due_date,
            status: 'pending'
          }
        ])
        .select(`
          *,
          assignee:assigned_to(name, email)
        `)
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating task:', error.message);
      throw error;
    }
  },

  // Get task by ID
  findById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:assigned_to(name, email)
        `)
        .eq('id', id)
        .single();

      if (error && error.code === 'PGRST116') {
        return null; // Task not found
      }
      
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error finding task by ID:', error.message);
      throw error;
    }
  },

  // Get all tasks for a project
  findByProjectId: async (projectId) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:assigned_to(name, email)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error finding tasks by project ID:', error.message);
      throw error;
    }
  },

  // Get tasks assigned to a user
  findByUserId: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          project:project_id(name, status),
          assignee:assigned_to(name, email)
        `)
        .eq('assigned_to', userId)
        .order('due_date', { ascending: true });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error finding tasks by user ID:', error.message);
      throw error;
    }
  },

  // Update task
  update: async (id, updateData) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          assignee:assigned_to(name, email)
        `)
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating task:', error.message);
      throw error;
    }
  },

  // Delete task
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting task:', error.message);
      throw error;
    }
  },

  // Get task statistics for a project
  getProjectTaskStats: async (projectId) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('status')
        .eq('project_id', projectId);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      const stats = data.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {});

      return {
        total: data.length,
        pending: stats.pending || 0,
        in_progress: stats.in_progress || 0,
        completed: stats.completed || 0,
        cancelled: stats.cancelled || 0
      };
    } catch (error) {
      console.error('Error getting task stats:', error.message);
      throw error;
    }
  },

  // Get overdue tasks
  getOverdueTasks: async (projectId = null) => {
    try {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          project:project_id(name),
          assignee:assigned_to(name, email)
        `)
        .lt('due_date', new Date().toISOString())
        .in('status', ['pending', 'in_progress']);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('due_date', { ascending: true });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting overdue tasks:', error.message);
      throw error;
    }
  }
};

module.exports = Task;
