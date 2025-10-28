'use client';

import { useState } from 'react';
import { paymentService } from '@/services/paymentService';
import { type Invoice } from '@/services/invoiceService';
import styles from './PaymentButton.module.css';

interface PaymentButtonProps {
  invoice: Invoice;
  onPaymentSuccess: () => void;
}

export default function PaymentButton({ invoice, onPaymentSuccess }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (invoice.status === 'paid') {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create Razorpay order
      const orderData = await paymentService.createRazorpayOrder(
        invoice.id,
        invoice.total_amount,
        invoice.currency
      );

      // Initialize Razorpay payment
      await paymentService.initializeRazorpayPayment(orderData, invoice);
      
      // Payment successful
      onPaymentSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (invoice.status === 'paid') {
    return (
      <span className={styles.paidBadge}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20,6 9,17 4,12"/>
        </svg>
        Paid
      </span>
    );
  }

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      
      <button
        onClick={handlePayment}
        disabled={loading}
        className={styles.paymentButton}
      >
        {loading ? (
          <>
            <svg className={styles.spinner} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            Pay Now
          </>
        )}
      </button>
    </div>
  );
}
