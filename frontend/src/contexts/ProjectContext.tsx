'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { projectService, type Project, type CreateProjectData, type UpdateProjectData } from '@/services/projectService';

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  loadProjects: () => Promise<void>;
  createProject: (data: CreateProjectData) => Promise<Project>;
  updateProject: (id: string, data: UpdateProjectData) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
  isStale: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);
  const [isStale, setIsStale] = useState<boolean>(true);

  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;
  
  // Calculate isStale only on client side to avoid hydration mismatch
  useEffect(() => {
    if (lastFetched) {
      const checkStale = () => {
        setIsStale(Date.now() - lastFetched > CACHE_DURATION);
      };
      checkStale();
      // Check every minute
      const interval = setInterval(checkStale, 60 * 1000);
      return () => clearInterval(interval);
    } else {
      setIsStale(true);
    }
  }, [lastFetched, CACHE_DURATION]);

  const loadProjects = useCallback(async (forceRefresh = false) => {
    // Don't reload if we have fresh data and not forcing refresh
    if (!forceRefresh && projects.length > 0 && !isStale && !loading) {
      console.log('🚀 Using cached projects data');
      return;
    }

    // Check if user is authenticated
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      console.log('⚠️ No authentication token found, skipping project load');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching projects from API...');
      
      const projectsData = await projectService.getProjects();
      setProjects(projectsData);
      setLastFetched(Date.now());
      
      console.log('✅ Projects loaded successfully:', projectsData.length);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('❌ Error loading projects:', error);
      
      // If it's a 401 error, clear the invalid token and redirect to login
      if (error.message?.includes('401') || error.message?.includes('status: 401')) {
        console.log('🔐 Authentication error - clearing invalid token');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Redirect to login page
          window.location.href = '/auth/login';
        }
        setError('Authentication failed. Please login again.');
      } else {
        setError('Failed to load projects');
      }
    } finally {
      setLoading(false);
    }
  }, [projects.length, isStale, loading]);

  const createProject = useCallback(async (data: CreateProjectData): Promise<Project> => {
    try {
      const newProject = await projectService.createProject(data);
      setProjects(prev => [newProject, ...prev]);
      setLastFetched(Date.now());
      console.log('✅ Project created and added to cache');
      return newProject;
    } catch (error) {
      console.error('❌ Error creating project:', error);
      throw error;
    }
  }, []);

  const updateProject = useCallback(async (id: string, data: UpdateProjectData): Promise<Project> => {
    try {
      const updatedProject = await projectService.updateProject(id, data);
      setProjects(prev => prev.map(project => 
        project.id === id ? updatedProject : project
      ));
      setLastFetched(Date.now());
      console.log('✅ Project updated in cache');
      return updatedProject;
    } catch (error) {
      console.error('❌ Error updating project:', error);
      throw error;
    }
  }, []);

  const deleteProject = useCallback(async (id: string): Promise<void> => {
    try {
      await projectService.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      setLastFetched(Date.now());
      console.log('✅ Project deleted from cache');
    } catch (error) {
      console.error('❌ Error deleting project:', error);
      throw error;
    }
  }, []);

  const refreshProjects = useCallback(async () => {
    await loadProjects(true);
  }, [loadProjects]);

  // Auto-load projects on mount if not cached and user is authenticated
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Check if user is authenticated before auto-loading
    const token = localStorage.getItem('token');
    
    if (token && projects.length === 0 && !loading) {
      loadProjects();
    }
  }, [loadProjects, projects.length, loading]);

  const value: ProjectContextType = {
    projects,
    loading,
    error,
    lastFetched,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects,
    isStale
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
