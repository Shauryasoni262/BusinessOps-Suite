export interface Project {
  id: string;
  name: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: string;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled' | 'planning' | 'in_progress';
  owner_id: string;
  created_at: string;
  updated_at: string;
  members?: ProjectMember[];
  stats?: ProjectStats;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role?: string;
  joined_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ProjectStats {
  tasks: {
    total: number;
    completed: number;
    in_progress: number;
    pending: number;
  };
  milestones: {
    total: number;
    completed: number;
    pending: number;
  };
  files: number;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: string;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  status?: Project['status'];
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  deadline: string;
  status: 'pending' | 'completed' | 'overdue';
  event_type?: string;
  created_at: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type?: string;
  uploaded_by: string;
  uploaded_at: string;
}

