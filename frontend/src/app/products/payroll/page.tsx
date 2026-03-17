import React from 'react';
import styles from '../workforce/Workforce.module.css'; // Reusing layout styles for consistency
import Link from 'next/link';

export default function PayrollPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.badge}>Product / Payroll</div>
        <h1 className={styles.title}>Payroll Management <span>Simplified.</span></h1>
        <p className={styles.subtitle}>Modern payroll solutions for the global workforce. Compliant, automated, and error-free.</p>
      </header>
      
      <section className={styles.grid}>
        <div className={styles.card}>
          <h3>Automated Cycles</h3>
          <p>Run your entire payroll in minutes with zero manual intervention.</p>
        </div>
        <div className={styles.card}>
          <h3>Compliance Ready</h3>
          <p>Stay up to date with the latest tax laws and regulations automatically.</p>
        </div>
        <div className={styles.card}>
          <h3>One-Click Payouts</h3>
          <p>Direct bank transfers integrated with major financial institutions.</p>
        </div>
      </section>

      <footer className={styles.cta}>
        <h2>End your payroll headaches today.</h2>
        <Link href="/auth/signup" className={styles.btn}>Get Started Now</Link>
      </footer>
    </div>
  );
}
