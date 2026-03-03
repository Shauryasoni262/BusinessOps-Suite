'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminService } from '@/services/adminService';
import { ApiLog, ApiLogStats } from '@/types/admin';
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
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(page); }, [page, fetchData]);

  const getStatusColor = (code: number) => {
    if (code >= 200 && code < 300) return '#22c55e';
    if (code >= 400 && code < 500) return '#f97316';
    if (code >= 500) return '#ef4444';
    return '#94a3b8';
  };

  const methodColors: Record<string, string> = {
    GET: '#3b82f6', POST: '#22c55e', PATCH: '#a855f7', PUT: '#f59e0b', DELETE: '#ef4444'
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>API Observability</h1>
          <p className={styles.subtitle}>Traffic analysis and performance monitoring</p>
        </div>
        <button className={styles.refreshBtn} onClick={() => fetchData(page)}>Refresh</button>
      </div>

      {/* Analytics Cards */}
      <div className={styles.analyticsRow}>
        <div className={styles.aCard}>
          <div className={styles.aLabel}>Requests (24h)</div>
          <div className={styles.aVal}>{stats?.totalRequests.toLocaleString() || 0}</div>
        </div>
        <div className={styles.aCard}>
          <div className={styles.aLabel}>Avg Response</div>
          <div className={styles.aVal}>{stats?.avgResponseTime || 0}<span className={styles.aUnit}>ms</span></div>
        </div>
        <div className={styles.aCard}>
          <div className={styles.aLabel}>Error Rate</div>
          <div className={styles.aVal} style={{ color: (stats?.errorRate || 0) > 5 ? '#ef4444' : '#22c55e' }}>{stats?.errorRate || 0}<span className={styles.aUnit}>%</span></div>
        </div>
        <div className={styles.aCard}>
          <div className={styles.aLabel}>Errors (24h)</div>
          <div className={styles.aVal} style={{ color: '#ef4444' }}>{stats?.errorCount || 0}</div>
        </div>
      </div>

      {/* Method & Status Distribution */}
      <div className={styles.distRow}>
        <div className={styles.distCard}>
          <h4 className={styles.distTitle}>Method Breakdown</h4>
          <div className={styles.distItems}>
            {stats?.methodDistribution.map((m, i) => (
              <div key={i} className={styles.distItem}>
                <span className={styles.distBadge} style={{ background: `${methodColors[m.method] || '#94a3b8'}20`, color: methodColors[m.method] || '#94a3b8' }}>{m.method}</span>
                <span className={styles.distCount}>{m.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.distCard}>
          <h4 className={styles.distTitle}>Top Endpoints</h4>
          <div className={styles.endpointList}>
            {stats?.topEndpoints.slice(0, 5).map((e, i) => (
              <div key={i} className={styles.endpointItem}>
                <span className={styles.endpointPath}>{e.path}</span>
                <span className={styles.endpointCount}>{e.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.logTable}>
          <thead>
            <tr><th>Time</th><th>Endpoint</th><th>Status</th><th>User</th><th>Latency</th></tr>
          </thead>
          <tbody>
            {logs.length > 0 ? logs.map(log => (
              <tr key={log.id}>
                <td className={styles.mono}>{new Date(log.created_at).toLocaleTimeString([], { hour12: false })}</td>
                <td>
                  <div className={styles.endpoint}>
                    <span className={styles.method} style={{ background: `${methodColors[log.method] || '#94a3b8'}15`, color: methodColors[log.method] || '#94a3b8' }}>{log.method}</span>
                    <span className={styles.path}>{log.path}</span>
                  </div>
                </td>
                <td><span className={styles.status} style={{ color: getStatusColor(log.status_code), background: `${getStatusColor(log.status_code)}10` }}>{log.status_code}</span></td>
                <td>{log.users ? <><div className={styles.bold}>{log.users.name}</div><div className={styles.sub}>{log.users.email}</div></> : <span className={styles.anon}>Anonymous</span>}</td>
                <td className={styles.mono}><span className={log.response_time > 500 ? styles.slow : styles.fast}>{log.response_time}ms</span></td>
              </tr>
            )) : <tr><td colSpan={5} className={styles.empty}>{loading ? 'Loading...' : 'No logs'}</td></tr>}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className={styles.pageBtn}>Previous</button>
        <span className={styles.pageInfo}>Page {page + 1} / {Math.max(1, Math.ceil(total / limit))}</span>
        <button disabled={(page + 1) * limit >= total} onClick={() => setPage(p => p + 1)} className={styles.pageBtn}>Next</button>
      </div>
    </div>
  );
}
