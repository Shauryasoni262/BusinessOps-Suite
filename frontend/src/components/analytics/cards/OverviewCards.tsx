'use client';

import React from 'react';
import { Users, Briefcase, DollarSign, Clock } from 'lucide-react';
import styles from './OverviewCards.module.css';

interface OverviewCardsProps {
  stats: {
    totalUsers: number;
    userGrowth: number;
    activeProjects: number;
    projectGrowth: number;
    revenue: number;
    revenueGrowth: number;
    avgResponseTime: number;
    responseTimeChange: number;
  };
}

const OverviewCards: React.FC<OverviewCardsProps> = ({ stats }) => {
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString()}`;
  };

  const cards = [
    {
      title: 'Total Users',
      value: formatNumber(stats.totalUsers),
      change: `+${stats.userGrowth.toFixed(1)}% from last month`,
      icon: Users,
      iconColor: '#3b82f6'
    },
    {
      title: 'Active Projects',
      value: formatNumber(stats.activeProjects),
      change: `+${stats.projectGrowth} from last week`,
      icon: Briefcase,
      iconColor: '#8b5cf6'
    },
    {
      title: 'Revenue',
      value: formatCurrency(stats.revenue),
      change: `+${stats.revenueGrowth.toFixed(1)}% from last month`,
      icon: DollarSign,
      iconColor: '#10b981',
      positive: stats.revenueGrowth > 0
    },
    {
      title: 'Avg. Response Time',
      value: `${stats.avgResponseTime}h`,
      change: `${stats.responseTimeChange}% slower`,
      icon: Clock,
      iconColor: '#f59e0b',
      positive: stats.responseTimeChange < 0
    }
  ];

  return (
    <div className={styles.cardsContainer}>
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isPositive = card.positive !== undefined ? card.positive : parseFloat(card.change) >= 0;
        
        return (
          <div key={index} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>{card.title}</span>
              <div className={styles.iconWrapper} style={{ backgroundColor: `${card.iconColor}20` }}>
                <Icon size={20} color={card.iconColor} />
              </div>
            </div>
            <div className={styles.cardValue}>{card.value}</div>
            <div className={`${styles.cardChange} ${isPositive ? styles.positive : styles.negative}`}>
              {card.change}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewCards;

