'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, TopBar } from '@/components/layout';
import { DashboardStats, RecentProjects, QuickActions } from '@/components/features/dashboard';
import { useProjects } from '@/contexts/ProjectContext';
import styles from './page.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { projects } = useProjects();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      if (userData === 'undefined' || userData === null || userData === '') {
        router.push('/auth/login');
        return;
      }
      
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className={styles.dashboardLayout}>
        <Sidebar />
        <div className={styles.mainContent}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Calculate dashboard stats from projects
  const activeProjects = projects.filter(p => 
    p.status === 'in_progress' || p.status === 'planning'
  ).length;

  const totalTasks = projects.reduce((sum, p) => 
    sum + (p.stats?.tasks.total || 0), 0
  );

  const completedTasks = projects.reduce((sum, p) => 
    sum + (p.stats?.tasks.completed || 0), 0
  );

  // Get unique team members count
  const allMembers = new Set<string>();
  projects.forEach(project => {
    project.members?.forEach(member => {
      allMembers.add(member.user_id);
    });
  });

  // Format recent projects
  const recentProjects = projects.slice(0, 4).map(project => ({
    id: project.id,
    name: project.name,
    status: project.status.replace('_', ' '),
    teamMembers: project.members?.length || 0,
    progress: project.stats?.tasks.total 
      ? Math.round((project.stats.tasks.completed / project.stats.tasks.total) * 100)
      : 0
  }));

  const dashboardStats = {
    revenue: 45231,
    revenueChange: '+20.1% from last month',
    projects: activeProjects,
    projectsChange: '+12% from last month',
    teamMembers: allMembers.size || 45,
    teamChange: '+5 from last month',
    tasksCompleted: completedTasks,
    tasksChange: '-3% from last month',
    tasksChangeType: 'negative' as const
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <TopBar user={user} onLogout={handleLogout} />
        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <p className={styles.pageSubtitle}>Welcome back! Here&apos;s what&apos;s happening with your projects.</p>
          </div>

          <DashboardStats stats={dashboardStats} />
          
          <RecentProjects projects={recentProjects} />
          
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
