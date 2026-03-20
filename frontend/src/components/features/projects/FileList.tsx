'use client';

import { useState, useEffect } from 'react';
import { fileService, type ProjectFile } from '@/services/fileService';
import { FileUploadModal } from '@/components/modals/project';
import { getInitials, formatUploadDate } from '@/utils/helpers';
import { 
  FileText, 
  Image as ImageIcon, 
  Code, 
  Archive, 
  Video, 
  Music, 
  File, 
  Download, 
  Trash2, 
  Plus, 
  AlertCircle,
  Clock,
  User as UserIcon,
  HardDrive,
  Loader2,
  XCircle
} from 'lucide-react';
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
      setError('Failed to load project files');
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

  const getFileTypeInfo = (fileType: string) => {
    switch (fileType) {
      case 'design': return { color: '#3b82f6', icon: <ImageIcon size={20} /> };
      case 'document': return { color: '#64748b', icon: <FileText size={20} /> };
      case 'image': return { color: '#8b5cf6', icon: <ImageIcon size={20} /> };
      case 'code': return { color: '#10b981', icon: <Code size={20} /> };
      case 'archive': return { color: '#f59e0b', icon: <Archive size={20} /> };
      case 'video': return { color: '#ef4444', icon: <Video size={20} /> };
      case 'audio': return { color: '#06b6d4', icon: <Music size={20} /> };
      default: return { color: '#94a3b8', icon: <File size={20} /> };
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Loader2 className={styles.spinner} size={32} />
          <p style={{ fontWeight: 600, color: '#64748b' }}>Accessing file vault...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <AlertCircle size={40} />
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
          <h2 className={styles.title}>Project Assets</h2>
          <p className={styles.subtitle}>Manage your project resources and documentation</p>
        </div>
        <button onClick={handleAddFile} className={styles.addButton}>
          <Plus size={18} />
          Upload File
        </button>
      </div>

      {files.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <HardDrive size={64} strokeWidth={1} color="#cbd5e1" />
          </div>
          <h3>Vault is empty</h3>
          <p>Centralize your project resources. Upload documentation, designs, or code snippets.</p>
          <button onClick={handleAddFile} className={styles.addFirstButton}>
            Upload First File
          </button>
        </div>
      ) : (
        <div className={styles.fileList}>
          {files.map((file) => (
            <div key={file.id} className={styles.fileItem}>
              <div 
                className={styles.fileIcon} 
                style={{ color: getFileTypeInfo(file.file_type || 'document').color }}
              >
                {getFileTypeInfo(file.file_type || 'document').icon}
              </div>
              
              <div className={styles.fileInfo}>
                <button 
                  onClick={() => handleDownloadFile(file)}
                  className={styles.fileName}
                >
                  {file.file_name}
                </button>
                <div className={styles.fileMeta}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <HardDrive size={10} />
                    {formatFileSize(file.file_size)}
                  </div>
                  <span>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <UserIcon size={10} />
                    {file.uploader?.name || 'Unknown'}
                  </div>
                  <span>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={10} />
                    {formatUploadDate(file.uploaded_at)}
                  </div>
                </div>
              </div>

              <div className={styles.fileActions}>
                <span 
                  className={styles.typeBadge}
                  style={{ backgroundColor: getFileTypeInfo(file.file_type || 'document').color }}
                >
                  {file.file_type || 'document'}
                </span>
                <button
                  onClick={() => handleDeleteFile(file.id)}
                  className={styles.deleteButton}
                  title="Delete file"
                >
                  <Trash2 size={16} />
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