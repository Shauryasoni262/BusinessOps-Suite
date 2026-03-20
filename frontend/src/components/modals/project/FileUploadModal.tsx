'use client';

import { useState, useRef, useCallback } from 'react';
import { fileService, type ProjectFile } from '@/services/fileService';
import { X, CloudUpload, File as FileIcon, Trash2, Type, HardDrive, Layout, CheckCircle2, User, Clock, Loader2 } from 'lucide-react';
import styles from './FileUploadModal.module.css';

interface FileUploadModalProps {
  projectId: string;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export default function FileUploadModal({ projectId, onClose, onUploadSuccess }: FileUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    fileName: '',
    category: 'other' as 'document' | 'design' | 'contract' | 'other',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    setFormData(prev => ({
      ...prev,
      fileName: file.name
    }));
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const fileToUpload = formData.fileName !== selectedFile.name 
        ? new File([selectedFile], formData.fileName, { type: selectedFile.type })
        : selectedFile;

      // Fix: fileService.uploadFile only takes two arguments
      await fileService.uploadFile(projectId, fileToUpload);

      onUploadSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFormData(prev => ({ ...prev, fileName: '' }));
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerTitleContainer}>
            <div className={styles.headerIcon}>
              <CloudUpload size={18} />
            </div>
            <div>
              <h2 className={styles.titleText}>Upload File</h2>
              <p className={styles.subtitle}>Add documents or assets</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {!selectedFile ? (
            <div 
              className={`${styles.dropzone} ${dragActive ? styles.dragActive : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className={styles.hiddenInput}
                onChange={(e) => e.target.files && handleFileSelection(e.target.files[0])}
              />
              <div className={styles.dropzoneContent}>
                <div className={styles.uploadIconWrapper}>
                  <CloudUpload size={32} />
                </div>
                <h3>Click or drag file here</h3>
                <p>Support for any document, image, or design asset</p>
              </div>
            </div>
          ) : (
            <div className={styles.fileSelected}>
              <div className={styles.fileIconWrapper}>
                <FileIcon size={22} />
              </div>
              <div className={styles.fileInfo}>
                <span className={styles.fileNameLarge}>{selectedFile.name}</span>
                <span className={styles.fileSize}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <button type="button" className={styles.removeButton} onClick={removeFile}>
                <Trash2 size={16} />
              </button>
            </div>
          )}

          <div className={styles.formContent}>
            <div className={styles.field}>
              <label htmlFor="fileName" className={styles.label}>
                <Type size={14} className={styles.fieldIcon} />
                Display Name
              </label>
              <input
                type="text"
                id="fileName"
                name="fileName"
                value={formData.fileName}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="e.g., Q1 Brand Guidelines"
                disabled={loading || !selectedFile}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="category" className={styles.label}>
                  <HardDrive size={14} className={styles.fieldIcon} />
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={styles.select}
                  disabled={loading || !selectedFile}
                >
                  <option value="document">Document</option>
                  <option value="design">Design</option>
                  <option value="contract">Contract</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="description" className={styles.label}>
                  <Layout size={14} className={styles.fieldIcon} />
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="What is this file for?"
                  disabled={loading || !selectedFile}
                />
              </div>
            </div>
          </div>

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
              className={styles.uploadButton}
              disabled={loading || !selectedFile}
            >
              {loading ? (
                <>
                  <Loader2 className={styles.spinner} size={16} />
                  Uploading...
                </>
              ) : (
                <>
                  <CloudUpload size={16} />
                  Upload
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
