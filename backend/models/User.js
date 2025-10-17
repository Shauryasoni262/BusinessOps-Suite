const bcrypt = require('bcryptjs');
const { supabase } = require('../config/database');

// User model functions for PostgreSQL
const User = {
  // Find user by email
  findByEmail: async (email) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code === 'PGRST116') {
        return null; // User not found
      }
      
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error finding user by email:', error.message);
      throw error;
    }
  },

  // Find user by ID
  findById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code === 'PGRST116') {
        return null; // User not found
      }
      
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error finding user by ID:', error.message);
      throw error;
    }
  },

  // Create new user
  create: async (userData) => {
    try {
      const { name, email, password } = userData;
      
      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            name,
            email,
            password: hashedPassword,
            role: 'user'
          }
        ])
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = data;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  },

  // Validate password
  validatePassword: async (password, hashedPassword) => {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error('Error validating password:', error.message);
      return false;
    }
  },

  // Get all users (for admin)
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting all users:', error.message);
      throw error;
    }
  },

  // Update user
  update: async (id, updateData) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = data;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error updating user:', error.message);
      throw error;
    }
  },

  // Delete user
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting user:', error.message);
      throw error;
    }
  }
};

module.exports = User;
