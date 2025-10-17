'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import styles from './google-error.module.css';

export default function GoogleError() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'An error occurred during Google login';

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className={styles.title}>Login Failed</h1>
            <p className={styles.message}>
              {decodeURIComponent(message)}
            </p>
            <div className={styles.actions}>
              <Link href="/auth/login" className={styles.retryButton}>
                Try Again
              </Link>
              <Link href="/" className={styles.homeButton}>
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
