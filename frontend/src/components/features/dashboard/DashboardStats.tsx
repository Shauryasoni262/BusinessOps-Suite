'use client';

import styles from './DashboardStats.module.css';

import { 
  DollarSign, 
  FolderKanban, 
  Users, 
  CheckCircle2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

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
        {changeType === 'positive' && <TrendingUp size={12} style={{ marginRight: '4px' }} />}
        {changeType === 'negative' && <TrendingDown size={12} style={{ marginRight: '4px' }} />}
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
        icon={<DollarSign size={20} />}
      />
      <StatCard
        title="Active Projects"
        value={stats.projects}
        change={stats.projectsChange}
        changeType="positive"
        icon={<FolderKanban size={20} />}
      />
      <StatCard
        title="Team Members"
        value={stats.teamMembers}
        change={stats.teamChange}
        changeType="positive"
        icon={<Users size={20} />}
      />
      <StatCard
        title="Tasks Completed"
        value={stats.tasksCompleted}
        change={stats.tasksChange}
        changeType={stats.tasksChangeType}
        icon={<CheckCircle2 size={20} />}
      />
    </div>
  );
}

