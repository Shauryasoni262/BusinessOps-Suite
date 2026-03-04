'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminService } from '@/services/adminService';
import { ApiLog, ApiLogStats } from '@/types/admin';
import { RefreshCw, Zap, Clock, AlertCircle, XCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import styles from './logs.module.css';

export default function LogsPage() {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<ApiLogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 50;

  const fetchData = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const [logData, statsData] = await Promise.all([
        adminService.getApiLogs(limit, pageNum * limit),
        adminService.getApiLogStats()
      ]);
      setLogs(logData.logs);
      setTotal(logData.total);
      setStats(statsData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(page); }, [page, fetchData]);

  const getStatusColor = (code: number) => {
    if (code >= 200 && code < 300) return '#22c55e';
    if (code >= 400 && code < 500) return '#f97316';
    if (code >= 500) return '#ef4444';
    return '#94a3b8';
  };

  const methodColors: Record<string, string> = { GET: '#3b82f6', POST: '#22c55e', PATCH: '#a855f7', PUT: '#f59e0b', DELETE: '#ef4444' };

  const kpis = [
    { label: 'Requests 24h', value: stats?.totalRequests || 0, icon: Zap, color: '#3b82f6' },
    { label: 'Avg Response', value: `${stats?.avgResponseTime || 0}ms`, icon: Clock, color: '#22c55e' },
    { label: 'Error Rate', value: `${stats?.errorRate || 0}%`, icon: AlertCircle, color: (stats?.errorRate || 0) > 5 ? '#ef4444' : '#22c55e' },
    { label: 'Errors', value: stats?.errorCount || 0, icon: XCircle, color: '#ef4444' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>System Logs</h1>
          <p className={styles.subtitle}>API traffic and performance</p>
        </div>
        <button className={styles.refreshBtn} onClick={() => fetchData(page)}><RefreshCw size={14} /></button>
      </div>

      <div className={styles.kpiRow}>
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className={styles.kpi}>
              <div className={styles.kpiTop}><span className={styles.kpiLabel}>{k.label}</span><div className={styles.kpiIcon} style={{ color: k.color }}><Icon size={14} /></div></div>
              <div className={styles.kpiVal}>{k.value}</div>
            </div>
          );
        })}
      </div>

      {/* Method Distribution Chart */}
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Method Distribution</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={stats?.methodDistribution || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="method" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12, color: '#e2e8f0' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#3b82f6">
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Top Endpoints</h3>
          <div className={styles.endpointList}>
            {stats?.topEndpoints.slice(0, 6).map((e, i) => (
              <div key={i} className={styles.endpointItem}>
                <span className={styles.endpointPath}>{e.path}</span>
                <span className={styles.endpointCount}>{e.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Table */}
      <div className={styles.tableWrap}>
        <table className={styles.logTable}>
          <thead><tr><th>Time</th><th>Endpoint</th><th>Status</th><th>User</th><th>Latency</th></tr></thead>
          <tbody>
            {logs.length > 0 ? logs.map(log => (
              <tr key={log.id}>
                <td className={styles.mono}>{new Date(log.created_at).toLocaleTimeString([], { hour12: false })}</td>
                <td>
                  <div className={styles.endpoint}>
                    <span className={styles.method} style={{ background: `${methodColors[log.method] || '#94a3b8'}12`, color: methodColors[log.method] || '#94a3b8' }}>{log.method}</span>
                    <span className={styles.path}>{log.path}</span>
                  </div>
                </td>
                <td><span className={styles.status} style={{ color: getStatusColor(log.status_code) }}>{log.status_code}</span></td>
                <td>{log.users ? <><span className={styles.bold}>{log.users.name}</span></> : <span className={styles.anon}>—</span>}</td>
                <td className={styles.mono}><span style={{ color: log.response_time > 500 ? '#ef4444' : '#22c55e' }}>{log.response_time}ms</span></td>
              </tr>
            )) : <tr><td colSpan={5} className={styles.empty}>{loading ? 'Loading...' : 'No logs'}</td></tr>}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className={styles.pageBtn}>Previous</button>
        <span className={styles.pageInfo}>Page {page + 1} of {Math.max(1, Math.ceil(total / limit))}</span>
        <button disabled={(page + 1) * limit >= total} onClick={() => setPage(p => p + 1)} className={styles.pageBtn}>Next</button>
      </div>
    </div>
  );
}
