'use client';

import { useState, useEffect } from 'react';
import { projectService, type Project } from '@/services/projectService';
import { getInitials } from '@/utils/helpers';
import { useProjectSocket } from '@/contexts/ProjectSocketContext';
import { AddMemberModal } from '@/components/modals/project';
import styles from './MemberList.module.css';

interface MemberListProps {
  projectId: string;
  project: Project;
  onProjectUpdated: () => void;
}

interface Member {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function MemberList({ projectId, project, onProjectUpdated }: MemberListProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [removingMember, setRemovingMember] = useState<string | null>(null);

  const { onMemberUpdate } = useProjectSocket();

  // Load members
  const loadMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectMembers = await projectService.getMembers(projectId);
      setMembers(projectMembers);
    } catch (err) {
      console.error('Error loading members:', err);
      setError('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  // Load members on mount
  useEffect(() => {
    loadMembers();
  }, [projectId]);

  // Listen for real-time member updates
  useEffect(() => {
    if (!projectId) return;

    const handleMemberUpdate = (action: string, memberData: Member) => {
      console.log(`📡 Real-time member ${action}:`, memberData);
      
      if (action === 'added' && memberData.project_id === projectId) {
        setMembers(prev => [...prev, memberData]);
      } else if (action === 'removed' && memberData.project_id === projectId) {
        setMembers(prev => prev.filter(member => member.user_id !== memberData.user_id));
      }
    };

    onMemberUpdate(handleMemberUpdate);
  }, [projectId, onMemberUpdate]);

  // Handle remove member
  const handleRemoveMember = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to remove ${userName} from this project?`)) return;
    
    try {
      setRemovingMember(userId);
      await projectService.removeMember(projectId, userId);
      // Real-time update will handle the UI update
    } catch (err) {
      console.error('Error removing member:', err);
      setError('Failed to remove member');
    } finally {
      setRemovingMember(null);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
  };

  // Handle member added
  const handleMemberAdded = () => {
    loadMembers(); // Refresh the list
    handleModalClose();
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div>Loading members...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Team Members</h2>
          <p>People working on this project</p>
        </div>
        <button 
          className={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Member
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className={styles.error}>
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}

      {/* Members list */}
      {members.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3>No team members yet</h3>
          <p>Get started by adding the first member to this project.</p>
          <button 
            className={styles.addButton}
            onClick={() => setShowModal(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Member
          </button>
        </div>
      ) : (
        <div className={styles.membersList}>
          {members.map((member) => (
            <div key={member.id} className={styles.memberCard}>
              <div className={styles.memberInfo}>
                <div className={styles.memberAvatar}>
                  <span className={styles.avatarInitials}>
                    {getInitials(member.user.name)}
                  </span>
                </div>
                <div className={styles.memberDetails}>
                  <h3 className={styles.memberName}>{member.user.name}</h3>
                  <p className={styles.memberRole}>{member.role}</p>
                </div>
              </div>
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveMember(member.user_id, member.user.name)}
                disabled={removingMember === member.user_id}
                title="Remove member"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Member Modal */}
      {showModal && (
        <AddMemberModal
          projectId={projectId}
          existingMembers={members.map(m => m.user_id)}
          onClose={handleModalClose}
          onMemberAdded={handleMemberAdded}
        />
      )}
    </div>
  );
}