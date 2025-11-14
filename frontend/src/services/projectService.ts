const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Project {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline: string | null;
  status: 'idea' | 'planning' | 'in_progress' | 'on_hold' | 'review' | 'completed' | 'cancelled';
  owner_id: string;
  created_at: string;
  updated_at: string;
  owner?: {
    name: string;
    email: string;
  };
  members?: Array<{
    user_id: string;
    joined_at: string;
    user: {
      name: string;
      email: string;
    };
  }>;
  stats?: {
    tasks: {
      total: number;
      pending: number;
      in_progress: number;
      completed: number;
      cancelled: number;
    };
    milestones: {
      total: number;
      pending: number;
      completed: number;
      overdue: number;
    };
    files: number;
  };
}

interface CreateProjectData {
  name: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: string;
  status?: 'idea' | 'planning' | 'in_progress' | 'on_hold' | 'review' | 'completed' | 'cancelled';
}

interface UpdateProjectData {
  name?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: string;
  status?: 'idea' | 'planning' | 'in_progress' | 'on_hold' | 'review' | 'completed' | 'cancelled';
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

class ProjectService {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getProjects(): Promise<Project[]> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Clear invalid token
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Project[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async getProject(id: string): Promise<Project> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Project> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }

  async createProject(data: CreateProjectData): Promise<Project> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Project> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async updateProject(id: string, data: UpdateProjectData): Promise<Project> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Project> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async addMember(projectId: string, userId: string, role: string = 'Team Member'): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/members`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ user_id: userId, role: role })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: ApiResponse<any> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  }

  async removeMember(projectId: string, userId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/members/${userId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getMembers(projectId: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/members`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: ApiResponse<any[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getProjectStats(projectId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: ApiResponse<any> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching project stats:', error);
      throw error;
    }
  }
}

export const projectService = new ProjectService();
export type { Project, CreateProjectData, UpdateProjectData };
