'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout';
import { API_ROUTES } from '@/lib/constants/routes';
import '@/components/layout/Navbar.css';
import styles from './page.module.css';
import GoogleOneTap from '@/components/auth/GoogleOneTap';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_ROUTES.BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Attempting ${provider} login...`);
    
    if (provider.toLowerCase() === 'google') {
      // Redirect to Google OAuth
      console.log('Redirecting to Google OAuth...');
      window.location.href = `${API_ROUTES.BASE}/auth/google`;
    } else {
      console.log(`Unknown provider: ${provider}`);
    }
  };

  return (
    <>
      <Navbar />
      <GoogleOneTap />
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Header Section */}
          <div className={styles.header}>
            <div className={styles.logo}>
              <span className={styles.logoText}>BusinessOps</span>
            </div>
            <h1 className={styles.title}>Create Account</h1>
            <p className={styles.subtitle}>Get started with your free account</p>
          </div>

          {/* Register Form Card */}
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}

              {/* Full Name Field */}
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>
                  Full Name
                </label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address
                </label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="16" r="1"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="••••••"
                    required
                  />
                </div>
                <div className={styles.passwordHint}>
                  Must be at least 6 characters
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirm Password
                </label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="16" r="1"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="••••••"
                    required
                  />
                </div>
              </div>

              {/* Terms and Privacy Checkbox */}
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className={styles.checkbox}
                    required
                  />
                  <span className={styles.checkboxText}>
                    I agree to the{' '}
                    <Link href="/terms" className={styles.link}>
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className={styles.link}>
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={loading}
                className={styles.createAccountButton}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              {/* Separator */}
              <div className={styles.separator}>
                <span className={styles.separatorText}>Or continue with</span>
              </div>

              {/* Social Login Buttons */}
              <div className={styles.socialButtons}>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className={styles.socialButton}
                >
                  <svg className={styles.googleIcon} width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Google</span>
                </button>
              </div>
            </form>

            {/* Sign In Link */}
            <div className={styles.signInLink}>
              <span className={styles.signInText}>Already have an account? </span>
              <Link href="/auth/login" className={styles.signInButton}>
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
