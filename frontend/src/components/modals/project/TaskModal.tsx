'use client';

import { useState, useEffect } from 'react';
import { type Task } from '@/services/taskService';
import { 
  X, 
  CheckCircle2, 
  Type, 
  AlignLeft, 
  Layout, 
  User, 
  Calendar, 
  Flag,
  Loader2, 
  ListTodo, 
  Play, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import styles from './TaskModal.module.css';

interface TaskModalProps {
  task: Task | null;
  projectId: string;
  projectMembers: any[];
  onClose: () => void;
  onSave: (taskData: any) => Promise<void>;
}

export default function TaskModal({ task, projectId, projectMembers, onClose, onSave }: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'cancelled',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    assigned_to: '',
    due_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: (task.status as any) || 'pending',
        priority: (task.priority as any) || 'medium',
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
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        assigned_to: formData.assigned_to || null,
        due_date: formData.due_date || null,
        projectId
      });
    } catch (error: any) {
      console.error('Error saving task:', error);
      setError(error.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ListTodo size={14} className={styles.fieldIcon} />;
      case 'in_progress': return <Play size={14} className={styles.fieldIcon} />;
      case 'completed': return <CheckCircle size={14} className={styles.fieldIcon} />;
      case 'cancelled': return <XCircle size={14} className={styles.fieldIcon} />;
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
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="priority" className={styles.label}>
                <Flag size={14} className={styles.fieldIcon} />
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

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="assigned_to" className={styles.label}>
                <User size={14} className={styles.fieldIcon} />
                Assignee
              </label>
              <select
                id="assigned_to"
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleInputChange}
                className={styles.select}
                disabled={loading}
              >
                <option value="">Unassigned</option>
                {projectMembers.map((member) => (
                  <option key={member.user?.id || member.user_id} value={member.user?.id || member.user_id}>
                    {member.user?.name || member.name || 'Member'} ({member.role || 'Member'})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="due_date" className={styles.label}>
                <Calendar size={14} className={styles.fieldIcon} />
                Due Date
              </label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
                className={styles.input}
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
