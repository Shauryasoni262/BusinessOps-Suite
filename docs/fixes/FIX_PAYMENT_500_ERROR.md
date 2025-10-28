# 🔧 Fix Payment Dashboard 500 Error

## Problem

Getting this error on the payment dashboard:
```
HTTP error! status: 500
at InvoiceService.getRevenueData
```

## Root Cause

The **database tables for the payment system haven't been created yet**.

---

## ⚡ Quick Fix (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to: **https://app.supabase.com/**
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"+ New query"**

### Step 2: Copy & Paste This SQL

Copy this entire block and paste it into the SQL editor:

```sql
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
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_gateway_id VARCHAR(255),
  payment_status VARCHAR(20) DEFAULT 'pending',
  transaction_id VARCHAR(255),
  payment_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE INDEX IF NOT EXISTS idx_invoices_created_by ON invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
```

### Step 3: Run the SQL

- Click the **"Run"** button
- OR press **`Ctrl + Enter`**

You should see: "Success. No rows returned"

### Step 4: Restart Backend

In your terminal where the backend is running:

1. Press `Ctrl + C` to stop
2. Run `npm start` to restart

### Step 5: Refresh Browser

- Go to your frontend: `http://localhost:3000/dashboard/payments`
- Press `Ctrl + Shift + R` (hard refresh)

---

## ✅ Expected Results

After the fix, you should see:

**In Backend Terminal:**
```
✅ Retrieved 0 invoices for revenue calculation
✅ Revenue data fetched successfully: 6 months
```

**In Frontend:**
- Financial stats cards showing $0
- Revenue chart with 6 months of data
- "No invoices yet" message
- "Generate Invoice" button working

---

## 🎯 Test It Works

1. Click **"Generate Invoice"**
2. Fill in:
   - Client Name: Test Client
   - Client Email: test@example.com  
   - Amount: 1000
   - Invoice Date: Today
   - Due Date: Next week
3. Click **"Generate Invoice"**
4. You should see the new invoice in the list!

---

## 🐛 Still Getting Errors?

### Check Backend Logs

Look at your backend terminal. You should see detailed error messages now:

```
📊 Querying invoices for user: <user-id>
❌ Database error in getRevenueData: <error details>
```

### Check if Tables Exist

Run this in Supabase SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('invoices', 'payments');
```

Should return both tables.

### Check if Function Exists

```sql
SELECT generate_invoice_number();
```

Should return: `INV-001`

---

## 📞 Need More Help?

See complete guide: **`DATABASE_SETUP_PAYMENTS.md`**

---

**That's it! Your payment system should now work!** 🎉

