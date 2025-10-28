'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from '../ChartCard.module.css';

interface TeamProductivityChartProps {
  data: Array<{
    name: string;
    tasksCompleted: number;
    totalTasks: number;
  }>;
}

const TeamProductivityChart: React.FC<TeamProductivityChartProps> = ({ data }) => {
  // Take top 5 team members
  const topMembers = data.slice(0, 5);

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Team Productivity</h3>
        <p className={styles.chartSubtitle}>Tasks completed per team member</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topMembers} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280" 
            style={{ fontSize: '0.875rem' }}
          />
          <YAxis 
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
            dataKey="tasksCompleted" 
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
            name="Tasks Completed"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TeamProductivityChart;

