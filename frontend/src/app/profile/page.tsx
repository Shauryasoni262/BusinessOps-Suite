'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  company?: string;
  location?: string;
  bio?: string;
  joinDate?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    role: '',
    bio: ''
  });
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Initialize form data with user data
      setFormData({
        fullName: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '+1 (555) 123-4567',
        company: parsedUser.company || 'Tech Innovations Inc.',
        location: parsedUser.location || 'San Francisco, CA',
        role: parsedUser.role || 'Project Manager',
        bio: parsedUser.bio || 'Experienced project manager with a passion for building great products and leading high-performing teams.'
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    // Here you would typically make an API call to update the user profile
    console.log('Saving changes:', formData);
    // For now, just show an alert
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '+1 (555) 123-4567',
        company: user.company || 'Tech Innovations Inc.',
        location: user.location || 'San Francisco, CA',
        role: user.role || 'Project Manager',
        bio: user.bio || 'Experienced project manager with a passion for building great products and leading high-performing teams.'
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleProfileClick = () => {
    // Already on profile page, could scroll to top or do nothing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Header with Back Button and Profile Button */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        <button className={styles.profileButton} onClick={handleProfileClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Profile
        </button>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Page Title */}
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Profile</h1>
          <p className={styles.subtitle}>Manage your account settings and preferences</p>
        </div>

        {/* User Summary Card */}
        <div className={styles.userCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              <span className={styles.avatarInitials}>
                {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'JD'}
              </span>
              <div className={styles.cameraIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            </div>
            <div className={styles.userInfo}>
              <h2 className={styles.userName}>{user.name || 'John Doe'}</h2>
              <p className={styles.userRole}>{user.role || 'Project Manager'} at {user.company || 'Tech Innovations Inc.'}</p>
              <div className={styles.contactDetails}>
                <div className={styles.contactItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span>{user.email || 'john@example.com'}</span>
                </div>
                <div className={styles.contactItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>{user.location || 'San Francisco, CA'}</span>
                </div>
                <div className={styles.contactItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>Joined Oct 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'general' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'security' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'notifications' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'general' && (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>General Information</h3>
              <p className={styles.sectionSubtitle}>Update your personal details</p>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formColumn}>
                <div className={styles.formField}>
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="company">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formColumn}>
                <div className={styles.formField}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="role">Role</label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formField}>
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className={styles.textarea}
                rows={4}
              />
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.cancelButton} onClick={handleCancel}>
                Cancel
              </button>
              <button className={styles.saveButton} onClick={handleSaveChanges}>
                Save Changes
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Security Settings</h3>
              <p className={styles.sectionSubtitle}>Manage your account security</p>
            </div>
            <p>Security settings will be implemented here.</p>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Notification Preferences</h3>
              <p className={styles.sectionSubtitle}>Configure how you receive notifications</p>
            </div>
            <p>Notification settings will be implemented here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
