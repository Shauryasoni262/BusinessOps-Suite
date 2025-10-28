'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import styles from './DateRangeFilter.module.css';

interface DateRangeFilterProps {
  value: string;
  onChange: (preset: string) => void;
}

const presets = [
  { value: '7days', label: 'Last 7 days' },
  { value: '30days', label: 'Last 30 days' },
  { value: '6months', label: 'Last 6 months' },
  { value: 'all', label: 'All time' }
];

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ value, onChange }) => {
  return (
    <div className={styles.filterContainer}>
      <Calendar size={18} className={styles.icon} />
      <select 
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {presets.map((preset) => (
          <option key={preset.value} value={preset.value}>
            {preset.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateRangeFilter;

