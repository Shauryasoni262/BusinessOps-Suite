'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar, TopBar } from '@/components/layout';
import styles from './page.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

type Step = 'basic' | 'job' | 'template';

export default function CreateOfferLetterPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const router = useRouter();

  // Form data
  const [formData, setFormData] = useState({
    offerTitle: '',
    candidateName: '',
    candidateEmail: '',
    resume: null as File | null,
  });

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
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        resume: e.target.files![0],
      }));
    }
  };

  const handleNext = () => {
    if (currentStep === 'basic') {
      setCurrentStep('job');
    } else if (currentStep === 'job') {
      setCurrentStep('template');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/offer-letters');
  };

  if (loading) {
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

  if (!user) {
    return null;
  }

  const steps = [
    { id: 'basic', label: 'Basic Information', icon: '👤' },
    { id: 'job', label: 'Job Details', icon: '💼' },
    { id: 'template', label: 'Template & Preview', icon: '📄' },
  ];

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <TopBar user={user} onLogout={handleLogout} />
        <div className={styles.content}>
          {/* Back Button */}
          <Link href="/dashboard/offer-letters" className={styles.backLink}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Offer Letters
          </Link>

          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div className={styles.headerIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            <div className={styles.headerText}>
              <h1>Create Offer Letter</h1>
              <p>Follow the steps to generate a professional offer letter</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className={styles.stepsContainer}>
            {steps.map((step, index) => (
              <div key={step.id} className={styles.stepItem}>
                <div
                  className={`${styles.stepCircle} ${
                    currentStep === step.id
                      ? styles.stepActive
                      : steps.findIndex(s => s.id === currentStep) > index
                      ? styles.stepCompleted
                      : ''
                  }`}
                >
                  {steps.findIndex(s => s.id === currentStep) > index ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <span>{step.icon}</span>
                  )}
                </div>
                <span
                  className={`${styles.stepLabel} ${
                    currentStep === step.id ? styles.stepLabelActive : ''
                  }`}
                >
                  {step.label}
                </span>
                {index < steps.length - 1 && <div className={styles.stepLine} />}
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className={styles.formContainer}>
            {currentStep === 'basic' && (
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <h2>Candidate Information</h2>
                    <p>Enter basic details about the candidate</p>
                  </div>
                </div>

                <div className={styles.formFields}>
                  <div className={styles.formField}>
                    <label htmlFor="offerTitle">
                      Offer Title <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="offerTitle"
                      name="offerTitle"
                      placeholder="e.g., Senior Software Engineer Offer - John Smith"
                      value={formData.offerTitle}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                    <span className={styles.helperText}>A descriptive title for internal tracking</span>
                  </div>

                  <div className={styles.formField}>
                    <label htmlFor="candidateName">
                      Candidate Full Name <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="candidateName"
                      name="candidateName"
                      placeholder="e.g., John Doe"
                      value={formData.candidateName}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formField}>
                    <label htmlFor="candidateEmail">
                      Candidate Email <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="email"
                      id="candidateEmail"
                      name="candidateEmail"
                      placeholder="e.g., john.doe@email.com"
                      value={formData.candidateEmail}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formField}>
                    <label htmlFor="resume" className={styles.fileLabel}>
                      <div className={styles.fileLabelContent}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <span>Upload Resume (Optional)</span>
                      </div>
                      <span className={styles.helperText}>AI can extract candidate details from resume</span>
                    </label>
                    <div className={styles.fileUploadContainer}>
                      <input
                        type="file"
                        id="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className={styles.fileInput}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('resume')?.click()}
                        className={styles.uploadButton}
                      >
                        Upload
                      </button>
                    </div>
                    {formData.resume && (
                      <span className={styles.fileName}>{formData.resume.name}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'job' && (
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                  </div>
                  <div>
                    <h2>Job Details</h2>
                    <p>Enter job information and compensation details</p>
                  </div>
                </div>
                <div className={styles.placeholderSection}>
                  <p>Job Details form will be implemented here</p>
                </div>
              </div>
            )}

            {currentStep === 'template' && (
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                  </div>
                  <div>
                    <h2>Template & Preview</h2>
                    <p>Select a template and preview your offer letter</p>
                  </div>
                </div>
                <div className={styles.placeholderSection}>
                  <p>Template & Preview section will be implemented here</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNext}
                className={styles.nextButton}
                disabled={currentStep === 'template'}
              >
                {currentStep === 'template' ? 'Generate Offer Letter' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

