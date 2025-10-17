'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

const AIAssistantPage: React.FC = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState('llama2');
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check Ollama connection and load models on component mount
  useEffect(() => {
    checkConnection();
    loadModels();
  }, []);

  const checkConnection = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/ai/test', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setIsConnected(data.success);
      
      if (!data.success) {
        setError('Failed to connect to Ollama. Please make sure Ollama is running.');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setIsConnected(false);
      setError('Failed to connect to AI service. Please check your connection.');
    }
  };

  const loadModels = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/ai/models', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setAvailableModels(data.models);
        if (data.models.length > 0) {
          setSelectedModel(data.models[0].name);
        } else {
          setError('No AI models available. Please install a model first using: ollama pull llama2');
        }
      }
    } catch (error) {
      console.error('Failed to load models:', error);
      setError('Failed to load AI models. Please check your connection.');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.content,
          model: selectedModel
        })
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        setError(data.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
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
    setMessages([]);
    setError(null);
  };

  const changeModel = async (modelName: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/ai/model', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ model: modelName })
      });

      const data = await response.json();
      if (data.success) {
        setSelectedModel(modelName);
        setError(null);
      } else {
        setError(data.message || 'Failed to change model');
      }
    } catch (error) {
      console.error('Error changing model:', error);
      setError('Failed to change model');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>AI Assistant</h1>
          <p>Chat with your AI assistant powered by Ollama</p>
        </div>
        
        <div className={styles.controls}>
          <div className={styles.modelSelector}>
            <label htmlFor="model-select">Model:</label>
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
            </select>
          </div>
          
          <button
            onClick={clearChat}
            className={styles.clearButton}
            disabled={messages.length === 0}
          >
            Clear Chat
          </button>
        </div>
      </div>

      <div className={styles.statusBar}>
        <div className={styles.status}>
          <div className={`${styles.statusIndicator} ${isConnected ? styles.connected : styles.disconnected}`}></div>
          <span>{isConnected ? 'Connected to Ollama' : 'Disconnected'}</span>
        </div>
        {error && (
          <div className={styles.error}>
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} className={styles.dismissError}>×</button>
          </div>
        )}
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🤖</div>
              <h3>Start a conversation</h3>
              {availableModels.length === 0 ? (
                <>
                  <p>No AI models are currently available.</p>
                  <div className={styles.installInstructions}>
                    <h4>To get started:</h4>
                    <ol>
                      <li>Make sure Ollama is installed and running</li>
                      <li>Install a model: <code>ollama pull llama2</code></li>
                      <li>Refresh this page</li>
                    </ol>
                  </div>
                </>
              ) : (
                <>
                  <p>Ask me anything! I'm here to help with your questions and tasks.</p>
                  <div className={styles.suggestions}>
                    <button
                      onClick={() => setInputMessage("What can you help me with?")}
                      className={styles.suggestionButton}
                    >
                      What can you help me with?
                    </button>
                    <button
                      onClick={() => setInputMessage("Explain quantum computing in simple terms")}
                      className={styles.suggestionButton}
                    >
                      Explain quantum computing
                    </button>
                    <button
                      onClick={() => setInputMessage("Write a Python function to sort a list")}
                      className={styles.suggestionButton}
                    >
                      Write a Python function
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${styles[message.type]}`}
              >
                <div className={styles.messageContent}>
                  <div className={styles.messageHeader}>
                    <span className={styles.messageType}>
                      {message.type === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                    <span className={styles.timestamp}>
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={styles.messageText}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className={`${styles.message} ${styles.ai}`}>
              <div className={styles.messageContent}>
                <div className={styles.messageHeader}>
                  <span className={styles.messageType}>AI Assistant</span>
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
              onKeyPress={handleKeyPress}
              placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
              className={styles.textInput}
              rows={1}
              disabled={isLoading || !isConnected}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || !isConnected}
              className={styles.sendButton}
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
