'use client';

import { useState } from 'react';
import { paymentService } from '@/services/paymentService';
import { type Invoice } from '@/services/invoiceService';
import { 
  CreditCard, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  ShieldCheck 
} from 'lucide-react';
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
      setError('Payment initiation failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (invoice.status === 'paid') {
    return (
      <span className={styles.paidBadge}>
        <CheckCircle2 size={16} />
        Paid Secured
      </span>
    );
  }

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.error}>
          <AlertCircle size={14} />
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
            <Loader2 className={styles.spinner} size={16} />
            Secure Processing...
          </>
        ) : (
          <>
            <CreditCard size={18} />
            Settle Invoice
          </>
        )}
      </button>
    </div>
  );
}
