import React from 'react';
import styles from './Workforce.module.css';
import Link from 'next/link';

export default function WorkforcePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.badge}>Product / Workforce</div>
        <h1 className={styles.title}>Workforce Management <span>Redefined.</span></h1>
        <p className={styles.subtitle}>Empowering your employees with a simplified journey from Onboarding to Exit.</p>
      </header>
      
      <section className={styles.grid}>
        <div className={styles.card}>
          <h3>Confirmation</h3>
          <p>Seamless automated confirmation workflows for your talent.</p>
        </div>
        <div className={styles.card}>
          <h3>Separation</h3>
          <p>Dignified and structured exit processes handled by AI.</p>
        </div>
        <div className={styles.card}>
          <h3>Workforce Insights</h3>
          <p>Real-time data on your team's health and distribution.</p>
        </div>
      </section>

      <footer className={styles.cta}>
        <h2>Ready to simplify your workforce?</h2>
        <Link href="/auth/signup" className={styles.btn}>Get Started Now</Link>
      </footer>
    </div>
  );
}
