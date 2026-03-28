import { SalarySlipData } from '@/components/salary-slips/SalarySlipTemplates';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface SalarySlip extends SalarySlipData {
  id: string;
  status: string;
  created_at: string;
  created_by: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

class SalarySlipService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getAllSalarySlips(): Promise<SalarySlip[]> {
    const response = await fetch(`${API_URL}/salary-slips`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch salary slips');
    }

    const result: ApiResponse<SalarySlip[]> = await response.json();
    return result.data;
  }

  async getSalarySlip(id: string): Promise<SalarySlip> {
    const response = await fetch(`${API_URL}/salary-slips/${id}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch salary slip details');
    }

    const result: ApiResponse<SalarySlip> = await response.json();
    return result.data;
  }

  async createSalarySlip(data: SalarySlipData): Promise<SalarySlip> {
    const response = await fetch(`${API_URL}/salary-slips`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to generate salary slip');
    }

    const result: ApiResponse<SalarySlip> = await response.json();
    return result.data;
  }

  async deleteSalarySlip(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/salary-slips/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete salary slip');
    }
  }
}

export const salarySlipService = new SalarySlipService();
