'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Sparkles, MapPin, Briefcase } from 'lucide-react';
import styles from './AdminJobModal.module.css';

interface AdminJobModalProps {
  job?: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (jobData: any) => void;
}

export const AdminJobModal: React.FC<AdminJobModalProps> = ({ job, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: '',
    job_type: 'Full-time',
    salary_range: '',
    description: '',
    is_remote: false,
    status: 'open'
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        department: job.department || 'Engineering',
        location: job.location || '',
        job_type: job.job_type || 'Full-time',
        salary_range: job.salary_range || '',
        description: job.description || '',
        is_remote: job.is_remote || false,
        status: job.status || 'open'
      });
    } else {
      setFormData({
        title: '',
        department: 'Engineering',
        location: '',
        job_type: 'Full-time',
        salary_range: '',
        description: '',
        is_remote: false,
        status: 'open'
      });
    }
  }, [job, isOpen]);

  const handleGenerateAI = async () => {
    if (!formData.title || !formData.department) {
      alert('Please enter a Job Title and select a Department first.');
      return;
    }

    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${apiUrl}/careers/admin/ai-gen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          department: formData.department,
          location: formData.location,
          job_type: formData.job_type,
          salary_range: formData.salary_range
        })
      });

      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, description: data.description }));
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      alert(`AI Generation failed: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <Sparkles className={styles.icon} size={20} />
            <h2>{job ? 'Edit Job Posting' : 'Post New Opening'}</h2>
          </div>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Job Title*</label>
              <input 
                type="text" 
                required 
                value={formData.title} 
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>
            
            <div className={styles.field}>
              <label>Department</label>
              <select 
                value={formData.department} 
                onChange={e => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Location*</label>
              <div className={styles.inputWithIcon}>
                <MapPin size={14} />
                <input 
                  type="text" 
                  required 
                  value={formData.location} 
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Remote, New York, London"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Job Type</label>
              <select 
                value={formData.job_type} 
                onChange={e => setFormData({ ...formData, job_type: e.target.value })}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Salary Range</label>
              <input 
                type="text" 
                value={formData.salary_range} 
                onChange={e => setFormData({ ...formData, salary_range: e.target.value })}
                placeholder="e.g. $120k - $160k"
              />
            </div>

            <div className={styles.field}>
              <label>Status</label>
              <select 
                value={formData.status} 
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="open">Open (Publicly Visible)</option>
                <option value="closed">Closed (Internal Only)</option>
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label>Job Description & Requirements*</label>
              <button 
                type="button" 
                className={styles.aiBtn} 
                onClick={handleGenerateAI}
                disabled={generating}
              >
                {generating ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                <span>{generating ? 'Generating...' : 'AI Generate'}</span>
              </button>
            </div>
            <textarea 
              required 
              rows={8}
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a detailed description of the role, responsibilities, and key requirements..."
            />
          </div>

          <div className={styles.checkboxField}>
            <input 
              type="checkbox" 
              id="is_remote"
              checked={formData.is_remote} 
              onChange={e => setFormData({ ...formData, is_remote: e.target.checked })}
            />
            <label htmlFor="is_remote">This is a fully remote position</label>
          </div>

          <div className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading} className={styles.saveBtn}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>{job ? 'Update Posting' : 'Publish Job'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
