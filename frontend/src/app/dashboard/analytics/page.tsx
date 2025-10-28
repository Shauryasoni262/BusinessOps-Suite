'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, TopBar } from '@/components/layout';
import { OverviewCards, PerformanceMetrics } from '@/components/analytics/cards';
import { TabNavigation } from '@/components/analytics/navigation';
import { UserGrowthChart, RevenueChart, ProjectStatusChart, TeamProductivityChart } from '@/components/analytics/charts';
import { DateRangeFilter, ExportButton } from '@/components/analytics/filters';
import { analyticsService, getDateRange } from '@/services/analyticsService';
import type { OverviewStats, ProjectAnalytics, FinancialAnalytics, TeamAnalytics, PerformanceMetrics as PerfMetrics, UserGrowthData } from '@/services/analyticsService';
import styles from './page.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AnalyticsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Data states
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null);
  const [projectAnalytics, setProjectAnalytics] = useState<ProjectAnalytics | null>(null);
  const [financialAnalytics, setFinancialAnalytics] = useState<FinancialAnalytics | null>(null);
  const [teamAnalytics, setTeamAnalytics] = useState<TeamAnalytics | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerfMetrics | null>(null);
  const [userGrowth, setUserGrowth] = useState<UserGrowthData[]>([]);

  // UI states
  const [activeTab, setActiveTab] = useState('revenue');
  const [dateRange, setDateRange] = useState('6months');
  const [dataLoading, setDataLoading] = useState(false);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Load analytics data
  useEffect(() => {
    if (!user) return;

    const loadAnalyticsData = async () => {
      setDataLoading(true);
      try {
        const { startDate, endDate } = getDateRange(dateRange);

        // Load all data in parallel
        const [overview, projects, financial, team, performance, growth] = await Promise.all([
          analyticsService.getOverviewStats(),
          analyticsService.getProjectAnalytics(startDate || undefined, endDate || undefined),
          analyticsService.getFinancialAnalytics(startDate || undefined, endDate || undefined),
          analyticsService.getTeamAnalytics(startDate || undefined, endDate || undefined),
          analyticsService.getPerformanceMetrics(startDate || undefined, endDate || undefined),
          analyticsService.getUserGrowth(6)
        ]);

        setOverviewStats(overview);
        setProjectAnalytics(projects);
        setFinancialAnalytics(financial);
        setTeamAnalytics(team);
        setPerformanceMetrics(performance);
        setUserGrowth(growth);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    loadAnalyticsData();
  }, [user, dateRange]);

  const handleDateRangeChange = (preset: string) => {
    setDateRange(preset);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className={styles.dashboardLayout}>
        <Sidebar />
        <div className={styles.mainContent}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const { startDate, endDate } = getDateRange(dateRange);

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <TopBar user={user} onLogout={handleLogout} />
        <div className={styles.content}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Analytics</h1>
              <p className={styles.pageSubtitle}>
                Visualize your business performance and insights
              </p>
            </div>
            <div className={styles.headerActions}>
              <DateRangeFilter value={dateRange} onChange={handleDateRangeChange} />
              <ExportButton 
                type={activeTab} 
                startDate={startDate || undefined} 
                endDate={endDate || undefined} 
              />
            </div>
          </div>

          {/* Overview Cards */}
          {overviewStats && !dataLoading && (
            <OverviewCards stats={overviewStats} />
          )}

          {dataLoading && (
            <div className={styles.dataLoading}>
              <div className={styles.spinner}></div>
              <p>Updating analytics...</p>
            </div>
          )}

          {/* Tab Navigation */}
          <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

          {/* Tab Content */}
          {!dataLoading && (
            <>
              {/* Revenue Tab */}
              {activeTab === 'revenue' && financialAnalytics && (
                <div className={styles.tabContent}>
                  <RevenueChart data={financialAnalytics.revenueData} />
                  
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <h4>Total Revenue</h4>
                      <p className={styles.statValue}>
                        ${financialAnalytics.summary.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className={styles.statCard}>
                      <h4>Pending Amount</h4>
                      <p className={styles.statValue}>
                        ${financialAnalytics.summary.pendingAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className={styles.statCard}>
                      <h4>Total Invoices</h4>
                      <p className={styles.statValue}>
                        {financialAnalytics.summary.totalInvoices}
                      </p>
                    </div>
                    <div className={styles.statCard}>
                      <h4>Paid Invoices</h4>
                      <p className={styles.statValue}>
                        {financialAnalytics.summary.paidInvoices}
                      </p>
                    </div>
                  </div>

                  {financialAnalytics.topClients.length > 0 && (
                    <div className={styles.topClients}>
                      <h3>Top Clients</h3>
                      <div className={styles.clientsList}>
                        {financialAnalytics.topClients.map((client, index) => (
                          <div key={index} className={styles.clientItem}>
                            <span className={styles.clientName}>{client.name}</span>
                            <span className={styles.clientRevenue}>
                              ${client.revenue.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && userGrowth.length > 0 && (
                <div className={styles.tabContent}>
                  <UserGrowthChart data={userGrowth} />
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && projectAnalytics && (
                <div className={styles.tabContent}>
                  <ProjectStatusChart data={projectAnalytics.statusDistribution} />
                  
                  {teamAnalytics && teamAnalytics.productivity.length > 0 && (
                    <TeamProductivityChart data={teamAnalytics.productivity} />
                  )}

                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <h4>Total Projects</h4>
                      <p className={styles.statValue}>
                        {projectAnalytics.summary.totalProjects}
                      </p>
                    </div>
                    <div className={styles.statCard}>
                      <h4>Completion Rate</h4>
                      <p className={styles.statValue}>
                        {projectAnalytics.summary.completionRate}%
                      </p>
                    </div>
                    <div className={styles.statCard}>
                      <h4>Avg Duration</h4>
                      <p className={styles.statValue}>
                        {projectAnalytics.summary.avgDuration.toFixed(1)} days
                      </p>
                    </div>
                    <div className={styles.statCard}>
                      <h4>On-Time Rate</h4>
                      <p className={styles.statValue}>
                        {projectAnalytics.summary.onTimeRate}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === 'performance' && performanceMetrics && (
                <div className={styles.tabContent}>
                  <PerformanceMetrics data={performanceMetrics} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

