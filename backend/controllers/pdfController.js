const Invoice = require('../models/Invoice');

const pdfController = {
  // Generate PDF for invoice
  generateInvoicePDF: async (req, res) => {
    try {
      const { invoiceId } = req.params;
      const userId = req.user.id;

      // Get invoice data
      const invoice = await Invoice.findById(invoiceId);
      
      if (!invoice || invoice.created_by !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this invoice'
        });
      }

      // Generate HTML template
      const html = generateInvoiceHTML(invoice);

      // Set headers for PDF download
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoice_number}.html"`);
      
      res.send(html);
    } catch (error) {
      console.error('Error generating PDF:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to generate PDF',
        error: error.message
      });
    }
  }
};

// Generate HTML template for invoice
function generateInvoiceHTML(invoice) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoice.invoice_number}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .company-info h1 {
            font-size: 28px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 8px;
        }
        
        .company-info p {
            color: #6b7280;
            font-size: 14px;
        }
        
        .invoice-details {
            text-align: right;
        }
        
        .invoice-number {
            font-size: 24px;
            font-weight: 700;
            color: #3b82f6;
            margin-bottom: 8px;
        }
        
        .invoice-date {
            color: #6b7280;
            font-size: 14px;
        }
        
        .client-info {
            margin-bottom: 40px;
        }
        
        .client-info h3 {
            font-size: 16px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 12px;
        }
        
        .client-details {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
        }
        
        .client-details p {
            margin-bottom: 4px;
            color: #6b7280;
        }
        
        .client-details .client-name {
            font-weight: 600;
            color: #1f2937;
            font-size: 16px;
        }
        
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        
        .invoice-table th {
            background: #f3f4f6;
            padding: 12px 16px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border: 1px solid #e5e7eb;
        }
        
        .invoice-table td {
            padding: 16px;
            border: 1px solid #e5e7eb;
        }
        
        .invoice-table .description {
            width: 50%;
        }
        
        .invoice-table .amount {
            text-align: right;
            font-weight: 600;
        }
        
        .totals {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
        }
        
        .totals-table {
            width: 300px;
        }
        
        .totals-table tr {
            border-bottom: 1px solid #e5e7eb;
        }
        
        .totals-table td {
            padding: 8px 16px;
            text-align: right;
        }
        
        .totals-table .label {
            font-weight: 500;
            color: #6b7280;
        }
        
        .totals-table .total {
            font-weight: 700;
            font-size: 18px;
            color: #1f2937;
        }
        
        .notes {
            margin-bottom: 40px;
        }
        
        .notes h3 {
            font-size: 16px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 12px;
        }
        
        .notes p {
            color: #6b7280;
            line-height: 1.6;
        }
        
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        
        @media print {
            body { margin: 0; }
            .container { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="company-info">
                <h1>BusinessOps</h1>
                <p>Professional Business Management</p>
            </div>
            <div class="invoice-details">
                <div class="invoice-number">${invoice.invoice_number}</div>
                <div class="invoice-date">${formatDate(invoice.invoice_date)}</div>
            </div>
        </div>
        
        <div class="client-info">
            <h3>Bill To:</h3>
            <div class="client-details">
                <p class="client-name">${invoice.client_name}</p>
                <p>${invoice.client_email}</p>
                ${invoice.client_address ? `<p>${invoice.client_address}</p>` : ''}
            </div>
        </div>
        
        <table class="invoice-table">
            <thead>
                <tr>
                    <th class="description">Description</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="description">
                        ${invoice.description || 'Services provided'}
                    </td>
                    <td class="amount">${formatCurrency(invoice.amount, invoice.currency)}</td>
                </tr>
            </tbody>
        </table>
        
        <div class="totals">
            <table class="totals-table">
                <tr>
                    <td class="label">Subtotal:</td>
                    <td>${formatCurrency(invoice.amount, invoice.currency)}</td>
                </tr>
                ${invoice.tax_rate > 0 ? `
                <tr>
                    <td class="label">Tax (${invoice.tax_rate}%):</td>
                    <td>${formatCurrency(invoice.tax_amount, invoice.currency)}</td>
                </tr>
                ` : ''}
                <tr>
                    <td class="label total">Total:</td>
                    <td class="total">${formatCurrency(invoice.total_amount, invoice.currency)}</td>
                </tr>
            </table>
        </div>
        
        ${invoice.notes ? `
        <div class="notes">
            <h3>Notes:</h3>
            <p>${invoice.notes}</p>
        </div>
        ` : ''}
        
        <div class="footer">
            <p>Thank you for your business!</p>
            <p>Due Date: ${formatDate(invoice.due_date)}</p>
        </div>
    </div>
</body>
</html>
  `;
}

module.exports = pdfController;
