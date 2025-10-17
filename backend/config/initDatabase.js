const { supabase, testConnection } = require('../config/database');

// Initialize database
const initializeDatabase = async () => {
  console.log('🚀 Initializing database...');
  
  try {
    // Test connection
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('✅ Database connection successful');
      
      // Check if users table exists
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (error && error.code === 'PGRST116') {
        console.log('⚠️  Users table not found. Please run the SQL setup script in Supabase.');
        console.log('📄 SQL script location: backend/database/setup.sql');
        console.log('🔗 Supabase SQL Editor: https://supabase.com/dashboard/project/[YOUR_PROJECT]/sql');
        return false;
      } else if (error) {
        console.error('❌ Database error:', error.message);
        return false;
      } else {
        console.log('✅ Users table exists and is accessible');
        return true;
      }
    } else {
      console.log('❌ Database connection failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    return false;
  }
};

// Create default admin user if it doesn't exist
const createDefaultAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@businessops.com')
      .single();

    if (error && error.code === 'PGRST116') {
      console.log('👤 Creating default admin user...');
      
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const { data: newAdmin, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            name: 'Admin User',
            email: 'admin@businessops.com',
            password: hashedPassword,
            role: 'admin'
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Failed to create admin user:', insertError.message);
        return false;
      }

      console.log('✅ Default admin user created');
      console.log('📧 Email: admin@businessops.com');
      console.log('🔑 Password: admin123');
      console.log('⚠️  Please change the password after first login!');
      return true;
    } else if (error) {
      console.error('❌ Error checking admin user:', error.message);
      return false;
    } else {
      console.log('✅ Admin user already exists');
      return true;
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    return false;
  }
};

module.exports = {
  initializeDatabase,
  createDefaultAdmin
};
