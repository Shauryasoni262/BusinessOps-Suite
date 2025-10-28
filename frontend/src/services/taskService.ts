const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  assigned_to: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
  created_at: string;
  updated_at: string;
  assignee?: {
    name: string;
    email: string;
  };
  project?: {
    name: string;
    status: string;
  };
}

interface CreateTaskData {
  title: string;
  description?: string;
  assigned_to?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  assigned_to?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
}

interface TaskStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  cancelled: number;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

class TaskService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getProjectTasks(projectId: string): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Task[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching project tasks:', error);
      throw error;
    }
  }

  async getTask(taskId: string): Promise<Task> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/tasks/${taskId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Task> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  async createTask(projectId: string, data: CreateTaskData): Promise<Task> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Task> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(projectId: string, taskId: string, data: UpdateTaskData): Promise<Task> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Task> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(projectId: string, taskId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async getTaskStats(projectId: string): Promise<TaskStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<TaskStats> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching task stats:', error);
      throw error;
    }
  }

  async getUserTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/user`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Task[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      throw error;
    }
  }

  async getOverdueTasks(projectId?: string): Promise<Task[]> {
    try {
      const url = new URL(`${API_BASE_URL}/tasks/overdue`);
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

      const result: ApiResponse<Task[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
      throw error;
    }
  }
}

export const taskService = new TaskService();
export type { Task, CreateTaskData, UpdateTaskData, TaskStats };
