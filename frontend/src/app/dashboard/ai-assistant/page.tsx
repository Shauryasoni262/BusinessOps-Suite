'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, TopBar } from '@/components/layout';
import ReactMarkdown from 'react-markdown';
import { 
  Bot, 
  User, 
  Send, 
  Trash2, 
  Sparkles, 
  Cpu, 
  Wifi, 
  WifiOff, 
  AlertCircle, 
  Loader2,
  Terminal,
  Code2,
  Lightbulb,
  MessageSquare
} from 'lucide-react';
import styles from './page.module.css';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface Model {
  name: string;
  size: number;
  modified_at: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

const AIAssistantPage: React.FC = () => {
  const router = useRouter();
  
  // State Hooks
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState('arcee-ai/trinity-large-preview:free');
  const [error, setError] = useState<string | null>(null);
  
  // Ref Hooks
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper Functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Effect Hooks
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      if (userData !== 'undefined' && userData !== null && userData !== '') {
        setUser(JSON.parse(userData));
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      const checkConnection = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/ai/test`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const data = await response.json();
          setIsConnected(data.success);
          if (!data.success) setError('AI Service heartbeat failed. Check configuration.');
        } catch (error) {
          setIsConnected(false);
          setError('Connection to AI gateway lost.');
        }
      };

      const loadModels = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/ai/models`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const data = await response.json();
          if (data.success && data.models.length > 0) {
            setAvailableModels(data.models);
            setSelectedModel(data.models[0].name);
          }
        } catch (error) {
          console.error('Failed to load models:', error);
        }
      };

      checkConnection();
      loadModels();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120; // Approximately 4-5 lines
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [inputMessage]);

  // Event Handlers
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/ai/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMsg.content,
          model: selectedModel
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.response,
          timestamp: new Date()
        }]);
      } else {
        setError(data.message || 'AI processing error occurred.');
      }
    } catch (error) {
      setError('Communication error with AI backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    if (confirm('Are you sure you want to clear the conversation?')) {
      setMessages([]);
      setError(null);
    }
  };

  const changeModel = async (modelName: string) => {
    setSelectedModel(modelName);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className={styles.loading}>
        <Loader2 className={styles.spinner} size={40} />
        <p>Initializing Neural Interface...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <TopBar user={user} onLogout={handleLogout} />
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <h1>AI Assistant</h1>
              <p>Harness the power of Trinity Large for complex problem solving</p>
            </div>
            
            <div className={styles.controls}>
              <div className={styles.modelSelector}>
                <Cpu size={14} color="#94a3b8" />
                <label htmlFor="model-select">Model</label>
                <select
                  id="model-select"
                  value={selectedModel}
                  onChange={(e) => changeModel(e.target.value)}
                  className={styles.select}
                >
                  {availableModels.map((model) => (
                    <option key={model.name} value={model.name}>
                      {model.name}
                    </option>
                  ))}
                  {availableModels.length === 0 && (
                    <option value={selectedModel}>{selectedModel.split('/').pop()}</option>
                  )}
                </select>
              </div>
              
              <button
                onClick={clearChat}
                className={styles.clearButton}
                disabled={messages.length === 0}
                title="Reset conversation"
              >
                <Trash2 size={16} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className={styles.statusBar}>
            <div className={styles.status}>
              <div className={`${styles.statusIndicator} ${isConnected ? styles.connected : styles.disconnected}`}></div>
              {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
              <span>{isConnected ? 'Neural Link Active' : 'Link Severed'}</span>
            </div>
            {error && (
              <div className={styles.error}>
                <AlertCircle size={14} />
                <span>{error}</span>
                <button onClick={() => setError(null)} className={styles.dismissError}>&times;</button>
              </div>
            )}
          </div>

          <div className={styles.chatContainer}>
            <div className={styles.messages}>
              {messages.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>
                    <Sparkles size={32} />
                  </div>
                  <h3>Ready for Interaction</h3>
                  <p>I can help you analyze projects, draft documents, or explain complex technical concepts.</p>
                  
                  <div className={styles.suggestions}>
                    {[
                      { text: "What can you help me with?", icon: <MessageSquare size={14} /> },
                      { text: "Explain quantum computing", icon: <Lightbulb size={14} /> },
                      { text: "Write a Python function", icon: <Code2 size={14} /> },
                      { text: "Analyze my project tech stack", icon: <Terminal size={14} /> }
                    ].map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInputMessage(suggestion.text)}
                        className={styles.suggestionButton}
                      >
                        {suggestion.icon}
                        {suggestion.text}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.message} ${styles[message.type]}`}
                  >
                    <div className={styles.messageContent}>
                      <div className={styles.messageHeader}>
                        {message.type === 'ai' ? <Bot size={14} /> : <User size={14} />}
                        <span className={styles.messageType}>
                          {message.type === 'user' ? 'Client' : 'Assistant'}
                        </span>
                        <span className={styles.timestamp}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className={styles.messageText}>
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className={`${styles.message} ${styles.ai}`}>
                  <div className={styles.messageContent}>
                    <div className={styles.messageHeader}>
                      <Bot size={14} />
                      <span className={styles.messageType}>Assistant</span>
                    </div>
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.inputWrapper}>
                <textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Inquire about a task or concept..."
                  className={styles.textInput}
                  rows={1}
                  disabled={isLoading || !isConnected}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading || !isConnected}
                  className={styles.sendButton}
                >
                  {isLoading ? <Loader2 className={styles.spinner} size={18} /> : <Send size={18} />}
                  <span>{isLoading ? 'Processing' : 'Transmit'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
