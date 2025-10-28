# 🚀 BusinessOps Suite - Database Setup Guide

## 📋 Prerequisites
- ✅ Supabase account created
- ✅ Project created in Supabase
- ✅ Environment variables configured

## 🔧 Step 1: Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on **Settings** → **API**
3. Copy the following values:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

## 🔑 Step 2: Update Environment Variables

Add these to your `backend/.env` file:

```env
# Database Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJ...your-anon-key-here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 🗄️ Step 3: Create Database Table

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `backend/database/setup.sql`
5. Click **Run** to execute the SQL

This will create:
- ✅ `users` table with proper structure
- ✅ Indexes for performance
- ✅ Default admin user
- ✅ Row Level Security policies

## 🧪 Step 4: Test the Setup

Start your backend server:

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Starting BusinessOps Suite API Server...
✅ Database connection successful
✅ Users table exists and is accessible
✅ Admin user already exists
🚀 Server is running on port 5000
```

## 🔐 Step 5: Test Authentication

### Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get profile (with token):
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🎯 Default Admin Credentials

- **Email**: `admin@businessops.com`
- **Password**: `admin123`
- **Role**: `admin`

⚠️ **Important**: Change the admin password after first login!

## 🔍 Troubleshooting

### Database Connection Issues
- ✅ Check your `SUPABASE_URL` and `SUPABASE_KEY` in `.env`
- ✅ Ensure your Supabase project is active
- ✅ Verify the SQL setup script ran successfully

### Authentication Issues
- ✅ Check JWT_SECRET is set in `.env`
- ✅ Ensure users table exists in Supabase
- ✅ Verify password hashing is working

### Common Errors
- **"Users table not found"**: Run the SQL setup script
- **"Invalid credentials"**: Check email/password combination
- **"Token expired"**: Login again to get a new token

## 📊 Database Schema

### Users Table Structure
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 Next Steps

1. ✅ Database setup complete
2. 🔄 Connect frontend to auth APIs
3. 📊 Add more protected routes
4. 🔐 Add password reset functionality
5. 📈 Add user management features

## 📞 Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all environment variables are set
3. Ensure Supabase project is active
4. Check the SQL setup script ran successfully
