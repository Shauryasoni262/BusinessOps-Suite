import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
}

export const useSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only connect if we have a token (user is authenticated)
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    // Get the base URL without '/api' suffix for Socket.IO connection
    let socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    // Remove '/api' suffix if present, as Socket.IO connects to the base server
    socketUrl = socketUrl.replace(/\/api\/?$/, '');

    // Initialize socket connection
    const socketInstance = io(socketUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Connection event handlers
    socketInstance.on('connect', () => {
      console.log('🔌 Socket.IO connected:', socketInstance.id);
      setIsConnected(true);
      setError(null);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 Socket.IO disconnected:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('🔌 Socket.IO connection error:', err);
      setError(err.message);
      setIsConnected(false);
    });

    // Authentication error handler
    socketInstance.on('auth_error', (err) => {
      console.error('🔌 Socket.IO auth error:', err);
      setError('Authentication failed');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, []);

  return { socket, isConnected, error };
};
