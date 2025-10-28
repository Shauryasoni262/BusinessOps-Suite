 // Helper functions for task management

/**
 * Get initials from user name
 * @param name - Full name of the user
 * @returns First 2 initials in uppercase
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return '??';
  
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Get color for task status badge
 * @param status - Task status
 * @returns Hex color code
 */
export function getTaskStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return '#22c55e'; // Green
    case 'in_progress':
      return '#3b82f6'; // Blue
    case 'pending':
      return '#6b7280'; // Gray
    case 'cancelled':
      return '#ef4444'; // Red
    default:
      return '#6b7280'; // Default gray
  }
}

/**
 * Get color for task priority badge
 * @param priority - Task priority
 * @returns Hex color code
 */
export function getTaskPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent':
      return '#ef4444'; // Red
    case 'high':
      return '#f97316'; // Orange
    case 'medium':
      return '#eab308'; // Yellow
    case 'low':
      return '#22c55e'; // Green
    default:
      return '#6b7280'; // Default gray
  }
}

/**
 * Format date for display
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'No date';
  
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Check if a date is overdue
 * @param dateString - ISO date string
 * @returns True if date is in the past
 */
export function isOverdue(dateString: string | null): boolean {
  if (!dateString) return false;
  
  try {
    return new Date(dateString) < new Date();
  } catch (error) {
    return false;
  }
}

/**
 * Get relative time string (e.g., "2 days ago")
 * @param dateString - ISO date string
 * @returns Relative time string
 */
export function getRelativeTime(dateString: string | null): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays > 1) return `${diffInDays} days ago`;
    if (diffInDays < 0) return `${Math.abs(diffInDays)} days from now`;
    
    return date.toLocaleDateString();
  } catch (error) {
    return '';
  }
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis
 */
export function truncateText(text: string | null, maxLength: number = 100): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Format file size in human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string (e.g., "2.4 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file type from filename extension
 * @param filename - File name with extension
 * @returns File type category
 */
export function getFileTypeFromName(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const typeMap: Record<string, string> = {
    // Design files
    'fig': 'design', 'sketch': 'design', 'xd': 'design', 'ai': 'design',
    // Documents
    'pdf': 'document', 'doc': 'document', 'docx': 'document', 'txt': 'document', 'rtf': 'document',
    // Images
    'jpg': 'image', 'jpeg': 'image', 'png': 'image', 'gif': 'image', 'bmp': 'image', 'svg': 'image', 'webp': 'image',
    // Code
    'js': 'code', 'ts': 'code', 'jsx': 'code', 'tsx': 'code', 'html': 'code', 'css': 'code', 'scss': 'code',
    'json': 'code', 'xml': 'code', 'py': 'code', 'java': 'code', 'cpp': 'code', 'c': 'code',
    // Archives
    'zip': 'archive', 'rar': 'archive', '7z': 'archive', 'tar': 'archive', 'gz': 'archive',
    // Videos
    'mp4': 'video', 'avi': 'video', 'mov': 'video', 'wmv': 'video', 'flv': 'video', 'webm': 'video',
    // Audio
    'mp3': 'audio', 'wav': 'audio', 'flac': 'audio', 'aac': 'audio', 'ogg': 'audio'
  };

  return typeMap[extension || ''] || 'other';
}

/**
 * Get color for file type badge
 * @param fileType - File type category
 * @returns Hex color code
 */
export function getFileTypeColor(fileType: string): string {
  switch (fileType) {
    case 'design':
      return '#3b82f6'; // Blue
    case 'document':
      return '#6b7280'; // Gray
    case 'image':
      return '#8b5cf6'; // Purple
    case 'code':
      return '#10b981'; // Green
    case 'archive':
      return '#f59e0b'; // Orange
    case 'video':
      return '#ef4444'; // Red
    case 'audio':
      return '#06b6d4'; // Cyan
    default:
      return '#6b7280'; // Default gray
  }
}

/**
 * Format upload date for display
 * @param dateString - ISO date string
 * @returns Formatted date string (M/D/YYYY format)
 */
export function formatUploadDate(dateString: string | null): string {
  if (!dateString) return 'No date';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    return 'Invalid date';
  }
}
