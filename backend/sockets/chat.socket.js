const Message = require('../models/Message');

/**
 * Initialize chat socket handlers
 */
const initializeChatSocket = (io) => {
  const messageModel = new Message();

  // Create messages table if it doesn't exist
  messageModel.createTable().catch(err => {
    console.error('❌ Error creating messages table:', err.message);
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // When a user joins a chat room
    socket.on('join_room', async (data) => {
      const room = data.room || data; // Support both string and object formats
      const username = data.username || `User_${socket.id.substring(0, 6)}`; // Default username

      socket.join(room);
      socket.username = username; // Store username for this socket
      socket.currentRoom = room; // Store current room

      console.log(`👤 User ${username} (${socket.id}) joined room: ${room}`);

      // Load message history for the room
      try {
        const messageHistory = await messageModel.getRoomMessages(room, 50);

        // Send message history to the user who just joined
        socket.emit('message_history', {
          room: room,
          messages: messageHistory
        });

        // Notify others in the room
        socket.to(room).emit('user_joined', {
          message: `${username} joined the room`,
          username: username,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('❌ Error loading message history:', error.message);
        socket.emit('error', { message: 'Failed to load message history' });
      }
    });

    // When a user sends a message
    socket.on('send_message', async (data) => {
      try {
        const room = data.room || socket.currentRoom;
        const message = data.message;
        const username = socket.username || `User_${socket.id.substring(0, 6)}`;

        if (!room || !message) {
          socket.emit('error', { message: 'Room and message are required' });
          return;
        }

        console.log(`💬 Message from ${username} in room ${room}:`, message);

        // Save message to database
        const savedMessage = await messageModel.saveMessage(room, socket.id, username, message);

        // Broadcast the message to everyone in the room (including sender)
        io.to(room).emit('receive_message', {
          id: savedMessage.id,
          userId: socket.id,
          username: username,
          message: message,
          timestamp: savedMessage.timestamp,
          room: room
        });

      } catch (error) {
        console.error('❌ Error sending message:', error.message);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // When a user disconnects
    socket.on('disconnect', () => {
      const username = socket.username || `User_${socket.id.substring(0, 6)}`;
      const room = socket.currentRoom;

      console.log(`🔌 User ${username} (${socket.id}) disconnected`);

      // Notify others in the room
      if (room) {
        socket.to(room).emit('user_left', {
          message: `${username} left the room`,
          username: username,
          timestamp: new Date().toISOString()
        });
      }
    });
  });

  return messageModel;
};

module.exports = { initializeChatSocket };

