'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { EnhancedStats, GrowthDataPoint, RevenueTrendPoint, ProjectDistribution } from '@/types/admin';
import {
  Users, FolderKanban, CheckCircle2, DollarSign,
  FileText, MessageSquare, Zap, ShieldCheck
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
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
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className={styles.loading}><div className={styles.spinner}></div><p>Loading analytics...</p></div>;
  }

  const kpiCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, sub: `+${stats?.newUsersThisMonth || 0} this month`, icon: Users, color: '#3b82f6' },
    { label: 'Active Projects', value: stats?.activeProjects || 0, sub: `${stats?.totalProjects || 0} total`, icon: FolderKanban, color: '#f59e0b' },
    { label: 'Tasks Done', value: stats?.completedTasks || 0, sub: `of ${stats?.totalTasks || 0} total`, icon: CheckCircle2, color: '#22c55e' },
    { label: 'Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, sub: `$${(stats?.pendingRevenue || 0).toLocaleString()} pending`, icon: DollarSign, color: '#10b981' },
    { label: 'Invoices', value: stats?.totalInvoices || 0, sub: 'Created', icon: FileText, color: '#8b5cf6' },
    { label: 'Messages', value: stats?.totalMessages || 0, sub: 'In chat', icon: MessageSquare, color: '#06b6d4' },
    { label: 'API 24h', value: stats?.apiRequests24h || 0, sub: 'Requests', icon: Zap, color: '#f97316' },
    { label: 'Admins', value: stats?.adminCount || 0, sub: 'Active', icon: ShieldCheck, color: '#ef4444' },
  ];

  const statusColors: Record<string, string> = {
    active: '#22c55e', completed: '#3b82f6', on_hold: '#f59e0b', cancelled: '#ef4444'
  };

  const PCOLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageSub}>Platform overview and analytics</p>
      </div>

      {/* KPI Grid */}
      <div className={styles.kpiGrid}>
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={styles.kpiCard}>
              <div className={styles.kpiTop}>
                <span className={styles.kpiLabel}>{card.label}</span>
                <div className={styles.kpiIcon} style={{ background: `${card.color}12`, color: card.color }}>
                  <Icon size={16} strokeWidth={2} />
                </div>
              </div>
              <div className={styles.kpiValue}>{typeof card.value === 'number' ? card.value.toLocaleString() : card.value}</div>
              <div className={styles.kpiSub}>{card.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className={styles.chartsRow}>
        {/* User Growth Area Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>User Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={growth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => v.split(' ')[0]} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} itemStyle={{ color: '#e2e8f0' }} labelStyle={{ color: '#94a3b8' }} />
              <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fill="url(#userGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Area Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenue} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} itemStyle={{ color: '#e2e8f0' }} labelStyle={{ color: '#94a3b8' }} />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
              <Area type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={1.5} fill="none" strokeDasharray="4 4" name="Pending" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Project Pie Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Project Status</h3>
          <div className={styles.pieWrap}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={projectDist.filter(p => p.count > 0)}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {projectDist.filter(p => p.count > 0).map((entry, i) => (
                    <Cell key={i} fill={statusColors[entry.status] || PCOLORS[i % PCOLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} itemStyle={{ color: '#e2e8f0' }} labelStyle={{ color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.pieLegend}>
              {projectDist.map((item, i) => (
                <div key={i} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: statusColors[item.status] || PCOLORS[i] }}></span>
                  <span className={styles.legendLabel}>{item.status.replace('_', ' ')}</span>
                  <span className={styles.legendVal}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
