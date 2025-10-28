# 💳 Razorpay Payment Gateway Setup Guide

This guide will walk you through setting up Razorpay payment gateway for your project from scratch.

---

## 📋 Table of Contents

1. [Create Razorpay Account](#step-1-create-razorpay-account)
2. [Get API Credentials](#step-2-get-api-credentials)
3. [Configure Backend](#step-3-configure-backend-env)
4. [Configure Frontend](#step-4-configure-frontend-env)
5. [Set Up Webhooks](#step-5-set-up-webhooks-optional)
6. [Test the Integration](#step-6-test-the-integration)
7. [Go Live](#step-7-go-live-production-mode)

---

## Step 1: Create Razorpay Account

### 1.1 Sign Up

1. Go to **https://razorpay.com/**
2. Click on **"Sign Up"** button (top right)
3. Fill in your details:
   - Business Email
   - Create Password
   - Business Name
4. Click **"Create Account"**

### 1.2 Verify Your Email

1. Check your email inbox
2. Click on the verification link sent by Razorpay
3. Your account will be activated

### 1.3 Complete KYC (Optional for Testing)

For testing purposes, you can skip KYC. For live payments, you'll need to complete KYC with:
- Business PAN
- Business proof
- Bank account details

---

## Step 2: Get API Credentials

### 2.1 Login to Dashboard

1. Go to **https://dashboard.razorpay.com/**
2. Login with your credentials
3. You'll be in **Test Mode** by default (perfect for development!)

### 2.2 Get API Keys

1. In the left sidebar, click on **"Settings"**
2. Click on **"API Keys"** (under "Developers" section)
3. Click on **"Generate Test Keys"** button
4. You'll see two keys:
   - **Key ID** (starts with `rzp_test_...`)
   - **Key Secret** (click "Show" to reveal it)
   
   ⚠️ **Important:** Copy both keys immediately and store them securely!

### 2.3 Example Keys Format

```
Key ID:     rzp_test_1234567890ABCD
Key Secret: ABCDEFGHIJabcdefghij1234567890
```

---

## Step 3: Configure Backend (.env)

### 3.1 Open/Create Backend .env File

Navigate to: `backend/.env`

If it doesn't exist, create it.

### 3.2 Add Razorpay Credentials

Add these lines to your `backend/.env` file:

```bash
# ===================================
# RAZORPAY CONFIGURATION
# ===================================

# Razorpay API Credentials (Test Mode)
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE

# Razorpay Webhook Secret (we'll set this up later)
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET_HERE
```

### 3.3 Complete Backend .env Example

Here's a complete example of what your `backend/.env` should look like:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/google/callback

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_1234567890ABCD
RAZORPAY_KEY_SECRET=ABCDEFGHIJabcdefghij1234567890
RAZORPAY_WEBHOOK_SECRET=webhook_secret_here
```

### 3.4 Save and Restart Backend

After adding the credentials:

```bash
# Stop the backend server (Ctrl+C)
# Start it again
cd backend
npm start
```

You should see: ✅ **Razorpay initialized successfully**

---

## Step 4: Configure Frontend (.env.local)

### 4.1 Open/Create Frontend .env.local File

Navigate to: `frontend/.env.local`

If it doesn't exist, create it.

### 4.2 Add Razorpay Key ID

Add this line to your `frontend/.env.local` file:

```bash
# ===================================
# FRONTEND ENVIRONMENT VARIABLES
# ===================================

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Razorpay Configuration (Only Key ID, NOT Secret!)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
```

⚠️ **IMPORTANT SECURITY NOTE:**
- **ONLY** put the `Key ID` in the frontend
- **NEVER** put the `Key Secret` in the frontend
- The Key Secret should ONLY be in the backend .env file

### 4.3 Complete Frontend .env.local Example

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Socket.IO URL (for real-time features)
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1234567890ABCD
```

### 4.4 Save and Restart Frontend

After adding the credentials:

```bash
# Stop the frontend server (Ctrl+C)
# Start it again
cd frontend
npm run dev
```

---

## Step 5: Set Up Webhooks (Optional)

Webhooks allow Razorpay to notify your backend when payment status changes.

### 5.1 Get Your Webhook URL

For local development, you need a public URL. Use **ngrok**:

1. Download ngrok: https://ngrok.com/download
2. Run: `ngrok http 5000`
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

Your webhook URL will be: `https://abc123.ngrok.io/api/payments/razorpay/webhook`

### 5.2 Configure Webhook in Razorpay Dashboard

1. Go to **Settings** → **Webhooks**
2. Click **"+ Add New Webhook"**
3. Enter your webhook URL: `https://abc123.ngrok.io/api/payments/razorpay/webhook`
4. Select events to track:
   - ✅ `payment.captured`
   - ✅ `payment.failed`
5. Click **"Create Webhook"**
6. Copy the **Webhook Secret** that's generated

### 5.3 Add Webhook Secret to Backend .env

Update your `backend/.env`:

```bash
RAZORPAY_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

Restart backend server.

---

## Step 6: Test the Integration

### 6.1 Create a Test Invoice

1. Login to your app: `http://localhost:3000/auth/login`
2. Go to **Payments** page: `http://localhost:3000/dashboard/payments`
3. Click **"Generate Invoice"**
4. Fill in the details:
   - Client Name
   - Amount (e.g., 1000)
   - Due Date
   - Items/Services
5. Click **"Generate Invoice"**

### 6.2 Make a Test Payment

1. View your invoices list
2. Click **"Pay Now"** on an invoice
3. Razorpay checkout window will open
4. Use Razorpay's test card details:

#### Test Card Details (Always Works in Test Mode)

```
Card Number:    4111 1111 1111 1111
CVV:            Any 3 digits (e.g., 123)
Expiry:         Any future date (e.g., 12/25)
Name:           Any name
```

#### More Test Cards

**Success:**
- `4111 1111 1111 1111` - Normal success
- `5555 5555 5555 4444` - Success with Mastercard

**Failure:**
- `4000 0000 0000 0002` - Card declined
- `4000 0000 0000 0069` - Expired card

### 6.3 Test UPI (Test Mode)

```
UPI ID: success@razorpay
Result: Payment will succeed
```

### 6.4 Test Netbanking

Select any bank and use:
```
Username: razorpay
Password: razorpay
```

### 6.5 Verify Payment Status

1. After successful payment, check your app
2. Invoice status should change to **"Paid"**
3. Payment record should be created in your database

---

## Step 7: Go Live (Production Mode)

⚠️ **Do this ONLY when you're ready for real payments!**

### 7.1 Complete KYC

1. Go to Razorpay Dashboard → **Account & Settings**
2. Complete KYC verification:
   - Submit business documents
   - Verify bank account
   - Wait for approval (usually 1-2 business days)

### 7.2 Activate Your Account

1. Once KYC is approved, you can activate live mode
2. Go to **Settings** → **API Keys**
3. Click **"Generate Live Keys"**
4. You'll get new keys starting with `rzp_live_...`

### 7.3 Update Environment Variables

**Backend .env:**
```bash
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET
```

**Frontend .env.local:**
```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
```

### 7.4 Set Up Production Webhook

Update webhook URL to your production domain:
```
https://yourdomain.com/api/payments/razorpay/webhook
```

---

## 🔧 Troubleshooting

### Issue: "Razorpay is not configured"

**Solution:**
1. Check if `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are in `backend/.env`
2. Restart backend server
3. Look for: ✅ "Razorpay initialized successfully" in console

### Issue: Payment popup doesn't open

**Solution:**
1. Check browser console for errors
2. Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is in `frontend/.env.local`
3. Restart frontend server
4. Clear browser cache

### Issue: "Invalid key_id"

**Solution:**
1. Verify the Key ID is correct (copy-paste from dashboard)
2. Make sure you're using Test key in development
3. Check for extra spaces or quotes

### Issue: Payment succeeds but status not updating

**Solution:**
1. Check webhook configuration
2. Verify webhook secret is correct
3. Test webhook using Razorpay dashboard's "Test Webhook" feature

---

## 📊 Testing Checklist

Before going live, test these scenarios:

- ✅ Create invoice
- ✅ View invoice details
- ✅ Make successful payment (card)
- ✅ Make successful payment (UPI)
- ✅ Make successful payment (Netbanking)
- ✅ Handle failed payment
- ✅ Verify payment status updates
- ✅ Check invoice gets marked as paid
- ✅ Test webhook (if configured)
- ✅ Generate invoice PDF

---

## 🔐 Security Best Practices

1. **Never commit .env files to Git**
   - Add `.env` to `.gitignore`
   - Use `.env.example` for documentation

2. **Never share your Key Secret**
   - Keep it secure
   - Rotate keys if exposed

3. **Use Test Mode for Development**
   - Always use `rzp_test_` keys in development
   - Only use `rzp_live_` in production

4. **Verify webhook signatures**
   - Already implemented in `razorpayController.js`
   - Don't skip signature verification

5. **Use HTTPS in Production**
   - Required for PCI compliance
   - Use SSL certificate

---

## 📞 Support

### Razorpay Support
- Documentation: https://razorpay.com/docs/
- Support Email: support@razorpay.com
- Dashboard: https://dashboard.razorpay.com/

### Common Resources
- API Reference: https://razorpay.com/docs/api/
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-details/
- Webhooks: https://razorpay.com/docs/webhooks/

---

## ✅ Quick Recap

**Backend .env:**
```bash
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
```

**Frontend .env.local:**
```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
```

**Test Card:**
```
4111 1111 1111 1111 | Any CVV | Any future date
```

**That's it! You're ready to accept payments!** 🎉

