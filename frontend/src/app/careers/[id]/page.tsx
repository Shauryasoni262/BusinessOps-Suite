'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Briefcase, DollarSign, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout';
import styles from './JobDetails.module.css';

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    resume: null as File | null
  });

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/careers/jobs/${id}`);
      const data = await response.json();
      if (data.success) {
        setJob(data.job);
      } else {
        router.push('/careers');
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resume: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resume) {
      alert('Please upload your resume');
      return;
    }

    setSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const submitData = new FormData();
      submitData.append('full_name', formData.full_name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('resume', formData.resume);

      const response = await fetch(`${apiUrl}/careers/jobs/${id}/apply`, {
        method: 'POST',
        body: submitData
      });

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.loadingState}>
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.mainWrapper}>
        <Link href="/careers" className={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>Back to Openings</span>
        </Link>

        <div className={styles.layout}>
          <div className={styles.content}>
            <div className={styles.header}>
              <span className={styles.typeBadge}>{job.job_type}</span>
              <h1 className={styles.title}>{job.title}</h1>
              
              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <label>Salary/Incentive</label>
                  <span className={styles.salary}>
                    <DollarSign size={18} />
                    {job.salary_range || 'Competitive'}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <label>Location</label>
                  <span>
                    <MapPin size={18} />
                    {job.is_remote ? 'Remote' : job.location}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <label>Department</label>
                  <span>
                    <Briefcase size={18} />
                    {job.department}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.description}>
              <h2>About the Role</h2>
              <div dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br/>') }} />
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.formCard}>
              {submitted ? (
                <div className={styles.successState}>
                  <CheckCircle className={styles.successIcon} size={64} />
                  <h3>Application Sent!</h3>
                  <p className="text-slate-500">
                    Thanks for your interest in joining BusinessOps Suite. 
                    Our recruitment team will review your profile and get back to you soon.
                  </p>
                  <button 
                    className={styles.submitBtn} 
                    onClick={() => router.push('/careers')}
                    style={{ marginTop: '2rem' }}
                  >
                    Explore More Roles
                  </button>
                </div>
              ) : (
                <>
                  <h3>Apply for this Position</h3>
                  <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                      <label>Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. John Doe"
                        value={formData.full_name}
                        onChange={e => setFormData({...formData, full_name: e.target.value})}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Resume/CV File *</label>
                      <label className={styles.fileInput}>
                        <input 
                          type="file" 
                          required
                          accept=".pdf,.doc,.docx" 
                          onChange={handleFileChange}
                        />
                        <div className={styles.fileInfo}>
                          <Upload size={24} />
                          <span>{formData.resume ? formData.resume.name : 'Choose file or drag here'}</span>
                          <p className="text-xs text-slate-400">PDF, DOC, DOCX up to 10MB</p>
                        </div>
                      </label>
                    </div>

                    <button 
                      type="submit" 
                      className={styles.submitBtn}
                      disabled={submitting}
                    >
                      {submitting ? <Loader2 className="animate-spin" size={20} /> : null}
                      <span>{submitting ? 'Sending Application...' : 'Submit Application'}</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem', borderTop: '1px solid #f1f5f9', background: 'white' }}>
        <p>© 2026 BusinessOps Suite. All rights reserved.</p>
      </footer>
    </div>
  );
}
