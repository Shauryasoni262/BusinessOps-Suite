'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, TopBar } from '@/components/layout';
import { Plus, FileText, User as UserIcon, Briefcase, CreditCard, Search } from 'lucide-react';
import { salarySlipService, SalarySlip } from '@/services/salarySlipService';
import styles from './page.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function SalarySlipsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [salarySlips, setSalarySlips] = useState<SalarySlip[]>([]);
  const router = useRouter();

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  useEffect(() => {
    if (user) {
      fetchSalarySlips();
    }
  }, [user]);

  const fetchSalarySlips = async () => {
    try {
      setLoadingData(true);
      const data = await salarySlipService.getAllSalarySlips();
      setSalarySlips(data);
    } catch (error) {
      console.error('Error fetching salary slips:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/salary-slips/${id}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.mainContent}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <TopBar user={user} onLogout={handleLogout} />
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h1>Salary Slips</h1>
              <p>Generate and manage professional employee salary slips</p>
            </div>
            <div className={styles.headerActions}>
                <button 
                  className={styles.createButton}
                  onClick={() => {
                    router.push('/dashboard/salary-slips/create');
                  }}
                >
                  <Plus size={20} />
                  Create Salary Slip
                </button>
            </div>
          </div>

          {loadingData ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading salary slips...</p>
            </div>
          ) : salarySlips.length > 0 ? (
            <div className={styles.grid}>
              {salarySlips.map((slip) => (
                <div key={slip.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.cardTitle}>{slip.month_year}</h3>
                      <p className={styles.cardSubtitle}>{slip.employee_name}</p>
                    </div>
                    <span className={`${styles.statusBadge} ${styles.statusGenerated}`}>
                      {slip.status}
                    </span>
                  </div>
                  
                  <div className={styles.cardBody}>
                    <div className={styles.infoRow}>
                      <UserIcon size={16} />
                      <span>ID: {slip.employee_id}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <Briefcase size={16} />
                      <span>{slip.designation}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <CreditCard size={16} />
                      <span style={{ fontWeight: 600 }}>Net Pay: {slip.currency || '$'}{slip.net_pay.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className={styles.cardFooter}>
                    <span className={styles.date}>
                      {new Date(slip.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                    <button 
                      className={styles.actionButton}
                      onClick={() => handleViewDetails(slip.id)}
                    >
                      <Search size={14} />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.placeholderIcon}>
                <FileText size={64} />
              </div>
              <h3>No Salary Slips Yet</h3>
              <p>Manage your payroll easily. Create your first salary slip here.</p>
              <button 
                className={styles.createButton} 
                style={{ margin: '0 auto' }}
                onClick={() => router.push('/dashboard/salary-slips/create')}
              >
                Create Salary Slip
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
