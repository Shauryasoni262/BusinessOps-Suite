# 🚀 Vercel Frontend + Railway Backend Connection Guide

## 🎯 What You Need

1. ✅ Your Railway backend URL (from Railway dashboard)
2. ✅ Your Vercel project (frontend deployed)

---

## 📍 Step 1: Get Your Railway Backend URL

### Finding Your Railway URL:

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your **BusinessOps-Suite** project
3. Click on your backend service
4. Go to **Settings** tab
5. Scroll to **Networking** section
6. Look for **Public Domain**
7. Copy the URL (looks like: `https://businessops-suite-production-xxxx.railway.app`)

**If you don't see a domain:**
- Click **Generate Domain** button
- Wait a few seconds
- Copy the generated URL

---

## ⚙️ Step 2: Configure Vercel Environment Variables

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **frontend project** (BusinessOps-Suite or similar)
3. Click **Settings** tab
4. Click **Environment Variables** in the sidebar
5. Add a new environment variable:

```
Name:  NEXT_PUBLIC_API_URL
Value: https://your-backend.railway.app/api
```

**⚠️ IMPORTANT:** 
- Add `/api` at the end of your Railway URL
- Make sure it's `https://` not `http://`
- No trailing slash after `/api`

**Example:**
```
✅ Correct: https://businessops-suite-production-a1b2c3.railway.app/api
❌ Wrong:   https://businessops-suite-production-a1b2c3.railway.app/api/
❌ Wrong:   https://businessops-suite-production-a1b2c3.railway.app
```

6. Select all environments (Production, Preview, Development)
7. Click **Save**

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Link to your project
vercel link

# Add environment variable
vercel env add NEXT_PUBLIC_API_URL production
# Paste your Railway URL with /api: https://your-backend.railway.app/api

# Add for preview
vercel env add NEXT_PUBLIC_API_URL preview

# Add for development
vercel env add NEXT_PUBLIC_API_URL development
```

---

## 🔄 Step 3: Redeploy Frontend

After adding environment variables, you need to redeploy:

### Option A: Trigger via Git Push
```bash
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```

### Option B: Manual Redeploy
1. Go to Vercel Dashboard → Your Project
2. Go to **Deployments** tab
3. Click on the latest deployment
4. Click **...** (three dots)
5. Click **Redeploy**
6. Check **Use existing Build Cache** (unchecked)
7. Click **Redeploy**

---

## ✅ Step 4: Verify Connection

Once Vercel redeployment completes:

### Test 1: Check Environment Variable

1. Open your Vercel app: `https://your-app.vercel.app`
2. Open browser console (F12)
3. Run:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL);
```

**Expected:** Should show your Railway backend URL

### Test 2: Test Login

1. Go to your Vercel app
2. Click **Sign In** or **Sign Up**
3. Try to register/login
4. Check browser console for errors

**Success indicators:**
- ✅ No "localhost" errors
- ✅ Requests go to your Railway URL
- ✅ User can register and login

### Test 3: Check Network Tab

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try to login
4. Look at the request URL
5. Should be: `https://your-backend.railway.app/api/auth/login`

---

## 🔧 Update Backend CORS for Vercel

Your backend needs to allow requests from your Vercel frontend.

### In Railway Dashboard:

1. Go to your **backend service** on Railway
2. Go to **Variables** tab
3. Find or add `FRONTEND_URL`
4. Set value to: `https://your-app.vercel.app`
5. Click **Save**
6. Backend will auto-redeploy

**Example:**
```
FRONTEND_URL=https://businessops-suite.vercel.app
```

---

## 🔍 Troubleshooting

### Issue 1: "This site can't be reached" / "localhost:5000"

**Problem:** Frontend still trying to connect to localhost

