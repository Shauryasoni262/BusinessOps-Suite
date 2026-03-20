'use client';

import { useState, useEffect } from 'react';
import { milestoneService, type Milestone } from '@/services/milestoneService';
import { MilestoneModal } from '@/components/modals/project';
import { 
  Flag, 
  Calendar, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus,
  MessageSquare,
  Video,
  FileText,
  Activity,
  History,
  Target
} from 'lucide-react';
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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getEventInfo = (eventType: string) => {
    switch (eventType) {
      case 'milestone': return { color: '#3b82f6', icon: <Target size={14} />, label: 'Milestone' };
      case 'update': return { color: '#10b981', icon: <Activity size={14} />, label: 'Update' };
      case 'meeting': return { color: '#f59e0b', icon: <Video size={14} />, label: 'Meeting' };
      case 'deadline': return { color: '#ef4444', icon: <Clock size={14} />, label: 'Deadline' };
      case 'review': return { color: '#8b5cf6', icon: <FileText size={14} />, label: 'Review' };
      default: return { color: '#6b7280', icon: <History size={14} />, label: 'Event' };
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p style={{ fontWeight: 600, color: '#64748b' }}>Refreshing timeline...</p>
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
          <p className={styles.subtitle}>Strategize and track key project beats</p>
        </div>
        <button onClick={handleAddEvent} className={styles.addButton}>
          <Plus size={18} />
          Add Event
        </button>
      </div>

      {milestones.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <History size={64} strokeWidth={1} color="#cbd5e1" />
          </div>
          <h3>Timeline is empty</h3>
          <p>Chart the course of your project by adding milestones, updates, or meeting notes.</p>
          <button onClick={handleAddEvent} className={styles.addFirstButton}>
            Add First Event
          </button>
        </div>
      ) : (
        <div className={styles.timeline}>
          {milestones.map((milestone) => (
            <div key={milestone.id} className={styles.timelineItem}>
              <div 
                className={styles.timelineDot} 
                style={{ color: getEventInfo(milestone.event_type || 'milestone').color }}
              >
                <div className={styles.timelineDotInner}></div>
              </div>
              
              <div className={styles.timelineContent}>
                <div className={styles.timelineHeader}>
                  <div className={styles.timelineDate}>
                    <Calendar size={12} />
                    {formatDate(milestone.deadline)}
                  </div>
                  <div className={styles.timelineActions}>
                    <button
                      onClick={() => handleEditEvent(milestone)}
                      className={styles.editButton}
                      title="Edit event"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(milestone.id)}
                      className={styles.deleteButton}
                      title="Delete event"
                    >
                      <Trash2 size={14} />
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
                      style={{ backgroundColor: getEventInfo(milestone.event_type || 'milestone').color }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {getEventInfo(milestone.event_type || 'milestone').icon}
                        {getEventInfo(milestone.event_type || 'milestone').label}
                      </div>
                    </span>
                    <span className={styles.statusBadge} data-status={milestone.status}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {milestone.status === 'completed' ? <CheckCircle2 size={12} /> : 
                         milestone.status === 'overdue' ? <AlertCircle size={12} /> : <Clock size={12} />}
                        {milestone.status === 'completed' ? 'Completed' : 
                         milestone.status === 'overdue' ? 'Overdue' : 'Pending'}
                      </div>
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