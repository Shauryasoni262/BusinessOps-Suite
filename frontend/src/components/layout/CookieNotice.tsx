'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-notice-container" style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      pointerEvents: 'none'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        pointerEvents: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <div style={{
            backgroundColor: '#eff6ff',
            color: '#3b82f6',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            🍪
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>We value your privacy</h4>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#64748b', lineHeight: '1.5' }}>
              We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies. Read our <Link href="/privacy-policy" style={{ color: '#3b82f6', textDecoration: 'none' }}>Privacy Policy</Link>.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', justifySelf: 'flex-end' }}>
          <button 
            onClick={() => setIsVisible(false)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#64748b',
              cursor: 'pointer',
              flex: 1
            }}
          >
            Decline
          </button>
          <button 
            onClick={acceptCookies}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              backgroundColor: '#0f172a',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              flex: 1
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
