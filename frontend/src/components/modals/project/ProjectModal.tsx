'use client';

import { useState, useEffect } from 'react';
import { type Project } from '@/services/projectService';
import { useProjects } from '@/contexts/ProjectContext';
import { X, FolderPlus, Type, AlignLeft, Flag, Clock, Lightbulb, ClipboardList, Play, Pause, Eye, CheckCircle, XCircle } from 'lucide-react';
import styles from './ProjectModal.module.css';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSave: () => void;
}

export default function ProjectModal({ project, onClose, onSave }: ProjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    deadline: '',
    status: 'planning' as 'idea' | 'planning' | 'in_progress' | 'on_hold' | 'review' | 'completed' | 'cancelled'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { createProject, updateProject } = useProjects();

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || '',
        priority: project.priority,
        deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
        status: project.status as any
      });
    }
  }, [project]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const projectData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        deadline: formData.deadline || undefined
      };

      if (project) {
        await updateProject(project.id, projectData);
      } else {
        await createProject(projectData as any);
      }

      onSave();
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idea': return <Lightbulb size={14} className={styles.fieldIcon} />;
      case 'planning': return <ClipboardList size={14} className={styles.fieldIcon} />;
      case 'in_progress': return <Play size={14} className={styles.fieldIcon} />;
      case 'on_hold': return <Pause size={14} className={styles.fieldIcon} />;
      case 'review': return <Eye size={14} className={styles.fieldIcon} />;
      case 'completed': return <CheckCircle size={14} className={styles.fieldIcon} />;
      case 'cancelled': return <XCircle size={14} className={styles.fieldIcon} />;
      default: return <Flag size={14} className={styles.fieldIcon} />;
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerTitleContainer}>
            <div className={styles.headerIcon}>
              <FolderPlus size={18} />
            </div>
            <div>
              <h2 className={styles.titleText}>{project ? 'Edit Project' : 'New Project'}</h2>
              <p className={styles.subtitle}>Define your vision and goals</p>
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

          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              <Type size={14} className={styles.fieldIcon} />
              Project Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="e.g., Enterprise Branding"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              <AlignLeft size={14} className={styles.fieldIcon} />
              Key Details
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="What is this project about?"
              rows={2}
              disabled={loading}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="status" className={styles.label}>
                {getStatusIcon(formData.status)}
                Current Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={styles.select}
                disabled={loading}
              >
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
                <option value="idea">Idea</option>
                <option value="on_hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="priority" className={styles.label}>
                <Clock size={14} className={styles.fieldIcon} />
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className={styles.select}
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
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
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Clock className={styles.spinner} size={16} />
                  Saving...
                </>
              ) : (
                <>
                  <FolderPlus size={16} />
                  {project ? 'Update' : 'Create'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
