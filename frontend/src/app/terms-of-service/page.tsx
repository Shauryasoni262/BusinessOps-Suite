import { Navbar } from '@/components/layout';
import '@/components/layout/Navbar.css';

export default function TermsOfService() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '2rem', color: '#1e293b' }}>Terms of Service</h1>
        
        <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#334155' }}>
          <p>Last updated: March 16, 2026</p>
          
          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>1. Agreement to Terms</h2>
          <p>By accessing or using BusinessOps Suite, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          
          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>2. Use of Services</h2>
          <p>You agree to use our platform only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account credentials.</p>
          
          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>3. Intellectual Property</h2>
          <p>All content and features on BusinessOps Suite, including text, graphics, logos, and software, are the property of BusinessOps Suite or its licensors and are protected by copyright and other laws.</p>
          
          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>4. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, BusinessOps Suite shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the platform.</p>
          
          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>5. Termination</h2>
          <p>We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without notice, for any reason, including breach of these Terms.</p>
          
          <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem' }}>6. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which BusinessOps Suite operates, without regard to its conflict of law provisions.</p>
        </div>
      </div>
    </>
  );
}
