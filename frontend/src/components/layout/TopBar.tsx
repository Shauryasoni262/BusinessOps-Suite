'use client';

import { useState } from 'react';
import styles from './TopBar.module.css';
import { Search, Bell, LogOut } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface TopBarProps {
  user: User | null;
  onLogout: () => void;
}

export default function TopBar({ user, onLogout }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={styles.topBar}>
      <div className={styles.topBarContent}>
        {/* Search Bar */}
        <form onSubmit={handleSearch} className={styles.searchContainer}>
          <div className={styles.searchInput}>
            <Search 
              className={styles.searchIcon} 
              size={18} 
              strokeWidth={2}
            />
            <input
              type="text"
              placeholder="Search projects, tasks, or chat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchField}
            />
          </div>
        </form>

        {/* Right Side - Notifications, User Profile, Logout */}
        <div className={styles.rightSection}>
          {/* Notifications */}
          <div className={styles.notifications}>
            <button className={styles.notificationButton}>
              <Bell size={20} />
              <span className={styles.notificationBadge}></span>
            </button>
          </div>

          {/* User Profile */}
          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              {getInitials(user?.name)}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user?.name || 'Guest User'}</div>
              <div className={styles.userEmail}>{user?.email || 'No email'}</div>
            </div>
          </div>

          {/* Logout Button */}
          <button onClick={onLogout} className={styles.logoutButton}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
