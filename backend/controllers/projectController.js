const Project = require('../models/Project');
const Task = require('../models/Task');
const Milestone = require('../models/Milestone');
const ProjectFile = require('../models/ProjectFile');
const User = require('../models/User');

const projectController = {
  // Create new project
  createProject: async (req, res) => {
    try {
      const { name, description, priority, deadline, status } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Project name is required'
        });
      }

      const projectData = {
        name: name.trim(),
        description: description?.trim() || '',
        priority: priority || 'medium',
        deadline: deadline || null,
        status: status || 'active',
        owner_id: userId
      };

      const project = await Project.create(projectData);

      // Emit real-time update
      if (global.projectSocketEvents) {
        global.projectSocketEvents.emitProjectUpdate(project.id, {
          action: 'created',
          project: project
        });
      }

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project
      });
    } catch (error) {
      console.error('Error creating project:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to create project',
        error: error.message
      });
    }
  },

  // Get all projects for user
  getProjects: async (req, res) => {
    try {
      console.log('🔍 getProjects - User:', req.user);
      const userId = req.user.id;
      console.log('🔍 getProjects - User ID:', userId);
      
      const projects = await Project.findByUserId(userId);
      console.log('🔍 getProjects - Projects found:', projects?.length || 0);

      res.json({
        success: true,
        data: projects
      });
    } catch (error) {
      console.error('❌ Error getting projects:', error.message);
      console.error('❌ Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Failed to get projects',
        error: error.message
      });
    }
  },

  // Get single project by ID
  getProject: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Check if user has access to this project
      const hasAccess = await Project.hasAccess(id, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this project'
        });
      }

      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      // Get project statistics
      const stats = await Project.getStats(id);

      res.json({
        success: true,
        data: {
          ...project,
          stats
        }
      });
    } catch (error) {
      console.error('Error getting project:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get project',
        error: error.message
      });
    }
  },

  // Update project
  updateProject: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      // Check if user has access to this project
      const hasAccess = await Project.hasAccess(id, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this project'
        });
      }

      // Remove fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.owner_id;
      delete updateData.created_at;

      const project = await Project.update(id, updateData);

      // Emit real-time update
      if (global.projectSocketEvents) {
        global.projectSocketEvents.emitProjectUpdate(id, {
          action: 'updated',
          project: project
        });
      }

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: project
      });
    } catch (error) {
      console.error('Error updating project:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to update project',
        error: error.message
      });
    }
  },

  // Delete project
  deleteProject: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Get project to check ownership
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      // Only owner can delete project
      if (project.owner_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Only project owner can delete the project'
        });
      }

      await Project.delete(id);

      // Emit real-time update
      if (global.projectSocketEvents) {
        global.projectSocketEvents.emitProjectUpdate(id, {
          action: 'deleted',
          projectId: id
        });
      }

      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting project:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to delete project',
        error: error.message
      });
    }
  },

  // Add member to project
  addMember: async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id, role } = req.body;
      const userId = req.user.id;

      // Check if user has access to this project
      const hasAccess = await Project.hasAccess(id, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this project'
        });
      }

      // Check if user to be added exists
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Add member with role
      const member = await Project.addMember(id, user_id, role || 'Team Member');

      // Emit real-time update
      if (global.projectSocketEvents) {
        global.projectSocketEvents.emitMemberUpdate(id, 'added', member);
      }

      res.status(201).json({
        success: true,
        message: 'Member added successfully',
        data: member
      });
    } catch (error) {
      console.error('Error adding member:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to add member',
        error: error.message
      });
    }
  },

  // Remove member from project
  removeMember: async (req, res) => {
    try {
      const { id, userId } = req.params;
      const currentUserId = req.user.id;

      // Check if user has access to this project
      const hasAccess = await Project.hasAccess(id, currentUserId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this project'
        });
      }

      await Project.removeMember(id, userId);

      // Emit real-time update
      if (global.projectSocketEvents) {
        global.projectSocketEvents.emitMemberUpdate(id, 'removed', {
          userId: userId,
          projectId: id
        });
      }

      res.json({
        success: true,
        message: 'Member removed successfully'
      });
    } catch (error) {
      console.error('Error removing member:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to remove member',
        error: error.message
      });
    }
  },

  // Get project members
  getMembers: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Check if user has access to this project
      const hasAccess = await Project.hasAccess(id, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this project'
        });
      }

      const members = await Project.getMembers(id);

      res.json({
        success: true,
        data: members
      });
    } catch (error) {
      console.error('Error getting project members:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get project members',
        error: error.message
      });
    }
  },

  // Get project statistics
  getProjectStats: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Check if user has access to this project
      const hasAccess = await Project.hasAccess(id, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this project'
        });
      }

      const stats = await Project.getStats(id);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting project stats:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get project statistics',
        error: error.message
      });
    }
  }
};

module.exports = projectController;
