'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { User } from '@/types/user';
import { Search, RefreshCw } from 'lucide-react';
import styles from './users.module.css';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'An error occurred'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.id === userId) return;
    try {
      await adminService.updateUser(userId, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as User['role'] } : u));
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'An error occurred'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>User Management</h1>
          <p className={styles.subtitle}>{users.length} users · {adminCount} admins</p>
        </div>
        <div className={styles.actions}>
          <div className={styles.searchBox}>
            <Search size={14} color="#475569" />
            <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className={styles.refreshBtn} onClick={fetchUsers}><RefreshCw size={14} /></button>
        </div>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr><th>User</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div className={styles.userMeta}>
                    <div className={styles.avatar}>{u.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <div className={styles.userName}>{u.name}</div>
                      <div className={styles.userEmail}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`${styles.roleBadge} ${u.role === 'admin' ? styles.adminBadge : styles.userBadge}`}>
                    {u.role}
                  </span>
                </td>
                <td className={styles.mono}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={e => handleRoleChange(u.id, e.target.value)}
                    className={styles.roleSelect}
                    disabled={JSON.parse(localStorage.getItem('user') || '{}').id === u.id}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={4} className={styles.empty}>{loading ? 'Loading...' : 'No users found'}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
