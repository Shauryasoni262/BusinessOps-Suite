const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface RazorpayOrder {
  order_id: string;
  amount: number;
  currency: string;
  payment_id: string;
}

export interface PaymentVerification {
  payment_id: string;
  order_id: string;
  signature: string;
}

class PaymentService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // Create Razorpay order
  async createRazorpayOrder(invoiceId: string, amount: number, currency: string = 'INR'): Promise<RazorpayOrder> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/razorpay/order`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          invoice_id: invoiceId,
          amount: amount,
          currency: currency
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  // Verify payment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async verifyPayment(verificationData: PaymentVerification): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/razorpay/verify`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(verificationData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  // Initialize Razorpay payment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async initializeRazorpayPayment(orderData: RazorpayOrder, invoiceData: any) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'BusinessOps',
          description: `Payment for Invoice ${invoiceData.invoice_number}`,
          order_id: orderData.order_id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          handler: async (response: any) => {
            try {
              const verificationData = {
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                signature: response.razorpay_signature
              };
              
              const result = await this.verifyPayment(verificationData);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          },
          prefill: {
            name: invoiceData.client_name,
            email: invoiceData.client_email
          },
          theme: {
            color: '#3b82f6'
          }
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.body.appendChild(script);
    });
  }
}

export const paymentService = new PaymentService();
