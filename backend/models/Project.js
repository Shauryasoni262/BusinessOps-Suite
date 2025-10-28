const { supabase } = require('../config/database');

// Project model functions for PostgreSQL
const Project = {
  // Create new project
  create: async (projectData) => {
    try {
      const { name, description, priority, deadline, status, owner_id } = projectData;
      
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            name,
            description,
            priority: priority || 'medium',
            deadline,
            status: status || 'idea',
            owner_id
          }
        ])
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating project:', error.message);
      throw error;
    }
  },

  // Get project by ID
  findById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          owner:owner_id(name, email),
          members:project_members(
            user_id,
            joined_at,
            user:user_id(name, email)
          )
        `)
        .eq('id', id)
        .single();

      if (error && error.code === 'PGRST116') {
        return null; // Project not found
      }
      
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error finding project by ID:', error.message);
      throw error;
    }
  },

  // Get all projects which the user owns or is a member of (with RLS disabled)
  findByUserId: async (userId) => {
    try {
      console.log('🔍 Project.findByUserId - User ID:', userId);
      
      // Get projects owned by user
      console.log('🔍 Querying owned projects...');
      const { data: ownedProjects, error: ownedError } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      console.log('🔍 Owned projects query result:', { ownedProjects, ownedError });

      if (ownedError) {
        console.error('❌ Owned projects error:', ownedError);
        throw new Error(`Database error: ${ownedError.message}`);
      }

      // Get projects where user is a member
      console.log('🔍 Querying member projects...');
      const { data: memberProjectIds, error: memberError } = await supabase
        .from('project_members')
        .select('project_id')
        .eq('user_id', userId);

      console.log('🔍 Member project IDs result:', { memberProjectIds, memberError });

      if (memberError) {
        console.error('❌ Member projects error:', memberError);
        throw new Error(`Database error: ${memberError.message}`);
      }

      // Get member projects details
      let memberProjects = [];
      if (memberProjectIds && memberProjectIds.length > 0) {
        const projectIds = memberProjectIds.map(m => m.project_id);
        const { data: memberProjectsData, error: memberProjectsError } = await supabase
          .from('projects')
          .select('*')
          .in('id', projectIds)
          .order('created_at', { ascending: false });

        if (memberProjectsError) {
          console.error('❌ Member projects details error:', memberProjectsError);
          throw new Error(`Database error: ${memberProjectsError.message}`);
        }

        memberProjects = memberProjectsData || [];
      }

      // Combine and deduplicate projects
      const allProjects = [...(ownedProjects || [])];
      const ownedProjectIds = (ownedProjects || []).map(p => p.id);
      
      memberProjects.forEach(project => {
        if (!ownedProjectIds.includes(project.id)) {
          allProjects.push(project);
        }
      });

      console.log('🔍 Final combined projects:', allProjects.length);
      return allProjects;
    } catch (error) {
      console.error('❌ Error finding projects by user ID:', error.message);
      console.error('❌ Error stack:', error.stack);
      throw error;
    }
  },

  // Update project
  update: async (id, updateData) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating project:', error.message);
      throw error;
    }
  },

  // Delete project
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting project:', error.message);
      throw error;
    }
  },

  // Add member to project
  addMember: async (projectId, userId, role = 'Team Member') => {
    try {
      const { data, error } = await supabase
        .from('project_members')
        .insert([
          {
            project_id: projectId,
            user_id: userId,
            role: role
          }
        ])
        .select(`
          *,
          user:user_id(name, email)
        `)
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error adding member to project:', error.message);
      throw error;
    }
  },

  // Remove member from project
  removeMember: async (projectId, userId) => {
    try {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error removing member from project:', error.message);
      throw error;
    }
  },

  // Get project members
  getMembers: async (projectId) => {
    try {
      const { data, error } = await supabase
        .from('project_members')
        .select(`
          *,
          user:user_id(id, name, email)
        `)
        .eq('project_id', projectId)
        .order('joined_at', { ascending: true });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting project members:', error.message);
      throw error;
    }
  },

  // Check if user has access to project
  hasAccess: async (projectId, userId) => {
    try {
      // Check if user owns the project
      const { data: ownedProject, error: ownedError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .eq('owner_id', userId)
        .single();

      if (ownedProject) {
        return true; // User owns the project
      }

      // Check if user is a member of the project
      const { data: memberProject, error: memberError } = await supabase
        .from('project_members')
        .select('project_id')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .single();

      if (memberError && memberError.code === 'PGRST116') {
        return false; // No access
      }
      
      if (memberError) {
        throw new Error(`Database error: ${memberError.message}`);
      }

      return !!memberProject;
    } catch (error) {
      console.error('Error checking project access:', error.message);
      throw error;
    }
  },

  // Get project statistics
  getStats: async (projectId) => {
    try {
      // Get task counts
      const { data: taskStats, error: taskError } = await supabase
        .from('tasks')
        .select('status')
        .eq('project_id', projectId);

      if (taskError) {
        throw new Error(`Database error: ${taskError.message}`);
      }

      // Get milestone counts
      const { data: milestoneStats, error: milestoneError } = await supabase
        .from('milestones')
        .select('status')
        .eq('project_id', projectId);

      if (milestoneError) {
        throw new Error(`Database error: ${milestoneError.message}`);
      }

      // Get file count
      const { count: fileCount, error: fileError } = await supabase
        .from('project_files')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId);

      if (fileError) {
        throw new Error(`Database error: ${fileError.message}`);
      }

      // Calculate stats
      const taskCounts = taskStats.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {});

      const milestoneCounts = milestoneStats.reduce((acc, milestone) => {
        acc[milestone.status] = (acc[milestone.status] || 0) + 1;
        return acc;
      }, {});

      return {
        tasks: {
          total: taskStats.length,
          pending: taskCounts.pending || 0,
          in_progress: taskCounts.in_progress || 0,
          completed: taskCounts.completed || 0,
          cancelled: taskCounts.cancelled || 0
        },
        milestones: {
          total: milestoneStats.length,
          pending: milestoneCounts.pending || 0,
          completed: milestoneCounts.completed || 0,
          overdue: milestoneCounts.overdue || 0
        },
        files: fileCount || 0
      };
    } catch (error) {
      console.error('Error getting project stats:', error.message);
      throw error;
    }
  }
};

module.exports = Project;
