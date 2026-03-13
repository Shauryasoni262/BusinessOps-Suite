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
              <h1>Resume Intelligence</h1>
              <p>AI-powered semantic analysis for your professional documents.</p>
            </div>

            {/* View 1: Initial Upload State */}
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
                    <h3>Processing Resume</h3>
                    <p>Securing context and generating semantic embeddings...</p>
                  </div>
                ) : (
                  <>
                    <div className={styles.uploadIcon}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <h3>Analyze your Career</h3>
                    <p>Upload your PDF resume to unlock deep insights, skill gap analysis, and personalized career coaching.</p>
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
                      Select PDF Document
                    </button>
                    
                    {uploadError && (
                      <div className={styles.error}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        {uploadError}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* View 2: Split View Post-Analysis */}
            {uploadResult && (
              <div className={styles.mainLayout}>
                {/* Left Panel: Document Metadata */}
                <div className={styles.infoPanel}>
                  <div className={styles.fileCard}>
                    <div className={styles.fileIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <span className={styles.fileName}>{uploadResult.fileName}</span>
                  </div>

                  <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Semantic Chunks</span>
                      <span className={styles.statValue}>{uploadResult.chunksCreated}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Document Pages</span>
                      <span className={styles.statValue}>{uploadResult.pageCount || 1}</span>
                    </div>
                  </div>

                  <div className={styles.contextCard}>
                    <span className={styles.statLabel}>AI Insights Ready</span>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                      Our AI has indexed your professional background and is ready to answer specific questions regarding your experience and skills.
                    </p>
                  </div>

                  <button className={styles.changeResumeBtn} onClick={resetUpload}>
                    Analyze New Resume
                  </button>
                </div>

                {/* Right Panel: Interactive Chat */}
                <div className={styles.chatContainer}>
                  <div className={styles.chatMessages}>
                    {messages.map((msg) => (
                      <div key={msg.id} className={`${styles.messageWrapper} ${styles[msg.role]}`}>
                        <div className={styles.avatar}>
                          {msg.role === 'ai' ? 'AI' : 'YOU'}
                        </div>
                        <div className={styles.messageContent}>
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                          {msg.sourcesUsed && msg.sourcesUsed > 0 && (
                            <div className={styles.sourcesBadge}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              Grounded in {msg.sourcesUsed} resume sections
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className={`${styles.messageWrapper} ${styles.ai}`}>
                        <div className={styles.avatar}>AI</div>
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
                        placeholder="Ask me anything about this resume..."
                        disabled={isTyping}
                        rows={1}
                      />
                      <button 
                        className={styles.sendButton}
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </button>
                    </div>
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
