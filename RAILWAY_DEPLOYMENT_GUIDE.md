# 🚂 Railway Backend Deployment Guide

## ✅ What's Been Fixed

1. ✅ Created `railway.json` - Railway service configuration
2. ✅ Created `nixpacks.toml` - Nixpacks build configuration  
3. ✅ Added `build` script to `package.json`
4. ✅ Updated CORS to use environment variables
5. ✅ Configured proper port handling for Railway

## 🔧 Railway Dashboard Configuration

### Step 1: Set Root Directory

**This is the most important step!**

1. Go to your Railway project dashboard
2. Click on your **BusinessOps-Suite** service
3. Go to **Settings** tab
4. Scroll down to **Root Directory**
5. Enter: `backend`
6. Click **Save Changes**

### Step 2: Configure Build & Deploy Commands

In **Settings** → scroll to **Deploy**:

- **Build Command**: Leave empty (uses railway.json config)
- **Start Command**: Leave empty (uses railway.json config)
- **Watch Paths**: `backend/**`

### Step 3: Add Environment Variables

Go to **Variables** tab and add these one by one:

#### Required Variables:
```bash
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### Optional Variables (if using these features):
```bash
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_REDIRECT_URI=https://your-backend.railway.app/api/google/callback
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
```

**Note**: Railway automatically provides `PORT` via `${{RAILWAY_PORT}}` - don't set it manually!

### Step 4: Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 5: Generate Strong JWT Secret

Run this in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

### Step 6: Redeploy

After configuring everything:

1. Click **Deploy** → **Redeploy**
2. Or push a new commit to trigger auto-deployment

## 🔍 Verify Deployment

### Check Build Logs

In Railway dashboard:
- Go to **Deployments** tab
- Click on the latest deployment
- Watch the logs for:

```
✅ Database connected successfully
✅ Socket.IO handlers initialized
🚀 Server is running on port XXXX
```

### Test Your Deployed API

Once deployed, Railway will give you a URL like: `https://businessops-suite-production-xxxx.railway.app`

Test these endpoints:

#### 1. Health Check
```bash
curl https://your-backend.railway.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-10-29T...",
  "uptime": 123.45
}
```

#### 2. Root Endpoint
```bash
curl https://your-backend.railway.app/
```

Should return API information with all available endpoints.

#### 3. Test Registration
```bash
curl -X POST https://your-backend.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

## 🐛 Troubleshooting

### Error: "creating build plan with Nixpacks"

**Solution**: Make sure **Root Directory** is set to `backend` in Settings.

### Error: "Cannot find module"

**Solution**: 
- Check that `node_modules` is not in `.gitignore` for backend
- Verify `npm install` runs successfully in build logs

### Error: "Database connection failed"

**Solution**: 
- Verify Supabase credentials in Railway Variables
- Make sure you used the **service_role** key, not just anon key
- Check Supabase project is not paused

### Error: "CORS policy blocked"

**Solution**: 
- Set `FRONTEND_URL` environment variable in Railway
- Make sure it matches your frontend domain exactly (no trailing slash)
- Redeploy after adding the variable

### Error: "Port already in use"

**Solution**: 
- Remove any hardcoded `PORT=5000` from Railway variables
- Railway automatically assigns a port via `process.env.PORT`

### Build succeeds but app crashes immediately

**Check these in order:**
1. All required env variables are set
2. Database connection string is correct
3. JWT_SECRET is set
4. No syntax errors in code (check build logs)

## 📊 Monitoring Your Deployment

### View Logs
```
Railway Dashboard → Deployments → Click deployment → View Logs
```

### Check Metrics
```
Railway Dashboard → Metrics
- CPU Usage
- Memory Usage
- Network Traffic
```

### Set Up Alerts
```
Railway Dashboard → Settings → Notifications
- Enable Discord/Slack/Email notifications
- Get alerted on deployment failures
```

## 🔗 Connect Frontend to Backend

Once backend is deployed, update your frontend:

### In `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

### Test the connection:
```javascript
// In your frontend
fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
  .then(res => res.json())
  .then(data => console.log('Backend status:', data));
```

## 📝 Database Setup Checklist

Make sure you've run these SQL scripts in Supabase:

- [ ] `backend/database/schemas/01_users.sql`
- [ ] `backend/database/schemas/02_projects.sql`
- [ ] `backend/database/schemas/03_analytics.sql`
- [ ] `backend/database/schemas/04_payments.sql`
- [ ] `backend/database/schemas/05_files.sql`

**Optional migrations:**
- [ ] `backend/database/migrations/001_add_role_to_members.sql`
- [ ] `backend/database/migrations/002_add_event_type_to_milestones.sql`
- [ ] `backend/database/migrations/003_update_project_status.sql`

## ✅ Deployment Success Checklist

Your backend is ready when:

- [x] ✅ Railway build completes successfully
- [ ] ✅ Health check returns 200 OK
- [ ] ✅ Can register a new user
- [ ] ✅ Can login and receive JWT token
- [ ] ✅ Protected routes require authentication
- [ ] ✅ Database queries work
- [ ] ✅ Socket.IO connections work
- [ ] ✅ No critical errors in logs
- [ ] ✅ All environment variables set

## 🎯 Next Steps

1. Deploy your frontend (Vercel recommended)
2. Update `FRONTEND_URL` in Railway with your production frontend URL
3. Update `NEXT_PUBLIC_API_URL` in your frontend with your Railway backend URL
4. Set up custom domain (optional)
5. Enable SSL/HTTPS (Railway does this automatically)

## 🚀 Quick Commands

```bash
# View live logs
railway logs

# Redeploy
railway up

# View environment variables
railway variables

# Open Railway dashboard
railway open
```

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Nixpacks Documentation](https://nixpacks.com/)
- [Supabase Documentation](https://supabase.com/docs)

---

**Need help?** Check your Railway deployment logs first - they usually contain detailed error messages!

