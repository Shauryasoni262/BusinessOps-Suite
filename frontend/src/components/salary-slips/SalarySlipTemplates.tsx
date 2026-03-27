import React from 'react';

export interface SalarySlipData {
  employee_name: string;
  employee_id: string;
  designation: string;
  month_year: string;
  bank_name: string;
  account_number: string;
  pan_number: string;
  earnings: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
  gross_earnings: number;
  total_deductions: number;
  net_pay: number;
  net_pay_words: string;
  currency: string;
}

export const ModernTemplate = ({ data }: { data: SalarySlipData }) => (
  <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', color: '#333', background: '#fff' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #2563eb', paddingBottom: '20px', marginBottom: '30px' }}>
      <div>
        <h1 style={{ margin: 0, color: '#2563eb', fontSize: '24px' }}>BusinessOps Suite</h1>
        <p style={{ margin: '5px 0', fontSize: '14px', color: '#64748b' }}>Premium Business Operations Platform</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <h2 style={{ margin: 0, fontSize: '18px', textTransform: 'uppercase' }}>Salary Slip</h2>
        <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{data.month_year}</p>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
      <div>
        <h3 style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #e2e8f0' }}>Employee Details</h3>
        <p style={{ margin: '5px 0' }}><strong>Name:</strong> {data.employee_name || '---'}</p>
        <p style={{ margin: '5px 0' }}><strong>Employee ID:</strong> {data.employee_id || '---'}</p>
        <p style={{ margin: '5px 0' }}><strong>Designation:</strong> {data.designation || '---'}</p>
      </div>
      <div>
        <h3 style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #e2e8f0' }}>Bank Details</h3>
        <p style={{ margin: '5px 0' }}><strong>Bank:</strong> {data.bank_name || '---'}</p>
        <p style={{ margin: '5px 0' }}><strong>A/C No:</strong> {data.account_number || '---'}</p>
        <p style={{ margin: '5px 0' }}><strong>PAN:</strong> {data.pan_number || '---'}</p>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', background: '#e2e8f0', border: '1px solid #e2e8f0' }}>
      <div style={{ background: '#fff' }}>
        <div style={{ background: '#f8fafc', padding: '10px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' }}>Earnings</div>
        <div style={{ padding: '10px' }}>
          {data.earnings.map((e, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
              <span>{e.name}</span>
              <span>{data.currency || '$'}{e.amount.toLocaleString()}</span>
            </div>
          ))}
          <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>Gross Earnings</span>
            <span>{data.currency || '$'}{data.gross_earnings.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div style={{ background: '#fff' }}>
        <div style={{ background: '#f8fafc', padding: '10px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' }}>Deductions</div>
        <div style={{ padding: '10px' }}>
          {data.deductions.map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
              <span>{d.name}</span>
              <span>{data.currency || '$'}{d.amount.toLocaleString()}</span>
            </div>
          ))}
          <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>Total Deductions</span>
            <span>{data.currency || '$'}{data.total_deductions.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>

    <div style={{ marginTop: '30px', background: '#2563eb', color: '#fff', padding: '20px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h3 style={{ margin: 0, fontSize: '14px', textTransform: 'uppercase', opacity: 0.8 }}>Net Salary Payable</h3>
        <p style={{ margin: '5px 0 0 0', fontStyle: 'italic', fontSize: '12px' }}>({data.net_pay_words || 'Zero dollars only'})</p>
      </div>
      <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
        {data.currency || '$'}{data.net_pay.toLocaleString()}
      </div>
    </div>

    <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ textAlign: 'center', width: '200px' }}>
        <div style={{ borderBottom: '1px solid #333', height: '40px', marginBottom: '10px' }}></div>
        <p style={{ margin: 0, fontSize: '12px' }}>Employee Signature</p>
      </div>
      <div style={{ textAlign: 'center', width: '200px' }}>
        <div style={{ borderBottom: '1px solid #333', height: '40px', marginBottom: '10px' }}></div>
        <p style={{ margin: 0, fontSize: '12px' }}>Authorized Signatory</p>
      </div>
    </div>
  </div>
);

export const ClassicTemplate = ({ data }: { data: SalarySlipData }) => (
  <div style={{ padding: '40px', fontFamily: 'serif', color: '#000', background: '#fff', border: '1px solid #000' }}>
    <h1 style={{ textAlign: 'center', margin: '0 0 10px 0', fontSize: '22px' }}>SALARY SLIP</h1>
    <h2 style={{ textAlign: 'center', margin: '0 0 20px 0', fontSize: '16px' }}>BusinessOps Suite</h2>
    
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
      <tbody>
        <tr>
          <td style={{ border: '1px solid #000', padding: '8px', width: '25%', fontWeight: 'bold' }}>Employee Name</td>
          <td style={{ border: '1px solid #000', padding: '8px', width: '25%' }}>{data.employee_name}</td>
          <td style={{ border: '1px solid #000', padding: '8px', width: '25%', fontWeight: 'bold' }}>For Month</td>
          <td style={{ border: '1px solid #000', padding: '8px', width: '25%' }}>{data.month_year}</td>
        </tr>
        <tr>
          <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold' }}>Employee ID</td>
          <td style={{ border: '1px solid #000', padding: '8px' }}>{data.employee_id}</td>
          <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold' }}>Designation</td>
          <td style={{ border: '1px solid #000', padding: '8px' }}>{data.designation}</td>
        </tr>
      </tbody>
    </table>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Earnings</th>
            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.earnings.map((e, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{e.name}</td>
              <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>{data.currency || '$'}{e.amount.toLocaleString()}</td>
            </tr>
          ))}
          <tr>
            <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold' }}>Gross Earnings</td>
            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>{data.currency || '$'}{data.gross_earnings.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Deductions</th>
            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.deductions.map((d, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{d.name}</td>
              <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>{data.currency || '$'}{d.amount.toLocaleString()}</td>
            </tr>
          ))}
          <tr>
            <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold' }}>Total Deductions</td>
            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>{data.currency || '$'}{data.total_deductions.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1px' }}>
      <tbody>
        <tr style={{ background: '#eee' }}>
          <td style={{ border: '1px solid #000', padding: '10px', width: '75%', fontWeight: 'bold' }}>NET PAYABLE</td>
          <td style={{ border: '1px solid #000', padding: '10px', width: '25%', textAlign: 'right', fontWeight: 'bold' }}>{data.currency || '$'}{data.net_pay.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>
    
    <p style={{ marginTop: '20px', fontSize: '13px' }}><strong>Amount in words:</strong> {data.net_pay_words}</p>
    
    <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'space-between' }}>
      <p style={{ borderTop: '1px solid #000', width: '200px', textAlign: 'center', paddingTop: '5px' }}>Employee Signature</p>
      <p style={{ borderTop: '1px solid #000', width: '200px', textAlign: 'center', paddingTop: '5px' }}>Employer Signature</p>
    </div>
  </div>
);
