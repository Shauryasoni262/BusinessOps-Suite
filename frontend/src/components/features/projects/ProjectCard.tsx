'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { type Project } from '@/services/projectService';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // Generate random progress for demo (65%, 25%, 90% like in image)
  const getRandomProgress = (projectId: string) => {
    const hash = projectId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const progressValues = [65, 25, 90, 40, 75, 15, 85];
    return progressValues[hash % progressValues.length];
  };

  const progress = getRandomProgress(project.id);

  // Generate random member count for demo (5, 0, 0 like in image)
  const getRandomMemberCount = (projectId: string) => {
    const hash = projectId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const memberCounts = [5, 0, 0, 3, 8, 2, 1];
    return memberCounts[hash % memberCounts.length];
  };

  const memberCount = getRandomMemberCount(project.id);

  // Handle outside clicks to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return { bg: '#dbeafe', text: '#1e40af' }; // Light blue background, dark blue text
      case 'planning':
        return { bg: '#fef3c7', text: '#92400e' }; // Light yellow background, dark yellow text
      case 'review':
        return { bg: '#e9d5ff', text: '#6b21a8' }; // Light purple background, dark purple text
      case 'completed':
        return { bg: '#d1fae5', text: '#065f46' }; // Light green background, dark green text
      case 'on_hold':
        return { bg: '#fed7aa', text: '#c2410c' }; // Light orange background, dark orange text
      case 'cancelled':
        return { bg: '#fecaca', text: '#991b1b' }; // Light red background, dark red text
      case 'idea':
        return { bg: '#f3f4f6', text: '#374151' }; // Light gray background, dark gray text
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return { bg: '#fed7aa', text: '#c2410c' }; // Orange background, dark orange text
      case 'medium':
        return { bg: '#dbeafe', text: '#1e40af' }; // Light blue background, dark blue text
      case 'low':
        return { bg: '#d1fae5', text: '#065f46' }; // Light green background, dark green text
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      case 'on_hold':
        return 'On Hold';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getPriorityDisplayName = (priority: string) => {
    return `${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority`;
  };

  const handleCardClick = () => {
    router.push(`/dashboard/projects/${project.id}`);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(project);
    setShowMenu(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(project.id);
    setShowMenu(false);
  };

  const statusColors = getStatusColor(project.status);
  const priorityColors = getPriorityColor(project.priority);

  return (
    <div className={styles.card} onClick={handleCardClick}>
      {/* Header with status badge and menu */}
      <div className={styles.cardHeader}>
        <span 
          className={styles.statusBadge}
          style={{ 
            backgroundColor: statusColors.bg, 
            color: statusColors.text 
          }}
        >
          {getStatusDisplayName(project.status)}
        </span>
        <button 
          className={styles.menuButton}
          onClick={handleMenuToggle}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="19" cy="12" r="1"/>
            <circle cx="5" cy="12" r="1"/>
          </svg>
        </button>
      </div>

      {/* Project title */}
      <div className={styles.projectTitle}>
        <h3>{project.name}</h3>
      </div>

      {/* Project description */}
      <div className={styles.projectDescription}>
        <p>{project.description || 'No description provided'}</p>
      </div>

      {/* Progress bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Progress</span>
          <span className={styles.progressPercentage}>{progress}%</span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Members and deadline */}
      <div className={styles.cardFooter}>
        <div className={styles.members}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span>{memberCount} members</span>
        </div>
        
        <div className={styles.deadline}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>{formatDate(project.deadline)}</span>
        </div>
      </div>

      {/* Priority badge at bottom */}
      <div className={styles.prioritySection}>
        <span 
          className={styles.priorityBadge}
          style={{ 
            backgroundColor: priorityColors.bg, 
            color: priorityColors.text 
          }}
        >
          {getPriorityDisplayName(project.priority)}
        </span>
      </div>

      {showMenu && (
        <div ref={menuRef} className={styles.menu}>
          <button className={styles.menuItem} onClick={handleEdit}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </button>
          <button className={`${styles.menuItem} ${styles.deleteItem}`} onClick={handleDelete}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
