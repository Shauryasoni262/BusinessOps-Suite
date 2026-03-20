'use client';

import { type FinancialStats } from '@/services/invoiceService';
import { 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ArrowUpRight,
  BadgeCent
} from 'lucide-react';
import styles from './FinancialStatsCards.module.css';

interface FinancialStatsCardsProps {
  stats: FinancialStats;
}

export default function FinancialStatsCards({ stats }: FinancialStatsCardsProps) {
  const cards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: `${stats.monthlyGrowth.toFixed(1)}%`,
      changeType: 'positive' as const,
      icon: <DollarSign size={24} />
    },
    {
      title: 'Paid Invoices',
      value: stats.paidInvoices.toString(),
      change: `+${stats.paidInvoices}`,
      changeType: 'positive' as const,
      icon: <CheckCircle2 size={24} />
    },
    {
      title: 'Pending Payments',
      value: `$${stats.pendingAmount.toLocaleString()}`,
      change: `${stats.pendingCount} invoices`,
      changeType: 'neutral' as const,
      icon: <Clock size={24} />
    },
    {
      title: 'Monthly Growth',
      value: `${stats.monthlyGrowth.toFixed(1)}%`,
      change: 'vs last month',
      changeType: 'positive' as const,
      icon: <TrendingUp size={24} />
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
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardValue}>{card.value}</p>
            </div>
          </div>
          <div className={styles.cardFooter}>
            <span className={`${styles.change} ${styles[card.changeType]}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                {card.changeType === 'positive' && <ArrowUpRight size={12} />}
                {card.change}
              </div>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
