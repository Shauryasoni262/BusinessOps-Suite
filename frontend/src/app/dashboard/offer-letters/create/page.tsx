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

  const [formData, setFormData] = useState({
    offerTitle: '',
    candidateName: '',
    candidateEmail: '',
    resume: null as File | null,
    jobTitle: '',
    department: '',
    compensation: '',
    employmentType: 'Full-time',
    startDate: '',
    workLocation: '',
    reportsTo: '',
    benefits: [] as string[],
    additionalTerms: '',
    enableAiAssistance: false,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkboxes
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddBenefit = () => {
    if (currentBenefit.trim() && !formData.benefits.includes(currentBenefit.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, currentBenefit.trim()]
      }));
      setCurrentBenefit('');
    }
  };

  const handleRemoveBenefit = (benefitToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(b => b !== benefitToRemove)
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

  const handlePrevious = () => {
    if (currentStep === 'job') {
      setCurrentStep('basic');
    } else if (currentStep === 'template') {
      setCurrentStep('job');
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
    { 
      id: 'basic', 
      label: 'Basic Information', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    },
    { 
      id: 'job', 
      label: 'Job Details', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      )
    },
    { 
      id: 'template', 
      label: 'Template & Preview', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      )
    },
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
                    step.icon
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

                  <div className={styles.formRow}>
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
                  </div>

                  <div className={styles.uploadArea}>
                    <div className={styles.uploadInfo}>
                      <div className={styles.uploadHeader}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <span>Upload Resume (Optional)</span>
                      </div>
                      <span className={styles.uploadHelper}>AI can extract candidate details from resume</span>
                      {formData.resume && (
                        <span className={styles.fileName}>{formData.resume.name}</span>
                      )}
                    </div>
                    
                    <div className={styles.uploadAction}>
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
                        className={styles.uploadButtonDashed}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'job' && (
              <div className={styles.jobDetailsContainer}>
                {/* Section 1: Position & Compensation */}
                <div className={styles.formCard}>
                  <div className={styles.cardHeader}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                    <div>
                      <h3>Position & Compensation</h3>
                      <p>Define the role and compensation details</p>
                    </div>
                  </div>

                  <div className={styles.formFields}>
                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label htmlFor="jobTitle">
                          Job Title <span className={styles.required}>*</span>
                        </label>
                        <input
                          type="text"
                          id="jobTitle"
                          name="jobTitle"
                          placeholder="Software Engineer"
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                          className={styles.input}
                          required
                        />
                      </div>

                      <div className={styles.formField}>
                        <label htmlFor="department">
                          Department <span className={styles.required}>*</span>
                        </label>
                        <input
                          type="text"
                          id="department"
                          name="department"
                          placeholder="Engineering"
                          value={formData.department}
                          onChange={handleInputChange}
                          className={styles.input}
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label htmlFor="compensation">
                          Compensation <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.inputWithIcon}>
                          <span className={styles.inputIcon}>$</span>
                          <input
                            type="text"
                            id="compensation"
                            name="compensation"
                            placeholder="$100,000 per year or $50/hour"
                            value={formData.compensation}
                            onChange={handleInputChange}
                            className={`${styles.input} ${styles.hasIcon}`}
                            required
                          />
                        </div>
                      </div>

                      <div className={styles.formField}>
                        <label htmlFor="employmentType">Employment Type</label>
                        <select
                          id="employmentType"
                          name="employmentType"
                          value={formData.employmentType}
                          onChange={handleInputChange}
                          className={styles.input}
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <label htmlFor="startDate">
                          Start Date <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.inputWithIcon}>
                          <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className={`${styles.input} ${styles.hasIconRight}`}
                            required
                          />
                        </div>
                      </div>

                      <div className={styles.formField}>
                        <label htmlFor="workLocation">Work Location</label>
                        <div className={styles.inputWithIcon}>
                          <span className={styles.inputIcon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                          </span>
                          <input
                            type="text"
                            id="workLocation"
                            name="workLocation"
                            placeholder="San Francisco, CA or Remote"
                            value={formData.workLocation}
                            onChange={handleInputChange}
                            className={`${styles.input} ${styles.hasIcon}`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.formField}>
                      <label htmlFor="reportsTo">Reports To</label>
                      <input
                        type="text"
                        id="reportsTo"
                        name="reportsTo"
                        placeholder="Jane Smith, Engineering Manager"
                        value={formData.reportsTo}
                        onChange={handleInputChange}
                        className={styles.input}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Benefits & Perks */}
                <div className={styles.formCard}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3>Benefits & Perks</h3>
                      <p>Add benefits included in this offer</p>
                    </div>
                  </div>

                  <div className={styles.formFields}>
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

                    {formData.benefits.length > 0 && (
                      <div className={styles.benefitChips}>
                        {formData.benefits.map((benefit, index) => (
                          <span key={index} className={styles.benefitChip}>
                            {benefit}
                            <button type="button" onClick={() => handleRemoveBenefit(benefit)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 3: Additional Terms */}
                <div className={styles.formCard}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3>Additional Terms</h3>
                      <p>Any special conditions or notes</p>
                    </div>
                  </div>

                  <div className={styles.formFields}>
                    <textarea
                      name="additionalTerms"
                      placeholder="Enter any additional terms, conditions, or notes..."
                      value={formData.additionalTerms}
                      onChange={handleInputChange}
                      className={`${styles.input} ${styles.textarea}`}
                      rows={3}
                    />

                    <div className={styles.checkboxGroup}>
                      <input
                        type="checkbox"
                        id="enableAiAssistance"
                        name="enableAiAssistance"
                        checked={formData.enableAiAssistance}
                        onChange={handleInputChange}
                        className={styles.checkbox}
                      />
                      <label htmlFor="enableAiAssistance" className={styles.checkboxLabel}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                        </svg>
                        Enable AI assistance for this offer letter
                      </label>
                    </div>
                  </div>
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
              
              <div className={styles.navButtons}>
                {currentStep !== 'basic' && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className={styles.previousButton}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Previous
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  className={styles.nextButton}
                  disabled={currentStep === 'template'}
                >
                  {currentStep === 'template' ? 'Generate Offer Letter' : (
                    <>
                      Next
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

