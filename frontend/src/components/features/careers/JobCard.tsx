import React from 'react';
import { MapPin, Clock, Briefcase, ArrowUpRight } from 'lucide-react';
import styles from './JobCard.module.css';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  job_type: string;
  salary_range?: string;
  is_remote: boolean;
  status: string;
}

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.department}>{job.department}</span>
        {job.is_remote && <span className={styles.remoteBadge}>Remote</span>}
      </div>
      
      <h3 className={styles.title}>{job.title}</h3>
      
      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <MapPin size={14} />
          <span>{job.location}</span>
        </div>
        <div className={styles.metaItem}>
          <Clock size={14} />
          <span>{job.job_type}</span>
        </div>
        <div className={styles.metaItem}>
          <Briefcase size={14} />
          <span>{job.salary_range || 'Competitive'}</span>
        </div>
      </div>
      
      <button className={styles.applyBtn} onClick={() => onApply(job)}>
        <span>View Details & Apply</span>
        <ArrowUpRight size={16} />
      </button>
    </div>
  );
};
