import Link from 'next/link';
import { Navbar } from '@/components/layout';
import { LogoCloud } from '@/components/home/LogoCloud';
import '@/components/layout/Navbar.css';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.main}>
        {/* Main heading */}
        <h1 className={styles.heroTitle}>
          Business Operations, <span>Perfected by AI.</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Unify your team, projects, and payments in a single, high-performance workspace. Designed for teams who refuse to settle for "good enough."
        </p>
        
        <div className={styles.ctaGroup}>
          <Link href="/auth/signup" className={styles.btnPrimary}>
            Get Started for Free
          </Link>
          <Link href="/auth/login" className={styles.btnSecondary}>
            <span>View Demo</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Floating Mockup Visual */}
        <div className={styles.floatingUi}>
          <div className={styles.mockup}>
            <div className={styles.mockupNav}></div>
            <div className={styles.mockupContent}>
              <video 
                src="/Videos/landingvideo.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className={styles.mockupVideo}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Trust Section */}
      <LogoCloud />

      {/* Features Bento Grid */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Everything you need. <br/>None of the clutter.</h2>
        </div>
        
        <div className={styles.bentoGrid}>
          <div className={`${styles.card} ${styles.col8}`}>
            <span className={styles.cardLabel}>Automation</span>
            <h3 className={styles.cardTitle}>AI-Powered Workflow Engine</h3>
            <p className={styles.cardDesc}>Let our AI handle the repetitive tasks while you focus on high-impact work. From auto-invoicing to smart scheduling.</p>
            <div className={styles.visualWrapper}>
              <div className={styles.workflowVisual}>
                <div className={styles.workflowNode} style={{ animationDelay: '0s' }}></div>
                <div className={styles.workflowNode} style={{ animationDelay: '0.2s' }}></div>
                <div className={styles.workflowNode} style={{ animationDelay: '0.4s' }}></div>
                <div className={styles.workflowNode} style={{ animationDelay: '0.6s' }}></div>
              </div>
            </div>
          </div>

          <div className={`${styles.card} ${styles.col4}`}>
            <span className={styles.cardLabel}>Communication</span>
            <h3 className={styles.cardTitle}>Seamless Team Chat</h3>
            <p className={styles.cardDesc}>Context-aware messaging that lives right where your work does.</p>
            <div className={styles.chatVisual}>
              <div className={styles.avatar} style={{ background: '#e0e7ff' }}></div>
              <div className={styles.avatar} style={{ background: '#f5f3ff' }}></div>
              <div className={styles.avatar} style={{ background: '#ecfdf5' }}></div>
              <div className={styles.typing}>
                <div className={styles.typingDot} style={{ animationDelay: '0s' }}></div>
                <div className={styles.typingDot} style={{ animationDelay: '0.2s' }}></div>
                <div className={styles.typingDot} style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>

          <div className={`${styles.card} ${styles.col4}`}>
            <span className={styles.cardLabel}>Financials</span>
            <h3 className={styles.cardTitle}>One-Click Invoicing</h3>
            <p className={styles.cardDesc}>Get paid faster with professional, automated invoicing.</p>
            <div className={styles.invoiceVisual}>
              <div className={styles.invoiceAmount}>$14,200.00</div>
              <div className={styles.paidBadge}>PAID</div>
            </div>
          </div>

          <div className={`${styles.card} ${styles.col8}`}>
            <span className={styles.cardLabel}>Intelligence</span>
            <h3 className={styles.cardTitle}>Real-time Insights & Analytics</h3>
            <p className={styles.cardDesc}>Visualization tools that give you a bird's eye view of your business performance.</p>
            <div className={styles.chartVisual}>
              <div className={styles.chartBar} style={{ height: '40%' }}></div>
              <div className={styles.chartBarActive} style={{ height: '70%', flex: 2 }}></div>
              <div className={styles.chartBar} style={{ height: '55%' }}></div>
              <div className={styles.chartBarActive} style={{ height: '90%', flex: 1.5 }}></div>
              <div className={styles.chartBar} style={{ height: '30%' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* 127 Processes Showcase */}
      <section className={styles.section} style={{ background: '#f8fafc' }}>
        <div className={styles.sectionHeader}>
          <span className={styles.badge}>Comprehensive</span>
          <h2 className={styles.sectionTitle}>1 Platform, 50+ HR processes.<br/>Everything your team needs.</h2>
          <p className={styles.heroSubtitle}>Manage your employee lifecycle like a breeze from onboarding to exit.</p>
        </div>
        
        <div className={styles.bentoGrid}>
          <Link href="/careers" className={`${styles.card} ${styles.col4}`}>
            <h3 className={styles.cardTitle}>Offer Letter Generator</h3>
            <p className={styles.cardDesc}>Create professional, legally-compliant offer letters in seconds.</p>
          </Link>
          <Link href="/dashboard/salary-slips" className={`${styles.card} ${styles.col4}`}>
            <h3 className={styles.cardTitle}>Salary Slip Generator</h3>
            <p className={styles.cardDesc}>Automated, compliant, and error-free payroll generation.</p>
          </Link>
          <div className={`${styles.card} ${styles.col4}`}>
            <h3 className={styles.cardTitle}>Team Management</h3>
            <p className={styles.cardDesc}>Manage your employee lifecycle from onboarding to exit.</p>
          </div>
        </div>
      </section>

      {/* Expanded Footer (Mega Footer) */}
      <footer className={styles.footer}>
        <div className={styles.megaFooterGrid}>
          {/* Brand & Newsletter */}
          <div className={styles.footerBrandBlock}>
            <span className={styles.brandText}>BusinessOps.</span>
            <p className={styles.footerDescription}>Building the future of business operations. Join 50,000+ HR leaders.</p>
            <form className={styles.newsletterForm}>
              <input type="email" placeholder="Work Email*" className={styles.footerInput} />
              <button type="submit" className={styles.footerSubmit}>Subscribe</button>
            </form>
          </div>

          {/* Nav Columns Group 1 */}
          <div className={styles.footerColumns}>
            <div className={styles.navColumn}>
              <h4 className={styles.navHeading}>Product</h4>
              <ul className={styles.navList}>
                <li><Link href="/products/workforce" className={styles.navLink}>Workforce Management</Link></li>
                <li><Link href="/products/payroll" className={styles.navLink}>Payroll Management</Link></li>
                <li><Link href="#" className={styles.navLink}>One AI Assistant</Link></li>
                <li><Link href="#" className={styles.navLink}>Integrations</Link></li>
              </ul>
            </div>

            <div className={styles.navColumn}>
              <h4 className={styles.navHeading}>Resources</h4>
              <ul className={styles.navList}>
                <li><Link href="#" className={styles.navLink}>Free HR Tools</Link></li>
                <li><Link href="#" className={styles.navLink}>Policy Library</Link></li>
                <li><Link href="#" className={styles.navLink}>Business Calculators</Link></li>
                <li><Link href="#" className={styles.navLink}>Documentation</Link></li>
              </ul>
            </div>

            <div className={styles.navColumn}>
              <h4 className={styles.navHeading}>Company</h4>
              <ul className={styles.navList}>
                <li><Link href="#" className={styles.navLink}>About Us</Link></li>
                <li><Link href="/careers" className={styles.navLink}>Careers</Link></li>
                <li><Link href="#" className={styles.navLink}>Contact</Link></li>
                <li><Link href="#" className={styles.navLink}>Newsroom</Link></li>
              </ul>
            </div>

            <div className={styles.navColumn}>
              <h4 className={styles.navHeading}>Legal</h4>
              <ul className={styles.navList}>
                <li><Link href="/privacy-policy" className={styles.navLink}>Privacy</Link></li>
                <li><Link href="/terms-of-service" className={styles.navLink}>Terms</Link></li>
                <li><Link href="#" className={styles.navLink}>Security</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.footerSeparator}></div>
        <div className={styles.footerBottomContent}>
          <p>© 2026 BusinessOps Suite (Uneecops Group Company). All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
