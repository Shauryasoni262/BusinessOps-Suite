'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar, TopBar } from '@/components/layout';
import { ProjectDetails } from '@/components/features/projects';
import { projectService, type Project } from '@/services/projectService';
import styles from './page.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ProjectDetailPage() {
  const [user, setUser] = useState<User | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  useEffect(() => {
    console.log('🔍 Project Detail - Checking authentication...');
    
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

    // Load project
    if (projectId) {
      loadProject();
    }
  }, [router, projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const projectData = await projectService.getProject(projectId);
      setProject(projectData);
    } catch (error) {
      console.error('Error loading project:', error);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectUpdated = async () => {
    await loadProject();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.mainContent}>
          <TopBar user={user} onLogout={handleLogout} />
          <div className={styles.content}>
            <div className={styles.loading}>Loading project...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (error || !project) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.mainContent}>
          <TopBar user={user} onLogout={handleLogout} />
          <div className={styles.content}>
            <div className={styles.error}>
              <h2>Project Not Found</h2>
              <p>{error || 'The project you are looking for does not exist or you do not have access to it.'}</p>
              <button 
                className={styles.backButton}
                onClick={() => router.push('/dashboard/projects')}
              >
                Back to Projects
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <TopBar user={user} onLogout={handleLogout} />
        <div className={styles.content}>
          <ProjectDetails 
            project={project} 
            onProjectUpdated={handleProjectUpdated}
          />
        </div>
      </div>
    </div>
  );
}
