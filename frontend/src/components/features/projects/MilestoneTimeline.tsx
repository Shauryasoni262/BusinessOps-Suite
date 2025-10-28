'use client';

import { useState, useEffect } from 'react';
import { milestoneService, type Milestone } from '@/services/milestoneService';
import { MilestoneModal } from '@/components/modals/project';
import styles from './MilestoneTimeline.module.css';

interface MilestoneTimelineProps {
  projectId: string;
}

export default function MilestoneTimeline({ projectId }: MilestoneTimelineProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    loadMilestones();
  }, [projectId]);

  const loadMilestones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await milestoneService.getProjectMilestones(projectId);
      setMilestones(data);
    } catch (error) {
      console.error('Error loading milestones:', error);
      setError('Failed to load timeline events');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = () => {
    setEditingMilestone(null);
    setShowModal(true);
  };

  const handleEditEvent = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setShowModal(true);
  };

  const handleDeleteEvent = async (milestoneId: string) => {
    if (!confirm('Are you sure you want to delete this timeline event?')) {
      return;
    }

    try {
      await milestoneService.deleteMilestone(projectId, milestoneId);
      await loadMilestones();
    } catch (error) {
      console.error('Error deleting milestone:', error);
      setError('Failed to delete timeline event');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingMilestone(null);
  };

  const handleModalSave = () => {
    setShowModal(false);
    setEditingMilestone(null);
    loadMilestones();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'milestone':
        return '#3b82f6'; // Blue
      case 'update':
        return '#10b981'; // Green
      case 'meeting':
        return '#f59e0b'; // Orange
      case 'deadline':
        return '#ef4444'; // Red
      case 'review':
        return '#8b5cf6'; // Purple
      default:
        return '#6b7280'; // Gray
    }
  };

  const getEventTypeLabel = (eventType: string) => {
    switch (eventType) {
      case 'milestone':
        return 'Milestone';
      case 'update':
        return 'Update';
      case 'meeting':
        return 'Meeting';
      case 'deadline':
        return 'Deadline';
      case 'review':
        return 'Review';
      default:
        return 'Event';
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading timeline events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={loadMilestones} className={styles.retryButton}>
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
          <h2 className={styles.title}>Project Timeline</h2>
          <p className={styles.subtitle}>Key milestones and events</p>
        </div>
        <button onClick={handleAddEvent} className={styles.addButton}>
          Add Event
        </button>
      </div>

      {milestones.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          </div>
          <h3>No timeline events yet</h3>
          <p>Add your first milestone, update, or meeting to get started.</p>
          <button onClick={handleAddEvent} className={styles.addFirstButton}>
            Add First Event
          </button>
        </div>
      ) : (
        <div className={styles.timeline}>
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className={styles.timelineItem}>
              <div className={styles.timelineDot} style={{ backgroundColor: getEventTypeColor(milestone.event_type || 'milestone') }}>
                <div className={styles.timelineDotInner}></div>
              </div>
              
              <div className={styles.timelineContent}>
                <div className={styles.timelineHeader}>
                  <div className={styles.timelineDate}>
                    {formatDate(milestone.deadline)}
                  </div>
                  <div className={styles.timelineActions}>
                    <button
                      onClick={() => handleEditEvent(milestone)}
                      className={styles.editButton}
                      title="Edit event"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(milestone.id)}
                      className={styles.deleteButton}
                      title="Delete event"
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
                
                <div className={styles.timelineBody}>
                  <h3 className={styles.timelineTitle}>{milestone.title}</h3>
                  {milestone.description && (
                    <p className={styles.timelineDescription}>{milestone.description}</p>
                  )}
                  <div className={styles.timelineMeta}>
                    <span 
                      className={styles.eventTypeBadge}
                      style={{ backgroundColor: getEventTypeColor(milestone.event_type || 'milestone') }}
                    >
                      {getEventTypeLabel(milestone.event_type || 'milestone')}
                    </span>
                    <span className={styles.statusBadge} data-status={milestone.status}>
                      {milestone.status === 'completed' ? 'Completed' : 
                       milestone.status === 'overdue' ? 'Overdue' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <MilestoneModal
          projectId={projectId}
          milestone={editingMilestone}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}