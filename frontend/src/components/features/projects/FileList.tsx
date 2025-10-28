'use client';

import { useState, useEffect } from 'react';
import { fileService, type ProjectFile } from '@/services/fileService';
import { FileUploadModal } from '@/components/modals/project';
import { getInitials, formatDate, formatFileSize, getFileTypeColor, formatUploadDate } from '@/utils/helpers';
import styles from './FileList.module.css';

interface FileListProps {
  projectId: string;
}

export default function FileList({ projectId }: FileListProps) {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadFiles();
  }, [projectId]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fileService.getProjectFiles(projectId);
      setFiles(data);
    } catch (error) {
      console.error('Error loading files:', error);
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFile = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSave = () => {
    setShowModal(false);
    loadFiles();
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      await fileService.deleteFile(projectId, fileId);
      await loadFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      setError('Failed to delete file');
    }
  };

  const handleDownloadFile = (file: ProjectFile) => {
    fileService.downloadFile(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeColor = (fileType: string): string => {
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
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
        );
      case 'code':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16,18 22,12 16,6"/>
            <polyline points="8,6 2,12 8,18"/>
          </svg>
        );
      case 'archive':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="4" rx="2"/>
            <path d="M7 3v4"/>
            <path d="M17 3v4"/>
            <path d="M7 7h10"/>
            <path d="M7 7l-1 12h12l-1-12"/>
          </svg>
        );
      case 'video':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
        );
      case 'audio':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={loadFiles} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Project Files</h2>
          <p className={styles.subtitle}>Documents and resources</p>
        </div>
        <button onClick={handleAddFile} className={styles.addButton}>
          + Add File
        </button>
      </div>

      {files.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </div>
          <h3>No files yet</h3>
          <p>Upload your first document or resource to get started.</p>
          <button onClick={handleAddFile} className={styles.addFirstButton}>
            Add First File
          </button>
        </div>
      ) : (
        <div className={styles.fileList}>
          {files.map((file) => (
            <div key={file.id} className={styles.fileItem}>
              <div className={styles.fileIcon}>
                {getFileIcon(file.file_type || 'document')}
              </div>
              
              <div className={styles.fileInfo}>
                <button 
                  onClick={() => handleDownloadFile(file)}
                  className={styles.fileName}
                >
                  {file.file_name}
                </button>
                <div className={styles.fileMeta}>
                  {formatFileSize(file.file_size)} • Uploaded by {getInitials(file.uploader?.name || 'Unknown')} on {formatUploadDate(file.uploaded_at)}
                </div>
              </div>

              <div className={styles.fileActions}>
                <span 
                  className={styles.typeBadge}
                  style={{ backgroundColor: getFileTypeColor(file.file_type || 'document') }}
                >
                  {file.file_type || 'document'}
                </span>
                <button
                  onClick={() => handleDeleteFile(file.id)}
                  className={styles.deleteButton}
                  title="Delete file"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <FileUploadModal
          projectId={projectId}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}