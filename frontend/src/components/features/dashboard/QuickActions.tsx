'use client';

import { useRouter } from 'next/navigation';
import styles from './QuickActions.module.css';

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className={styles.actionsGrid}>
      <div className={styles.actionCard}>
        <div className={styles.actionIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
        <h3 className={styles.actionTitle}>Start New Project</h3>
        <p className={styles.actionDescription}>Create and configure a new project</p>
        <button 
          className={styles.actionButton}
          onClick={() => router.push('/dashboard/projects')}
        >
          Get Started
        </button>
      </div>

      <div className={styles.actionCard}>
        <div className={styles.actionIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
            <line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
        </div>
        <h3 className={styles.actionTitle}>Invite Team Member</h3>
        <p className={styles.actionDescription}>Add someone to your workspace</p>
        <button className={styles.actionButton}>
          Send Invite
        </button>
      </div>

      <div className={styles.actionCard}>
        <div className={styles.actionIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <h3 className={styles.actionTitle}>Generate Report</h3>
        <p className={styles.actionDescription}>Create a performance report</p>
        <button className={styles.actionButton}>
          Create Report
        </button>
      </div>
    </div>
  );
}

