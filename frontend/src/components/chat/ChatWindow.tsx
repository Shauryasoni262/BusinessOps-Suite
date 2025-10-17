'use client';

import React from 'react';
import MessageInput from './MessageInput';
import styles from './ChatWindow.module.css';

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

interface ChatWindowProps {
  messages: Message[];
  currentRoom: string;
  onSendMessage: (message: string) => void;
  user: User;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatWindow({ messages, currentRoom, onSendMessage, user, messagesEndRef }: ChatWindowProps) {

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getCurrentRoomName = () => {
    // Simple room name mapping - in real app, this would come from your conversations data
    const roomNames: { [key: string]: string } = {
      'general': 'General Chat'
    };
    return roomNames[currentRoom] || currentRoom.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className={styles.chatWindow}>
      {/* Chat Header */}
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderContent}>
          <div className={styles.chatInfo}>
            <h2 className={styles.chatTitle}>{getCurrentRoomName()}</h2>
            <p className={styles.chatStatus}>Active now</p>
          </div>
          <button className={styles.menuButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path 
                d="M12 5V19M5 12H19" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className={styles.messagesArea}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className={styles.emptyStateTitle}>No messages yet</h3>
            <p className={styles.emptyStateText}>Start the conversation by sending a message!</p>
          </div>
        ) : (
          <div className={styles.messages}>
            {messages.map((message) => {
              const isOwnMessage = message.userId === user.id;
              return (
                <div
                  key={message.id}
                  className={`${styles.message} ${isOwnMessage ? styles.ownMessage : styles.otherMessage}`}
                >
                  {!isOwnMessage && (
                    <div className={styles.messageAvatar}>
                      {getInitials(message.username)}
                    </div>
                  )}
                  
                  <div className={styles.messageContent}>
                    {!isOwnMessage && (
                      <div className={styles.messageHeader}>
                        <span className={styles.messageUsername}>{message.username}</span>
                        <span className={styles.messageTime}>{formatTime(message.timestamp)}</span>
                      </div>
                    )}
                    
                    <div className={`${styles.messageBubble} ${isOwnMessage ? styles.ownBubble : styles.otherBubble}`}>
                      <p className={styles.messageText}>{message.message}</p>
                      {isOwnMessage && (
                        <span className={styles.messageTime}>{formatTime(message.timestamp)}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className={styles.messageInputContainer}>
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
