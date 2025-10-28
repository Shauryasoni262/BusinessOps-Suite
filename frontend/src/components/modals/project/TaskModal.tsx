'use client';

import { useState, useEffect } from 'react';
import { taskService, type Task, type CreateTaskData, type UpdateTaskData } from '@/services/taskService';
import { projectService } from '@/services/projectService';
import { getInitials } from '@/utils/helpers';
import styles from './TaskModal.module.css';

interface TaskModalProps {
  projectId: string;
  task: Task | null;
  onClose: () => void;
  onSave: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function TaskModal({ projectId, task, onClose, onSave }: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    status: 'pending' as 'pending' | 'in_progress' | 'completed'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectMembers, setProjectMembers] = useState<User[]>([]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        assigned_to: task.assigned_to || '',
        status: task.status as 'pending' | 'in_progress' | 'completed'
      });
    }
    loadProjectMembers();
  }, [task, projectId]);

  const loadProjectMembers = async () => {
    try {
      const members = await projectService.getMembers(projectId);
      setProjectMembers(members.map(member => member.user).filter(Boolean));
    } catch (error) {
      console.error('Error loading project members:', error);
    }
  };

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

      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        assigned_to: formData.assigned_to || undefined,
        status: formData.status,
        priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent' // Default priority
      };

      if (task) {
        // Update existing task
        await taskService.updateTask(projectId, task.id, taskData);
      } else {
        // Create new task
        await taskService.createTask(projectId, taskData);
      }

      onSave();
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <h2>{task ? 'Edit Task' : 'Add New Task'}</h2>
            <p className={styles.subtitle}>Create a new task for this project</p>
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

          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>
              Task Name
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="e.g., Design wireframes"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Brief description"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="status" className={styles.label}>
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
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="assigned_to" className={styles.label}>
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
                <option key={member.id} value={member.id}>
                  {member.name} ({getInitials(member.name)})
                </option>
              ))}
            </select>
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
                  <svg className={styles.spinner} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  {task ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                task ? 'Update Task' : 'Add Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
