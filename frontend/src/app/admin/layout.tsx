'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './layout.module.css';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Users', href: '/admin/users', icon: '👥' },
  { name: 'Projects', href: '/admin/projects', icon: '📁' },
  { name: 'Finance', href: '/admin/finance', icon: '💰' },
  { name: 'Chat', href: '/admin/chat', icon: '💬' },
  { name: 'System Logs', href: '/admin/logs', icon: '📡' },
  { name: 'Admin Activity', href: '/admin/activity', icon: '🛡️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Wait for client mount to avoid SSR hydration mismatch
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;

    if (pathname === '/admin/login') {
      setIsAdmin(true);
      return;
    }

    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      router.push('/admin/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setUser(parsedUser);
      setIsAdmin(true);
    } catch {
      router.push('/admin/login');
    }
  }, [mounted, router, pathname]);

  // During SSR or before mount, render children directly (no layout chrome)
  // This prevents hydration mismatch
  if (!mounted) {
    return null;
  }

  if (isAdmin === null) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.logoSection}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.brandName}>Admin</span>
        </div>
        <nav className={styles.nav}>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navText}>{item.name}</span>
            </Link>
          ))}
          <div className={styles.separator}></div>
          <Link href="/dashboard" className={styles.navLink}>
            <span className={styles.navIcon}>🏠</span>
            <span className={styles.navText}>Main App</span>
          </Link>
        </nav>
      </aside>

      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.breadcrumb}>Admin Panel</span>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name}</span>
              <span className={styles.userRole}>Administrator</span>
            </div>
            <button onClick={handleLogout} className={styles.logoutBtn}>Sign Out</button>
          </div>
        </header>
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
