'use client';

import { useState } from 'react';
import { invoiceService, type CreateInvoiceData } from '@/services/invoiceService';
import styles from './GenerateInvoiceModal.module.css';

interface GenerateInvoiceModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function GenerateInvoiceModal({ onClose, onSuccess }: GenerateInvoiceModalProps) {
  const [formData, setFormData] = useState<CreateInvoiceData>({
    client_name: 'Acme Corp',
    client_email: 'client@example.com',
    client_address: '',
    description: '',
    amount: 0,
    currency: 'USD',
    tax_rate: 0,
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: ''
  });

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
            <p className={styles.subtitle}>Create a new invoice for your client. Fill in the details below.</p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Client Information</h3>
            
            <div className={styles.field}>
              <label htmlFor="client_name" className={styles.label}>
                Client Name *
              </label>
              <input
                type="text"
                id="client_name"
                name="client_name"
                value={formData.client_name}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter client name"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="client_email" className={styles.label}>
                Client Email *
              </label>
              <input
                type="email"
                id="client_email"
                name="client_email"
                value={formData.client_email}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter client email"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="client_address" className={styles.label}>
                Client Address
              </label>
              <textarea
                id="client_address"
                name="client_address"
                value={formData.client_address}
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder="Enter client address"
                rows={3}
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Invoice Details</h3>
            
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="invoice_date" className={styles.label}>
                  Invoice Date *
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
                  Due Date *
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
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder="Services provided"
                rows={3}
                disabled={loading}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="amount" className={styles.label}>
                  Amount *
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
                Tax Rate (%)
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
            <h3 className={styles.sectionTitle}>Additional Information</h3>
            
            <div className={styles.field}>
              <label htmlFor="notes" className={styles.label}>
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder="Payment terms, additional information..."
                rows={3}
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
                  <svg className={styles.spinner} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Creating...
                </>
              ) : (
                'Generate Invoice'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
