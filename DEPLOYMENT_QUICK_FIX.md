# 🚨 QUICK FIX: Google OAuth Redirecting to Localhost

## The Problem
When clicking "Continue with Google", you're redirected to `localhost` instead of your Railway backend.

## The Solution (3 Steps)

### Step 1: Set Environment Variable in Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click your **backend service**
3. Go to **Variables** tab
4. Add or update:

```
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**⚠️ IMPORTANT:** Use your ACTUAL Vercel URL (no `/api` at the end)

Example:
```
FRONTEND_URL=https://businessops-suite.vercel.app
```

5. Click **Add** or **Update**
6. Backend will auto-redeploy (wait 2-3 minutes)

---

### Step 2: Set Environment Variable in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **frontend project**
3. Go to **Settings** → **Environment Variables**
4. Add:

```
Name:  NEXT_PUBLIC_API_URL
Value: https://your-backend.railway.app/api
```

**⚠️ IMPORTANT:** Add `/api` at the end!

Example:
```
NEXT_PUBLIC_API_URL=https://businessops-suite-production-a1b2.railway.app/api
```

5. Select **ALL** environments (Production, Preview, Development)
6. Click **Save**

---

### Step 3: Redeploy Both Services

#### Redeploy Vercel:
1. Go to Vercel → **Deployments**
2. Click latest deployment → **...** → **Redeploy**
3. **UNCHECK** "Use existing Build Cache"
4. Click **Redeploy**

#### Railway will auto-redeploy when you save the environment variable.

---

## How to Find Your URLs

### Find Railway Backend URL:
1. Railway Dashboard → Your Service
2. **Settings** → **Networking**
3. Look for the public domain or click **Generate Domain**
4. Copy: `https://something.railway.app`

### Find Vercel Frontend URL:
1. Vercel Dashboard → Your Project
2. Look at the top for "Visit" button
3. Or in Deployments, click latest deployment
4. Copy the URL shown: `https://something.vercel.app`

---

## Test After Redeployment

1. Wait 3-5 minutes for both deployments to complete
2. Go to your Vercel app
3. Click **Sign In** → **Continue with Google**
4. Should redirect to Google (not localhost!)

**Expected Flow:**
```
Your Vercel App 
  → Your Railway Backend (/api/auth/google)
  → Google Login Page
  → Your Railway Backend (/api/auth/google/callback)
  → Back to Your Vercel App (/auth/google-success)
```

---

## Still Not Working?

### Check These:

1. **Railway Backend Logs:**
   - Railway → Deployments → View Logs
   - Look for: `✅ Redirecting to: https://your-vercel-app.vercel.app/auth/google-success`
   - Should NOT say `localhost`

2. **Browser Network Tab:**
   - Open DevTools (F12)
   - Network tab
   - Click Google login
   - Check the request URLs - should all be `railway.app` not `localhost`

3. **Environment Variables:**
   - Railway: Check `FRONTEND_URL` is set correctly
   - Vercel: Check `NEXT_PUBLIC_API_URL` is set correctly
   - Both should be `https://` not `http://`

4. **Google Cloud Console:**
   - Go to [Google Console](https://console.cloud.google.com/)
   - APIs & Services → Credentials
   - Edit your OAuth 2.0 Client
   - Add to Authorized redirect URIs:
     ```
     https://your-backend.railway.app/api/auth/google/callback
     ```

---

## Environment Variables Checklist

### Railway (Backend):
- [ ] `FRONTEND_URL` = `https://your-app.vercel.app` (no `/api`)
- [ ] `GOOGLE_CLIENT_ID` = your Google client ID
- [ ] `GOOGLE_CLIENT_SECRET` = your Google secret
- [ ] `GOOGLE_CALLBACK_URL` = `https://your-backend.railway.app/api/auth/google/callback`
- [ ] All other required variables (JWT_SECRET, Supabase, etc.)

### Vercel (Frontend):
- [ ] `NEXT_PUBLIC_API_URL` = `https://your-backend.railway.app/api` (with `/api`)

---

## Quick Test Commands

### Test Backend Health:
```bash
curl https://your-backend.railway.app/api/health
```

### Test Backend Google Auth URL:
```bash
curl https://your-backend.railway.app/api/auth/google
```
Should redirect to Google.

---

## Common Mistakes

❌ Forgot to add environment variables  
❌ Used wrong URLs (localhost instead of production)  
❌ Forgot to redeploy after adding env vars  
❌ Didn't wait for deployment to complete  
❌ Forgot to uncheck "Use existing Build Cache" in Vercel  
❌ Added `/api` to `FRONTEND_URL` (should not have it)  
❌ Forgot `/api` in `NEXT_PUBLIC_API_URL` (should have it)  

---

## What I Fixed in the Code

✅ Backend Google OAuth now uses `FRONTEND_URL` environment variable  
✅ Frontend auth pages now use `API_ROUTES.BASE` (which uses `NEXT_PUBLIC_API_URL`)  
✅ All hardcoded `localhost` URLs removed  
✅ Server listens on `0.0.0.0` for Railway  

---

**Your Turn:** Set those environment variables and redeploy! 🚀


