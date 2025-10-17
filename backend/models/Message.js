const { supabase } = require('../config/database');

class Message {
  constructor() {
    this.tableName = 'messages';
  }

  // Create messages table if it doesn't exist
  async createTable() {
    try {
      // Check if table exists by trying to select from it
      const { data, error } = await supabase
        .from(this.tableName)
        .select('id')
        .limit(1);

      if (error && (error.code === 'PGRST116' || error.message.includes('Could not find the table'))) {
        // Table doesn't exist, we need to create it
        console.log(`📝 Messages table doesn't exist. Please create it in Supabase dashboard.`);
        console.log(`📝 Go to your Supabase dashboard → SQL Editor and run this SQL:`);
        console.log(`
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  room VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_room_timestamp ON messages (room, timestamp);
        `);
        console.log(`📝 After creating the table, restart the server.`);
        
        // For now, we'll skip the table creation and let the user create it manually
        console.log(`⚠️ Skipping messages table creation. Please create it manually.`);
        return true;
      } else if (error) {
        console.error('❌ Error checking messages table:', error.message);
        throw error;
      } else {
        console.log(`✅ Messages table exists and is accessible`);
        return true;
      }
      
    } catch (error) {
      console.error('❌ Error creating messages table:', error.message);
      throw error;
    }
  }

  // Save a new message
  async saveMessage(room, userId, username, message) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert([
          {
            room: room,
            user_id: userId,
            username: username,
            message: message
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Error saving message:', error.message);
        throw error;
      }
      
      console.log(`💾 Message saved: ${username} in room ${room}`);
      return {
        id: data.id,
        room: data.room,
        userId: data.user_id,
        username: data.username,
        message: data.message,
        timestamp: new Date(data.timestamp)
      };
      
    } catch (error) {
      console.error('❌ Error saving message:', error.message);
      throw error;
    }
  }

  // Get message history for a room
  async getRoomMessages(room, limit = 50) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('id, room, user_id, username, message, timestamp')
        .eq('room', room)
        .order('timestamp', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('❌ Error getting room messages:', error.message);
        throw error;
      }
      
      return data || [];
      
    } catch (error) {
      console.error('❌ Error getting room messages:', error.message);
      throw error;
    }
  }

  // Get recent messages across all rooms
  async getRecentMessages(limit = 20) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('id, room, user_id, username, message, timestamp')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error getting recent messages:', error.message);
        throw error;
      }
      
      return data || [];
      
    } catch (error) {
      console.error('❌ Error getting recent messages:', error.message);
      throw error;
    }
  }

  // Delete old messages (cleanup function)
  async deleteOldMessages(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const { data, error } = await supabase
        .from(this.tableName)
        .delete()
        .lt('timestamp', cutoffDate.toISOString())
        .select();

      if (error) {
        console.error('❌ Error deleting old messages:', error.message);
        throw error;
      }
      
      const deletedCount = data ? data.length : 0;
      console.log(`🗑️ Deleted ${deletedCount} old messages`);
      return deletedCount;
      
    } catch (error) {
      console.error('❌ Error deleting old messages:', error.message);
      throw error;
    }
  }
}

module.exports = Message;
