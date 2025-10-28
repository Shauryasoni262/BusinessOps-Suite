'use client';

import { type FinancialStats } from '@/services/invoiceService';
import styles from './FinancialStatsCards.module.css';

interface FinancialStatsCardsProps {
  stats: FinancialStats;
}

export default function FinancialStatsCards({ stats }: FinancialStatsCardsProps) {
  const cards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: `+${stats.monthlyGrowth.toFixed(1)}%`,
      changeType: 'positive' as const,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      )
    },
    {
      title: 'Paid Invoices',
      value: stats.paidInvoices.toString(),
      change: `+${stats.paidInvoices}`,
      changeType: 'positive' as const,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20,6 9,17 4,12"/>
        </svg>
      )
    },
    {
      title: 'Pending Payments',
      value: `$${stats.pendingAmount.toLocaleString()}`,
      change: `${stats.pendingCount} invoices`,
      changeType: 'neutral' as const,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
      )
    },
    {
      title: 'Monthly Growth',
      value: `+${stats.monthlyGrowth.toFixed(1)}%`,
      change: 'vs last month',
      changeType: 'positive' as const,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
          <polyline points="17,6 23,6 23,12"/>
        </svg>
      )
    }
  ];

  return (
    <div className={styles.cardsGrid}>
      {cards.map((card, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconContainer}>
              {card.icon}
            </div>
            <div className={styles.cardInfo}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardValue}>{card.value}</p>
            </div>
          </div>
          <div className={styles.cardFooter}>
            <span className={`${styles.change} ${styles[card.changeType]}`}>
              {card.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
