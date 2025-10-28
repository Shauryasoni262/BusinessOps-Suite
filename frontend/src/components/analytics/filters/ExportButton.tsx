'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';
import styles from './ExportButton.module.css';

interface ExportButtonProps {
  type: string;
  startDate?: string;
  endDate?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ type, startDate, endDate }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      setIsExporting(true);
      setShowMenu(false);
      await analyticsService.downloadExport(type, format, startDate, endDate);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={styles.exportContainer}>
      <button
        className={styles.exportButton}
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
      >
        <Download size={18} />
        {isExporting ? 'Exporting...' : 'Export'}
      </button>
      
      {showMenu && (
        <>
          <div className={styles.backdrop} onClick={() => setShowMenu(false)} />
          <div className={styles.menu}>
            <button 
              className={styles.menuItem}
              onClick={() => handleExport('csv')}
            >
              Export as CSV
            </button>
            <button 
              className={styles.menuItem}
              onClick={() => handleExport('pdf')}
            >
              Export as PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;

