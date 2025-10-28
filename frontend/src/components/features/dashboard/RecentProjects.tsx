'use client';

import styles from './RecentProjects.module.css';

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
      </div>

      <div className={styles.projectsList}>
        {projects.map((project) => (
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
        ))}

        {projects.length === 0 && (
          <div className={styles.emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <p>No recent projects</p>
          </div>
        )}
      </div>
    </div>
  );
}

