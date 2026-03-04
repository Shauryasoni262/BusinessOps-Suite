import React from 'react';

export interface CompanySettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  industry: string;
  taxId: string;
  foundedYear: string;
  hrDepartmentName: string;
  hrContactPerson: string;
  hrEmail: string;
  signatureName: string;
  signatureTitle: string;
  defaultBenefits: string[];
}

// Define the shape of data we expect from the parent form
export interface OfferLetterData {
  offerTitle: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  department: string;
  compensation: string;
  employmentType: string;
  startDate: string;
  workLocation: string;
  reportsTo: string;
  benefits: string[];
  additionalTerms: string;
  companySettings?: CompanySettings;
}

const currentDate = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

// Common Styles for all letters to look like real documents
const documentBaseStyles = {
  backgroundColor: 'white',
  padding: '40px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  margin: '0 auto',
  maxWidth: '800px',
  minHeight: '1056px', // Standard US Letter height approx ratio
  color: '#1e293b',
  lineHeight: 1.6,
  textAlign: 'left' as const,
  border: '1px solid #e2e8f0',
};

export const ModernTemplate = ({ data }: { data: OfferLetterData }) => (
  <div style={{ ...documentBaseStyles, fontFamily: '"Inter", sans-serif' }}>
    {/* Header */}
    <div style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '20px', marginBottom: '30px' }}>
      <h1 style={{ margin: 0, fontSize: '28px', color: '#0f172a' }}>{data.companySettings?.companyName || 'COMPANY NAME'}</h1>
      <p style={{ margin: 0, color: '#64748b', fontSize: '14px', whiteSpace: 'pre-wrap' }}>{data.companySettings?.companyAddress || '123 Business Avenue, Tech Hub, CA 90210'}</p>
    </div>

    {/* Date and Recipient */}
    <div style={{ marginBottom: '30px' }}>
      <p style={{ fontWeight: 600 }}>Date: {currentDate}</p>
      <p style={{ margin: 0 }}><strong>To:</strong> {data.candidateName || '[Candidate Name]'}</p>
      <p style={{ margin: 0 }}><strong>Email:</strong> {data.candidateEmail || '[Candidate Email]'}</p>
    </div>

    {/* Subject */}
    <h2 style={{ fontSize: '18px', color: '#3b82f6', marginBottom: '20px' }}>
      Subject: Offer of Employment - {data.jobTitle || '[Job Title]'}
    </h2>

    {/* Body */}
    <p>Dear {data.candidateName?.split(' ')[0] || '[First Name]'},</p>
    <p>
      We are thrilled to offer you the position of <strong>{data.jobTitle || '[Job Title]'}</strong> at {data.companySettings?.companyName || 'COMPANY NAME'}. 
      Based on your experience, interviews, and portfolio, we are confident you will be a fantastic addition to our <strong>{data.department || '[Department]'}</strong> team.
    </p>

    <h3 style={{ fontSize: '16px', color: '#0f172a', marginTop: '25px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>Position Details</h3>
    <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
      <li><strong>Role:</strong> {data.jobTitle || '[Job Title]'} ({data.employmentType || 'Full-time'})</li>
      <li><strong>Reporting To:</strong> {data.reportsTo || '[Manager Name]'}</li>
      <li><strong>Start Date:</strong> {data.startDate || '[Start Date]'}</li>
      <li><strong>Location:</strong> {data.workLocation || '[Location]'}</li>
    </ul>

    <h3 style={{ fontSize: '16px', color: '#0f172a', marginTop: '25px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>Compensation & Benefits</h3>
    <p>
      In this role, your starting compensation will be <strong>{data.compensation || '[Compensation Amount]'}</strong>. 
      This is subject to regular deductions and withholdings as required by law.
    </p>
    
    {data.benefits && data.benefits.length > 0 && (
      <>
        <p>Additionally, you will be eligible to participate in our comprehensive benefits program, which includes:</p>
        <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
          {data.benefits.map((benefit, i) => (
            <li key={i}>{benefit}</li>
          ))}
        </ul>
      </>
    )}

    {data.additionalTerms && (
      <>
        <h3 style={{ fontSize: '16px', color: '#0f172a', marginTop: '25px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>Additional Terms</h3>
        <p style={{ whiteSpace: 'pre-wrap' }}>{data.additionalTerms}</p>
      </>
    )}

    <p style={{ marginTop: '30px' }}>
      Please note that this offer is contingent upon the successful completion of a background check and agreeing to our standard confidentiality agreements. Your employment with {data.companySettings?.companyName || 'COMPANY NAME'} will be on an at-will basis.
    </p>

    <p>
      To accept this offer, please sign and date this letter below. We are excited about the prospect of you joining our team and look forward to a mutually rewarding relationship!
    </p>

    {/* Signatures */}
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px' }}>
      <div style={{ width: '45%' }}>
        <div style={{ borderBottom: '1px solid #1e293b', marginBottom: '10px' }}></div>
        <p style={{ margin: 0, fontWeight: 600 }}>{data.companySettings?.signatureName || 'Company Representative'}</p>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{data.companySettings?.signatureTitle || 'Date'}</p>
      </div>
      <div style={{ width: '45%' }}>
        <div style={{ borderBottom: '1px solid #1e293b', marginBottom: '10px' }}></div>
        <p style={{ margin: 0, fontWeight: 600 }}>{data.candidateName || 'Candidate Signature'}</p>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Date</p>
      </div>
    </div>
  </div>
);

export const ClassicFormalTemplate = ({ data }: { data: OfferLetterData }) => (
  <div style={{ ...documentBaseStyles, fontFamily: '"Georgia", "Times New Roman", serif', padding: '50px' }}>
    {/* Formal Header */}
    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
      <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '2px', textTransform: 'uppercase' }}>{data.companySettings?.companyName || 'COMPANY NAME INC.'}</h1>
      <p style={{ margin: '5px 0', fontStyle: 'italic', fontSize: '14px', whiteSpace: 'pre-wrap' }}>{data.companySettings?.companyAddress || '123 Corporate Blvd, Suite 100, Financial District'}</p>
    </div>

    <div style={{ marginBottom: '20px' }}>
      <p>{currentDate}</p>
      <p style={{ margin: '20px 0 0 0' }}>{data.candidateName || '[Candidate Name]'}</p>
      <p style={{ margin: 0 }}>{data.candidateEmail || '[Candidate Email]'}</p>
    </div>

    <p style={{ fontWeight: 'bold' }}>RE: Formal Offer of Employment</p>

    <p>Dear {data.candidateName || '[Candidate Name]'},</p>
    <p>
      {data.companySettings?.companyName || 'COMPANY NAME INC.'} (the &ldquo;Company&rdquo;) is pleased to offer you the position of <strong>{data.jobTitle || '[Job Title]'}</strong>, within the <strong>{data.department || '[Department]'}</strong> department. 
      Your anticipated start date will be {data.startDate || '[Start Date]'}, and you will be reporting directly to {data.reportsTo || '[Manager Name]'} at our {data.workLocation || '[Location]'} office.
    </p>

    <p>
      As a {data.employmentType?.toLowerCase() || 'full-time'} employee of the Company, you will receive a compensation of <strong>{data.compensation || '[Compensation]'}</strong>, subject to all applicable taxes and withholdings.
    </p>

    {data.benefits && data.benefits.length > 0 && (
      <p>
        During your employment, you will be eligible for standard company benefits, which presently include: {data.benefits.join('; ')}. 
        The Company reserves the right to modify or terminate benefits at its sole discretion.
      </p>
    )}

    {data.additionalTerms && (
      <p style={{ whiteSpace: 'pre-wrap' }}>
        <strong>Additional Provisions:</strong><br/>
        {data.additionalTerms}
      </p>
    )}

    <p>
      Your employment with the Company is &ldquo;at-will.&rdquo; This means that either you or the Company may terminate the employment relationship at any time, with or without cause or advance notice.
    </p>

    <p>
      If you choose to accept this offer, please sign, date, and return this letter. This offer expires five (5) business days from the date of this letter if not accepted.
    </p>
    
    <p>Sincerely,</p>
    <div style={{ marginTop: '40px', marginBottom: '40px' }}>
      <p style={{ margin: 0 }}>___________________________</p>
      <p style={{ margin: 0, fontWeight: 'bold' }}>{data.companySettings?.signatureName || 'Human Resources Director'}</p>
      <p style={{ margin: 0 }}>{data.companySettings?.signatureTitle || 'COMPANY NAME INC.'}</p>
    </div>

    <p style={{ fontWeight: 'bold', borderTop: '1px solid black', paddingTop: '10px' }}>Acceptance of Offer</p>
    <p>I have read and understood the provisions of this offer of employment, and I accept the above terms.</p>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
      <div style={{ width: '60%' }}>
        <p style={{ margin: 0 }}>__________________________________</p>
        <p style={{ margin: 0 }}>Employee Signature</p>
      </div>
      <div style={{ width: '30%' }}>
        <p style={{ margin: 0 }}>___________________</p>
        <p style={{ margin: 0 }}>Date</p>
      </div>
    </div>
  </div>
);

export const StartupFriendlyTemplate = ({ data }: { data: OfferLetterData }) => (
  <div style={{ ...documentBaseStyles, fontFamily: '"Outfit", "Segoe UI", sans-serif', borderTop: '8px solid #10b981' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
      <h1 style={{ margin: 0, fontSize: '32px', color: '#10b981', fontWeight: 800 }}>{data.companySettings?.companyName || 'STARTUP.IO'}</h1>
      <span style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '5px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: 600 }}>We&apos;re hiring!</span>
    </div>

    <h2 style={{ fontSize: '28px', color: '#111827', marginBottom: '10px' }}>Welcome to the team, {data.candidateName?.split(' ')[0] || '[Name]'}! 🎉</h2>
    <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: 1.8 }}>
      We had an amazing time getting to know you during the interview process. Your passion and expertise blew us away, and we are absolutely thrilled to officially offer you the role of <strong>{data.jobTitle || '[Job Title]'}</strong>!
    </p>

    <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', margin: '30px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div>
        <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Role</p>
        <p style={{ margin: 0, fontWeight: 600, color: '#111827' }}>{data.jobTitle || '[Job Title]'}</p>
      </div>
      <div>
        <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Team</p>
        <p style={{ margin: 0, fontWeight: 600, color: '#111827' }}>{data.department || '[Department]'}</p>
      </div>
      <div>
        <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Start Date</p>
        <p style={{ margin: 0, fontWeight: 600, color: '#111827' }}>{data.startDate || '[Start Date]'}</p>
      </div>
      <div>
        <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Compensation</p>
        <p style={{ margin: 0, fontWeight: 600, color: '#111827' }}>{data.compensation || '[Compensation]'}</p>
      </div>
    </div>

    <h3 style={{ fontSize: '18px', color: '#111827' }}>Perks & Benefits 🚀</h3>
    <p>We believe in taking care of our team. As a {data.employmentType?.toLowerCase() || 'full-time'} team member, you&apos;ll get:</p>
    {data.benefits && data.benefits.length > 0 ? (
      <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
        {data.benefits.map((benefit, i) => (
          <li key={i}>{benefit}</li>
        ))}
      </ul>
    ) : (
      <p style={{ fontStyle: 'italic', color: '#64748b' }}>[Benefits will be listed here]</p>
    )}

    {data.additionalTerms && (
      <div style={{ backgroundColor: '#fffbeb', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', margin: '20px 0' }}>
        <p style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap' }}><strong>Note:</strong> {data.additionalTerms}</p>
      </div>
    )}

    <p style={{ marginTop: '30px' }}>
      The boring legal stuff: Your employment here is &ldquo;at-will,&rdquo; meaning either of us can end the relationship at any time. This offer is also contingent on signing our standard NDA and passing a background check.
    </p>

    <p style={{ fontWeight: 600, fontSize: '18px', textAlign: 'center', margin: '40px 0' }}>
      Ready to build something amazing together? 
    </p>

    <div style={{ display: 'flex', gap: '20px', marginTop: '40px', justifyContent: 'center' }}>
      <div style={{ width: '300px', border: '2px dashed #cbd5e1', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
        <p style={{ margin: '0 0 30px 0', color: '#94a3b8' }}>Sign here to accept</p>
        <div style={{ borderBottom: '2px solid #111827', width: '80%', margin: '0 auto' }}></div>
        <p style={{ margin: '10px 0 0 0', fontWeight: 600 }}>{data.candidateName || 'Candidate'}</p>
        <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#64748b' }}>Date: ____________</p>
      </div>
      <div style={{ width: '300px', padding: '20px', textAlign: 'center' }}>
        <p style={{ margin: '0 0 30px 0', color: '#fff' }}>Hidden alignment</p>
        <div style={{ borderBottom: '2px solid #111827', width: '80%', margin: '0 auto' }}></div>
        <p style={{ margin: '10px 0 0 0', fontWeight: 600 }}>{data.companySettings?.signatureName || 'Founder'}</p>
        <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#64748b' }}>{data.companySettings?.signatureTitle || 'CEO'}</p>
      </div>
    </div>
  </div>
);
