'use client';

import React from 'react';
import Link from 'next/link';
import { Target, Heart, Award, TrendingUp, Github, Twitter, Linkedin } from 'lucide-react';
import { Navbar } from '@/components/layout';
import styles from './About.module.css';

const ValueCard = ({ icon: Icon, title, description, color }: any) => (
  <div className={styles.valueCard}>
    <div className={styles.valueIcon} style={{ backgroundColor: `${color}15`, color }}>
      <Icon size={24} />
    </div>
    <h4>{title}</h4>
    <p>{description}</p>
  </div>
);

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Precision",
      description: "We believe in building tools that work with surgical precision, eliminating errors and streamlining efficiency.",
      color: "#2563eb"
    },
    {
      icon: Heart,
      title: "User-Centric",
      description: "Every feature we build is designed with the user's workflow in mind, ensuring a seamless and intuitive experience.",
      color: "#f43f5e"
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "We're constantly pushing the boundaries of what's possible with AI to keep your business ahead of the curve.",
      color: "#10b981"
    }
  ];

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.badge}>Our Vision</div>
          <h1 className={styles.title}>
            Powering the next <span>Generation of Business.</span>
          </h1>
          <p className={styles.subtitle}>
            BusinessOps Suite was founded with a simple goal: to make business operations as smart as the people running them.
          </p>
        </section>

        {/* Story Section */}
        <section className={styles.storySection}>
          <div className={styles.storyContent}>
            <h2>Our Story</h2>
            <p>
              In an era of fragmented tools and cluttered workspaces, we saw a need for a unified platform that combines intelligence, communication, and execution.
            </p>
            <p>
              Today, BusinessOps Suite is used by thousands of teams worldwide to manage everything from HR and payroll to global project collaboration.
            </p>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>10k+</span>
                <span className={styles.statLabel}>Active Teams</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>50+</span>
                <span className={styles.statLabel}>Countries</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>99.9%</span>
                <span className={styles.statLabel}>Uptime</span>
              </div>
            </div>
          </div>
          <div className={styles.storyImage}>
            <div className={styles.imagePlaceholder}>
              <div className={styles.abstractGraphic}></div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className={styles.valuesSection}>
          <div className={styles.sectionHeader}>
            <h2>The core principles that <span>drive us.</span></h2>
          </div>
          <div className={styles.valuesGrid}>
            {values.map((v, i) => (
              <ValueCard key={i} {...v} />
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className={styles.teamSection}>
          <div className={styles.sectionHeader}>
            <h2>Join our <span>Global Community.</span></h2>
            <p>We're a team of engineers, designers, and dreamers building the future of work.</p>
          </div>
          <div className={styles.ctaCard}>
            <h3>Want to build something amazing?</h3>
            <p>Check out our open positions and join the mission.</p>
            <Link href="/careers" className={styles.careersBtn}>View Careers</Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="#"><Twitter size={20} /></a>
          <a href="#"><Github size={20} /></a>
          <a href="#"><Linkedin size={20} /></a>
        </div>
        <p>© 2026 BusinessOps Suite. All rights reserved.</p>
      </footer>
    </div>
  );
}
