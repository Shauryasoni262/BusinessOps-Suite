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

interface OfferLetter {
  id: string;
  candidate_name: string;
  candidate_email: string;
  job_title: string;
  status: string;
  created_at: string;
  offer_data: { offerTitle: string };
}

export default function OfferLettersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [offerLetters, setOfferLetters] = useState<OfferLetter[]>([]);
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

  useEffect(() => {
    if (user) {
      fetchOfferLetters();
    }
  }, [user]);

  const fetchOfferLetters = async () => {
    try {
      setLoadingData(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/offer-letters`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOfferLetters(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching offer letters:', error);
    } finally {
      setLoadingData(false);
    }
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
            <div className={styles.headerActions}>
              <button 
                className={styles.settingsButton}
                onClick={() => {
                  router.push('/dashboard/offer-letters/settings');
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18"></path>
                  <path d="M9 8h1"></path>
                  <path d="M9 12h1"></path>
                  <path d="M9 16h1"></path>
                  <path d="M14 8h1"></path>
                  <path d="M14 12h1"></path>
                  <path d="M14 16h1"></path>
                  <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
                </svg>
                Company Settings
              </button>
              <button 
                className={styles.createButton}
                onClick={() => {
                  router.push('/dashboard/offer-letters/create');
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Create Offer Letter
              </button>
            </div>
          </div>

          {loadingData ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading offer letters...</p>
            </div>
          ) : offerLetters.length > 0 ? (
            <div className={styles.grid}>
              {offerLetters.map((letter) => (
                <div key={letter.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.cardTitle} title={letter.offer_data.offerTitle}>
                        {letter.offer_data.offerTitle || 'Offer Letter'}
                      </h3>
                      <p className={styles.cardSubtitle}>{letter.candidate_name}</p>
                    </div>
                    <span className={`${styles.statusBadge} ${
                      letter.status === 'draft' ? styles.statusDraft : 
                      letter.status === 'sent' ? styles.statusSent : styles.statusSigned
                    }`}>
                      {letter.status}
                    </span>
                  </div>
                  
                  <div className={styles.cardBody}>
                    <div className={styles.infoRow}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                      <span>{letter.job_title}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <span>{letter.candidate_email}</span>
                    </div>
                  </div>
                  
                  <div className={styles.cardFooter}>
                    <span className={styles.date}>
                      {new Date(letter.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                    <button className={styles.actionButton}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.placeholderIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3>No Offer Letters Yet</h3>
              <p>Ready to hire? Create your first professional offer letter here.</p>
              <button 
                className={styles.createButton} 
                style={{ margin: '0 auto' }}
                onClick={() => router.push('/dashboard/offer-letters/create')}
              >
                Create Offer Letter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

