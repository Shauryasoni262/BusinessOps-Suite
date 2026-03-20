'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './Sidebar.module.css';

import { 
  LayoutDashboard, 
  FolderKanban, 
  Mail, 
  MessageSquare, 
  CreditCard, 
  BarChart3, 
  Sparkles, 
  User, 
  Settings, 
  Wrench, 
  FileSearch,
  ChevronDown
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navigationItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Projects', href: '/dashboard/projects', icon: <FolderKanban size={20} /> },
  { name: 'Offer Letters', href: '/dashboard/offer-letters', icon: <Mail size={20} /> },
  { name: 'Chat', href: '/dashboard/chat', icon: <MessageSquare size={20} /> },
  { name: 'Payments', href: '/dashboard/payments', icon: <CreditCard size={20} /> },
  { name: 'Analytics', href: '/dashboard/analytics', icon: <BarChart3 size={20} /> },
  { name: 'AI Assistant', href: '/dashboard/ai-assistant', icon: <Sparkles size={20} /> },
];

const bottomNavigationItems: NavItem[] = [
  { name: 'Profile', href: '/profile', icon: <User size={20} /> },
  { name: 'Settings', href: '/settings', icon: <Settings size={20} /> },
];

const toolsItems: NavItem[] = [
  { name: 'Resume Analyzer', href: '/dashboard/tools/resume-analyzer', icon: <FileSearch size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isToolsExpanded, setIsToolsExpanded] = useState(false);
  
  const isToolsActive = pathname.startsWith('/dashboard/tools');

  return (
    <div className={styles.sidebar}>
      {/* Logo Section */}
      <div className={styles.logoSection}>
        <div className={styles.logoIcon}>
          <Sparkles size={24} className={styles.sparkleIcon} />
        </div>
        <span className={styles.brandName}>BusinessOps</span>
      </div>

      {/* Main Navigation */}
      <nav className={styles.navigation}>
        {navigationItems.map((item) => {
          let isActive = pathname === item.href;
          if (item.name === 'Projects') {
            isActive = pathname === item.href || pathname.startsWith('/dashboard/projects/');
          }
          if (item.name === 'Offer Letters') {
            isActive = pathname === item.href || pathname.startsWith('/dashboard/offer-letters/');
          }
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navText}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Tools & Utilities Section */}
      <div className={styles.toolsSection}>
        <div 
          className={`${styles.toolsHeader} ${isToolsActive ? styles.active : ''}`}
          onClick={() => setIsToolsExpanded(!isToolsExpanded)}
        >
          <span className={styles.toolsHeaderIcon}><Wrench size={20} /></span>
          <span className={styles.toolsHeaderText}>Tools & Utilities</span>
          <span className={`${styles.expandIcon} ${(isToolsExpanded || isToolsActive) ? styles.expanded : ''}`}>
            <ChevronDown size={16} />
          </span>
        </div>
        
        <div className={`${styles.toolsContent} ${(isToolsExpanded || isToolsActive) ? styles.expanded : ''}`}>
          {toolsItems.map((item) => {
            let isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${styles.toolItem} ${isActive ? styles.active : ''}`}
              >
                <span className={styles.toolIcon}>{item.icon}</span>
                <span className={styles.toolText}>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className={styles.bottomNavigation}>
        {bottomNavigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navText}>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
