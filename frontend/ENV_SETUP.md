# Environment Variables Setup

## Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Backend Environment Variables

Add these to your `backend/.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

## How to Get Razorpay Credentials

1. **Go to Razorpay Dashboard**: https://dashboard.razorpay.com/
2. **Sign up/Login** to your account
3. **Go to Settings > API Keys**
4. **Copy the following values**:
   - **Key ID** → Use as `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - **Key Secret** → Use as `RAZORPAY_KEY_SECRET`
   - **Webhook Secret** → Use as `RAZORPAY_WEBHOOK_SECRET`

## Database Setup

Run the payments schema in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of backend/database/payments_schema.sql
```
