const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ProjectFile {
  id: string;
  project_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  uploaded_by: string;
  uploaded_at: string;
  uploader?: {
    name: string;
    email: string;
  };
  project?: {
    name: string;
  };
}

interface FileStats {
  total_files: number;
  total_size: number;
  formatted_size: string;
  file_types: Record<string, number>;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

class FileService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  async uploadFile(projectId: string, file: File): Promise<ProjectFile> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/files`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ProjectFile> = await response.json();
      console.log('Upload success:', result);
      return result.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async getProjectFiles(projectId: string): Promise<ProjectFile[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/files`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ProjectFile[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching project files:', error);
      throw error;
    }
  }

  async getFile(fileId: string): Promise<ProjectFile> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/files/${fileId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ProjectFile> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching file:', error);
      throw error;
    }
  }

  async deleteFile(projectId: string, fileId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/files/${fileId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async getFileStats(projectId: string): Promise<FileStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/files/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<FileStats> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching file stats:', error);
      throw error;
    }
  }

  async getRecentFiles(projectId?: string): Promise<ProjectFile[]> {
    try {
      const url = new URL(`${API_BASE_URL}/files/recent`);
      if (projectId) {
        url.searchParams.append('projectId', projectId);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ProjectFile[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching recent files:', error);
      throw error;
    }
  }

  async getFilesByType(projectId: string, fileType: string): Promise<ProjectFile[]> {
    try {
      const url = new URL(`${API_BASE_URL}/projects/${projectId}/files`);
      url.searchParams.append('type', fileType);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ProjectFile[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching files by type:', error);
      throw error;
    }
  }

  // Utility function to format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Utility function to get file type from filename
  getFileType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    const typeMap: Record<string, string> = {
      // Images
      'jpg': 'image', 'jpeg': 'image', 'png': 'image', 'gif': 'image', 'bmp': 'image', 'svg': 'image', 'webp': 'image',
      // Documents
      'pdf': 'document', 'doc': 'document', 'docx': 'document', 'txt': 'document', 'rtf': 'document',
      'xls': 'spreadsheet', 'xlsx': 'spreadsheet', 'csv': 'spreadsheet',
      'ppt': 'presentation', 'pptx': 'presentation',
      // Archives
      'zip': 'archive', 'rar': 'archive', '7z': 'archive', 'tar': 'archive', 'gz': 'archive',
      // Code
      'js': 'code', 'ts': 'code', 'jsx': 'code', 'tsx': 'code', 'html': 'code', 'css': 'code', 'scss': 'code',
      'json': 'code', 'xml': 'code', 'py': 'code', 'java': 'code', 'cpp': 'code', 'c': 'code',
      // Videos
      'mp4': 'video', 'avi': 'video', 'mov': 'video', 'wmv': 'video', 'flv': 'video', 'webm': 'video',
      // Audio
      'mp3': 'audio', 'wav': 'audio', 'flac': 'audio', 'aac': 'audio', 'ogg': 'audio'
    };

    return typeMap[extension || ''] || 'other';
  }

  // Utility function to download file
  downloadFile(file: ProjectFile): void {
    const link = document.createElement('a');
    link.href = file.file_url;
    link.download = file.file_name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const fileService = new FileService();
export type { ProjectFile, FileStats };
