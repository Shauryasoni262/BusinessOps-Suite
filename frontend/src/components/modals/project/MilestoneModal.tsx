'use client';

import { useState, useEffect } from 'react';
import { milestoneService, type Milestone, type CreateMilestoneData, type UpdateMilestoneData } from '@/services/milestoneService';
import styles from './MilestoneModal.module.css';

interface MilestoneModalProps {
  projectId: string;
  milestone: Milestone | null;
  onClose: () => void;
  onSave: () => void;
}

export default function MilestoneModal({ projectId, milestone, onClose, onSave }: MilestoneModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    event_type: 'milestone' as 'milestone' | 'update' | 'meeting' | 'deadline' | 'review'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (milestone) {
      setFormData({
        title: milestone.title,
        description: milestone.description || '',
        deadline: milestone.deadline ? new Date(milestone.deadline).toISOString().split('T')[0] : '',
        event_type: milestone.event_type || 'milestone'
      });
    }
  }, [milestone]);

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
      setError('Milestone title is required');
      return;
    }

    if (!formData.deadline) {
      setError('Milestone deadline is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const milestoneData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        deadline: formData.deadline
      };

      if (milestone) {
        // Update existing milestone
        await milestoneService.updateMilestone(projectId, milestone.id, milestoneData);
      } else {
        // Create new milestone
        await milestoneService.createMilestone(projectId, milestoneData);
      }

      onSave();
    } catch (error) {
      console.error('Error saving milestone:', error);
      setError('Failed to save milestone');
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
          <div className={styles.headerContent}>
            <h2>{milestone ? 'Edit Timeline Event' : 'Add Timeline Event'}</h2>
            <p className={styles.subtitle}>Record a milestone or event</p>
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
              Milestone Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter milestone title"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Enter milestone description"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="event_type" className={styles.label}>
                Event Type
              </label>
              <select
                id="event_type"
                name="event_type"
                value={formData.event_type}
                onChange={handleInputChange}
                className={styles.select}
                disabled={loading}
              >
                <option value="milestone">Milestone</option>
                <option value="update">Update</option>
                <option value="meeting">Meeting</option>
                <option value="deadline">Deadline</option>
                <option value="review">Review</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="deadline" className={styles.label}>
                Date *
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className={styles.input}
                required
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
                  <svg className={styles.spinner} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  {milestone ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                milestone ? 'Update Event' : 'Add Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
