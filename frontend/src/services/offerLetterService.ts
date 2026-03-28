const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface OfferLetter {
  id: string;
  candidate_name: string;
  candidate_email: string;
  job_title: string;
  status: string;
  created_at: string;
  offer_data: any;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

class OfferLetterService {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getOfferLetters(): Promise<OfferLetter[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/offer-letters`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<OfferLetter[]> = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching offer letters:', error);
      throw error;
    }
  }

  async createOfferLetter(data: any): Promise<OfferLetter> {
    try {
      const response = await fetch(`${API_BASE_URL}/offer-letters`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<OfferLetter> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating offer letter:', error);
      throw error;
    }
  }
}

export const offerLetterService = new OfferLetterService();
export type { OfferLetter };
