'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { type Project } from '@/services/projectService';
import { useProjectSocket } from '@/contexts/ProjectSocketContext';
import { 
  ArrowLeft, 
  LayoutGrid, 
  CheckSquare, 
  Users, 
  Flag, 
  FileText, 
  Clock, 
  Calendar, 
  User as UserIcon, 
  Shield, 
  Activity,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  PlusCircle,
  TrendingUp,
  BarChart3,
  HardDrive
} from 'lucide-react';
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

    onProjectUpdate(() => onProjectUpdated());
    onTaskUpdate((action, task) => {
      if (task.project_id === project.id) onProjectUpdated();
    });
    onMilestoneUpdate((action, milestone) => {
      if (milestone.project_id === project.id) onProjectUpdated();
    });
    onMemberUpdate((action, member) => {
      if (member.project_id === project.id) onProjectUpdated();
    });
    onFileUpdate((action, file) => {
      if (file.project_id === project.id) onProjectUpdated();
    });
  }, [project?.id, onProjectUpdate, onTaskUpdate, onMilestoneUpdate, onMemberUpdate, onFileUpdate, onProjectUpdated]);

  if (!project) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={() => router.push('/dashboard/projects')}>
            <ArrowLeft size={18} />
            Back to Projects
          </button>
        </div>
        <div className={styles.content}>
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <Activity className={styles.spinner} size={40} color="#3b82f6" />
            <p style={{ marginTop: '1rem', color: '#64748b', fontWeight: 600 }}>Loading project details...</p>
          </div>
        </div>
      </div>
    );
  }

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'urgent': return { color: '#ef4444', bg: '#fef2f2', icon: <AlertCircle size={14} /> };
      case 'high': return { color: '#f97316', bg: '#fff7ed', icon: <TrendingUp size={14} /> };
      case 'medium': return { color: '#eab308', bg: '#fefce8', icon: <Activity size={14} /> };
      case 'low': return { color: '#22c55e', bg: '#f0fdf4', icon: <BarChart3 size={14} /> };
      default: return { color: '#64748b', bg: '#f8fafc', icon: <Activity size={14} /> };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
      case 'in_progress':
        return { color: '#3b82f6', bg: '#eff6ff', icon: <PlayCircle size={14} /> };
      case 'completed':
        return { color: '#22c55e', bg: '#f0fdf4', icon: <CheckCircle2 size={14} /> };
      case 'on_hold':
        return { color: '#f59e0b', bg: '#fffbeb', icon: <PauseCircle size={14} /> };
      case 'cancelled':
        return { color: '#ef4444', bg: '#fef2f2', icon: <AlertCircle size={14} /> };
      default:
        return { color: '#64748b', bg: '#f8fafc', icon: <PlusCircle size={14} /> };
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isOverdue = project.deadline && new Date(project.deadline) < new Date() && project.status === 'in_progress';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutGrid size={18} /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={18} /> },
    { id: 'members', label: 'Members', icon: <Users size={18} /> },
    { id: 'milestones', label: 'Milestones', icon: <Flag size={18} /> },
    { id: 'files', label: 'Files', icon: <FileText size={18} /> }
  ] as const;

  const renderOverview = () => (
    <div className={styles.overview}>
      <div className={styles.projectInfo}>
        <div className={styles.infoContent}>
          <div className={styles.mainInfo}>
            <div className={styles.infoHeader}>
              <h1 className={styles.projectName}>{project.name}</h1>
              <div className={styles.badges}>
                <span 
                  className={styles.priorityBadge}
                  style={{ color: getPriorityInfo(project.priority).color, backgroundColor: getPriorityInfo(project.priority).bg }}
                >
                  {getPriorityInfo(project.priority).icon}
                  {project.priority}
                </span>
                <span 
                  className={styles.statusBadge}
                  style={{ color: getStatusInfo(project.status).color, backgroundColor: getStatusInfo(project.status).bg }}
                >
                  {getStatusInfo(project.status).icon}
                  {project.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <div className={styles.description}>
              <h3>Description</h3>
              <p>{project.description || 'No description provided for this project.'}</p>
            </div>
          </div>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Owner</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserIcon size={14} color="#94a3b8" />
                <span className={styles.metaValue}>{project.owner?.name || 'Unknown'}</span>
              </div>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Created</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={14} color="#94a3b8" />
                <span className={styles.metaValue}>{formatDate(project.created_at)}</span>
              </div>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Deadline</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={14} color={isOverdue ? '#ef4444' : '#94a3b8'} />
                <span className={`${styles.metaValue} ${isOverdue ? styles.overdue : ''}`}>
                  {formatDate(project.deadline)}
                </span>
              </div>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Access Role</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={14} color="#94a3b8" />
                <span className={styles.metaValue}>Project Member</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <h3 className={styles.statsTitle}>Project Statistics</h3>
        <div className={styles.statsGrid}>
          {/* Tasks Stat Card */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>TASKS</span>
              <div className={styles.statIcon}><CheckSquare size={16} /></div>
            </div>
            <div className={styles.statBody}>
              <span className={styles.statValue}>{project.stats?.tasks?.total || 0}</span>
              <span className={styles.statUnit}>Total</span>
            </div>
            <div className={styles.progressBarContainer}>
              <div 
                className={styles.progressBar} 
                style={{ 
                  width: `${(project.stats?.tasks?.completed / Math.max(project.stats?.tasks?.total, 1)) * 100}%`,
                  backgroundColor: '#3b82f6'
                }}
              ></div>
            </div>
            <div className={styles.statBreakdown}>
              <div className={styles.breakdownItem}>
                <div className={styles.dot} style={{ background: '#f59e0b' }}></div>
                {project.stats?.tasks?.pending || 0} Pending
              </div>
              <div className={styles.breakdownItem}>
                <div className={styles.dot} style={{ background: '#22c55e' }}></div>
                {project.stats?.tasks?.completed || 0} Done
              </div>
            </div>
          </div>

          {/* Milestones Stat Card */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>MILESTONES</span>
              <div className={styles.statIcon} style={{ background: '#fefce8', color: '#eab308' }}><Flag size={16} /></div>
            </div>
            <div className={styles.statBody}>
              <span className={styles.statValue}>{project.stats?.milestones?.total || 0}</span>
              <span className={styles.statUnit}>Major</span>
            </div>
            <div className={styles.progressBarContainer} style={{ background: '#fefce8' }}>
              <div 
                className={styles.progressBar} 
                style={{ 
                  width: `${(project.stats?.milestones?.completed / Math.max(project.stats?.milestones?.total, 1)) * 100}%`,
                  backgroundColor: '#eab308'
                }}
              ></div>
            </div>
            <div className={styles.statBreakdown}>
              <div className={styles.breakdownItem}>
                <div className={styles.dot} style={{ background: '#94a3b8' }}></div>
                {project.stats?.milestones?.pending || 0} Remaining
              </div>
              <div className={styles.breakdownItem}>
                <div className={styles.dot} style={{ background: '#ef4444' }}></div>
                {project.stats?.milestones?.overdue || 0} Overdue
              </div>
            </div>
          </div>

          {/* Files Stat Card */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>FILES</span>
              <div className={styles.statIcon} style={{ background: '#fdf2f8', color: '#db2777' }}><HardDrive size={16} /></div>
            </div>
            <div className={styles.statBody}>
              <span className={styles.statValue}>{project.stats?.files || 0}</span>
              <span className={styles.statUnit}>Updates</span>
            </div>
            <div className={styles.progressBarContainer} style={{ background: '#fdf2f8' }}>
              <div className={styles.progressBar} style={{ width: '100%', backgroundColor: '#db2777' }}></div>
            </div>
            <div className={styles.statBreakdown}>
              <div className={styles.breakdownItem}>
                <FileText size={12} color="#94a3b8" />
                Shared assets
              </div>
              <div className={styles.breakdownItem}>
                <Activity size={12} color="#94a3b8" />
                Latest revision
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push('/dashboard/projects')}>
          <ArrowLeft size={18} />
          Back to Projects
        </button>
        
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
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {activeTab === 'overview' ? renderOverview() : (
          <>
            {activeTab === 'tasks' && <TaskList projectId={project.id} />}
            {activeTab === 'members' && <MemberList projectId={project.id} project={project} onProjectUpdated={onProjectUpdated} />}
            {activeTab === 'milestones' && <MilestoneTimeline projectId={project.id} />}
            {activeTab === 'files' && <FileList projectId={project.id} />}
          </>
        )}
      </div>
    </div>
  );
}
