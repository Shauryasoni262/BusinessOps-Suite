/**
 * Initialize project socket handlers
 */
const initializeProjectSocket = (io) => {
  io.on('connection', (socket) => {
    // When a user joins a project room for real-time updates
    socket.on('join_project', (projectId) => {
      socket.join(`project_${projectId}`);
      console.log(`👤 User ${socket.username || socket.id} joined project room: ${projectId}`);
    });

    // When a user leaves a project room
    socket.on('leave_project', (projectId) => {
      socket.leave(`project_${projectId}`);
      console.log(`👤 User ${socket.username || socket.id} left project room: ${projectId}`);
    });
  });

  // Project socket event emitters
  const projectSocketEvents = {
    // Emit project update to all members
    emitProjectUpdate: (projectId, data) => {
      io.to(`project_${projectId}`).emit('project:update', data);
    },

    // Emit task update to project members
    emitTaskUpdate: (projectId, action, task) => {
      io.to(`project_${projectId}`).emit(`task:${action}`, task);
    },

    // Emit milestone update to project members
    emitMilestoneUpdate: (projectId, action, milestone) => {
      io.to(`project_${projectId}`).emit(`milestone:${action}`, milestone);
    },

    // Emit member update to project members
    emitMemberUpdate: (projectId, action, member) => {
      io.to(`project_${projectId}`).emit(`member:${action}`, member);
    },

    // Emit file update to project members
    emitFileUpdate: (projectId, action, file) => {
      io.to(`project_${projectId}`).emit(`file:${action}`, file);
    }
  };

  return projectSocketEvents;
};

module.exports = { initializeProjectSocket };

