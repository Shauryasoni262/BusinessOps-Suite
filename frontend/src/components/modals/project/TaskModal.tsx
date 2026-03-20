'use client';

import { useState, useEffect } from 'react';
import { type ProjectTask } from '@/services/taskService';
import { X, CheckCircle2, Type, AlignLeft, Layout, User, Clock, Loader2, ListTodo, Play, Eye, CheckCircle } from 'lucide-react';
import styles from './TaskModal.module.css';

interface TaskModalProps {
  task: ProjectTask | null;
  projectId: string;
  projectMembers: any[];
  onClose: () => void;
  onSave: (taskData: any) => Promise<void>;
}

export default function TaskModal({ task, projectId, projectMembers, onClose, onSave }: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as 'todo' | 'in_progress' | 'in_review' | 'completed',
    assigned_to: '',
    due_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status as any,
        assigned_to: task.assigned_to || '',
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''
      });
    }
  }, [task]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSave({
        ...formData,
        projectId
      });
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return <ListTodo size={14} className={styles.fieldIcon} />;
      case 'in_progress': return <Play size={14} className={styles.fieldIcon} />;
      case 'in_review': return <Eye size={14} className={styles.fieldIcon} />;
      case 'completed': return <CheckCircle size={14} className={styles.fieldIcon} />;
      default: return <Layout size={14} className={styles.fieldIcon} />;
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerTitleContainer}>
            <div className={styles.headerIcon}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h2 className={styles.titleText}>{task ? 'Edit Task' : 'New Task'}</h2>
              <p className={styles.subtitle}>Specify the task requirements</p>
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
            <label htmlFor="title" className={styles.label}>
              <Type size={14} className={styles.fieldIcon} />
              Task Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="e.g., Design System Update"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              <AlignLeft size={14} className={styles.fieldIcon} />
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Provide more context..."
              rows={2}
              disabled={loading}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="status" className={styles.label}>
                {getStatusIcon(formData.status)}
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={styles.select}
                disabled={loading}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="assigned_to" className={styles.label}>
                <User size={14} className={styles.fieldIcon} />
                Assignee
              </label>
              <input
                type="text"
                id="assigned_to"
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Name or Initials"
                disabled={loading}
              />
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
                  <Loader2 className={styles.spinner} size={16} />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  {task ? 'Update' : 'Create'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
