'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, TopBar } from '@/components/layout';
import Link from 'next/link';
import styles from './page.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function CompanySettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Settings State
  const [settings, setSettings] = useState({
    companyName: 'Acme Corporation',
    companyAddress: '123 Business Street, Suite 100\nSan Francisco, CA 94105',
    companyPhone: '+1 (555) 123-4567',
    companyEmail: 'contact@acme.com',
    companyWebsite: 'https://www.acme.com',
    industry: 'Technology, Healthcare, etc.',
    taxId: '12-3456789',
    foundedYear: '2020',
    hrDepartmentName: 'HR Department',
    hrContactPerson: 'Jane Smith',
    hrEmail: 'hr@acme.com',
    signatureName: 'John Doe',
    signatureTitle: 'HR Manager',
    defaultBenefits: [
      'Health Insurance (Medical, Dental, Vision)',
      '401(k) retirement plan',
      'Paid Time Off'
    ]
  });

  const [currentBenefit, setCurrentBenefit] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      const savedSettings = localStorage.getItem('companySettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error parsing data:', error);
      if (!user) router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddBenefit = () => {
    if (currentBenefit.trim() && !settings.defaultBenefits.includes(currentBenefit.trim())) {
      setSettings(prev => ({
        ...prev,
        defaultBenefits: [...prev.defaultBenefits, currentBenefit.trim()]
      }));
      setCurrentBenefit('');
    }
  };

  const handleRemoveBenefit = (benefitToRemove: string) => {
    setSettings(prev => ({
      ...prev,
      defaultBenefits: prev.defaultBenefits.filter(b => b !== benefitToRemove)
    }));
  };

  const handleReset = () => {
    const savedSettings = localStorage.getItem('companySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      window.location.reload();
    }
  };

  const handleSave = () => {
    localStorage.setItem('companySettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  if (loading || !user) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.mainContent}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <TopBar user={user} onLogout={handleLogout} />
        <div className={styles.content}>
          <div className={styles.topNavigation}>
            <Link href="/dashboard/offer-letters" className={styles.backLink}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Offer Letters</span>
            </Link>
          </div>

          <div className={styles.header}>
            <div className={styles.titleSection}>
              <div className={styles.titleIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 22h16"></path>
                  <path d="M4 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"></path>
                  <path d="M14 10h6a2 2 0 0 1 2 2v10"></path>
                  <path d="M18 10v12"></path>
                  <path d="M8 18h2"></path>
                  <path d="M8 14h2"></path>
                  <path d="M8 10h2"></path>
                  <path d="M8 6h2"></path>
                </svg>
              </div>
              <div>
                <h1>Company Settings</h1>
                <p>Configure your company information to auto-populate offer letters</p>
              </div>
            </div>
            
            <div className={styles.headerActions}>
              <button onClick={handleReset} className={styles.resetButtonOuter}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
                Reset
              </button>
              <button onClick={handleSave} className={styles.saveButtonOuter}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Changes
              </button>
            </div>
          </div>

          <div className={styles.settingsForm}>
            
            {/* Section 1: Company Information */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 22h16"></path>
                  <path d="M4 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"></path>
                </svg>
                <div>
                  <h3>Company Information</h3>
                  <p>Basic company details that will appear in offer letters</p>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 22h16"></path>
                    <path d="M4 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8"></path>
                  </svg>
                  Company Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={settings.companyName}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Company Address
                </label>
                <textarea
                  name="companyAddress"
                  value={settings.companyAddress}
                  onChange={handleInputChange}
                  className={`${styles.input} ${styles.textarea}`}
                  rows={2}
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    Company Phone
                  </label>
                  <input
                    type="text"
                    name="companyPhone"
                    value={settings.companyPhone}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Company Email <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    name="companyEmail"
                    value={settings.companyEmail}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    Company Website
                  </label>
                  <input
                    type="text"
                    name="companyWebsite"
                    value={settings.companyWebsite}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Industry
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={settings.industry}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Tax ID / EIN
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={settings.taxId}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Founded Year
                  </label>
                  <input
                    type="text"
                    name="foundedYear"
                    value={settings.foundedYear}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: HR Department Information */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <div>
                  <h3>HR Department Information</h3>
                  <p>Human resources contact details for offer letters</p>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  HR Department Name
                </label>
                <input
                  type="text"
                  name="hrDepartmentName"
                  value={settings.hrDepartmentName}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    HR Contact Person
                  </label>
                  <input
                    type="text"
                    name="hrContactPerson"
                    value={settings.hrContactPerson}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    HR Email
                  </label>
                  <input
                    type="email"
                    name="hrEmail"
                    value={settings.hrEmail}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Offer Letter Signature */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <div>
                  <h3>Offer Letter Signature</h3>
                  <p>Default signature that appears at the bottom of offer letters</p>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Signature Name
                  </label>
                  <input
                    type="text"
                    name="signatureName"
                    value={settings.signatureName}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Signature Title
                  </label>
                  <input
                    type="text"
                    name="signatureTitle"
                    value={settings.signatureTitle}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.signaturePreview}>
                <p className={styles.previewLabel}>Preview:</p>
                <div className={styles.signatureBox}>
                  <p>Sincerely,</p>
                  <div className={styles.signatureLine}></div>
                  <p className={styles.sigName}>[{settings.signatureName || 'Signature Name'}]</p>
                  <p className={styles.sigTitle}>{settings.signatureTitle || 'Signature Title'}</p>
                </div>
              </div>
            </div>

            {/* Section 4: Default Benefits Package */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                <div>
                  <h3>Default Benefits Package</h3>
                  <p>Standard benefits that will be pre-filled when creating new offer letters</p>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Enter a benefit"
                  value={currentBenefit}
                  onChange={(e) => setCurrentBenefit(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
                  className={styles.input}
                />
                <button type="button" onClick={handleAddBenefit} className={styles.addButton}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add
                </button>
              </div>

              {settings.defaultBenefits.length > 0 && (
                <div className={styles.benefitList}>
                  {settings.defaultBenefits.map((benefit, index) => (
                    <div key={index} className={styles.benefitListItem}>
                      <span className={styles.benefitText}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {benefit}
                      </span>
                      <button type="button" onClick={() => handleRemoveBenefit(benefit)} className={styles.removeBtn}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className={styles.footerSection}>
              <div className={styles.infoBox}>
                <div className={styles.infoIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div className={styles.infoContent}>
                  <h4>How This Works</h4>
                  <p>Once you save your company settings, this information will automatically pre-populate when creating new offer letters. You can still modify any field on a per-letter basis. This saves time and ensures consistency across all your offer letters.</p>
                </div>
              </div>

              <div className={styles.bottomActions}>
                <button onClick={handleReset} className={styles.resetButtonBottom}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                    <path d="M3 3v5h5"></path>
                  </svg>
                  Reset to Default
                </button>
                <button onClick={handleSave} className={styles.saveButtonBottom}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Save Company Settings
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
