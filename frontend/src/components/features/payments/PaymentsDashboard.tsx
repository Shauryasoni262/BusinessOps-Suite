'use client';

import { useState, useEffect } from 'react';
import { invoiceService, type FinancialStats, type RevenueData } from '@/services/invoiceService';
import { RevenueChart } from '@/components/analytics/charts';
import FinancialStatsCards from './FinancialStatsCards';
import RecentInvoices from './RecentInvoices';
import { GenerateInvoiceModal } from '@/components/modals/payment';
import { Plus, RefreshCcw, AlertTriangle, Loader2 } from 'lucide-react';
import styles from './PaymentsDashboard.module.css';

export default function PaymentsDashboard() {
  const [financialStats, setFinancialStats] = useState<FinancialStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [stats, revenue] = await Promise.all([
        invoiceService.getFinancialStats(),
        invoiceService.getRevenueData()
      ]);

      setFinancialStats(stats);
      setRevenueData(revenue);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader2 className={styles.spinner} size={40} />
        <p style={{ fontWeight: 600, color: '#64748b' }}>Refreshing financial vault...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
        <p>{error}</p>
        <button onClick={handleRefresh} className={styles.retryButton}>
          <RefreshCcw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Financial Dashboard</h1>
          <p className={styles.subtitle}>Track revenue, manage invoices, and monitor growth</p>
        </div>
        <button 
          className={styles.generateButton}
          onClick={() => setShowInvoiceModal(true)}
        >
          <Plus size={18} />
          Generate Invoice
        </button>
      </div>

      {financialStats && (
        <FinancialStatsCards stats={financialStats} />
      )}

      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <RecentInvoices onRefresh={handleRefresh} />
        </div>
        
        <div className={styles.rightColumn}>
          <RevenueChart data={revenueData} />
        </div>
      </div>

      {showInvoiceModal && (
        <GenerateInvoiceModal
          onClose={() => setShowInvoiceModal(false)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}
