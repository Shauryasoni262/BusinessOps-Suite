'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { AdminProject, ProjectDistribution } from '@/types/admin';
import styles from './projects.module.css';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminService.getAllProjects();
        setProjects(data.projects);
        setTotal(data.total);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);

  const statusColors: Record<string, string> = {
    active: '#22c55e', completed: '#3b82f6', on_hold: '#f59e0b', cancelled: '#ef4444'
  };

  const priorityColors: Record<string, string> = {
    low: '#94a3b8', medium: '#f59e0b', high: '#f97316', urgent: '#ef4444'
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Projects Overview</h1>
          <p className={styles.subtitle}>{total} projects across all users</p>
        </div>
        <div className={styles.filters}>
          {['all', 'active', 'completed', 'on_hold', 'cancelled'].map(f => (
            <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ''}`} onClick={() => setFilter(f)}>
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Project</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Deadline</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <div className={styles.projectName}>{p.name}</div>
                  <div className={styles.projectDesc}>{p.description?.slice(0, 60)}{(p.description?.length || 0) > 60 ? '...' : ''}</div>
                </td>
                <td>
                  <div className={styles.ownerName}>{p.users?.name || 'Unknown'}</div>
                  <div className={styles.ownerEmail}>{p.users?.email || ''}</div>
                </td>
                <td>
                  <span className={styles.badge} style={{ background: `${statusColors[p.status]}15`, color: statusColors[p.status] }}>
                    {p.status.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <span className={styles.badge} style={{ background: `${priorityColors[p.priority]}15`, color: priorityColors[p.priority] }}>
                    {p.priority}
                  </span>
                </td>
                <td className={styles.mono}>{p.deadline ? new Date(p.deadline).toLocaleDateString() : '—'}</td>
                <td className={styles.mono}>{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            )) : (
              <tr><td colSpan={6} className={styles.empty}>{loading ? 'Loading projects...' : 'No projects found'}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
