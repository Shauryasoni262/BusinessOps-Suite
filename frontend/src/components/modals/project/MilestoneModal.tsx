'use client';

import { useState, useEffect } from 'react';
import { type Milestone } from '@/services/milestoneService';
import { X, Trophy, Type, AlignLeft, Layout, Calendar, Clock, Loader2, Flag, MessageSquare, Users, Timer, Eye } from 'lucide-react';
import styles from './MilestoneModal.module.css';

interface MilestoneModalProps {
  milestone: Milestone | null;
  projectId: string;
  onClose: () => void;
  onSave: (milestoneData: any) => Promise<void>;
}

export default function MilestoneModal({ milestone, projectId, onClose, onSave }: MilestoneModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'milestone' as 'milestone' | 'update' | 'meeting' | 'deadline' | 'review',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (milestone) {
      setFormData({
        title: milestone.title,
        description: milestone.description || '',
        event_type: milestone.event_type as any || 'milestone',
        deadline: milestone.deadline ? new Date(milestone.deadline).toISOString().split('T')[0] : ''
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
      setError('Title is required');
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
      console.error('Error saving milestone:', error);
      setError('Failed to save milestone');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <Trophy size={14} className={styles.fieldIcon} />;
      case 'update': return <Flag size={14} className={styles.fieldIcon} />;
      case 'meeting': return <Users size={14} className={styles.fieldIcon} />;
      case 'deadline': return <Timer size={14} className={styles.fieldIcon} />;
      case 'review': return <Eye size={14} className={styles.fieldIcon} />;
      default: return <Layout size={14} className={styles.fieldIcon} />;
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerTitleContainer}>
            <div className={styles.headerIcon}>
              <Trophy size={18} />
            </div>
            <div>
              <h2 className={styles.titleText}>{milestone ? 'Edit Event' : 'New Event'}</h2>
              <p className={styles.subtitle}>Key timeline milestone</p>
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
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="e.g., Major Release"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              <AlignLeft size={14} className={styles.fieldIcon} />
              Details
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Add some context..."
              rows={2}
              disabled={loading}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="event_type" className={styles.label}>
                {getEventTypeIcon(formData.event_type)}
                Type
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
                <Calendar size={14} className={styles.fieldIcon} />
                Date
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
                  <Loader2 className={styles.spinner} size={16} />
                  Saving...
                </>
              ) : (
                <>
                  <Clock size={16} />
                  {milestone ? 'Update' : 'Add'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
