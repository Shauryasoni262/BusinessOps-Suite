'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Sidebar, TopBar } from '@/components/layout';
import { ModernTemplate, ClassicTemplate } from '@/components/salary-slips/SalarySlipTemplates';
import { salarySlipService, SalarySlip } from '@/services/salarySlipService';
import { FileText, Download, Trash2, Printer, ChevronLeft, User as UserIcon, Briefcase, CreditCard, Landmark } from 'lucide-react';
import styles from './page.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function SalarySlipDetailsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [slip, setSlip] = useState<SalarySlip | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'classic'>('modern');
  const router = useRouter();
  const params = useParams();
  const slipId = params.id as string;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
      fetchSlipDetails();
    } catch (error) {
      console.error('Error parsing user data');
    }
  }, [router, slipId]);

  const fetchSlipDetails = async () => {
    try {
      setLoading(true);
      const data = await salarySlipService.getSalarySlip(slipId);
      setSlip(data);
    } catch (error) {
      console.error('Error fetching slip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!slip) return;
    try {
      const element = document.getElementById('salary-slip-preview');
      if (element) {
        const html2pdf = (await import('html2pdf.js')).default;
        const opt = {
          margin: 10,
          filename: `Salary_Slip_${slip.employee_name.replace(/\s+/g, '_')}_${slip.month_year.replace(/\s+/g, '_')}.pdf`,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
        };
        await html2pdf().set(opt).from(element).save();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this salary slip? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await salarySlipService.deleteSalarySlip(slipId);
      router.push('/dashboard/salary-slips');
    } catch (error) {
      console.error('Error deleting slip:', error);
      alert('Failed to delete salary slip');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.mainContent}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!slip) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.mainContent}>
          <div className={styles.errorContainer}>
            <h2>Salary Slip Not Found</h2>
            <p>The slip you are looking for does not exist or you don't have permission to view it.</p>
            <Link href="/dashboard/salary-slips" className={styles.backButton}>
              Back to Salary Slips
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <TopBar user={user} onLogout={() => {}} />
        <div className={styles.content}>
          {/* Breadcrumbs & Navigation */}
          <div className={styles.navigationRow}>
            <Link href="/dashboard/salary-slips" className={styles.backLink}>
              <ChevronLeft size={18} />
              Back to Salary Slips
            </Link>
          </div>

          <div className={styles.dashboardLayout}>
            {/* Left Column: Preview */}
            <div className={styles.previewSection}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitleGroup}>
                    <FileText className={styles.cardIcon} />
                    <h3>Salary Slip Preview</h3>
                  </div>
                  <div className={styles.templateSwitcher}>
                    <button 
                      className={`${styles.templateBtn} ${selectedTemplate === 'modern' ? styles.templateBtnActive : ''}`}
                      onClick={() => setSelectedTemplate('modern')}
                    >
                      Modern
                    </button>
                    <button 
                      className={`${styles.templateBtn} ${selectedTemplate === 'classic' ? styles.templateBtnActive : ''}`}
                      onClick={() => setSelectedTemplate('classic')}
                    >
                      Classic
                    </button>
                    <button className={styles.actionIconButton} onClick={() => window.print()}>
                      <Printer size={16} />
                    </button>
                  </div>
                </div>
                
                <div className={styles.documentPreviewWrapper}>
                  <div className={styles.documentPaper} id="salary-slip-preview">
                    {selectedTemplate === 'modern' ? <ModernTemplate data={slip} /> : <ClassicTemplate data={slip} />}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Info & Actions */}
            <div className={styles.infoSection}>
              {/* Slip Summary */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Slip Details</h3>
                  <span className={styles.statusBadge}>Generated</span>
                </div>
                <div className={styles.detailsList}>
                  <div className={styles.detailItem}>
                    <UserIcon size={16} className={styles.detailIcon} />
                    <div>
                      <label>Employee</label>
                      <p>{slip.employee_name}</p>
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <Briefcase size={16} className={styles.detailIcon} />
                    <div>
                      <label>Designation</label>
                      <p>{slip.designation || '---'}</p>
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <Landmark size={16} className={styles.detailIcon} />
                    <div>
                      <label>Pay Period</label>
                      <p>{slip.month_year}</p>
                    </div>
                  </div>
                  <div className={styles.detailItem}>
                    <CreditCard size={16} className={styles.detailIcon} />
                    <div>
                      <label>Net Payable</label>
                      <p style={{ fontWeight: 700, color: '#2563eb', fontSize: '1.25rem' }}>
                        {slip.currency || '$'}{slip.net_pay.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className={styles.card} style={{ marginTop: '1.5rem' }}>
                <div className={styles.cardHeader}>
                  <h3>Actions</h3>
                </div>
                <div className={styles.actionsGrid}>
                  <button className={styles.downloadButton} onClick={handleDownloadPDF}>
                    <Download size={18} />
                    Download PDF
                  </button>
                  <button className={styles.deleteButton} onClick={handleDelete} disabled={isDeleting}>
                    <Trash2 size={18} />
                    {isDeleting ? 'Deleting...' : 'Delete Slip'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
