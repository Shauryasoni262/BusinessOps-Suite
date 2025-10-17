'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import ConversationList from '@/components/chat/ConversationList';
import ChatWindow from '@/components/chat/ChatWindow';
import styles from './page.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Message {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  room: string;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string;
  isActive: boolean;
}

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string>('general');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Start with General Chat room always available
  const initialConversations: Conversation[] = useMemo(() => [
    {
      id: 'general',
      name: 'General Chat',
      lastMessage: 'Welcome to the general chat!',
      timestamp: 'Now',
      unreadCount: 0,
      avatar: 'GC',
      isActive: true
    }
  ], []);

  useEffect(() => {
    console.log('🔍 Chat Page - Checking authentication...');
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      console.log('❌ Missing token or user data, redirecting to login');
      router.push('/auth/login');
      return;
    }

    try {
      if (userData === 'undefined' || userData === null || userData === '') {
        console.log('❌ User data is undefined/null/empty, redirecting to login');
        router.push('/auth/login');
        return;
      }
      
      const parsedUser = JSON.parse(userData);
      console.log('✅ User data parsed successfully:', parsedUser);
      setUser(parsedUser);
      setConversations(initialConversations);
    } catch (error) {
      console.error('❌ Error parsing user data:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, [router, initialConversations]);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      // Join the default room
      newSocket.emit('join_room', {
        room: currentRoom,
        username: user.name
      });

      // Listen for messages
      newSocket.on('receive_message', (data: Message) => {
        setMessages(prev => [...prev, data]);
      });

      // Listen for message history
      newSocket.on('message_history', (data: { room: string; messages: Message[] }) => {
        setMessages(data.messages);
      });

      // Listen for user joined/left notifications
      newSocket.on('user_joined', (data) => {
        console.log('User joined:', data.message);
      });

      newSocket.on('user_left', (data) => {
        console.log('User left:', data.message);
      });

      // Listen for errors
      newSocket.on('error', (data) => {
        console.error('Socket error:', data.message);
      });

      return () => {
        newSocket.close();
      };
    }
  }, [user, currentRoom]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = () => {
    if (socket) {
      socket.disconnect();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleSendMessage = (message: string) => {
    if (socket && message.trim()) {
      socket.emit('send_message', {
        room: currentRoom,
        message: message.trim()
      });
    }
  };

  const handleRoomChange = (roomId: string) => {
    if (socket) {
      // Leave current room
      socket.emit('leave_room', currentRoom);
      
      // Join new room
      setCurrentRoom(roomId);
      setMessages([]);
      
      socket.emit('join_room', {
        room: roomId,
        username: user?.name
      });
    }
  };

  const createNewRoom = () => {
    const roomName = prompt('Enter room name:');
    if (roomName && roomName.trim()) {
      const roomId = roomName.toLowerCase().replace(/\s+/g, '-');
      const newConversation: Conversation = {
        id: roomId,
        name: roomName,
        lastMessage: 'Room created',
        timestamp: 'Now',
        unreadCount: 0,
        avatar: roomName.substring(0, 2).toUpperCase(),
        isActive: false
      };
      
      setConversations(prev => [...prev, newConversation]);
      handleRoomChange(roomId);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <TopBar user={user} onLogout={handleLogout} />
        
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <div className={styles.headerContent}>
              <div>
                <h1 className={styles.title}>Team Chat</h1>
                <p className={styles.subtitle}>Communicate with your team in real-time</p>
              </div>
              <button onClick={createNewRoom} className={styles.createRoomButton}>
                + Create Room
              </button>
            </div>
          </div>

          <div className={styles.chatContent}>
            <ConversationList 
              conversations={conversations}
              currentRoom={currentRoom}
              onRoomChange={handleRoomChange}
            />
            
            <ChatWindow 
              messages={messages}
              currentRoom={currentRoom}
              onSendMessage={handleSendMessage}
              user={user}
              messagesEndRef={messagesEndRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
