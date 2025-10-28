# ⚡ Quick Environment Setup

## 🎯 What You Need

### For Razorpay Payment Gateway:
1. **Razorpay Account** (Free for testing)
2. **API Keys** (Key ID + Key Secret)

---

## 📝 Step-by-Step Setup

### Step 1: Create Razorpay Account

1. Go to: **https://razorpay.com/**
2. Click **"Sign Up"** → Create account
3. Verify email
4. Login to dashboard: **https://dashboard.razorpay.com/**

### Step 2: Get API Keys

1. In dashboard, go to: **Settings** → **API Keys**
2. Click **"Generate Test Keys"**
3. Copy both:
   - **Key ID** (e.g., `rzp_test_1234567890ABCD`)
   - **Key Secret** (click "Show" to reveal)

### Step 3: Create Backend .env File

1. Navigate to `backend` folder
2. Create a file named `.env` (no extension)
3. Copy and paste this, then **replace the placeholder values**:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Supabase Configuration (Get from https://app.supabase.com)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Razorpay (Paste your keys here)
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
RAZORPAY_WEBHOOK_SECRET=
```

### Step 4: Create Frontend .env.local File

1. Navigate to `frontend` folder
2. Create a file named `.env.local` (no extension)
3. Copy and paste this, then **replace with your Key ID**:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Razorpay (Only Key ID, NOT Secret!)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
```

---

## ✅ Quick Copy-Paste Example

**Example values to help you understand:**

### Backend .env:
```bash
PORT=5000
NODE_ENV=development
JWT_SECRET=my-secret-key-12345
SUPABASE_URL=https://abcxyz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
FRONTEND_URL=http://localhost:3000
RAZORPAY_KEY_ID=rzp_test_1A2B3C4D5E6F7G
RAZORPAY_KEY_SECRET=ABC123xyz789secret
RAZORPAY_WEBHOOK_SECRET=
```

### Frontend .env.local:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1A2B3C4D5E6F7G
```

⚠️ **Notice:** Same `RAZORPAY_KEY_ID` in both files!

---

## 🚀 Start Servers

After creating .env files:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

Look for: ✅ **"Razorpay initialized successfully"**

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🧪 Test Payment

### Use Razorpay Test Card:

```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
Name: Test User
```

This card **always works** in test mode!

---

## 📍 Where to Get Credentials

| What | Where to Get |
|------|-------------|
| **Razorpay Keys** | https://dashboard.razorpay.com/app/keys |
| **Supabase URL** | https://app.supabase.com → Project Settings → API |
| **Supabase Keys** | https://app.supabase.com → Project Settings → API |

---

## 🔐 Security Reminders

✅ **DO:**
- Put Key Secret in backend/.env
- Put Key ID in both backend/.env and frontend/.env.local
- Add .env to .gitignore
- Use test keys (rzp_test_) for development

❌ **DON'T:**
- Commit .env files to Git
- Share your Key Secret publicly
- Put Key Secret in frontend
- Use live keys (rzp_live_) without KYC

---

## 🆘 Need More Help?

See detailed guide: **`RAZORPAY_SETUP_GUIDE.md`**

---

**That's all! You're ready to accept payments!** 🎉

