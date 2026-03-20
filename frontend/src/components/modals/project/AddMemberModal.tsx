'use client';

import { useState } from 'react';
import { projectService } from '@/services/projectService';
import { X, UserPlus, Search, User, Briefcase, Mail, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import styles from './AddMemberModal.module.css';

interface AddMemberModalProps {
  projectId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddMemberModal({ projectId, onClose, onSuccess }: AddMemberModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer' as 'admin' | 'editor' | 'viewer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await projectService.addMember(projectId, email.trim(), role);
      onSuccess();
    } catch (error) {
      console.error('Error adding member:', error);
      setError('Failed to add member to project');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerTitleContainer}>
            <div className={styles.headerIcon}>
              <UserPlus size={18} />
            </div>
            <div>
              <h2 className={styles.titleText}>Invite Member</h2>
              <p className={styles.subtitle}>Collaborate with your team</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              <Mail size={14} className={styles.fieldIcon} />
              Email Address
            </label>
            <div className={styles.inputWrapper}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputWithIcon}
                placeholder="e.g., teammate@company.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="role" className={styles.label}>
              <Briefcase size={14} className={styles.fieldIcon} />
              Assignment Role
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className={styles.select}
              disabled={loading}
            >
              <option value="viewer">Viewer (Read Only)</option>
              <option value="editor">Editor (Can contribute)</option>
              <option value="admin">Admin (Full Access)</option>
            </select>
          </div>

          <div className={styles.infoBox}>
            <CheckCircle2 size={14} className={styles.infoIcon} />
            <p>Invited members will receive a notification to join the project workspace.</p>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className={styles.spinner} size={16} />
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
