'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { AdminActivityLog } from '@/types/admin';
import styles from './activity.module.css';

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<AdminActivityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 50;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await adminService.getAdminActivity(limit, page * limit);
        setActivities(data.activities);
        setTotal(data.total);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [page]);

  const actionLabels: Record<string, { label: string; color: string }> = {
    'UPDATE_USER': { label: 'User Updated', color: '#f59e0b' },
    'DELETE_USER': { label: 'User Deleted', color: '#ef4444' },
    'CREATE_PROJECT': { label: 'Project Created', color: '#22c55e' },
    'UPDATE_PROJECT': { label: 'Project Updated', color: '#3b82f6' },
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Activity Audit</h1>
        <p className={styles.subtitle}>{total} administrative actions recorded</p>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Administrator</th>
              <th>Action</th>
              <th>Target</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? activities.map(act => {
              const info = actionLabels[act.action] || { label: act.action, color: '#94a3b8' };
              return (
                <tr key={act.id}>
                  <td className={styles.mono}>{new Date(act.created_at).toLocaleString()}</td>
                  <td>
                    <div className={styles.bold}>{act.users?.name || 'System'}</div>
                    <div className={styles.sub}>{act.users?.email || ''}</div>
                  </td>
                  <td><span className={styles.badge} style={{ background: `${info.color}15`, color: info.color }}>{info.label}</span></td>
                  <td className={styles.mono}>{act.target_type}: {act.target_id?.slice(0, 8)}...</td>
                  <td className={styles.details}>{act.details ? JSON.stringify(act.details) : '—'}</td>
                </tr>
              );
            }) : (
              <tr><td colSpan={5} className={styles.empty}>{loading ? 'Loading audit trail...' : 'No admin activity recorded yet'}</td></tr>
            )}
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
