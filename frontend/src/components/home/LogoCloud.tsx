import React from 'react';
import styles from './LogoCloud.module.css';

const logos = [
  { name: 'Aviva', symbol: '💠' },
  { name: 'Canon', symbol: '📷' },
  { name: 'Haier', symbol: '🏠' },
  { name: 'Flipkart', symbol: '🛒' },
  { name: 'Bikanervala', symbol: '🍲' },
  { name: 'Muthoot', symbol: '💰' },
  { name: 'Sula', symbol: '🍷' },
  { name: 'Magicpin', symbol: '📍' },
];

export const LogoCloud = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <p className={styles.label}>Trusted by 2000+ industry leaders</p>
        <div className={styles.grid}>
          {logos.map((logo) => (
            <div key={logo.name} className={styles.logoItem}>
              <span className={styles.symbol}>{logo.symbol}</span>
              <span className={styles.name}>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
