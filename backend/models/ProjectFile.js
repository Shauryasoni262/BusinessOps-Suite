const { supabase } = require('../config/database');

// ProjectFile model functions for PostgreSQL
const ProjectFile = {
  // Create file record
  create: async (fileData) => {
    try {
      const { project_id, file_name, file_url, file_size, file_type, uploaded_by } = fileData;
      
      const { data, error } = await supabase
        .from('project_files')
        .insert([
          {
            project_id,
            file_name,
            file_url,
            file_size,
            file_type,
            uploaded_by
          }
        ])
        .select(`
          *,
          uploader:uploaded_by(name, email)
        `)
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating file record:', error.message);
      throw error;
    }
  },

  // Get file by ID
  findById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('project_files')
        .select(`
          *,
          uploader:uploaded_by(name, email)
        `)
        .eq('id', id)
        .single();

      if (error && error.code === 'PGRST116') {
        return null; // File not found
      }
      
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error finding file by ID:', error.message);
      throw error;
    }
  },

  // Get all files for a project
  findByProjectId: async (projectId) => {
    try {
      const { data, error } = await supabase
        .from('project_files')
        .select(`
          *,
          uploader:uploaded_by(name, email)
        `)
        .eq('project_id', projectId)
        .order('uploaded_at', { ascending: false });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error finding files by project ID:', error.message);
      throw error;
    }
  },

  // Update file record
  update: async (id, updateData) => {
    try {
      const { data, error } = await supabase
        .from('project_files')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          uploader:uploaded_by(name, email)
        `)
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating file record:', error.message);
      throw error;
    }
  },

  // Delete file record
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('project_files')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting file record:', error.message);
      throw error;
    }
  },

  // Get file statistics for a project
  getProjectFileStats: async (projectId) => {
    try {
      const { data, error } = await supabase
        .from('project_files')
        .select('file_size, file_type')
        .eq('project_id', projectId);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      const stats = {
        total_files: data.length,
        total_size: 0,
        file_types: {}
      };

      data.forEach(file => {
        stats.total_size += file.file_size || 0;
        
        const fileType = file.file_type || 'unknown';
        stats.file_types[fileType] = (stats.file_types[fileType] || 0) + 1;
      });

      // Format file size
      stats.formatted_size = ProjectFile.formatFileSize(stats.total_size);

      return stats;
    } catch (error) {
      console.error('Error getting file stats:', error.message);
      throw error;
    }
  },

  // Format file size in human readable format
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Get recent files (last 30 days)
  getRecentFiles: async (projectId = null) => {
    try {
      const thirtyDaysAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));

      let query = supabase
        .from('project_files')
        .select(`
          *,
          project:project_id(name),
          uploader:uploaded_by(name, email)
        `)
        .gte('uploaded_at', thirtyDaysAgo.toISOString());

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query
        .order('uploaded_at', { ascending: false })
        .limit(10);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting recent files:', error.message);
      throw error;
    }
  },

  // Get files by type
  getFilesByType: async (projectId, fileType) => {
    try {
      const { data, error } = await supabase
        .from('project_files')
        .select(`
          *,
          uploader:uploaded_by(name, email)
        `)
        .eq('project_id', projectId)
        .eq('file_type', fileType)
        .order('uploaded_at', { ascending: false });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting files by type:', error.message);
      throw error;
    }
  }
};

module.exports = ProjectFile;
