'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { AdminActivityLog } from '@/types/admin';
import { ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const actionStyles: Record<string, { label: string; color: string }> = {
    'UPDATE_USER': { label: 'User Updated', color: '#f59e0b' },
    'DELETE_USER': { label: 'User Deleted', color: '#ef4444' },
    'CREATE_PROJECT': { label: 'Project Created', color: '#22c55e' },
    'UPDATE_PROJECT': { label: 'Project Updated', color: '#3b82f6' },
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerIcon}><ShieldCheck size={18} color="#6366f1" /></div>
        <div>
          <h1 className={styles.title}>Audit Trail</h1>
          <p className={styles.subtitle}>{total} admin actions recorded</p>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr><th>Timestamp</th><th>Admin</th><th>Action</th><th>Target</th><th>Details</th></tr></thead>
          <tbody>
            {activities.length > 0 ? activities.map(act => {
              const info = actionStyles[act.action] || { label: act.action, color: '#64748b' };
              return (
                <tr key={act.id}>
                  <td className={styles.mono}>{new Date(act.created_at).toLocaleString()}</td>
                  <td><div className={styles.bold}>{act.users?.name || 'System'}</div><div className={styles.sub}>{act.users?.email || ''}</div></td>
                  <td><span className={styles.badge} style={{ background: `${info.color}10`, color: info.color }}>{info.label}</span></td>
                  <td className={styles.mono}>{act.target_type}{act.target_id ? `: ${act.target_id.slice(0, 8)}…` : ''}</td>
                  <td className={styles.details}>{act.details ? JSON.stringify(act.details) : '—'}</td>
                </tr>
              );
            }) : <tr><td colSpan={5} className={styles.empty}>{loading ? 'Loading...' : 'No activity yet'}</td></tr>}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className={styles.pageBtn}><ChevronLeft size={14} /> Prev</button>
        <span className={styles.pageInfo}>Page {page + 1} of {Math.max(1, Math.ceil(total / limit))}</span>
        <button disabled={(page + 1) * limit >= total} onClick={() => setPage(p => p + 1)} className={styles.pageBtn}>Next <ChevronRight size={14} /></button>
      </div>
    </div>
  );
}
