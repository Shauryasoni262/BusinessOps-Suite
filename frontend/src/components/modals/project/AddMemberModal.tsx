'use client';

import { useState, useEffect } from 'react';
import { projectService } from '@/services/projectService';
import styles from './AddMemberModal.module.css';

interface AddMemberModalProps {
  projectId: string;
  existingMembers: string[];
  onClose: () => void;
  onMemberAdded: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AddMemberModal({ projectId, existingMembers, onClose, onMemberAdded }: AddMemberModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [role, setRole] = useState('');

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchUsers();
    } else {
      setAvailableUsers([]);
    }
  }, [searchTerm]);

  const searchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, we'll use a mock search. In a real app, you'd have a user search endpoint
      // This would typically be: GET /api/users/search?q=${searchTerm}
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        const allUsers = result.data || [];
        
        // Filter out existing members and current user
        const currentUserId = JSON.parse(localStorage.getItem('user') || '{}').id;
        const filteredUsers = allUsers.filter((user: User) => 
          !existingMembers.includes(user.id) && 
          user.id !== currentUserId &&
          (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        setAvailableUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setError('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser || !role.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      await projectService.addMember(projectId, selectedUser.id, role.trim());
      onMemberAdded();
    } catch (error) {
      console.error('Error adding member:', error);
      setError('Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <h2>Add Team Member</h2>
            <p className={styles.subtitle}>Add a new member to this project</p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="fullName" className={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={selectedUser?.name || ''}
              className={styles.input}
              placeholder="e.g., John Doe"
              readOnly
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="role" className={styles.label}>
              Role
            </label>
            <input
              type="text"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={styles.input}
              placeholder="e.g., Frontend Developer"
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="search" className={styles.label}>
              Search for users
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.input}
              placeholder="Type name or email to search..."
              disabled={loading}
            />
          </div>

          {loading && (
            <div className={styles.loading}>
              Searching users...
            </div>
          )}

          {searchTerm.length >= 2 && availableUsers.length === 0 && !loading && (
            <div className={styles.noResults}>
              No users found matching &quot;{searchTerm}&quot;
            </div>
          )}

          {availableUsers.length > 0 && (
            <div className={styles.usersList}>
              <h3>Available Users</h3>
              {availableUsers.map((user) => (
                <div
                  key={user.id}
                  className={`${styles.userItem} ${selectedUser?.id === user.id ? styles.selected : ''}`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className={styles.userAvatar}>
                    <span>{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className={styles.userInfo}>
                    <h4 className={styles.userName}>{user.name}</h4>
                    <p className={styles.userEmail}>{user.email}</p>
                    <span className={styles.userRole}>{user.role}</span>
                  </div>
                  {selectedUser?.id === user.id && (
                    <div className={styles.selectedIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

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
              type="button"
              onClick={handleAddMember}
              className={styles.addButton}
              disabled={loading || !selectedUser || !role.trim()}
            >
              {loading ? (
                <>
                  <svg className={styles.spinner} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Adding...
                </>
              ) : (
                'Add Member'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
