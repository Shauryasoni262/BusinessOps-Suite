'use client';

import { useState } from 'react';
import styles from './ConversationList.module.css';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string;
  isActive: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  currentRoom: string;
  onRoomChange: (roomId: string) => void;
}

export default function ConversationList({ conversations, currentRoom, onRoomChange }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.conversationList}>
      <div className={styles.searchContainer}>
        <div className={styles.searchInput}>
          <svg 
            className={styles.searchIcon} 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <path 
              d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchField}
          />
        </div>
      </div>

      <div className={styles.conversations}>
        {filteredConversations.length === 0 ? (
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
            <h3 className={styles.emptyStateTitle}>No conversations yet</h3>
            <p className={styles.emptyStateText}>Start a new conversation to begin chatting!</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`${styles.conversationItem} ${
                currentRoom === conversation.id ? styles.active : ''
              }`}
              onClick={() => onRoomChange(conversation.id)}
            >
              <div className={styles.avatar}>
                {conversation.avatar}
              </div>
              
              <div className={styles.conversationContent}>
                <div className={styles.conversationHeader}>
                  <h3 className={styles.conversationName}>{conversation.name}</h3>
                  <span className={styles.timestamp}>{conversation.timestamp}</span>
                </div>
                
                <div className={styles.conversationFooter}>
                  <p className={styles.lastMessage}>{conversation.lastMessage}</p>
                  {conversation.unreadCount > 0 && (
                    <span className={styles.unreadBadge}>
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
