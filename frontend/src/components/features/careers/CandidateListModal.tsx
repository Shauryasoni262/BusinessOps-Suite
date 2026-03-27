import React, { useState, useEffect } from 'react';
import { X, FileText, Mail, Phone, ExternalLink, RefreshCw, CheckCircle, Clock, XCircle } from 'lucide-react';
import styles from './CandidateListModal.module.css';

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  resume_url: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
  created_at: string;
}

interface CandidateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string | null;
  jobTitle: string | null;
}

export const CandidateListModal: React.FC<CandidateListModalProps> = ({ 
  isOpen, 
  onClose, 
  jobId, 
  jobTitle 
}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && jobId) {
      fetchApplications();
    }
  }, [isOpen, jobId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${apiUrl}/careers/admin/jobs/${jobId}/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      } else {
        setError(data.message || 'Failed to fetch applications');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${apiUrl}/careers/admin/applications/${appId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      if (data.success) {
        setApplications(apps => apps.map(app => 
          app.id === appId ? { ...app, status: status as any } : app
        ));
      }
    } catch (err) {
      alert('Update failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <h3>Candidates for {jobTitle}</h3>
            <p>{applications.length} applications received</p>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>
              <RefreshCw className="animate-spin" size={24} />
              <span>Fetching talent data...</span>
            </div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : applications.length === 0 ? (
            <div className={styles.empty}>
              <Clock size={48} opacity={0.2} />
              <p>No applications found for this role yet.</p>
            </div>
          ) : (
            <div className={styles.list}>
              {applications.map(app => (
                <div key={app.id} className={styles.candidateCard}>
                  <div className={styles.candidateInfo}>
                    <h4>{app.full_name}</h4>
                    <div className={styles.contacts}>
                      <span><Mail size={14} /> {app.email}</span>
                      <span><Phone size={14} /> {app.phone}</span>
                    </div>
                    <span className={styles.date}>Applied on {new Date(app.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className={styles.actions}>
                    <div className={styles.statusBadge} data-status={app.status}>
                      {app.status}
                    </div>
                    
                    <a 
                      href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${app.resume_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.resumeBtn}
                    >
                      <FileText size={16} />
                      <span>View Resume</span>
                    </a>

                    <div className={styles.statusButtons}>
                      <button onClick={() => updateStatus(app.id, 'shortlisted')} title="Shortlist">
                        <CheckCircle size={14} color="#10b981" />
                      </button>
                      <button onClick={() => updateStatus(app.id, 'rejected')} title="Reject">
                        <XCircle size={14} color="#f43f5e" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
