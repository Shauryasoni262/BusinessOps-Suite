'use client';

import { useState, useEffect } from 'react';
import { invoiceService, type Invoice } from '@/services/invoiceService';
import styles from './RecentInvoices.module.css';

interface RecentInvoicesProps {
  onRefresh: () => void;
}

export default function RecentInvoices({ onRefresh }: RecentInvoicesProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await invoiceService.getInvoices();
      setInvoices(data.slice(0, 6)); // Show only recent 6 invoices
    } catch (error) {
      console.error('Error loading invoices:', error);
      setError('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      await invoiceService.deleteInvoice(invoiceId);
      await loadInvoices();
      onRefresh();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      setError('Failed to delete invoice');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return { text: 'Paid', className: styles.paid };
      case 'pending':
        return { text: 'Pending', className: styles.pending };
      case 'overdue':
        return { text: 'Overdue', className: styles.overdue };
      case 'cancelled':
        return { text: 'Cancelled', className: styles.cancelled };
      default:
        return { text: 'Unknown', className: styles.unknown };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading invoices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={loadInvoices} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h3 className={styles.title}>Recent Invoices</h3>
          <p className={styles.subtitle}>View and manage your invoices</p>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </div>
          <h4>No invoices yet</h4>
          <p>Create your first invoice to get started.</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => {
                const statusBadge = getStatusBadge(invoice.status);
                return (
                  <tr key={invoice.id}>
                    <td className={styles.invoiceId}>{invoice.invoice_number}</td>
                    <td className={styles.client}>
                      <div className={styles.clientInfo}>
                        <div className={styles.clientName}>{invoice.client_name}</div>
                        <div className={styles.clientEmail}>{invoice.client_email}</div>
                      </div>
                    </td>
                    <td className={styles.amount}>
                      {formatCurrency(invoice.total_amount, invoice.currency)}
                    </td>
                    <td className={styles.date}>{formatDate(invoice.invoice_date)}</td>
                    <td className={styles.date}>{formatDate(invoice.due_date)}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${statusBadge.className}`}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td className={styles.actions}>
                      <button
                        className={styles.downloadButton}
                        title="Download PDF"
                        onClick={() => window.open(`/api/pdf/invoice/${invoice.id}`, '_blank')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7,10 12,15 17,10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        PDF
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className={styles.deleteButton}
                        title="Delete invoice"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
