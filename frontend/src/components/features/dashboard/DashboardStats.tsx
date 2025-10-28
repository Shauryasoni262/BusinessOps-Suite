'use client';

import styles from './DashboardStats.module.css';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <h3 className={styles.statTitle}>{title}</h3>
        <div className={styles.statIcon}>{icon}</div>
      </div>
      <div className={styles.statValue}>{value}</div>
      <div className={`${styles.statChange} ${styles[changeType]}`}>
        {changeType === 'positive' && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        )}
        {changeType === 'negative' && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 7L7 17M7 17H17M7 17V7"/>
          </svg>
        )}
        {change}
      </div>
    </div>
  );
}

interface DashboardStatsProps {
  stats: {
    revenue: number;
    revenueChange: string;
    projects: number;
    projectsChange: string;
    teamMembers: number;
    teamChange: string;
    tasksCompleted: number;
    tasksChange: string;
    tasksChangeType: 'positive' | 'negative';
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className={styles.statsGrid}>
      <StatCard
        title="Total Revenue"
        value={`$${stats.revenue.toLocaleString()}`}
        change={stats.revenueChange}
        changeType="positive"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        }
      />
      <StatCard
        title="Active Projects"
        value={stats.projects}
        change={stats.projectsChange}
        changeType="positive"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        }
      />
      <StatCard
        title="Team Members"
        value={stats.teamMembers}
        change={stats.teamChange}
        changeType="positive"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        }
      />
      <StatCard
        title="Tasks Completed"
        value={stats.tasksCompleted}
        change={stats.tasksChange}
        changeType={stats.tasksChangeType}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        }
      />
    </div>
  );
}

