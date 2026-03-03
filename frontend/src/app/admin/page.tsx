'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { EnhancedStats, GrowthDataPoint, RevenueTrendPoint, ProjectDistribution } from '@/types/admin';
import styles from './page.module.css';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<EnhancedStats | null>(null);
  const [growth, setGrowth] = useState<GrowthDataPoint[]>([]);
  const [revenue, setRevenue] = useState<RevenueTrendPoint[]>([]);
  const [projectDist, setProjectDist] = useState<ProjectDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, g, r, p] = await Promise.all([
          adminService.getEnhancedStats(),
          adminService.getUserGrowth(),
          adminService.getRevenueTrend(),
          adminService.getProjectDistribution()
        ]);
        setStats(s);
        setGrowth(g);
        setRevenue(r);
        setProjectDist(p);
      } catch (err) {
        console.error('Dashboard data fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className={styles.loading}><div className={styles.spinner}></div><p>Loading dashboard...</p></div>;
  }

  const maxGrowth = Math.max(...growth.map(g => g.count), 1);
  const maxRevenue = Math.max(...revenue.map(r => Math.max(r.revenue, r.pending)), 1);
  const totalProjectCount = projectDist.reduce((s, p) => s + p.count, 0) || 1;

  const kpiCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, sub: `${stats?.newUsersThisMonth || 0} new this month`, color: '#3b82f6', icon: '👥' },
    { label: 'Active Projects', value: stats?.activeProjects || 0, sub: `${stats?.totalProjects || 0} total`, color: '#f59e0b', icon: '📁' },
    { label: 'Tasks', value: stats?.completedTasks || 0, sub: `of ${stats?.totalTasks || 0} completed`, color: '#22c55e', icon: '✅' },
    { label: 'Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, sub: `$${(stats?.pendingRevenue || 0).toLocaleString()} pending`, color: '#10b981', icon: '💰' },
    { label: 'Invoices', value: stats?.totalInvoices || 0, sub: 'Total created', color: '#8b5cf6', icon: '📄' },
    { label: 'Messages', value: stats?.totalMessages || 0, sub: 'Chat messages', color: '#06b6d4', icon: '💬' },
    { label: 'API Traffic (24h)', value: stats?.apiRequests24h || 0, sub: 'Requests served', color: '#f97316', icon: '📡' },
    { label: 'Admins', value: stats?.adminCount || 0, sub: 'With admin access', color: '#ef4444', icon: '🛡️' },
  ];

  const statusColors: Record<string, string> = {
    active: '#22c55e', completed: '#3b82f6', on_hold: '#f59e0b', cancelled: '#ef4444'
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Command Center</h1>
        <p className={styles.pageSubtitle}>Real-time platform intelligence</p>
      </div>

      {/* KPI Grid */}
      <div className={styles.kpiGrid}>
        {kpiCards.map((card, i) => (
          <div key={i} className={styles.kpiCard}>
            <div className={styles.kpiTop}>
              <span className={styles.kpiLabel}>{card.label}</span>
              <span className={styles.kpiIcon} style={{ background: `${card.color}15`, color: card.color }}>{card.icon}</span>
            </div>
            <div className={styles.kpiValue}>{typeof card.value === 'number' ? card.value.toLocaleString() : card.value}</div>
            <div className={styles.kpiSub}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className={styles.chartsRow}>
        {/* User Growth */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>User Growth</h3>
          <div className={styles.barChart}>
            {growth.map((point, i) => (
              <div key={i} className={styles.barGroup}>
                <div className={styles.barTrack}>
                  <div className={styles.bar} style={{ height: `${(point.count / maxGrowth) * 100}%`, background: '#3b82f6' }}>
                    {point.count > 0 && <span className={styles.barLabel}>{point.count}</span>}
                  </div>
                </div>
                <span className={styles.barMonth}>{point.month.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Trend */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Revenue Trend</h3>
          <div className={styles.barChart}>
            {revenue.map((point, i) => (
              <div key={i} className={styles.barGroup}>
                <div className={styles.barTrack}>
                  <div className={styles.bar} style={{ height: `${(point.revenue / maxRevenue) * 100}%`, background: '#22c55e' }}>
                    {point.revenue > 0 && <span className={styles.barLabel}>${point.revenue}</span>}
                  </div>
                </div>
                <span className={styles.barMonth}>{point.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Distribution */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Project Status</h3>
          <div className={styles.distList}>
            {projectDist.map((item, i) => (
              <div key={i} className={styles.distItem}>
                <div className={styles.distHeader}>
                  <span className={styles.distDot} style={{ background: statusColors[item.status] || '#94a3b8' }}></span>
                  <span className={styles.distName}>{item.status.replace('_', ' ')}</span>
                  <span className={styles.distCount}>{item.count}</span>
                </div>
                <div className={styles.distBarTrack}>
                  <div className={styles.distBar} style={{ width: `${(item.count / totalProjectCount) * 100}%`, background: statusColors[item.status] || '#94a3b8' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