**Solution:**
1. Verify `NEXT_PUBLIC_API_URL` is set in Vercel
2. Redeploy Vercel (don't use build cache)
3. Hard refresh browser (Ctrl+Shift+R)

### Issue 2: CORS Error

**Problem:** 
```
Access to fetch at 'https://your-backend.railway.app/api/...' 
has been blocked by CORS policy
```

**Solution:**
1. Set `FRONTEND_URL` in Railway environment variables
2. Make sure it matches your Vercel URL exactly
3. Redeploy backend on Railway

### Issue 3: 404 Not Found on API Calls

**Problem:** API endpoints return 404

**Solution:**
1. Check if your Railway backend is running (check logs)
2. Test backend directly: `curl https://your-backend.railway.app/api/health`
3. Make sure Railway generated a public domain

### Issue 4: Google OAuth Not Working

**Problem:** Google login redirects to localhost

**Solution:**
1. Update Google OAuth redirect URI in [Google Console](https://console.cloud.google.com/):
   - Add: `https://your-backend.railway.app/api/auth/google/callback`
   - Add: `https://your-app.vercel.app/auth/google-success`

2. Update `GOOGLE_REDIRECT_URI` in Railway:
   ```
   GOOGLE_REDIRECT_URI=https://your-backend.railway.app/api/auth/google/callback
   ```

---

## 📋 Environment Variables Checklist

### Vercel (Frontend) Environment Variables:

- [ ] `NEXT_PUBLIC_API_URL` = `https://your-backend.railway.app/api`
- [ ] (Optional) `NEXT_PUBLIC_RAZORPAY_KEY_ID` = your Razorpay key

### Railway (Backend) Environment Variables:

- [ ] `NODE_ENV` = `production`
- [ ] `JWT_SECRET` = your-secret-key
- [ ] `SUPABASE_URL` = your-supabase-url
- [ ] `SUPABASE_ANON_KEY` = your-key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = your-key
- [ ] `FRONTEND_URL` = `https://your-app.vercel.app`
- [ ] (Optional) Google OAuth credentials
- [ ] (Optional) Razorpay credentials

---

## 🧪 Complete Test Flow

After everything is configured:

### 1. Test Backend Health
```bash
curl https://your-backend.railway.app/api/health
```

Expected:
```json
{"status":"OK","timestamp":"...","uptime":123}
```

### 2. Test Frontend Connection

1. Open `https://your-app.vercel.app`
2. Open browser console
3. Go to **Network** tab
4. Click **Register** or **Login**
5. Check request URLs - should all go to Railway

### 3. Test Full Registration Flow

1. Go to `https://your-app.vercel.app/auth/register`
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123456
3. Click **Create Account**
4. Should redirect to `/dashboard`
5. Check if you're logged in

### 4. Test Project Creation

1. Go to Dashboard
2. Click **Create Project**
3. Fill in project details
4. Save
5. Project should appear in list

---

## 🎯 Success Criteria

Your deployment is successful when:

- [x] ✅ Frontend loads on Vercel URL
- [ ] ✅ No "localhost" errors in console
- [ ] ✅ User can register/login
- [ ] ✅ Dashboard loads after login
- [ ] ✅ Can create projects
- [ ] ✅ Real-time chat works
- [ ] ✅ File uploads work
- [ ] ✅ API calls go to Railway backend

---

## 📱 Custom Domains (Optional)

### For Frontend (Vercel):

1. Vercel Dashboard → Settings → Domains
2. Add your domain: `yourdomain.com`
3. Add DNS records as shown
4. Update `FRONTEND_URL` in Railway to your custom domain

### For Backend (Railway):

1. Railway Dashboard → Settings → Networking
2. Click **Add Custom Domain**
3. Enter: `api.yourdomain.com`
4. Add CNAME record to your DNS
5. Update `NEXT_PUBLIC_API_URL` in Vercel to your custom domain

---

## 🆘 Still Having Issues?

### Check These:

1. **Railway Backend Logs:**
   - Railway Dashboard → Deployments → View Logs
   - Look for errors or startup messages

2. **Vercel Build Logs:**
   - Vercel Dashboard → Deployments → Click deployment
   - Check if env vars are loaded

3. **Browser Console:**
   - Open DevTools (F12)
   - Check Console for errors
   - Check Network tab for failed requests

### Common Mistakes:

❌ Forgot to add `/api` to `NEXT_PUBLIC_API_URL`  
❌ Using `http://` instead of `https://`  
❌ Trailing slash in URLs  
❌ Forgot to redeploy after adding env vars  
❌ CORS not configured (missing `FRONTEND_URL` in Railway)  

---

## 📚 Quick Reference

| Service | Dashboard URL | Purpose |
|---------|--------------|---------|
| Railway | https://railway.app/dashboard | Backend hosting |
| Vercel | https://vercel.com/dashboard | Frontend hosting |
| Supabase | https://supabase.com/dashboard | Database |
| Google Console | https://console.cloud.google.com | OAuth setup |

---

**Your setup:**
- 🎨 Frontend: Vercel
- 🔧 Backend: Railway  
- 💾 Database: Supabase
- 🔐 Auth: JWT + Google OAuth
- 💳 Payments: Razorpay (optional)

---

Need more help? Check the Railway and Vercel logs first - they usually have detailed error messages!

