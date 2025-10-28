'use client';

import { useState, useRef, useCallback } from 'react';
import { fileService, type ProjectFile } from '@/services/fileService';
import { getInitials } from '@/utils/helpers';
import styles from './FileUploadModal.module.css';

interface FileUploadModalProps {
  projectId: string;
  onClose: () => void;
  onSave: () => void;
}

export default function FileUploadModal({ projectId, onClose, onSave }: FileUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    fileName: '',
    fileType: '',
    uploadedBy: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current user initials (you might want to get this from context/auth)
  const currentUserInitials = getInitials('Current User'); // This should come from auth context

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeFromName = (filename: string): string => {
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
  };

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setFormData({
      fileName: file.name,
      fileType: getFileTypeFromName(file.name),
      uploadedBy: currentUserInitials
    });
    setError(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    if (!formData.fileName.trim()) {
      setError('File name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create a new File object with the custom name if it was changed
      const fileToUpload = formData.fileName !== selectedFile.name 
        ? new File([selectedFile], formData.fileName, { type: selectedFile.type })
        : selectedFile;

      await fileService.uploadFile(projectId, fileToUpload);
      onSave();
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2>Add File</h2>
            <p className={styles.subtitle}>Add a document or resource to this project</p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {/* File Dropzone */}
          <div className={styles.field}>
            <label className={styles.label}>Select File</label>
            <div 
              className={`${styles.dropzone} ${dragActive ? styles.dragActive : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                className={styles.fileInput}
                accept="*/*"
              />
              {selectedFile ? (
                <div className={styles.fileSelected}>
                  <div className={styles.fileIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                  </div>
                  <div className={styles.fileInfo}>
                    <div className={styles.fileName}>{selectedFile.name}</div>
                    <div className={styles.fileSize}>{formatFileSize(selectedFile.size)}</div>
                  </div>
                  <button type="button" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setFormData({ fileName: '', fileType: '', uploadedBy: currentUserInitials });
                  }} className={styles.removeFile}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <div className={styles.dropzoneContent}>
                  <div className={styles.dropzoneIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </div>
                  <p className={styles.dropzoneText}>Click to select a file or drag and drop</p>
                  <p className={styles.dropzoneSubtext}>Maximum file size: 10MB</p>
                </div>
              )}
            </div>
          </div>

          {/* File Details */}
          {selectedFile && (
            <>
              <div className={styles.field}>
                <label htmlFor="fileName" className={styles.label}>
                  File Name
                </label>
                <input
                  type="text"
                  id="fileName"
                  name="fileName"
                  value={formData.fileName}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="e.g., design-mockups.fig"
                  required
                  disabled={loading}
                />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="fileSize" className={styles.label}>
                    File Size
                  </label>
                  <input
                    type="text"
                    id="fileSize"
                    value={formatFileSize(selectedFile.size)}
                    className={styles.input}
                    readOnly
                    disabled
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="fileType" className={styles.label}>
                    Type
                  </label>
                  <input
                    type="text"
                    id="fileType"
                    name="fileType"
                    value={formData.fileType}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="e.g., design"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="uploadedBy" className={styles.label}>
                  Uploaded By (Initials)
                </label>
                <input
                  type="text"
                  id="uploadedBy"
                  name="uploadedBy"
                  value={formData.uploadedBy}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="e.g., JD"
                  disabled={loading}
                />
              </div>
            </>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={loading || !selectedFile}
            >
              {loading ? (
                <>
                  <svg className={styles.spinner} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Uploading...
                </>
              ) : (
                'Add File'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
