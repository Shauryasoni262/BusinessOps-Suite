'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Zap, Shield, BarChart, Users, 
  MessageSquare, CreditCard, Sparkles, 
  Layers, Globe, Smartphone 
} from 'lucide-react';
import { Navbar } from '@/components/layout';
import styles from './Features.module.css';

const FeatureCard = ({ icon: Icon, title, description, color }: any) => (
  <div className={styles.card}>
    <div className={styles.iconWrapper} style={{ backgroundColor: `${color}15` }}>
      <Icon size={24} style={{ color }} />
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export default function FeaturesPage() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Automation",
      description: "Automate repetitive workflows with context-aware AI. From document processing to smart scheduling.",
      color: "#8b5cf6"
    },
    {
      icon: MessageSquare,
      title: "Seamless Team Chat",
      description: "Direct messaging and channels integrated directly with your projects and tasks.",
      color: "#0ea5e9"
    },
    {
      icon: Zap,
      title: "Real-time Collaboration",
      description: "Work together on projects and tasks with live updates and instant notifications.",
      color: "#f59e0b"
    },
    {
      icon: CreditCard,
      title: "Integrated Payments",
      description: "Manage invoicing and payments globally with Razorpay and Stripe integrations.",
      color: "#10b981"
    },
    {
      icon: Users,
      title: "HR & Talent Management",
      description: "Full lifecycle management from recruitment (Careers) to onboarding and payroll.",
      color: "#ec4899"
    },
    {
      icon: BarChart,
      title: "Real-time Analytics",
      description: "Gain actionable insights with real-time dashboards and custom reporting tools.",
      color: "#6366f1"
    }
  ];

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.badge}>Capabilities</div>
          <h1 className={styles.title}>
            Engineered for <span>High Performance Teams.</span>
          </h1>
          <p className={styles.subtitle}>
            BusinessOps Suite combines intelligence with simplicity. We've built the tools so you can focus on building your vision.
          </p>
        </section>

        {/* Features Grid */}
        <section className={styles.gridSection}>
          <div className={styles.grid}>
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </section>

        {/* Technical Capabilities Section */}
        <section className={styles.techSection}>
          <div className={styles.techText}>
            <h2>Built on a <span>Global Infrastructure.</span></h2>
            <p>Our platform is designed for scale, security, and speed. Deploy with confidence knowing your data is protected and available 24/7.</p>
            
            <div className={styles.techLists}>
              <div className={styles.techItem}>
                <Shield size={18} />
                <span>Enterprise Grade Security</span>
              </div>
              <div className={styles.techItem}>
                <Layers size={18} />
                <span>Scalable Cloud Architecture</span>
              </div>
              <div className={styles.techItem}>
                <Globe size={18} />
                <span>Multi-Region Availability</span>
              </div>
            </div>
          </div>
          
          <div className={styles.techVisual}>
            {/* Abstract visual element */}
            <div className={styles.blob}></div>
            <div className={styles.codeWindow}>
              <div className={styles.codeHeader}>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
              </div>
              <div className={styles.codeBody}>
                <pre>
                  <code>{`
// AI Integration Example
const workflow = new BusinessAI();
await workflow.automate({
  trigger: 'invoice_created',
  action: 'notify_finance_and_sync'
});
                  `}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer is already global if wrapped in layout, but let's assume it's page specific for now or use the global one */}
      <footer className={styles.footer}>
        <p>© 2026 BusinessOps Suite. All rights reserved.</p>
      </footer>
    </div>
  );
}
