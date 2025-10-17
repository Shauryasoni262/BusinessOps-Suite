'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import styles from './page.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log('🔍 Dashboard - Checking authentication...');
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    console.log('🔍 Token exists:', token ? 'Yes' : 'No');
    console.log('🔍 User data exists:', userData ? 'Yes' : 'No');

    if (!token || !userData) {
      console.log('❌ Missing token or user data, redirecting to login');
      router.push('/auth/login');
      return;
    }

    try {
      if (userData === 'undefined' || userData === null || userData === '') {
        console.log('❌ User data is undefined/null/empty, redirecting to login');
        router.push('/auth/login');
        return;
      }
      
      const parsedUser = JSON.parse(userData);
      console.log('✅ User data parsed successfully:', parsedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error('❌ Error parsing user data:', error);
      console.error('❌ Raw userData:', userData);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <TopBar user={user} onLogout={handleLogout} />
        <div className={styles.content}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Projects</h3>
            <p className={styles.statNumber}>12</p>
            <p className={styles.statLabel}>Active Projects</p>
          </div>
          
          <div className={styles.statCard}>
            <h3>Tasks</h3>
            <p className={styles.statNumber}>47</p>
            <p className={styles.statLabel}>Completed This Week</p>
          </div>
          
          <div className={styles.statCard}>
            <h3>Team</h3>
            <p className={styles.statNumber}>8</p>
            <p className={styles.statLabel}>Team Members</p>
          </div>
          
          <div className={styles.statCard}>
            <h3>Revenue</h3>
            <p className={styles.statNumber}>$24,500</p>
            <p className={styles.statLabel}>This Month</p>
          </div>
        </div>

        <div className={styles.userDetails}>
          <h2>User Information</h2>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <strong>Name:</strong> {user.name}
            </div>
            <div className={styles.detailItem}>
              <strong>Email:</strong> {user.email}
            </div>
            <div className={styles.detailItem}>
              <strong>Role:</strong> {user.role}
            </div>
            <div className={styles.detailItem}>
              <strong>User ID:</strong> {user.id}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <h2>Quick Actions</h2>
          <div className={styles.actionButtons}>
            <button className={styles.actionButton}>
              Create Project
            </button>
            <button className={styles.actionButton}>
              View Analytics
            </button>
            <button className={styles.actionButton}>
              Manage Team
            </button>
            <button className={styles.actionButton}>
              Settings
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
