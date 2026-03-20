'use client';

import { useState, useEffect } from 'react';
import { projectService, type Project } from '@/services/projectService';
import { getInitials } from '@/utils/helpers';
import { useProjectSocket } from '@/contexts/ProjectSocketContext';
import { AddMemberModal } from '@/components/modals/project';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Shield, 
  Mail, 
  MoreVertical, 
  Search,
  AlertCircle,
  XCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
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

  useEffect(() => {
    loadMembers();
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    const handleMemberUpdate = (action: string, memberData: Member) => {
      if (action === 'added' && memberData.project_id === projectId) {
        setMembers(prev => [...prev, memberData]);
      } else if (action === 'removed' && memberData.project_id === projectId) {
        setMembers(prev => prev.filter(member => member.user_id !== memberData.user_id));
      }
    };

    onMemberUpdate(handleMemberUpdate);
  }, [projectId, onMemberUpdate]);

  const handleRemoveMember = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to remove ${userName} from this project?`)) return;
    
    try {
      setRemovingMember(userId);
      await projectService.removeMember(projectId, userId);
    } catch (err) {
      console.error('Error removing member:', err);
      setError('Failed to remove member');
    } finally {
      setRemovingMember(null);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleMemberAdded = () => {
    loadMembers();
    handleModalClose();
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader2 className={styles.spinner} size={32} />
        <span style={{ marginLeft: '1rem' }}>Loading team members...</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Team Members</h2>
          <p>Collaborating on {project.name}</p>
        </div>
        <button className={styles.addButton} onClick={() => setShowModal(true)}>
          <UserPlus size={18} />
          Add Member
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
            <XCircle size={18} />
          </button>
        </div>
      )}

      {members.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Users size={64} strokeWidth={1} color="#cbd5e1" />
          </div>
          <h3>No team members yet</h3>
          <p>Projects are better with friends. Invite your team to start collaborating.</p>
          <button className={styles.addButton} style={{ marginTop: '0.5rem' }} onClick={() => setShowModal(true)}>
            <UserPlus size={18} />
            Invite First Member
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
                    <Shield size={12} color="#94a3b8" />
                    <p className={styles.memberRole}>{member.role}</p>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveMember(member.user_id, member.user.name)}
                  disabled={removingMember === member.user_id}
                  title="Remove member"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddMemberModal
          projectId={projectId}
          onClose={handleModalClose}
          onSuccess={handleMemberAdded}
        />
      )}
    </div>
  );
}