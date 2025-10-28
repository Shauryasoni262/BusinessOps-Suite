const { initializeChatSocket } = require('./chat.socket');
const { initializeProjectSocket } = require('./project.socket');

/**
 * Initialize all socket handlers
 */
const initializeSockets = (io) => {
  console.log('🔌 Initializing Socket.IO handlers...');

  // Initialize chat socket handlers
  const messageModel = initializeChatSocket(io);

  // Initialize project socket handlers
  const projectSocketEvents = initializeProjectSocket(io);

  console.log('✅ Socket.IO handlers initialized');

  return {
    messageModel,
    projectSocketEvents
  };
};

module.exports = { initializeSockets };

