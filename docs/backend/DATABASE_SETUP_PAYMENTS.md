# 💳 Payment System Database Setup

This guide will help you set up the database tables and functions required for the payment system.

---

## 🚨 Quick Fix for 500 Error

If you're getting a **500 error** on the payments dashboard, it means the database tables haven't been created yet.

### Step 1: Login to Supabase

1. Go to: https://app.supabase.com/
2. Select your project
3. Click on **SQL Editor** (left sidebar)

### Step 2: Run the SQL Script

1. Click **"+ New query"**
2. Copy the entire SQL script below
3. Paste it into the editor
4. Click **"Run"** or press `Ctrl+Enter`

---

## 📝 Complete SQL Script

Copy and paste this entire script into your Supabase SQL Editor:

```sql
-- ============================================
-- PAYMENT SYSTEM DATABASE SETUP
-- ============================================

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_address TEXT,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  tax_rate DECIMAL(5,2) DEFAULT 0.00,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  notes TEXT,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_gateway_id VARCHAR(255),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id VARCHAR(255),
  payment_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  config JSONB,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_created_by ON invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payment_methods_type ON payment_methods(type);

-- Create function to update invoice status based on payments
CREATE OR REPLACE FUNCTION update_invoice_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'completed' THEN
    UPDATE invoices 
    SET status = 'paid', updated_at = NOW()
    WHERE id = NEW.invoice_id;
  ELSIF NEW.payment_status = 'failed' THEN
    UPDATE invoices 
    SET status = 'pending', updated_at = NOW()
    WHERE id = NEW.invoice_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update invoice status
DROP TRIGGER IF EXISTS trigger_update_invoice_status ON payments;
CREATE TRIGGER trigger_update_invoice_status
  AFTER UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_invoice_status();

-- Create function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  invoice_num TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_number
  FROM invoices
  WHERE invoice_number LIKE 'INV-%';
  
  invoice_num := 'INV-' || LPAD(next_number::TEXT, 3, '0');
  
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- Insert default payment methods (optional)
INSERT INTO payment_methods (name, type, is_active, config, created_by) 
SELECT 
  'Razorpay', 
  'gateway', 
  true, 
  '{"key_id": "", "key_secret": "", "webhook_secret": ""}'::jsonb,
  id
FROM users 
WHERE role = 'admin'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Payment system tables created successfully!';
  RAISE NOTICE '✅ Invoice auto-numbering function created!';
  RAISE NOTICE '✅ Payment status trigger created!';
  RAISE NOTICE '🎉 You can now use the payment system!';
END $$;
```

---

## ✅ Verification

After running the script, verify everything is set up:

### Check if tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('invoices', 'payments', 'payment_methods');
```

You should see 3 tables listed.

### Check if function exists:

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_type = 'FUNCTION' 
AND routine_name = 'generate_invoice_number';
```

You should see `generate_invoice_number` listed.

### Test the function:

```sql
SELECT generate_invoice_number();
```

You should get: `INV-001`

---

## 🔄 Restart Backend Server

After setting up the database:

1. **Stop the backend server** (press `Ctrl+C` in terminal)
2. **Start it again:**
   ```bash
   cd backend
   npm start
   ```
3. **Refresh your frontend** in the browser

The 500 error should be gone!

---

## 🧪 Test the Payment System

1. Login to your app: `http://localhost:3000/auth/login`
2. Go to Payments: `http://localhost:3000/dashboard/payments`
3. Click **"Generate Invoice"**
4. Fill in the form and create an invoice
5. Check the **Recent Invoices** section

---

## 🆘 Still Getting Errors?

### Check Backend Console

Look at your backend terminal for error messages. You should see:

```
✅ Retrieved 0 invoices for revenue calculation
✅ Revenue data fetched successfully: 6 months
```

### Check Browser Console

Press `F12` → Console tab. Look for:
- Network errors
- API response messages

### Common Issues:

**Error: "relation invoices does not exist"**
- Solution: Run the SQL script above in Supabase

**Error: "function generate_invoice_number() does not exist"**
- Solution: The function is in the SQL script above - make sure you ran the entire script

**Error: "column created_by does not exist in table payment_methods"**
- Solution: This is optional. Comment out the INSERT statement for payment_methods if you don't have an admin user yet

---

## 📊 Database Structure

After setup, you'll have:

**Tables:**
- ✅ `invoices` - Stores invoice records
- ✅ `payments` - Stores payment transactions
- ✅ `payment_methods` - Stores available payment methods

**Functions:**
- ✅ `generate_invoice_number()` - Auto-generates invoice numbers (INV-001, INV-002, etc.)
- ✅ `update_invoice_status()` - Trigger function that updates invoice status when payment completes

**Indexes:**
- ✅ Fast queries on user_id, status, dates

---

## 🎉 Success!

Once the database is set up, you can:
- ✅ Generate invoices
- ✅ Accept payments via Razorpay
- ✅ Track payment status
- ✅ View financial statistics
- ✅ Generate revenue charts
- ✅ Download invoice PDFs

**Happy invoicing!** 💰

