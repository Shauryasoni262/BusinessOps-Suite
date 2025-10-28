'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout';
import styles from './google-success.module.css';

function GoogleSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    console.log('🔍 Google Success Page - Token received:', token ? 'Yes' : 'No');
    console.log('🔍 Token value:', token ? token.substring(0, 50) + '...' : 'No token');
    
    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);
      console.log('✅ Token stored in localStorage');
      
      // Fetch user profile from backend
      fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('🔍 Profile API response status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('🔍 Profile API response data:', data);
        
        if (data.success && data.data && data.data.user) {
          // Store user data in localStorage
          const userDataString = JSON.stringify(data.data.user);
          localStorage.setItem('user', userDataString);
          console.log('✅ User data stored in localStorage:', data.data.user);
          console.log('✅ User data string:', userDataString);
          
          // Redirect to dashboard after a short delay
          console.log('⏳ Redirecting to dashboard in 2 seconds...');
          setTimeout(() => {
            console.log('🚀 Redirecting to dashboard now!');
            router.push('/dashboard');
          }, 2000);
        } else {
          console.error('❌ Failed to fetch user profile:', data.message);
          console.error('❌ Response data:', data);
          router.push('/auth/login');
        }
      })
      .catch(error => {
        console.error('❌ Error fetching user profile:', error);
        router.push('/auth/login');
      });
    } else {
      // No token, redirect to login
      console.log('❌ No token found, redirecting to login');
      router.push('/auth/login');
    }
  }, [token, router]);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className={styles.title}>Login Successful!</h1>
            <p className={styles.message}>
              You have successfully logged in with Google. Redirecting to dashboard...
            </p>
            <div className={styles.spinner}></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function GoogleSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleSuccessContent />
    </Suspense>
  );
}
