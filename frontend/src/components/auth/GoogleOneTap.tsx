'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_ROUTES } from '@/lib/constants/routes';

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleOneTap() {
  const router = useRouter();
  const clientID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientID) {
      console.warn('Google Client ID is missing. Google One Tap will not be initialized.');
      return;
    }

    const loadGSIScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeOneTap;
      document.body.appendChild(script);
    };

    const initializeOneTap = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: false,
        });

        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('One Tap prompt not displayed or skipped');
          }
        });
      }
    };

    const handleCredentialResponse = async (response: any) => {
      try {
        console.log('One Tap credential received, verifying with backend...');
        
        const res = await fetch(`${API_ROUTES.BASE}/auth/one-tap`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            credential: response.credential,
          }),
        });

        const data = await res.json();

        if (data.success) {
          console.log('✅ One Tap login successful');
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          router.push('/dashboard');
        } else {
          console.error('❌ One Tap login failed:', data.message);
        }
      } catch (error) {
        console.error('❌ One Tap error:', error);
      }
    };

    // Only load if not already loaded
    if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      loadGSIScript();
    } else {
      initializeOneTap();
    }

    // Cleanup
    return () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [clientID, router]);

  return null; // This component doesn't render anything visible
}
