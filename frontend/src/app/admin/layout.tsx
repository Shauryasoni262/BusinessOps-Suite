'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Users, FolderKanban, Wallet,
  MessageSquare, Activity, ShieldCheck, Home, LogOut
} from 'lucide-react';
import styles from './layout.module.css';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Finance', href: '/admin/finance', icon: Wallet },
  { name: 'Chat', href: '/admin/chat', icon: MessageSquare },
  { name: 'System Logs', href: '/admin/logs', icon: Activity },
  { name: 'Audit Trail', href: '/admin/activity', icon: ShieldCheck },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

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

  if (!mounted) return null;

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
          <div className={styles.logoMark}>B</div>
          <span className={styles.brandName}>Admin</span>
        </div>
        <nav className={styles.nav}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`${styles.navLink} ${isActive ? styles.active : ''}`}>
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className={styles.separator}></div>
          <Link href="/dashboard" className={styles.navLink}>
            <Home size={18} strokeWidth={1.8} />
            <span>Main App</span>
          </Link>
        </nav>
      </aside>

      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.breadcrumb}>Admin Console</span>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name}</span>
              <span className={styles.userRole}>Administrator</span>
            </div>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
