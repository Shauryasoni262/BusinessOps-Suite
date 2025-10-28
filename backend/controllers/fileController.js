const { supabase } = require('../config/database');
const ProjectFile = require('../models/ProjectFile');
const Project = require('../models/Project');

const fileController = {
  // Upload file to project
  uploadFile: async (req, res) => {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file provided'
        });
      }

      // Check if user has access to this project
      const hasAccess = await Project.hasAccess(projectId, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this project'
        });
      }

      const file = req.file;
      const fileName = `${projectId}/${Date.now()}-${file.originalname}`;
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('Error uploading file to storage:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload file to storage',
          error: uploadError.message
        });
      }

      // Get public URL for the file
      const { data: urlData } = supabase.storage
        .from('project-files')
        .getPublicUrl(fileName);

      // Save file metadata to database
      const fileData = {
        project_id: projectId,
        file_name: file.originalname,
        file_url: urlData.publicUrl,
        file_size: file.size,
        file_type: file.mimetype,
        uploaded_by: userId
      };

      const savedFile = await ProjectFile.create(fileData);

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: savedFile
      });
    } catch (error) {
      console.error('Error uploading file:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to upload file',
        error: error.message
      });
    }
  },

  // Get all files for a project
  getProjectFiles: async (req, res) => {
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

      const files = await ProjectFile.findByProjectId(projectId);

      res.json({
        success: true,
        data: files
      });
    } catch (error) {
      console.error('Error getting project files:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get project files',
        error: error.message
      });
    }
  },

  // Get single file by ID
  getFile: async (req, res) => {
    try {
      const { fileId } = req.params;
      const userId = req.user.id;

      const file = await ProjectFile.findById(fileId);
      if (!file) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      // Check if user has access to the project this file belongs to
      const hasAccess = await Project.hasAccess(file.project_id, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this file'
        });
      }

      res.json({
        success: true,
        data: file
      });
    } catch (error) {
      console.error('Error getting file:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get file',
        error: error.message
      });
    }
  },

  // Delete file
  deleteFile: async (req, res) => {
    try {
      const { fileId } = req.params;
      const userId = req.user.id;

      // Get file first to check access and get file path
      const file = await ProjectFile.findById(fileId);
      if (!file) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      // Check if user has access to the project this file belongs to
      const hasAccess = await Project.hasAccess(file.project_id, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this file'
        });
      }

      // Only the uploader can delete the file
      if (file.uploaded_by !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Only the file uploader can delete the file'
        });
      }

      // Extract file path from URL for deletion from storage
      const filePath = file.file_url.split('/').slice(-2).join('/'); // Get projectId/filename part

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('project-files')
        .remove([filePath]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
        // Continue with database deletion even if storage deletion fails
      }

      // Delete from database
      await ProjectFile.delete(fileId);

      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting file:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to delete file',
        error: error.message
      });
    }
  },

  // Get file statistics for a project
  getFileStats: async (req, res) => {
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

      const stats = await ProjectFile.getProjectFileStats(projectId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting file stats:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get file statistics',
        error: error.message
      });
    }
  },

  // Get recent files
  getRecentFiles: async (req, res) => {
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

      const files = await ProjectFile.getRecentFiles(projectId);

      res.json({
        success: true,
        data: files
      });
    } catch (error) {
      console.error('Error getting recent files:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get recent files',
        error: error.message
      });
    }
  },

  // Get files by type
  getFilesByType: async (req, res) => {
    try {
      const { projectId } = req.params;
      const { type } = req.query;
      const userId = req.user.id;

      // Check if user has access to this project
      const hasAccess = await Project.hasAccess(projectId, userId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this project'
        });
      }

      if (!type) {
        return res.status(400).json({
          success: false,
          message: 'File type is required'
        });
      }

      const files = await ProjectFile.getFilesByType(projectId, type);

      res.json({
        success: true,
        data: files
      });
    } catch (error) {
      console.error('Error getting files by type:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get files by type',
        error: error.message
      });
    }
  }
};

module.exports = fileController;
