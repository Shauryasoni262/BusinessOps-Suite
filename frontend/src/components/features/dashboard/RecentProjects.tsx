'use client';

import styles from './RecentProjects.module.css';
import { FolderPlus, Plus } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  status: string;
  teamMembers: number;
  progress: number;
}

interface RecentProjectsProps {
  projects: Project[];
}

export default function RecentProjects({ projects }: RecentProjectsProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress':
      case 'in_progress':
        return '#3b82f6';
      case 'planning':
        return '#8b5cf6';
      case 'review':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Recent Projects</h2>
          <p className={styles.subtitle}>Your most recent project activity</p>
        </div>
        {projects.length > 0 && (
          <Link href="/dashboard/projects" className={styles.viewAll}>
            View All
          </Link>
        )}
      </div>

      <div className={styles.projectsList}>
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectInfo}>
                <h3 className={styles.projectName}>{project.name}</h3>
                <div className={styles.projectMeta}>
                  <span className={styles.projectStatus} style={{ color: getStatusColor(project.status) }}>
                    {project.status}
                  </span>
                  <span className={styles.projectMembers}>
                    • {project.teamMembers} team member{project.teamMembers !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className={styles.projectProgress}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ 
                      width: `${project.progress}%`,
                      backgroundColor: getStatusColor(project.status)
                    }}
                  />
                </div>
                <span className={styles.progressText}>{project.progress}%</span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconContainer}>
              <FolderPlus size={40} strokeWidth={1.5} />
            </div>
            <h3 className={styles.emptyTitle}>Ready to start something new?</h3>
            <p className={styles.emptySubtitle}>
              Create your first project to track progress, collaborate with your team, and hit your goals.
            </p>
            <Link href="/dashboard/projects" className={styles.addButton}>
              <Plus size={18} />
              <span>Create Project</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

