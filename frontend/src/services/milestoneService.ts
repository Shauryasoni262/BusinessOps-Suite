const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'completed' | 'overdue';
  event_type?: 'milestone' | 'update' | 'meeting' | 'deadline' | 'review';
  display_order?: number;
  created_at: string;
  project?: {
    name: string;
  };
}

interface CreateMilestoneData {
  title: string;
  description?: string;
  deadline: string;
  event_type?: 'milestone' | 'update' | 'meeting' | 'deadline' | 'review';
  display_order?: number;
}

interface UpdateMilestoneData {
  title?: string;
  description?: string;
  deadline?: string;
  status?: 'pending' | 'completed' | 'overdue';
  event_type?: 'milestone' | 'update' | 'meeting' | 'deadline' | 'review';
  display_order?: number;
}

interface MilestoneStats {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

class MilestoneService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getProjectMilestones(projectId: string): Promise<Milestone[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/milestones`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Milestone[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching project milestones:', error);
      throw error;
    }
  }

  async getMilestone(milestoneId: string): Promise<Milestone> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/milestones/${milestoneId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Milestone> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching milestone:', error);
      throw error;
    }
  }

  async createMilestone(projectId: string, data: CreateMilestoneData): Promise<Milestone> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/milestones`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Milestone> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating milestone:', error);
      throw error;
    }
  }

  async updateMilestone(projectId: string, milestoneId: string, data: UpdateMilestoneData): Promise<Milestone> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/milestones/${milestoneId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Milestone> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating milestone:', error);
      throw error;
    }
  }

  async deleteMilestone(projectId: string, milestoneId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/milestones/${milestoneId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting milestone:', error);
      throw error;
    }
  }

  async markMilestoneCompleted(projectId: string, milestoneId: string): Promise<Milestone> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/milestones/${milestoneId}/complete`, {
        method: 'PATCH',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Milestone> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error marking milestone as completed:', error);
      throw error;
    }
  }

  async getMilestoneStats(projectId: string): Promise<MilestoneStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/milestones/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<MilestoneStats> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching milestone stats:', error);
      throw error;
    }
  }

  async getUpcomingMilestones(projectId?: string): Promise<Milestone[]> {
    try {
      const url = new URL(`${API_BASE_URL}/milestones/upcoming`);
      if (projectId) {
        url.searchParams.append('projectId', projectId);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Milestone[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching upcoming milestones:', error);
      throw error;
    }
  }
}

export const milestoneService = new MilestoneService();
export type { Milestone, CreateMilestoneData, UpdateMilestoneData, MilestoneStats };
