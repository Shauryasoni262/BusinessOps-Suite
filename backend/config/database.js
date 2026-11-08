const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please add SUPABASE_URL and SUPABASE_KEY (or SUPABASE_SERVICE_ROLE_KEY) to your .env file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test database connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('📊 Database connected successfully (users table not found yet)');
      return true;
    } else if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    } else {
      console.log('✅ Database connected successfully');
      return true;
    }
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
};

module.exports = {
  supabase,
  testConnection
};
