'use client';

import React from 'react';
import styles from './PerformanceMetrics.module.css';

interface PerformanceMetricsProps {
  data: {
    taskCompletionRate: number;
    onTimeDeliveryRate: number;
    clientSatisfaction: number;
  };
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ data }) => {
  const metrics = [
    {
      title: 'Task Completion Rate',
      value: `${data.taskCompletionRate}%`,
      progress: data.taskCompletionRate,
      color: '#10b981'
    },
    {
      title: 'Client Satisfaction',
      value: `${data.clientSatisfaction}/5`,
      progress: (data.clientSatisfaction / 5) * 100,
      color: '#3b82f6'
    },
    {
      title: 'On-Time Delivery',
      value: `${data.onTimeDeliveryRate}%`,
      progress: data.onTimeDeliveryRate,
      color: '#8b5cf6'
    }
  ];

  return (
    <div className={styles.metricsContainer}>
      <h3 className={styles.title}>Performance Metrics</h3>
      <p className={styles.subtitle}>Key performance indicators for your business</p>
      
      <div className={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <div key={index} className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span className={styles.metricTitle}>{metric.title}</span>
              <span className={styles.metricValue}>{metric.value}</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ 
                  width: `${metric.progress}%`,
                  backgroundColor: metric.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetrics;

