'use client';

import { useRouter } from 'next/navigation';
import { 
  FolderPlus, 
  UserPlus, 
  FileCheck2,
  ChevronRight
} from 'lucide-react';
import styles from './QuickActions.module.css';

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className={styles.actionsGrid}>
      <div className={styles.actionCard}>
        <div className={styles.actionHeader}>
          <div className={styles.actionIcon}>
            <FolderPlus size={24} />
          </div>
          <div className={styles.actionBadge}>New</div>
        </div>
        <h3 className={styles.actionTitle}>Start New Project</h3>
        <p className={styles.actionDescription}>Create and configure a new project</p>
        <button 
          className={styles.actionButton}
          onClick={() => router.push('/dashboard/projects')}
        >
          <span>Get Started</span>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className={styles.actionCard}>
        <div className={styles.actionHeader}>
          <div className={styles.actionIcon} style={{ background: '#f0f9ff', color: '#0ea5e9' }}>
            <UserPlus size={24} />
          </div>
        </div>
        <h3 className={styles.actionTitle}>Invite Team Member</h3>
        <p className={styles.actionDescription}>Add someone to your workspace</p>
        <button className={styles.actionButton}>
          <span>Send Invite</span>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className={styles.actionCard}>
        <div className={styles.actionHeader}>
          <div className={styles.actionIcon} style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
            <FileCheck2 size={24} />
          </div>
        </div>
        <h3 className={styles.actionTitle}>Generate Report</h3>
        <p className={styles.actionDescription}>Create a performance report</p>
        <button className={styles.actionButton}>
          <span>Create Report</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
