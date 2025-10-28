# Environment Variables Setup

Create a `.env` file in the `backend` directory with the following variables:

## Required Variables

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
```

## Optional Variables

### Google OAuth (Optional - for Google login)
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/google/callback
```

### Razorpay (Optional - for payment gateway)
```bash
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret
```

## Notes

- The server will start without Razorpay credentials, but payment features will be disabled
- Make sure to add `.env` to your `.gitignore` file to avoid committing sensitive data
- In production, use strong secrets and never commit them to version control

