import React from 'react';
import styles from './LogoCloud.module.css';

const features = [
  { name: 'AI-First', symbol: '🤖' },
  { name: 'On-Cloud', symbol: '☁️' },
  { name: 'Secure', symbol: '🛡️' },
  { name: 'Scalable', symbol: '📈' },
  { name: 'Intuitive', symbol: '✨' },
  { name: 'Automated', symbol: '⚙️' },
];

export const LogoCloud = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <p className={styles.label}>Built for the next generation of businesses</p>
        <div className={styles.grid}>
          {features.map((feature) => (
            <div key={feature.name} className={styles.logoItem}>
              <span className={styles.symbol}>{feature.symbol}</span>
              <span className={styles.name}>{feature.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
