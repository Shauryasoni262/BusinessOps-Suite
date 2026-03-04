'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { AdminInvoice, AdminPayment } from '@/types/admin';
import { DollarSign, Clock, AlertTriangle, CreditCard, FileText } from 'lucide-react';
import styles from './finance.module.css';

export default function AdminFinancePage() {
  const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'invoices' | 'payments'>('invoices');

  useEffect(() => {
    const load = async () => {
      try {
        const [inv, pay] = await Promise.all([
          adminService.getAllInvoices(),
          adminService.getAllPayments()
        ]);
        setInvoices(inv.invoices);
        setPayments(pay.payments);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + parseFloat(String(i.total_amount)), 0);
  const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + parseFloat(String(i.total_amount)), 0);
  const overdueCount = invoices.filter(i => i.status === 'overdue').length;

  const statusColors: Record<string, string> = {
    paid: '#22c55e', pending: '#f59e0b', overdue: '#ef4444', cancelled: '#64748b',
    completed: '#22c55e', failed: '#ef4444', refunded: '#8b5cf6'
  };

  const kpis = [
    { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#22c55e' },
    { label: 'Pending', value: `$${pendingAmount.toLocaleString()}`, icon: Clock, color: '#f59e0b' },
    { label: 'Overdue', value: overdueCount, icon: AlertTriangle, color: '#ef4444' },
    { label: 'Invoices', value: invoices.length, icon: FileText, color: '#8b5cf6' },
    { label: 'Payments', value: payments.length, icon: CreditCard, color: '#3b82f6' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Finance</h1>
        <p className={styles.subtitle}>Invoices and payment tracking</p>
      </div>

      <div className={styles.kpiRow}>
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className={styles.kpi}>
              <div className={styles.kpiTop}>
                <span className={styles.kpiLabel}>{k.label}</span>
                <div className={styles.kpiIcon} style={{ background: `${k.color}10`, color: k.color }}><Icon size={14} /></div>
              </div>
              <div className={styles.kpiVal}>{k.value}</div>
            </div>
          );
        })}
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'invoices' ? styles.activeTab : ''}`} onClick={() => setTab('invoices')}>
          <FileText size={13} /> Invoices
        </button>
        <button className={`${styles.tab} ${tab === 'payments' ? styles.activeTab : ''}`} onClick={() => setTab('payments')}>
          <CreditCard size={13} /> Payments
        </button>
      </div>

      {tab === 'invoices' ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Invoice</th><th>Client</th><th>Amount</th><th>Status</th><th>Due</th><th>By</th></tr></thead>
            <tbody>
              {invoices.length > 0 ? invoices.map(inv => (
                <tr key={inv.id}>
                  <td className={styles.mono}>{inv.invoice_number}</td>
                  <td><div className={styles.bold}>{inv.client_name}</div><div className={styles.sub}>{inv.client_email}</div></td>
                  <td className={styles.bold}>{inv.currency} {parseFloat(String(inv.total_amount)).toLocaleString()}</td>
                  <td><span className={styles.badge} style={{ background: `${statusColors[inv.status]}10`, color: statusColors[inv.status] }}>{inv.status}</span></td>
                  <td className={styles.mono}>{new Date(inv.due_date).toLocaleDateString()}</td>
                  <td className={styles.sub}>{inv.users?.name || '—'}</td>
                </tr>
              )) : <tr><td colSpan={6} className={styles.empty}>{loading ? 'Loading...' : 'No invoices'}</td></tr>}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Invoice</th><th>Client</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {payments.length > 0 ? payments.map(pay => (
                <tr key={pay.id}>
                  <td className={styles.mono}>{pay.invoices?.invoice_number || '—'}</td>
                  <td>{pay.invoices?.client_name || '—'}</td>
                  <td className={styles.bold}>{pay.currency} {parseFloat(String(pay.amount)).toLocaleString()}</td>
                  <td className={styles.methodTag}>{pay.payment_method}</td>
                  <td><span className={styles.badge} style={{ background: `${statusColors[pay.payment_status]}10`, color: statusColors[pay.payment_status] }}>{pay.payment_status}</span></td>
                  <td className={styles.mono}>{pay.payment_date ? new Date(pay.payment_date).toLocaleDateString() : '—'}</td>
                </tr>
              )) : <tr><td colSpan={6} className={styles.empty}>{loading ? 'Loading...' : 'No payments'}</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
