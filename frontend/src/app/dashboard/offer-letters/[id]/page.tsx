'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Sidebar, TopBar } from '@/components/layout';
import { 
  ModernTemplate, 
  ClassicFormalTemplate, 
  StartupFriendlyTemplate 
} from '@/components/offer-letters/OfferLetterTemplates';
import { offerLetterService, OfferLetter } from '@/services/offerLetterService';
import { 
  ArrowLeft, 
  Download, 
  Mail, 
  Copy, 
  Edit, 
  Trash2, 
  CheckCircle,
  Clock,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  User,
  ChevronDown
} from 'lucide-react';
import styles from './page.module.css';

export default function OfferLetterDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offerLetter, setOfferLetter] = useState<OfferLetter | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
      fetchOfferLetter();
    } catch (e) {
      router.push('/auth/login');
    }
  }, [id]);

  const fetchOfferLetter = async () => {
    try {
      setLoading(true);
      const data = await offerLetterService.getOfferLetter(id);
      setOfferLetter(data);
    } catch (err: any) {
      console.error('Error fetching offer letter:', err);
      setError(err.message || 'Failed to load offer letter');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this offer letter? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await offerLetterService.deleteOfferLetter(id);
      router.push('/dashboard/offer-letters');
    } catch (err: any) {
      alert(err.message || 'Failed to delete offer letter');
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      const updated = await offerLetterService.updateOfferLetterStatus(id, newStatus);
      setOfferLetter(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDownload = async () => {
    const element = document.getElementById('offer-letter-preview');
    if (element) {
      try {
        const html2pdf = (await import('html2pdf.js')).default;
        const opt = {
          margin: 0,
          filename: `${offerLetter?.candidate_name.replace(/\s+/g, '_')}_Offer_Letter.pdf`,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'px', format: [element.offsetWidth, element.offsetHeight] as [number, number], orientation: 'portrait' as const }
        };
        await html2pdf().set(opt).from(element).save();
      } catch (err) {
        console.error('Error generating PDF:', err);
        alert('Failed to generate PDF. Please try again.');
      }
    }
  };

  const renderTemplate = () => {
    if (!offerLetter) return null;
    
    // offer_data contains the form fields sent during creation
    const templateData = {
      ...offerLetter.offer_data,
      candidateName: offerLetter.candidate_name,
      candidateEmail: offerLetter.candidate_email,
      jobTitle: offerLetter.job_title,
    };

    switch (offerLetter.offer_data.templateId) {
      case 'classic':
        return <ClassicFormalTemplate data={templateData} />;
      case 'startup':
        return <StartupFriendlyTemplate data={templateData} />;
      default:
        return <ModernTemplate data={templateData} />;
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.mainContent}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading offer details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !offerLetter) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.mainContent}>
          <div className={styles.errorContainer}>
            <h2>Oops! Something went wrong</h2>
            <p>{error || 'Offer letter not found'}</p>
            <Link href="/dashboard/offer-letters" className={styles.backLink}>
              <ArrowLeft size={16} /> Back to Offer Letters
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { offer_data } = offerLetter;

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <TopBar user={user} onLogout={handleLogout} />
        
        <div className={styles.content}>
          {/* Top Navigation */}
          <div className={styles.topNavigation}>
            <Link href="/dashboard/offer-letters" className={styles.backLink}>
              <ArrowLeft size={16} /> Back to Offer Letters
            </Link>
          </div>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h1>{offer_data.offerTitle || `${offerLetter.job_title} Offer`}</h1>
              <div className={styles.createdDate}>
                Created on {new Date(offerLetter.created_at).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric'
                })}
              </div>
            </div>

            <div className={styles.headerActions}>
              <select 
                className={styles.statusDropdown}
                value={offerLetter.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isUpdatingStatus}
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="signed">Signed</option>
              </select>

              <button className={styles.actionButton} onClick={() => alert('Email integration coming soon!')}>
                <Mail size={16} /> Send Email
              </button>

              <button className={styles.actionButton} onClick={handleDownload}>
                <Download size={16} /> Download
              </button>

              <button className={styles.actionButton} onClick={() => alert('Duplicate feature coming soon!')}>
                <Copy size={16} /> Duplicate
              </button>

              <button className={`${styles.actionButton} ${styles.primaryButton}`} onClick={() => alert('Editing feature coming soon!')}>
                <Edit size={16} /> Edit
              </button>

              <button 
                className={`${styles.actionButton} ${styles.deleteButton}`} 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className={styles.grid}>
            {/* Left Column: Details & Benefits */}
            <div className={styles.leftColumn}>
              {/* Offer Details Card */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2>Offer Details</h2>
                  <p>Summary of the job offer</p>
                </div>
                <div className={styles.sectionBody}>
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Candidate Name</span>
                      <span className={styles.detailValue}>{offerLetter.candidate_name}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Email</span>
                      <span className={styles.detailValue}>{offerLetter.candidate_email}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Position</span>
                      <span className={styles.detailValue}>{offerLetter.job_title}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Department</span>
                      <span className={styles.detailValue}>{offer_data.department || 'N/A'}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Employment Type</span>
                      <span className={styles.detailValue}>{offer_data.employmentType}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Location</span>
                      <span className={styles.detailValue}>{offer_data.location || 'Remote'}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Salary</span>
                      <span className={styles.detailValue}>{offer_data.salary}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Start Date</span>
                      <span className={styles.detailValue}>{offer_data.joiningDate}</span>
                    </div>
                    <div className={styles.detailItem + ' ' + styles.fullWidth}>
                      <span className={styles.detailLabel}>Reporting To</span>
                      <span className={styles.detailValue}>{offer_data.managerName || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Card */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2>Benefits & Perks</h2>
                </div>
                <div className={styles.sectionBody}>
                  {offer_data.benefits && offer_data.benefits.length > 0 ? (
                    <div className={styles.benefitList}>
                      {offer_data.benefits.map((benefit: string, index: number) => (
                        <div key={index} className={styles.benefitTag}>
                          <CheckCircle size={14} /> {benefit}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#64748b', fontStyle: 'italic' }}>No additional benefits specified.</p>
                  )}
                </div>
              </div>

              {/* Additional Terms */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2>Additional Terms</h2>
                </div>
                <div className={styles.sectionBody}>
                  {offer_data.additionalTerms ? (
                    <div className={styles.termsContent}>
                      {offer_data.additionalTerms}
                    </div>
                  ) : (
                    <p style={{ color: '#64748b', fontStyle: 'italic' }}>No additional terms provided.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Preview */}
            <div className={styles.previewColumn}>
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2>Letter Preview</h2>
                  <p>Professional offer letter ready to send</p>
                </div>
                <div className={styles.previewCard}>
                  <div id="offer-letter-preview">
                    {renderTemplate()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
