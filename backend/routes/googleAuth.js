const express = require('express');
const router = express.Router();
const { getGoogleAuthURL, verifyGoogleToken } = require('../config/googleAuth');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Google OAuth login route
router.get('/google', (req, res) => {
  try {
    const authURL = getGoogleAuthURL();
    res.redirect(authURL);
  } catch (error) {
    console.error('Google auth URL generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate Google auth URL'
    });
  }
});

// Google OAuth callback route
router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code not provided'
      });
    }

    // Verify the Google token and get user info
    const googleUser = await verifyGoogleToken(code);

    if (!googleUser.verified) {
      return res.status(400).json({
        success: false,
        message: 'Google email not verified'
      });
    }

    // Check if user already exists
    let user = await User.findByEmail(googleUser.email);

    if (!user) {
      // Create new user with Google info
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        password: 'google_oauth_user', // Dummy password for OAuth users
        role: 'user'
      });
    }

    // Generate JWT token
    const token = generateToken(user);
    console.log('✅ Google OAuth successful for user:', user.email);
    console.log('✅ Generated token:', token.substring(0, 50) + '...');

    // Redirect to frontend with token
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const successURL = `${frontendURL}/auth/google-success?token=${token}`;
    console.log('✅ Redirecting to:', successURL);
    res.redirect(successURL);

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const errorURL = `${frontendURL}/auth/google-error?message=${encodeURIComponent(error.message)}`;
    res.redirect(errorURL);
  }
});

// Google OAuth success route (for testing)
router.get('/google/success', (req, res) => {
  res.json({
    success: true,
    message: 'Google OAuth login successful',
    data: req.user
  });
});

module.exports = router;
