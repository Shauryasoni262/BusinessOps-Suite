const { OAuth2Client } = require('google-auth-library');

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error('❌ Missing Google OAuth credentials');
  console.error('Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env file');
}

// Create OAuth2 client
const oauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL
);

// Generate Google OAuth URL
const getGoogleAuthURL = (state = null) => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];

  const authOptions = {
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true
  };

  if (state) {
    authOptions.state = state;
  }

  return oauth2Client.generateAuthUrl(authOptions);
};

// Verify Google OAuth token
const verifyGoogleToken = async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info from Google
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      verified: payload.email_verified
    };
  } catch (error) {
    const errorDetail = error?.response?.data?.error_description || error?.response?.data?.error || error?.message || 'Invalid Google token';
    console.error('Google token verification error details:', errorDetail, error?.response?.data || error);
    throw new Error(errorDetail);
  }
};

// Verify Google ID token (for One Tap/Identity Services)
const verifyGoogleIdToken = async (idToken) => {
  try {
    const ticket = await oauth2Client.verifyIdToken({
      idToken: idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      verified: payload.email_verified
    };
  } catch (error) {
    console.error('Google ID token verification error:', error);
    throw new Error('Invalid Google ID token');
  }
};

module.exports = {
  getGoogleAuthURL,
  verifyGoogleToken,
  verifyGoogleIdToken,
  oauth2Client
};
