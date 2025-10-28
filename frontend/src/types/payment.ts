export interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_address?: string;
  description?: string;
  amount: number;
  currency: string;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  invoice_date: string;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_gateway_id?: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  payment_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateInvoiceData {
  client_name: string;
  client_email: string;
  client_address?: string;
  description?: string;
  amount: number;
  currency?: string;
  tax_rate?: number;
  invoice_date: string;
  due_date: string;
  notes?: string;
}

