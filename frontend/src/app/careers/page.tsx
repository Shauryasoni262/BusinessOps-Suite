'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout';
import { JobCard, Job } from '@/components/features/careers/JobCard';
import { Briefcase, Search, Loader2 } from 'lucide-react';
import styles from './page.module.css';

const DEPARTMENTS = ['All', 'Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR'];

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/careers/jobs`);
      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = filter === 'All' || job.department === filter;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         job.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApply = (job: Job) => {
    console.log('Apply to job:', job.title);
    // Modal logic will be added next
  };

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.badge}>Join the Future</div>
          <h1 className={styles.title}>
            Shape the future of <br/><span>Business Operations.</span>
          </h1>
          <p className={styles.subtitle}>
            We're looking for passionate individuals to help us build the next generation 
            of AI-powered business tools.
          </p>
        </div>

        <div className={styles.filters}>
          {DEPARTMENTS.map(dept => (
            <button
              key={dept}
              className={`${styles.filterBtn} ${filter === dept ? styles.filterBtnActive : ''}`}
              onClick={() => setFilter(dept)}
            >
              {dept}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={styles.loading}>
            <Loader2 className={styles.spinner} size={40} />
          </div>
        ) : (
          <div className={styles.jobsGrid}>
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <JobCard key={job.id} job={job} onApply={handleApply} />
              ))
            ) : (
              <div className={styles.noJobs}>
                <Briefcase size={48} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
                <h3>No positions found</h3>
                <p>Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Basic Footer for Careers page (simpler than landing) */}
      <footer style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem', borderTop: '1px solid #f1f5f9' }}>
        <p>© 2026 BusinessOps Suite. All rights reserved.</p>
      </footer>
    </div>
  );
}
