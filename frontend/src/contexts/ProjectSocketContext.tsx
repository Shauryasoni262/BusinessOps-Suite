'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from '@/hooks/useSocket';

interface ProjectSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
  currentProjectId: string | null;
  joinProject: (projectId: string) => void;
  leaveProject: (projectId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onProjectUpdate: (callback: (data: any) => void) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTaskUpdate: (callback: (action: string, task: any) => void) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMilestoneUpdate: (callback: (action: string, milestone: any) => void) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMemberUpdate: (callback: (action: string, member: any) => void) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFileUpdate: (callback: (action: string, file: any) => void) => void;
}

const ProjectSocketContext = createContext<ProjectSocketContextType | undefined>(undefined);

interface ProjectSocketProviderProps {
  children: React.ReactNode;
}

export const ProjectSocketProvider: React.FC<ProjectSocketProviderProps> = ({ children }) => {
  const { socket, isConnected, error } = useSocket();
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const joinProject = (projectId: string) => {
    if (socket && isConnected) {
      socket.emit('join_project', projectId);
      setCurrentProjectId(projectId);
      console.log(`🔌 Joined project room: ${projectId}`);
    }
  };

  const leaveProject = (projectId: string) => {
    if (socket && isConnected) {
      socket.emit('leave_project', projectId);
      setCurrentProjectId(null);
      console.log(`🔌 Left project room: ${projectId}`);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onProjectUpdate = (callback: (data: any) => void) => {
    if (socket) {
      socket.on('project:update', callback);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onTaskUpdate = (callback: (action: string, task: any) => void) => {
    if (socket) {
      socket.on('task:created', (task) => callback('created', task));
      socket.on('task:updated', (task) => callback('updated', task));
      socket.on('task:deleted', (task) => callback('deleted', task));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMilestoneUpdate = (callback: (action: string, milestone: any) => void) => {
    if (socket) {
      socket.on('milestone:created', (milestone) => callback('created', milestone));
      socket.on('milestone:updated', (milestone) => callback('updated', milestone));
      socket.on('milestone:deleted', (milestone) => callback('deleted', milestone));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMemberUpdate = (callback: (action: string, member: any) => void) => {
    if (socket) {
      socket.on('member:added', (member) => callback('added', member));
      socket.on('member:removed', (member) => callback('removed', member));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFileUpdate = (callback: (action: string, file: any) => void) => {
    if (socket) {
      socket.on('file:uploaded', (file) => callback('uploaded', file));
      socket.on('file:deleted', (file) => callback('deleted', file));
    }
  };

  // Cleanup listeners when socket changes
  useEffect(() => {
    return () => {
      if (socket) {
        socket.off('project:update');
        socket.off('task:created');
        socket.off('task:updated');
        socket.off('task:deleted');
        socket.off('milestone:created');
        socket.off('milestone:updated');
        socket.off('milestone:deleted');
        socket.off('member:added');
        socket.off('member:removed');
        socket.off('file:uploaded');
        socket.off('file:deleted');
      }
    };
  }, [socket]);

  const value: ProjectSocketContextType = {
    socket,
    isConnected,
    error,
    currentProjectId,
    joinProject,
    leaveProject,
    onProjectUpdate,
    onTaskUpdate,
    onMilestoneUpdate,
    onMemberUpdate,
    onFileUpdate,
  };

  return (
    <ProjectSocketContext.Provider value={value}>
      {children}
    </ProjectSocketContext.Provider>
  );
};

export const useProjectSocket = (): ProjectSocketContextType => {
  const context = useContext(ProjectSocketContext);
  if (context === undefined) {
    throw new Error('useProjectSocket must be used within a ProjectSocketProvider');
  }
  return context;
};
