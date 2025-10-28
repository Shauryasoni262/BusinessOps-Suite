const Task = require('../models/Task');
const Project = require('../models/Project');

const taskController = {
  // Create new task
  createTask: async (req, res) => {
    try {
      const { projectId } = req.params;
      const { title, description, assigned_to, priority, due_date } = req.body;
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
          message: 'Task title is required'
        });
      }

      const taskData = {
        project_id: projectId,
        title: title.trim(),
        description: description?.trim() || '',
        assigned_to: assigned_to || null,
        priority: priority || 'medium',
        due_date: due_date || null
      };

      const task = await Task.create(taskData);

      // Emit real-time update
      if (global.projectSocketEvents) {
        global.projectSocketEvents.emitTaskUpdate(projectId, 'created', task);
      }

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });
    } catch (error) {
      console.error('Error creating task:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to create task',
        error: error.message
      });
    }
  },

  // Get all tasks for a project
  getProjectTasks: async (req, res) => {
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

      const tasks = await Task.findByProjectId(projectId);

      res.json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Error getting project tasks:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get project tasks',
        error: error.message
      });
    }
  },

  // Get single task by ID
  getTask: async (req, res) => {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;

      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Check if user has access to the project this task belongs to
      const hasAccess = await Project.hasAccess(task.project_id, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this task'
        });
      }

      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Error getting task:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get task',
        error: error.message
      });
    }
  },

  // Update task
  updateTask: async (req, res) => {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      // Get task first to check access
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Check if user has access to the project this task belongs to
      const hasAccess = await Project.hasAccess(task.project_id, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this task'
        });
      }

      // Remove fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.project_id;
      delete updateData.created_at;

      const updatedTask = await Task.update(taskId, updateData);

      // Emit real-time update
      if (global.projectSocketEvents) {
        global.projectSocketEvents.emitTaskUpdate(task.project_id, 'updated', updatedTask);
      }

      res.json({
        success: true,
        message: 'Task updated successfully',
        data: updatedTask
      });
    } catch (error) {
      console.error('Error updating task:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to update task',
        error: error.message
      });
    }
  },

  // Delete task
  deleteTask: async (req, res) => {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;

      // Get task first to check access
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Check if user has access to the project this task belongs to
      const hasAccess = await Project.hasAccess(task.project_id, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this task'
        });
      }

      await Task.delete(taskId);

      // Emit real-time update
      if (global.projectSocketEvents) {
        global.projectSocketEvents.emitTaskUpdate(task.project_id, 'deleted', {
          taskId: taskId,
          projectId: task.project_id
        });
      }

      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting task:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to delete task',
        error: error.message
      });
    }
  },

  // Get task statistics for a project
  getTaskStats: async (req, res) => {
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

      const stats = await Task.getProjectTaskStats(projectId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting task stats:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get task statistics',
        error: error.message
      });
    }
  },

  // Get user's assigned tasks
  getUserTasks: async (req, res) => {
    try {
      const userId = req.user.id;
      const tasks = await Task.findByUserId(userId);

      res.json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Error getting user tasks:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get user tasks',
        error: error.message
      });
    }
  },

  // Get overdue tasks
  getOverdueTasks: async (req, res) => {
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

      const tasks = await Task.getOverdueTasks(projectId);

      res.json({
        success: true,
        data: tasks
      });
    } catch (error) {
      console.error('Error getting overdue tasks:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get overdue tasks',
        error: error.message
      });
    }
  }
};

module.exports = taskController;
