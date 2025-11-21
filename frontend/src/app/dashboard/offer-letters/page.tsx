'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, TopBar } from '@/components/layout';
import styles from './page.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function OfferLettersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
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
        <Sidebar />
        <div className={styles.mainContent}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <TopBar user={user} onLogout={handleLogout} />
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h1>Offer Letters</h1>
              <p>Manage and generate offer letters for candidates</p>
            </div>
            <button 
              className={styles.createButton}
              onClick={() => {
                // TODO: Implement create offer letter functionality
                console.log('Create offer letter');
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Offer Letter
            </button>
          </div>

          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h2 className={styles.placeholderTitle}>Offer Letters</h2>
            <p className={styles.placeholderText}>
              This feature is coming soon. You'll be able to create, manage, and send offer letters to candidates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

