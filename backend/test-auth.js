// Test script for authentication endpoints
const testAuth = async () => {
  const baseURL = 'http://localhost:5000/api/auth';
  
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Register a new user
    console.log('1️⃣ Testing user registration...');
    const registerResponse = await fetch(`${baseURL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('✅ Registration:', registerData.success ? 'SUCCESS' : 'FAILED');
    console.log('   Response:', registerData.message);
    
    if (registerData.success) {
      console.log('   Token:', registerData.data.token.substring(0, 20) + '...');
    }

    // Test 2: Login with existing user
    console.log('\n2️⃣ Testing user login...');
    const loginResponse = await fetch(`${baseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@businessops.com',
        password: 'password'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login:', loginData.success ? 'SUCCESS' : 'FAILED');
    console.log('   Response:', loginData.message);
    
    if (loginData.success) {
      console.log('   User:', loginData.data.user.name);
      console.log('   Token:', loginData.data.token.substring(0, 20) + '...');
      
      // Test 3: Access protected route
      console.log('\n3️⃣ Testing protected route...');
      const profileResponse = await fetch(`${baseURL}/profile`, {
        headers: {
          'Authorization': `Bearer ${loginData.data.token}`
        }
      });
      
      const profileData = await profileResponse.json();
      console.log('✅ Profile:', profileData.success ? 'SUCCESS' : 'FAILED');
      console.log('   Response:', profileData.message);
      
      if (profileData.success) {
        console.log('   User Profile:', profileData.data.user.name, '-', profileData.data.user.email);
      }
    }

    // Test 4: Test without token (should fail)
    console.log('\n4️⃣ Testing protected route without token...');
    const noTokenResponse = await fetch(`${baseURL}/profile`);
    const noTokenData = await noTokenResponse.json();
    console.log('✅ No Token Test:', noTokenData.success ? 'FAILED (should fail)' : 'SUCCESS (correctly failed)');
    console.log('   Response:', noTokenData.message);

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
};

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  testAuth();
}

module.exports = testAuth;
