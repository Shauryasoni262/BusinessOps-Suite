'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // Redirect to home page
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left side - Brand */}
        <div className="navbar-brand">
          <Link href="/" className="brand-link">
            <img 
              src="/images/Logo/businesslogo.svg" 
              alt="BusinessOps Logo" 
              className="brand-logo"
            />
            <span>BusinessOps</span>
          </Link>
        </div>

        {/* Center - Navigation Links */}
        <div className="navbar-links">
          <Link href="#features" className="nav-link">Features</Link>
          <Link href="#pricing" className="nav-link">Pricing</Link>
          <Link href="#about" className="nav-link">About</Link>
          <Link href="#contact" className="nav-link">Contact</Link>
        </div>

        {/* Right side - Auth Buttons */}
        <div className="navbar-auth">
          {loading ? (
            <span className="auth-link">Loading...</span>
          ) : user ? (
            <>
              <span className="user-welcome">Welcome, {user.name}</span>
              <Link href="/dashboard" className="auth-link dashboard-link">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="auth-link logout-link">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="auth-link sign-in">Sign In</Link>
              <Link href="/auth/register" className="auth-link get-started">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
