'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, RefreshCw, 
  Briefcase, MapPin, Search, ExternalLink, Users 
} from 'lucide-react';
import { Job } from '@/components/features/careers/JobCard';
import { AdminJobModal } from '@/components/features/careers/AdminJobModal';
import { CandidateListModal } from '@/components/features/careers/CandidateListModal';
import styles from './page.module.css';

export default function AdminCareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedJob, setSelectedJob] = useState<{id: string, title: string} | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${apiUrl}/careers/admin/list`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs);
      } else {
        setError(data.message || 'Failed to fetch jobs');
      }
    } catch (err) {
      setError('An error occurred while connecting to the server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (jobData: any) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const endpoint = editingJob 
        ? `${apiUrl}/careers/admin/update/${editingJob.id}`
        : `${apiUrl}/careers/admin/create`;
      
      const method = editingJob ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });
      
      const data = await response.json();
      if (data.success) {
        fetchJobs();
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      alert(`Operation failed: ${err.message}`);
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleViewCandidates = (job: Job) => {
    setSelectedJob({ id: job.id, title: job.title });
    setIsCandidateModalOpen(true);
  };

  const handleCreate = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${apiUrl}/careers/admin/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setJobs(jobs.filter(j => j.id !== id));
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Job Postings</h1>
          <p className={styles.subtitle}>Manage careers and openings for BusinessOps Suite</p>
        </div>
        
        <div className={styles.actions}>
          <button className={styles.actionIcon} onClick={fetchJobs} title="Refresh List" style={{ background: '#111827' }}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className={styles.createBtn} onClick={handleCreate}>
            <Plus size={18} />
            <span>Post New Job</span>
          </button>
        </div>
      </div>

      {error && <div style={{ color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Job Opening</th>
              <th>Department</th>
              <th>Type</th>
              <th>Status</th>
              <th>Applicants</th>
              <th>Posted On</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', color: '#64748b' }}>
                    <RefreshCw size={20} className="animate-spin" />
                    <span>Syncing neural talent pool...</span>
                  </div>
                </td>
              </tr>
            ) : jobs.length > 0 ? (
              jobs.map(job => (
                <tr key={job.id}>
                  <td>
                    <div className={styles.jobInfo}>
                      <span className={styles.jobTitle}>{job.title}</span>
                      <span className={styles.jobId}>{job.id?.slice(0, 8)}...</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.badge} style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#60a5fa' }}>{job.department}</span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.typeBadge}`}>{job.job_type}</span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${job.status === 'open' ? styles.statusOpen : styles.statusClosed}`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={styles.viewAppsBtn}
                      onClick={() => handleViewCandidates(job)}
                    >
                      <Users size={14} />
                      <span>View Candidates</span>
                    </button>
                  </td>
                  <td>
                    <span style={{ color: '#475569', fontSize: '0.75rem' }}>
                      {/* @ts-ignore */}
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className={styles.rowActions} style={{ justifyContent: 'flex-end' }}>
                      <button className={styles.actionIcon} title="Edit Posting" onClick={() => handleEdit(job)}>
                        <Edit2 size={14} />
                      </button>
                      <button 
                        className={`${styles.actionIcon} ${styles.deleteIcon}`} 
                        title="Delete Posting"
                        onClick={() => handleDelete(job.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                      <a href={`/careers`} target="_blank" className={styles.actionIcon} title="View Live">
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '4rem', color: '#475569' }}>
                  <Briefcase size={32} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                  <p>No job postings found. Click "Post New Job" to start.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminJobModal 
        isOpen={isModalOpen}
        job={editingJob}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <CandidateListModal 
        isOpen={isCandidateModalOpen}
        jobId={selectedJob?.id || null}
        jobTitle={selectedJob?.title || null}
        onClose={() => setIsCandidateModalOpen(false)}
      />
    </div>
  );
}
