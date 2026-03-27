'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, HelpCircle } from 'lucide-react';
import { Navbar } from '@/components/layout';
import styles from './Contact.module.css';

const ContactInfo = ({ icon: Icon, title, content, link }: any) => (
  <div className={styles.infoCard}>
    <div className={styles.infoIcon}>
      <Icon size={24} />
    </div>
    <div className={styles.infoText}>
      <h4>{title}</h4>
      {link ? (
        <a href={link}>{content}</a>
      ) : (
        <p>{content}</p>
      )}
    </div>
  </div>
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.badge}>Get in Touch</div>
          <h1 className={styles.title}>
            Let's start a <span>Conversation.</span>
          </h1>
          <p className={styles.subtitle}>
            Have questions about BusinessOps Suite? Our team is here to help you scaling your operations.
          </p>
        </section>

        <div className={styles.contactWrapper}>
          {/* Contact Information */}
          <aside className={styles.infoSection}>
            <div className={styles.infoGrid}>
              <ContactInfo 
                icon={Mail}
                title="Email Us"
                content="support@businessops.com"
                link="mailto:support@businessops.com"
              />
              <ContactInfo 
                icon={Phone}
                title="Call Us"
                content="+1 (555) 000-0000"
                link="tel:+15550000000"
              />
              <ContactInfo 
                icon={MapPin}
                title="Visit Us"
                content="123 Innovation Drive, Silicon Valley, CA"
              />
            </div>

            <div className={styles.supportBento}>
              <div className={styles.supportCard}>
                <MessageCircle size={24} />
                <h4>Live Chat</h4>
                <p>Available Mon-Fri, 9am - 6pm EST</p>
              </div>
              <div className={styles.supportCard}>
                <HelpCircle size={24} />
                <h4>Knowledge Base</h4>
                <p>Find answers in our documentation</p>
              </div>
            </div>
          </aside>

          {/* Contact Form */}
          <section className={styles.formSection}>
            {submitted ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className={styles.resetBtn}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Work Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    required 
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    required 
                    rows={6}
                    placeholder="Tell us more about your needs..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                  {isSubmitting ? 'Sending...' : (
                    <>
                      <span>Send Message</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2026 BusinessOps Suite. All rights reserved.</p>
      </footer>
    </div>
  );
}
