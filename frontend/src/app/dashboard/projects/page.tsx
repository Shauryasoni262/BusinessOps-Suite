'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, TopBar } from '@/components/layout';
import { ProjectCard } from '@/components/features/projects';
import { ProjectModal } from '@/components/modals/project';
import { useProjectSocket } from '@/contexts/ProjectSocketContext';
import { useProjects } from '@/contexts/ProjectContext';
import { type Project } from '@/services/projectService';
import styles from './page.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ProjectsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const router = useRouter();
  
  // Use cached projects from context
  const { 
    projects, 
    loading, 
    error, 
    loadProjects, 
    createProject, 
    updateProject, 
    deleteProject,
    isStale 
  } = useProjects();
  
  const { onProjectUpdate, onTaskUpdate, onMilestoneUpdate, onMemberUpdate, onFileUpdate } = useProjectSocket();

  useEffect(() => {
    console.log('🔍 Projects - Checking authentication...');
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      console.log('❌ Missing token or user data, redirecting to login');
      router.push('/auth/login');
      return;
    }

    try {
      if (userData === 'undefined' || userData === null || userData === '') {
        console.log('❌ User data is undefined/null/empty, redirecting to login');
        router.push('/auth/login');
        return;
      }
      
      const parsedUser = JSON.parse(userData);
      console.log('✅ User data parsed successfully:', parsedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error('❌ Error parsing user data:', error);
      router.push('/auth/login');
      return;
    }

    // Load projects
    loadProjects();
  }, [router]);

  // Set up real-time event listeners
  useEffect(() => {
    // Listen for project updates
    onProjectUpdate((data) => {
      console.log('📡 Real-time project update received:', data);
      loadProjects(); // Force refresh to get latest data
    });

    // Listen for task updates (affects project stats)
    onTaskUpdate((action, task) => {
      console.log(`📡 Real-time task ${action}:`, task);
      loadProjects(); // Force refresh to update project stats
    });

    // Listen for milestone updates (affects project stats)
    onMilestoneUpdate((action, milestone) => {
      console.log(`📡 Real-time milestone ${action}:`, milestone);
      loadProjects(); // Force refresh to update project stats
    });

    // Listen for member updates (affects project access)
    onMemberUpdate((action, member) => {
      console.log(`📡 Real-time member ${action}:`, member);
      loadProjects(); // Force refresh to update project access
    });

    // Listen for file updates (affects project stats)
    onFileUpdate((action, file) => {
      console.log(`📡 Real-time file ${action}:`, file);
      loadProjects(); // Force refresh to update project stats
    });
  }, [onProjectUpdate, onTaskUpdate, onMilestoneUpdate, onMemberUpdate, onFileUpdate, loadProjects]);

  // Removed loadProjects function - now using context

  const handleCreateProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleProjectSaved = async () => {
    setIsModalOpen(false);
    setEditingProject(null);
    // No need to reload - context handles updates automatically
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(projectId);
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const getFilteredProjects = () => {
    if (activeFilter === 'all') {
      return projects;
    }
    return projects.filter(project => {
      switch (activeFilter) {
        case 'active':
          return project.status === 'in_progress';
        case 'planning':
          return project.status === 'planning';
        case 'review':
          return project.status === 'review';
        case 'completed':
          return project.status === 'completed';
        default:
          return true;
      }
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.mainContent}>
          <TopBar user={user} onLogout={handleLogout} />
          <div className={styles.content}>
            <div className={styles.loading}>Loading projects...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <TopBar user={user} onLogout={handleLogout} />
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h1>Projects</h1>
              <p>Manage your projects and collaborate with your team</p>
              {!isStale && projects.length > 0 && (
                <div className={styles.cacheIndicator}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                  Cached data - fast loading
                </div>
              )}
            </div>
            <button 
              className={styles.createButton}
              onClick={handleCreateProject}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Project
            </button>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {/* Filter Tabs */}
          <div className={styles.filterTabs}>
            <button
              className={`${styles.filterTab} ${activeFilter === 'all' ? styles.active : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              All Projects
            </button>
            <button
              className={`${styles.filterTab} ${activeFilter === 'active' ? styles.active : ''}`}
              onClick={() => handleFilterChange('active')}
            >
              In Progress
            </button>
            <button
              className={`${styles.filterTab} ${activeFilter === 'planning' ? styles.active : ''}`}
              onClick={() => handleFilterChange('planning')}
            >
              Planning
            </button>
            <button
              className={`${styles.filterTab} ${activeFilter === 'review' ? styles.active : ''}`}
              onClick={() => handleFilterChange('review')}
            >
              Review
            </button>
            <button
              className={`${styles.filterTab} ${activeFilter === 'completed' ? styles.active : ''}`}
              onClick={() => handleFilterChange('completed')}
            >
              Completed
            </button>
          </div>

          {getFilteredProjects().length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3>No projects yet</h3>
              <p>Create your first project to get started with project management</p>
              <button 
                className={styles.createButton}
                onClick={handleCreateProject}
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className={styles.projectsGrid}>
              {getFilteredProjects().map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ProjectModal
          project={editingProject}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProject(null);
          }}
          onSave={handleProjectSaved}
        />
      )}
    </div>
  );
}
