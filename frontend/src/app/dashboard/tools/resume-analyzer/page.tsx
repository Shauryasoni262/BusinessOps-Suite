'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, TopBar } from '@/components/layout';
import ReactMarkdown from 'react-markdown';
import { resumeAnalyzerService, ResumeUploadResult } from '@/services/resumeAnalyzerService';
import styles from './page.module.css';
import dashboardStyles from '../../page.module.css';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  sourcesUsed?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ResumeAnalyzerPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  
  // State for Upload flow
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<ResumeUploadResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for Chat flow
  const [messages, setMessages] = useState<Message[]>([{
    id: 'welcome',
    role: 'ai',
    content: "I've successfully read your resume! What would you like to know about it? \n\n*Try asking: 'What are my top skills?', 'Summarize my experience', or 'What am I missing for a Frontend role?'*"
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      if (userData !== 'undefined' && userData !== null && userData !== '') {
        const parsed = JSON.parse(userData);
        // Ensure name exists for TopBar
        if (!parsed.name && parsed.email) {
          parsed.name = parsed.email.split('@')[0];
        }
        setUser(parsed);
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth/login');
    }
  }, [router]);

  // --- Handlers for File Upload Drag & Drop ---
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        handleFileUpload(droppedFile);
      } else {
        setUploadError('Please drop a valid PDF file.');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsUploading(true);
    setUploadError(null);

    try {
      const result = await resumeAnalyzerService.uploadResume(selectedFile);
      setUploadResult(result);
    } catch (err: any) {
      setUploadError(err.message || 'An error occurred while analyzing the resume.');
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadResult(null);
    setUploadError(null);
    setMessages([{
      id: 'welcome',
      role: 'ai',
      content: "I've successfully read your resume! What would you like to know about it?"
    }]);
  };

  // --- Handlers for Chat ---

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !uploadResult?.resumeId || isTyping) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: userMessage };
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      const response = await resumeAnalyzerService.chatWithResume(uploadResult.resumeId, userMessage);
      const newAiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'ai', 
        content: response.answer,
        sourcesUsed: response.sourcesUsed 
      };
      setMessages(prev => [...prev, newAiMsg]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `Error: ${error.message || 'Failed to get a response.'}`
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className={dashboardStyles.dashboardLayout}>
      <Sidebar />
      <div className={dashboardStyles.mainContent}>
        <TopBar user={user} onLogout={handleLogout} />
        
        <div className={dashboardStyles.content}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1>RAG Resume Analyzer</h1>
              <p>Upload a resume PDF and chat with an AI that understands its context completely.</p>
            </div>

            {/* View 1: Upload State */}
            {!uploadResult && (
              <div 
                className={`${styles.uploadSection} ${isDragging ? styles.isDragging : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {isUploading ? (
                  <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <h3>Analyzing Resume...</h3>
                    <p>Extracting text, chunking, and generating vector embeddings.</p>
                  </div>
                ) : (
                  <>
                    <svg className={styles.uploadIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <path d="M12 18v-6"/>
                      <path d="m9 15 3-3 3 3"/>
                    </svg>
                    <h3>Upload Resume PDF</h3>
                    <p>Drag and drop your PDF here, or click to browse (Max 10MB)</p>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      className={styles.hiddenInput} 
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                    />
                    <button 
                      className={styles.uploadButton}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse Files
                    </button>
                    
                    {uploadError && <div className={styles.error}>{uploadError}</div>}
                  </>
                )}
              </div>
            )}

            {/* View 2: Chat State */}
            {uploadResult && (
              <div className={styles.chatContainer}>
                <div className={styles.chatHeader}>
                  <div className={styles.resumeInfo}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <div>
                      <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 500 }}>{uploadResult.fileName}</h4>
                      <div className={styles.fileStats}>
                        <span className={styles.statBadge}>{uploadResult.chunksCreated} context chunks created</span>
                      </div>
                    </div>
                  </div>
                  <button className={styles.changeResumeBtn} onClick={resetUpload}>
                    Upload Different Resume
                  </button>
                </div>

                <div className={styles.chatMessages}>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`${styles.messageWrapper} ${styles[msg.role]}`}>
                      <div className={styles.avatar}>
                        {msg.role === 'ai' ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        )}
                      </div>
                      <div className={styles.messageContent}>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                        {msg.sourcesUsed && msg.sourcesUsed > 0 && (
                          <div className={styles.sourcesBadge}>
                            ✨ Answer generated using {msg.sourcesUsed} resume sections
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className={`${styles.messageWrapper} ${styles.ai}`}>
                      <div className={styles.avatar}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                      </div>
                      <div className={`${styles.messageContent} ${styles.typingIndicator}`}>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className={styles.chatInputContainer}>
                  <div className={styles.inputWrapper}>
                    <textarea
                      className={styles.chatInput}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask a question about the resume..."
                      disabled={isTyping}
                    />
                    <button 
                      className={styles.sendButton}
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
