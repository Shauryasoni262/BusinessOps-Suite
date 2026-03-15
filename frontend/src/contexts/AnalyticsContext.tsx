'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { analyticsService, type OverviewStats } from '@/services/analyticsService';

interface AnalyticsContextType {
  stats: OverviewStats | null;
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    // Check if user is authenticated
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getOverviewStats();
      setStats(data);
    } catch (err: any) {
      console.error('Error fetching analytics stats:', err);
      setError(err.message || 'Failed to fetch analytics statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  // Initial fetch on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const value: AnalyticsContextType = {
    stats,
    loading,
    error,
    refreshStats,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
