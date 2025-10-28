const Milestone = require('../models/Milestone');
const Project = require('../models/Project');

const milestoneController = {
  // Create new milestone
  createMilestone: async (req, res) => {
    try {
      const { projectId } = req.params;
      const { title, description, deadline } = req.body;
      const userId = req.user.id;

      // Check if user has access to this project
      const hasAccess = await Project.hasAccess(projectId, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this project'
        });
      }

      // Validate required fields
      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Event title is required'
        });
      }

      if (!deadline) {
        return res.status(400).json({
          success: false,
          message: 'Event date is required'
        });
      }

      const milestoneData = {
        project_id: projectId,
        title: title.trim(),
        description: description?.trim() || '',
        deadline: deadline,
        event_type: req.body.event_type || 'milestone',
        display_order: req.body.display_order || 0
      };

      const milestone = await Milestone.create(milestoneData);

      res.status(201).json({
        success: true,
        message: 'Milestone created successfully',
        data: milestone
      });
    } catch (error) {
      console.error('Error creating milestone:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to create milestone',
        error: error.message
      });
    }
  },

  // Get all milestones for a project
  getProjectMilestones: async (req, res) => {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;

      // Check if user has access to this project
      const hasAccess = await Project.hasAccess(projectId, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this project'
        });
      }

      const milestones = await Milestone.findByProjectId(projectId);

      res.json({
        success: true,
        data: milestones
      });
    } catch (error) {
      console.error('Error getting project milestones:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get project milestones',
        error: error.message
      });
    }
  },

  // Get single milestone by ID
  getMilestone: async (req, res) => {
    try {
      const { milestoneId } = req.params;
      const userId = req.user.id;

      const milestone = await Milestone.findById(milestoneId);
      if (!milestone) {
        return res.status(404).json({
          success: false,
          message: 'Milestone not found'
        });
      }

      // Check if user has access to the project this milestone belongs to
      const hasAccess = await Project.hasAccess(milestone.project_id, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this milestone'
        });
      }

      res.json({
        success: true,
        data: milestone
      });
    } catch (error) {
      console.error('Error getting milestone:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get milestone',
        error: error.message
      });
    }
  },

  // Update milestone
  updateMilestone: async (req, res) => {
    try {
      const { milestoneId } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      // Get milestone first to check access
      const milestone = await Milestone.findById(milestoneId);
      if (!milestone) {
        return res.status(404).json({
          success: false,
          message: 'Milestone not found'
        });
      }

      // Check if user has access to the project this milestone belongs to
      const hasAccess = await Project.hasAccess(milestone.project_id, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this milestone'
        });
      }

      // Remove fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.project_id;
      delete updateData.created_at;

      const updatedMilestone = await Milestone.update(milestoneId, updateData);

      res.json({
        success: true,
        message: 'Milestone updated successfully',
        data: updatedMilestone
      });
    } catch (error) {
      console.error('Error updating milestone:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to update milestone',
        error: error.message
      });
    }
  },

  // Delete milestone
  deleteMilestone: async (req, res) => {
    try {
      const { milestoneId } = req.params;
      const userId = req.user.id;

      // Get milestone first to check access
      const milestone = await Milestone.findById(milestoneId);
      if (!milestone) {
        return res.status(404).json({
          success: false,
          message: 'Milestone not found'
        });
      }

      // Check if user has access to the project this milestone belongs to
      const hasAccess = await Project.hasAccess(milestone.project_id, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this milestone'
        });
      }

      await Milestone.delete(milestoneId);

      res.json({
        success: true,
        message: 'Milestone deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting milestone:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to delete milestone',
        error: error.message
      });
    }
  },

  // Mark milestone as completed
  markMilestoneCompleted: async (req, res) => {
    try {
      const { milestoneId } = req.params;
      const userId = req.user.id;

      // Get milestone first to check access
      const milestone = await Milestone.findById(milestoneId);
      if (!milestone) {
        return res.status(404).json({
          success: false,
          message: 'Milestone not found'
        });
      }

      // Check if user has access to the project this milestone belongs to
      const hasAccess = await Project.hasAccess(milestone.project_id, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this milestone'
        });
      }

      const updatedMilestone = await Milestone.markCompleted(milestoneId);

      res.json({
        success: true,
        message: 'Milestone marked as completed',
        data: updatedMilestone
      });
    } catch (error) {
      console.error('Error marking milestone as completed:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to mark milestone as completed',
        error: error.message
      });
    }
  },

  // Get milestone statistics for a project
  getMilestoneStats: async (req, res) => {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;

      // Check if user has access to this project
      const hasAccess = await Project.hasAccess(projectId, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this project'
        });
      }

      const stats = await Milestone.getProjectMilestoneStats(projectId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting milestone stats:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get milestone statistics',
        error: error.message
      });
    }
  },

  // Get upcoming milestones
  getUpcomingMilestones: async (req, res) => {
    try {
      const { projectId } = req.query;
      const userId = req.user.id;

      // If projectId is provided, check access to that project
      if (projectId) {
        const hasAccess = await Project.hasAccess(projectId, userId);
        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            message: 'Access denied to this project'
          });
        }
      }

      const milestones = await Milestone.getUpcomingMilestones(projectId);

      res.json({
        success: true,
        data: milestones
      });
    } catch (error) {
      console.error('Error getting upcoming milestones:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get upcoming milestones',
        error: error.message
      });
    }
  }
};

module.exports = milestoneController;
