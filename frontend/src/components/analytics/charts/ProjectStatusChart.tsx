'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from '../ChartCard.module.css';

interface ProjectStatusChartProps {
  data: {
    active: number;
    completed: number;
    planning: number;
    on_hold: number;
  };
}

const ProjectStatusChart: React.FC<ProjectStatusChartProps> = ({ data }) => {
  const chartData = [
    { status: 'In Progress', count: data.active || 0, color: '#3b82f6' },
    { status: 'Planning', count: data.planning || 0, color: '#f59e0b' },
    { status: 'Completed', count: data.completed || 0, color: '#10b981' },
    { status: 'On Hold', count: data.on_hold || 0, color: '#6b7280' }
  ];

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Project Status Distribution</h3>
        <p className={styles.chartSubtitle}>Current status of all projects</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#6b7280" style={{ fontSize: '0.875rem' }} />
          <YAxis 
            dataKey="status" 
            type="category" 
            width={100}
            stroke="#6b7280" 
            style={{ fontSize: '0.875rem' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '0.875rem'
            }}
          />
          <Bar 
            dataKey="count" 
            fill="#3b82f6"
            radius={[0, 8, 8, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className={styles.statusLegend}>
        {chartData.map((item, index) => (
          <div key={index} className={styles.legendItem}>
            <div 
              className={styles.legendColor} 
              style={{ backgroundColor: item.color }}
            />
            <span className={styles.legendLabel}>{item.status}</span>
            <span className={styles.legendValue}>{item.count} projects</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectStatusChart;

