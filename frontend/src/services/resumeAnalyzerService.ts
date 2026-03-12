import { API_BASE_URL, getAuthHeaders } from '@/lib/config/api';

export interface ResumeUploadResult {
  resumeId: string;
  fileName: string;
  textLength: number;
  chunksCreated: number;
  pageCount: number;
}

export interface ChatResult {
  answer: string;
  sourcesUsed: number;
}

export const resumeAnalyzerService = {
  /**
   * Upload a resume PDF to the backend for RAG processing (chunking + embedding)
   */
  uploadResume: async (file: File): Promise<ResumeUploadResult> => {
    const formData = new FormData();
    formData.append('resume', file);

    const token = localStorage.getItem('token');
    
    // Note: We don't use the standard apiRequest wrapper here because
    // we need to send FormData (multipart/form-data), and fetch automatically
    // sets the correct Content-Type with boundaries when passing FormData.
    // If we manually set 'Content-Type': 'application/json', it will break.
    
    const response = await fetch(`${API_BASE_URL}/resume-analyzer/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(err.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Ask the AI a question about the uploaded resume
   */
  chatWithResume: async (resumeId: string, message: string): Promise<ChatResult> => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/resume-analyzer/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resumeId, message })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Chat request failed' }));
      throw new Error(err.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }
};
