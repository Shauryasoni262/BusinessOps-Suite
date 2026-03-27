'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Landmark, CreditCard, FileText } from 'lucide-react';
import Link from 'next/link';
import { Sidebar, TopBar } from '@/components/layout';
import { ModernTemplate, ClassicTemplate, SalarySlipData } from '@/components/salary-slips/SalarySlipTemplates';
import styles from './page.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

type Step = 'basic' | 'finance' | 'preview';

export default function CreateSalarySlipPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'classic'>('modern');
  const router = useRouter();

  const [formData, setFormData] = useState<SalarySlipData>({
    employee_name: '',
    employee_id: '',
    designation: '',
    month_year: `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date())} ${new Date().getFullYear()}`,
    bank_name: '',
    account_number: '',
    pan_number: '',
    earnings: [
      { name: 'Basic Salary', amount: 0 },
      { name: 'HRA', amount: 0 },
      { name: 'Special Allowance', amount: 0 }
    ],
    deductions: [
      { name: 'Provident Fund', amount: 0 },
      { name: 'Professional Tax', amount: 0 },
      { name: 'Income Tax', amount: 0 }
    ],
    gross_earnings: 0,
    total_deductions: 0,
    net_pay: 0,
    net_pay_words: '',
    currency: '$'
  });

  const [newEarning, setNewEarning] = useState({ name: '', amount: '' as any });
  const [newDeduction, setNewDeduction] = useState({ name: '', amount: '' as any });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Recalculate totals
  useEffect(() => {
    const gross = formData.earnings.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const totalDed = formData.deductions.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const net = gross - totalDed;
    
    setFormData(prev => ({
      ...prev,
      gross_earnings: gross,
      total_deductions: totalDed,
      net_pay: net > 0 ? net : 0
    }));
  }, [formData.earnings, formData.deductions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEarning = () => {
    if (newEarning.name && (newEarning.amount >= 0)) {
      setFormData(prev => ({
        ...prev,
        earnings: [...prev.earnings, { ...newEarning, amount: Number(newEarning.amount) || 0 }]
      }));
      setNewEarning({ name: '', amount: '' as any });
    }
  };

  const handleRemoveEarning = (index: number) => {
    const updated = [...formData.earnings];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, earnings: updated }));
  };

  const handleAddDeduction = () => {
    if (newDeduction.name && (newDeduction.amount >= 0)) {
      setFormData(prev => ({
        ...prev,
        deductions: [...prev.deductions, { ...newDeduction, amount: Number(newDeduction.amount) || 0 }]
      }));
      setNewDeduction({ name: '', amount: '' as any });
    }
  };

  const handleRemoveDeduction = (index: number) => {
    const updated = [...formData.deductions];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, deductions: updated }));
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      
      // 1. Generate PDF
      const element = document.getElementById('salary-slip-preview');
      if (element) {
        const html2pdf = (await import('html2pdf.js')).default;
        const opt = {
          margin: 10,
          filename: `Salary_Slip_${formData.employee_name.replace(/\s+/g, '_')}_${formData.month_year.replace(/\s+/g, '_')}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        await html2pdf().set(opt).from(element).save();
      }

      // 2. Save to DB
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/salary-slips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      router.push('/dashboard/salary-slips');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate salary slip');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <TopBar user={user} onLogout={() => {}} />
        <div className={styles.content}>
          <Link href="/dashboard/salary-slips" className={styles.backLink}>
            ← Back to Salary Slips
          </Link>

          <div className={styles.pageHeader}>
            <div className={styles.headerIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
            <div className={styles.headerText}>
              <h1>Generate Salary Slip</h1>
              <p>Create a professional salary slip for your employees</p>
            </div>
          </div>

          <div className={styles.stepsContainer}>
            {['Basic Info', 'Financials', 'Preview'].map((label, i) => (
              <div key={label} className={styles.stepItem}>
                <div className={`${styles.stepCircle} ${
                  (i === 0 && currentStep === 'basic') || 
                  (i === 1 && currentStep === 'finance') || 
                  (i === 2 && currentStep === 'preview') ? styles.stepActive : 
                  (i === 0 && currentStep !== 'basic') || (i === 1 && currentStep === 'preview') ? styles.stepCompleted : ''
                }`}>
                  {i + 1}
                </div>
                <span className={styles.stepLabel}>{label}</span>
                {i < 2 && <div className={styles.stepLine} />}
              </div>
            ))}
          </div>

          <div className={styles.formContainer}>
            {currentStep === 'basic' && (
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIcon}>
                    <User size={20} />
                  </div>
                  <div>
                    <h2>Employee Information</h2>
                    <p>Details about the employee and pay period</p>
                  </div>
                </div>
                <div className={styles.formFields}>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label>Employee Name *</label>
                      <input name="employee_name" value={formData.employee_name} onChange={handleInputChange} className={styles.input} placeholder="John Doe" />
                    </div>
                    <div className={styles.formField}>
                      <label>Employee ID *</label>
                      <input name="employee_id" value={formData.employee_id} onChange={handleInputChange} className={styles.input} placeholder="EMP001" />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label>Designation</label>
                      <input name="designation" value={formData.designation} onChange={handleInputChange} className={styles.input} placeholder="Senior Developer" />
                    </div>
                    <div className={styles.formField}>
                      <label>Month & Year *</label>
                      <input name="month_year" value={formData.month_year} onChange={handleInputChange} className={styles.input} placeholder="March 2026" />
                    </div>
                  </div>
                  <div className={styles.sectionHeader} style={{ marginTop: '2rem' }}>
                    <div className={styles.sectionIcon}>
                      <Landmark size={20} />
                    </div>
                    <div>
                      <h2>Bank Details</h2>
                      <p>Used for the salary transfer reference</p>
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label>Bank Name</label>
                      <input name="bank_name" value={formData.bank_name} onChange={handleInputChange} className={styles.input} placeholder="HDFC Bank" />
                    </div>
                    <div className={styles.formField}>
                      <label>Account Number</label>
                      <input name="account_number" value={formData.account_number} onChange={handleInputChange} className={styles.input} placeholder="XXXX XXXX XXXX" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'finance' && (
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIcon}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h2>Earnings & Deductions</h2>
                    <p>Enter salary components and select currency</p>
                  </div>
                </div>

                <div className={styles.formField} style={{ marginBottom: '2rem', maxWidth: '300px' }}>
                  <label>Select Currency</label>
                  <select 
                    className={styles.input} 
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  >
                    <option value="$">$ (USD)</option>
                    <option value="₹">₹ (INR)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                    <option value="¥">¥ (JPY)</option>
                  </select>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#166534' }}>Earnings</h3>
                    <div className={styles.itemsList}>
                      {formData.earnings.map((e, index) => (
                        <div key={index} className={styles.itemRow}>
                          <input className={styles.input} value={e.name} readOnly />
                          <input 
                            type="number" 
                            className={styles.input} 
                            value={e.amount || ''} 
                            placeholder="0"
                            onChange={(ev) => {
                              const newE = [...formData.earnings];
                              newE[index].amount = Number(ev.target.value);
                              setFormData(prev => ({ ...prev, earnings: newE }));
                            }} 
                          />
                          <button 
                            className={styles.removeItemBtn} 
                            onClick={() => handleRemoveEarning(index)}
                            title="Remove item"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <div className={styles.addItemRow}>
                        <input className={styles.input} placeholder="Earning Name" value={newEarning.name} onChange={e => setNewEarning({...newEarning, name: e.target.value})} />
                        <input type="number" className={styles.input} value={newEarning.amount} placeholder="0" onChange={e => setNewEarning({...newEarning, amount: e.target.value})} />
                        <button type="button" className={styles.addItemBtn} onClick={handleAddEarning}>+</button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#991b1b' }}>Deductions</h3>
                    <div className={styles.itemsList}>
                      {formData.deductions.map((d, index) => (
                        <div key={index} className={styles.itemRow}>
                          <input className={styles.input} value={d.name} readOnly />
                          <input 
                            type="number" 
                            className={styles.input} 
                            value={d.amount || ''} 
                            placeholder="0"
                            onChange={(ev) => {
                              const newD = [...formData.deductions];
                              newD[index].amount = Number(ev.target.value);
                              setFormData(prev => ({ ...prev, deductions: newD }));
                            }} 
                          />
                          <button 
                            className={styles.removeItemBtn} 
                            onClick={() => handleRemoveDeduction(index)}
                            title="Remove item"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <div className={styles.addItemRow}>
                        <input className={styles.input} placeholder="Deduction Name" value={newDeduction.name} onChange={e => setNewDeduction({...newDeduction, name: e.target.value})} />
                        <input type="number" className={styles.input} value={newDeduction.amount} placeholder="0" onChange={e => setNewDeduction({...newDeduction, amount: e.target.value})} />
                        <button type="button" className={styles.addItemBtn} onClick={handleAddDeduction}>+</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.summaryRow}>
                  <div className={styles.summaryCard}>
                    <span>Gross Earnings</span>
                    <h4>{formData.currency}{formData.gross_earnings.toLocaleString()}</h4>
                  </div>
                  <div className={styles.summaryCard}>
                    <span>Total Deductions</span>
                    <h4>{formData.currency}{formData.total_deductions.toLocaleString()}</h4>
                  </div>
                  <div className={`${styles.summaryCard} ${styles.highlight}`}>
                    <span>Net Take-home</span>
                    <h4>{formData.currency}{formData.net_pay.toLocaleString()}</h4>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'preview' && (
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIcon}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h2>Template & Preview</h2>
                    <p>Choose a style and review the result</p>
                  </div>
                </div>

                <div className={styles.templateGrid}>
                  <div className={`${styles.templateCard} ${selectedTemplate === 'modern' ? styles.templateCardActive : ''}`} onClick={() => setSelectedTemplate('modern')}>
                    <h4>Modern Blue</h4>
                    <p>Clean, tech-focused design with blue accents.</p>
                  </div>
                  <div className={`${styles.templateCard} ${selectedTemplate === 'classic' ? styles.templateCardActive : ''}`} onClick={() => setSelectedTemplate('classic')}>
                    <h4>Classic Formal</h4>
                    <p>Traditional minimalist business style.</p>
                  </div>
                </div>

                <div className={styles.documentPreviewWrapper}>
                  <div className={styles.documentPaper} id="salary-slip-preview">
                    {selectedTemplate === 'modern' ? <ModernTemplate data={formData} /> : <ClassicTemplate data={formData} />}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.cancelButton} onClick={() => router.push('/dashboard/salary-slips')}>Cancel</button>
            <div className={styles.navButtons}>
              {currentStep !== 'basic' && (
                <button className={styles.previousButton} onClick={() => setCurrentStep(currentStep === 'preview' ? 'finance' : 'basic')}>
                  Previous
                </button>
              )}
              <button 
                className={styles.nextButton} 
                onClick={() => {
                  if (currentStep === 'basic') setCurrentStep('finance');
                  else if (currentStep === 'finance') setCurrentStep('preview');
                  else handleGenerate();
                }}
                disabled={isGenerating}
              >
                {currentStep === 'preview' ? (isGenerating ? 'Generating...' : 'Download PDF') : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
