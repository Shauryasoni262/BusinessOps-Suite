'use client';

import { useState, useEffect } from 'react';
import { invoiceService, type CreateInvoiceData } from '@/services/invoiceService';
import { 
  X, 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  DollarSign, 
  Percent, 
  StickyNote,
  Send,
  Loader2,
  AlertCircle
} from 'lucide-react';
import styles from './GenerateInvoiceModal.module.css';

interface GenerateInvoiceModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function GenerateInvoiceModal({ onClose, onSuccess }: GenerateInvoiceModalProps) {
  const [formData, setFormData] = useState<CreateInvoiceData>({
    client_name: '',
    client_email: '',
    client_address: '',
    description: '',
    amount: 0,
    currency: 'USD',
    tax_rate: 0,
    invoice_date: '',
    due_date: '',
    notes: ''
  });

  // Initialize dates only on client side to avoid hydration mismatch
  useEffect(() => {
    const today = new Date();
    const dueDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    setFormData(prev => ({
      ...prev,
      invoice_date: today.toISOString().split('T')[0],
      due_date: dueDate.toISOString().split('T')[0]
    }));
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'tax_rate' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client_name || !formData.client_email || !formData.amount) {
      setError('Client name, email, and amount are required');
      return;
    }

    if (formData.amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await invoiceService.createInvoice(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating invoice:', error);
      setError('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'INR', label: 'INR (₹)' },
    { value: 'CAD', label: 'CAD (C$)' },
    { value: 'AUD', label: 'AUD (A$)' }
  ];

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>Generate Invoice</h2>
            <p className={styles.subtitle}>Create a professional invoice for your client.</p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Client Information</h3>
            
            <div className={styles.field}>
              <label htmlFor="client_name" className={styles.label}>
                <User size={14} /> Client Name *
              </label>
              <input
                type="text"
                id="client_name"
                name="client_name"
                value={formData.client_name}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="e.g. Acme Corp"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="client_email" className={styles.label}>
                <Mail size={14} /> Client Email *
              </label>
              <input
                type="email"
                id="client_email"
                name="client_email"
                value={formData.client_email}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="client@company.com"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="client_address" className={styles.label}>
                <MapPin size={14} /> Client Address
              </label>
              <textarea
                id="client_address"
                name="client_address"
                value={formData.client_address}
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder="123 Business Rd, Suite 100"
                rows={2}
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Invoice Terms</h3>
            
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="invoice_date" className={styles.label}>
                  <Calendar size={14} /> Issue Date *
                </label>
                <input
                  type="date"
                  id="invoice_date"
                  name="invoice_date"
                  value={formData.invoice_date}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                  disabled={loading}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="due_date" className={styles.label}>
                  <Calendar size={14} /> Due Date *
                </label>
                <input
                  type="date"
                  id="due_date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="description" className={styles.label}>
                <FileText size={14} /> Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder="Product design services - Q1 2024"
                rows={2}
                disabled={loading}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="amount" className={styles.label}>
                  <DollarSign size={14} /> Subtotal *
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  disabled={loading}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="currency" className={styles.label}>
                   Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className={styles.select}
                  disabled={loading}
                >
                  {currencies.map(currency => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="tax_rate" className={styles.label}>
                <Percent size={14} /> Tax Rate (%)
              </label>
              <input
                type="number"
                id="tax_rate"
                name="tax_rate"
                value={formData.tax_rate}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="0"
                min="0"
                max="100"
                step="0.01"
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Notes</h3>
            
            <div className={styles.field}>
              <label htmlFor="notes" className={styles.label}>
                <StickyNote size={14} /> Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder="Payment via bank transfer only..."
                rows={2}
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.generateButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className={styles.spinner} size={16} />
                  Processing...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Generate Invoice
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
