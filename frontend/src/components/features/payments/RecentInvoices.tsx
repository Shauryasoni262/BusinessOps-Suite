'use client';

import { useState, useEffect } from 'react';
import { invoiceService, type Invoice } from '@/services/invoiceService';
import { 
  FileText, 
  Download, 
  Trash2, 
  FileSearch, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  XCircle,
  MoreVertical,
  ExternalLink,
  ChevronRight,
  Loader2
} from 'lucide-react';
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
      setError('Failed to load recent invoices');
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

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'paid':
        return { text: 'Paid', className: styles.paid, icon: <CheckCircle2 size={12} /> };
      case 'pending':
        return { text: 'Pending', className: styles.pending, icon: <Clock size={12} /> };
      case 'overdue':
        return { text: 'Overdue', className: styles.overdue, icon: <AlertCircle size={12} /> };
      case 'cancelled':
        return { text: 'Cancelled', className: styles.cancelled, icon: <XCircle size={12} /> };
      default:
        return { text: 'Unknown', className: styles.unknown, icon: <AlertCircle size={12} /> };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
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
          <Loader2 className={styles.spinner} />
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>
            Syncing invoices...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error} style={{ padding: '2rem', textAlign: 'center' }}>
          <AlertCircle size={32} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: '#ef4444', fontWeight: 600 }}>{error}</p>
          <button onClick={loadInvoices} className={styles.retryButton} style={{ marginTop: '1rem' }}>
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
          <p className={styles.subtitle}>Audit trail of latest client billings</p>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FileSearch size={48} strokeWidth={1} />
          </div>
          <h4>No invoices found</h4>
          <p>Generate your first invoice to begin tracking billing history.</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Client Details</th>
                <th>Amount</th>
                <th>Issued</th>
                <th>Due Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => {
                const status = getStatusInfo(invoice.status);
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
                      <span className={`${styles.statusBadge} ${status.className}`}>
                        {status.icon}
                        {status.text}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.downloadButton}
                          title="Download PDF"
                          onClick={() => window.open(`/api/pdf/invoice/${invoice.id}`, '_blank')}
                        >
                          <Download size={14} />
                          PDF
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className={styles.deleteButton}
                          title="Delete invoice"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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
