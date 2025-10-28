# 🚀 Quick Start Guide

This guide will help you get the project up and running in minutes.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase account and project

## Step 1: Backend Setup

### 1.1 Install Dependencies

```bash
cd backend
npm install
```

### 1.2 Create Environment File

Create a `.env` file in the `backend` directory:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/google/callback

# Optional: Razorpay Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret
```

**Note:** Razorpay credentials are optional. The server will run without them, but payment features will be disabled.

### 1.3 Database Setup

Run the SQL scripts in your Supabase SQL Editor in this order:

1. `backend/database/setup.sql` - Creates base tables
2. `backend/database/projects_schema.sql` - Creates project-related tables
3. `backend/database/payments_schema.sql` - Creates payment tables (optional)
4. `backend/database/setup_file_storage.sql` - Sets up file storage

### 1.4 Start Backend Server

```bash
cd backend
npm start
```

You should see:
```
✅ Database connected successfully
🚀 Server is running on port 5000
📡 API available at http://localhost:5000
⚠️  Razorpay credentials not found. Payment gateway features will be disabled.
```

## Step 2: Frontend Setup

### 2.1 Install Dependencies

Open a **new terminal window** and run:

```bash
cd frontend
npm install
```

### 2.2 Create Environment File (Optional)

Create a `.env.local` file in the `frontend` directory:

```bash
# API Configuration (defaults to localhost:5000 if not set)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Optional: Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

**Note:** If you don't create this file, the app will use the default values.

### 2.3 Start Frontend Server

```bash
cd frontend
npm run dev
```

You should see:
```
✓ Ready in 2.5s
➜  Local:   http://localhost:3000
```

## Step 3: Access the Application

1. Open your browser and go to: **http://localhost:3000**
2. Register a new account or login
3. Start creating projects!

## Common Issues & Solutions

### ❌ "Failed to fetch" Error

**Cause:** Backend server is not running

**Solution:** 
1. Make sure backend is running on port 5000
2. Check terminal for any errors
3. Verify `.env` file has correct Supabase credentials

### ❌ "TypeError: argument handler is required"

**Cause:** Auth middleware import error

**Solution:** Already fixed! Just restart the backend server.

### ❌ "Razorpay key_id is mandatory"

**Cause:** Missing Razorpay credentials

**Solution:** Already fixed! Server now runs without Razorpay. Add credentials only if you need payment features.

### ❌ Database Connection Error

**Cause:** Incorrect Supabase credentials

**Solution:**
1. Check your Supabase project URL
2. Verify your API keys are correct
3. Make sure you copied the Service Role key (not the anon key)

### ❌ Port Already in Use

**Cause:** Another process is using port 5000 or 3000

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

## Testing the API

Test if backend is working:

```bash
# Health check
curl http://localhost:5000/api/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## Next Steps

✅ Backend running on http://localhost:5000  
✅ Frontend running on http://localhost:3000  
✅ Database connected  

Now you can:
- Create projects
- Add team members
- Create tasks and milestones
- Upload files
- Use real-time chat
- Generate invoices (if Razorpay is configured)

## Need Help?

- Check `backend/ENV_VARIABLES.md` for detailed environment setup
- Check `frontend/ENV_SETUP.md` for frontend configuration
- Look at error logs in both terminal windows
- Verify all database migrations ran successfully

---

**Happy Coding! 🎉**

