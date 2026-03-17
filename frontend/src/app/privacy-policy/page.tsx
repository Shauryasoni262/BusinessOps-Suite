import { Navbar } from '@/components/layout';
import '@/components/layout/Navbar.css';
import styles from '../page.module.css';

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '2rem', color: '#1e293b' }}>Privacy Policy</h1>
        
        <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#334155' }}>
          <p>Last updated: March 16, 2026</p>
          
          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>1. Introduction</h2>
          <p>Welcome to BusinessOps Suite. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.</p>
          
          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>2. Data We Collect</h2>
          <p>We collect information that you provide directly to us, such as when you create an account, update your profile, or use our tools. This may include:</p>
          <ul>
            <li>Name and contact information</li>
            <li>Login credentials (e.g., Google OAuth data)</li>
            <li>Payment information (processed securely through third-party providers)</li>
            <li>Content you upload or generate within our tools</li>
          </ul>
          
          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>3. How We Use Your Data</h2>
          <p>We use your information to provide, maintain, and improve our services, including:</p>
          <ul>
            <li>Managing your account and providing customer support</li>
            <li>Processing transactions and sending invoices</li>
            <li>Personalizing your experience and improving platform functionality</li>
            <li>Ensuring security and preventing fraud</li>
          </ul>
          
          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>4. Data Sharing</h2>
          <p>We do not sell your personal data. We may share information with trusted third-party service providers (like payment processors or analytics tools) only to the extent necessary to provide our services.</p>
          
          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>5. Your Rights</h2>
          <p>Depending on your location, you may have rights under GDPR or other privacy laws, including the right to access, correct, or delete your personal data. Please contact us to exercise these rights.</p>
          
          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>6. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please reach out to our support team.</p>
        </div>
      </div>
    </>
  );
}
