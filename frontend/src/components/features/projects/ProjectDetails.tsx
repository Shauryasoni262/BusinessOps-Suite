'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { type Project } from '@/services/projectService';
import { useProjectSocket } from '@/contexts/ProjectSocketContext';
import TaskList from './TaskList';
import MemberList from './MemberList';
import MilestoneTimeline from './MilestoneTimeline';
import FileList from './FileList';
import styles from './ProjectDetails.module.css';

interface ProjectDetailsProps {
  project: Project | null;
  onProjectUpdated: () => void;
}

type TabType = 'overview' | 'tasks' | 'members' | 'milestones' | 'files';

export default function ProjectDetails({ project, onProjectUpdated }: ProjectDetailsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const router = useRouter();
  const { joinProject, leaveProject, onProjectUpdate, onTaskUpdate, onMilestoneUpdate, onMemberUpdate, onFileUpdate, isConnected } = useProjectSocket();

  // Join project room when component mounts
  useEffect(() => {
    if (project?.id && isConnected) {
      joinProject(project.id);
    }

    return () => {
      if (project?.id) {
        leaveProject(project.id);
      }
    };
  }, [project?.id, isConnected, joinProject, leaveProject]);

  // Set up real-time event listeners
  useEffect(() => {
    if (!project?.id) return;

    // Listen for project updates
    onProjectUpdate((data) => {
      console.log('📡 Real-time project update received:', data);
      onProjectUpdated();
    });

    // Listen for task updates
    onTaskUpdate((action, task) => {
      console.log(`📡 Real-time task ${action}:`, task);
      if (task.project_id === project.id) {
        onProjectUpdated();
      }
    });

    // Listen for milestone updates
    onMilestoneUpdate((action, milestone) => {
      console.log(`📡 Real-time milestone ${action}:`, milestone);
      if (milestone.project_id === project.id) {
        onProjectUpdated();
      }
    });

    // Listen for member updates
    onMemberUpdate((action, member) => {
      console.log(`📡 Real-time member ${action}:`, member);
      if (member.project_id === project.id) {
        onProjectUpdated();
      }
    });

    // Listen for file updates
    onFileUpdate((action, file) => {
      console.log(`📡 Real-time file ${action}:`, file);
      if (file.project_id === project.id) {
        onProjectUpdated();
      }
    });
  }, [project?.id, onProjectUpdate, onTaskUpdate, onMilestoneUpdate, onMemberUpdate, onFileUpdate, onProjectUpdated]);

  if (!project) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button 
            className={styles.backButton}
            onClick={() => router.push('/dashboard/projects')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"/>
              <path d="M12 19l-7-7 7-7"/>
            </svg>
            Back to Projects
          </button>
        </div>
        <div className={styles.content}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading project details...</p>
          </div>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#ef4444';
      case 'high':
        return '#f97316';
      case 'medium':
        return '#eab308';
      case 'low':
        return '#22c55e';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#22c55e';
      case 'completed':
        return '#3b82f6';
      case 'on_hold':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = project?.deadline && new Date(project.deadline) < new Date() && project?.status === 'in_progress';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'grid' },
    { id: 'tasks', label: 'Tasks', icon: 'checklist' },
    { id: 'members', label: 'Members', icon: 'users' },
    { id: 'milestones', label: 'Milestones', icon: 'flag' },
    { id: 'files', label: 'Files', icon: 'folder' }
  ] as const;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'grid':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
        );
      case 'checklist':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12l2 2 4-4"/>
            <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"/>
            <path d="M3 12h18v6c0 .552-.448 1-1 1H4c-.552 0-1-.448-1-1v-6z"/>
          </svg>
        );
      case 'users':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        );
      case 'flag':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
            <line x1="4" y1="22" x2="4" y2="15"/>
          </svg>
        );
      case 'folder':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className={styles.overview}>
            <div className={styles.projectInfo}>
              <div className={styles.header}>
                <h1 className={styles.projectName}>{project.name}</h1>
                <div className={styles.badges}>
                  <span 
                    className={styles.priorityBadge}
                    style={{ backgroundColor: getPriorityColor(project.priority) }}
                  >
                    {project.priority}
                  </span>
                  <span 
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(project.status) }}
                  >
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div className={styles.description}>
                <h3>Description</h3>
                <p>{project.description || 'No description provided'}</p>
              </div>

              <div className={styles.details}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Owner:</span>
                  <span className={styles.detailValue}>{project.owner?.name || 'Unknown'}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Created:</span>
                  <span className={styles.detailValue}>
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Deadline:</span>
                  <span className={`${styles.detailValue} ${isOverdue ? styles.overdue : ''}`}>
                    {formatDate(project.deadline)}
                  </span>
                </div>
              </div>
            </div>

            {project.stats && (
              <div className={styles.stats}>
                <h3>Project Statistics</h3>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <h4>Tasks</h4>
                    <div className={styles.statNumbers}>
                      <span className={styles.statTotal}>{project.stats.tasks?.total || 0}</span>
                      <div className={styles.statBreakdown}>
                        <span className={styles.statPending}>{project.stats.tasks?.pending || 0} pending</span>
                        <span className={styles.statInProgress}>{project.stats.tasks?.in_progress || 0} in progress</span>
                        <span className={styles.statCompleted}>{project.stats.tasks?.completed || 0} completed</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.statCard}>
                    <h4>Milestones</h4>
                    <div className={styles.statNumbers}>
                      <span className={styles.statTotal}>{project.stats.milestones?.total || 0}</span>
                      <div className={styles.statBreakdown}>
                        <span className={styles.statPending}>{project.stats.milestones?.pending || 0} pending</span>
                        <span className={styles.statCompleted}>{project.stats.milestones?.completed || 0} completed</span>
                        <span className={styles.statOverdue}>{project.stats.milestones?.overdue || 0} overdue</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.statCard}>
                    <h4>Files</h4>
                    <div className={styles.statNumbers}>
                      <span className={styles.statTotal}>{project.stats.files || 0}</span>
                      <div className={styles.statBreakdown}>
                        <span>files uploaded</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'tasks':
        return <TaskList projectId={project.id} />;
      case 'members':
        return <MemberList projectId={project.id} project={project} onProjectUpdated={onProjectUpdated} />;
      case 'milestones':
        return <MilestoneTimeline projectId={project.id} />;
      case 'files':
        return <FileList projectId={project.id} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => router.push('/dashboard/projects')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5"/>
            <path d="M12 19l-7-7 7-7"/>
          </svg>
          Back to Projects
        </button>
        
        {/* Real-time connection status */}
        <div className={styles.connectionStatus}>
          <div className={`${styles.statusDot} ${isConnected ? styles.connected : styles.disconnected}`}></div>
          <span className={styles.statusText}>
            {isConnected ? 'Real-time updates active' : 'Connecting...'}
          </span>
        </div>
      </div>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.tabIcon}>{renderIcon(tab.icon)}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {renderTabContent()}
      </div>
    </div>
  );
}
