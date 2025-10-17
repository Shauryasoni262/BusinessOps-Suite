import Navbar from '@/components/common/Navbar';
import '@/components/common/Navbar.css';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <main className={styles.main}>
          {/* Trusted by banner */}
          <div className={styles.trustedBanner}>
            <span className={styles.starIcon}>✨</span>
            <span>Trusted by 10,000+ businesses worldwide</span>
          </div>

          {/* Main heading */}
          <h1 className={styles.mainHeading}>
            The All-in-One Platform for<br />
            Modern Business
          </h1>

          {/* Description */}
          <p className={styles.description}>
            Manage projects, communicate with teams, handle payments, and leverage AI - all in one powerful suite.
          </p>

          {/* CTA Buttons */}
          <div className={styles.ctaButtons}>
            <button className={styles.ctaPrimary}>
              Get Started Free →
            </button>
            <button className={styles.ctaSecondary}>
              Sign In
            </button>
          </div>

          {/* Image Placeholder */}
          <div className={styles.imagePlaceholder}>
            <div className={styles.imageIcon}>📊</div>
            <p className={styles.imageText}>Dashboard Preview</p>
          </div>
        </main>
      </div>

      {/* Features Section */}
      <div className={styles.featuresSection}>
        <div className={styles.featuresContent}>
          <h2 className={styles.featuresHeading}>Everything You Need to Succeed</h2>
          <p className={styles.featuresSubheading}>Powerful features designed for growing businesses</p>
          
          <div className={styles.featuresGrid}>
            {/* Feature Card 1 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Project Management</h3>
              <p className={styles.featureDescription}>Organize and track all your projects in one centralized platform with real-time updates.</p>
            </div>

            {/* Feature Card 2 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Team Chat</h3>
              <p className={styles.featureDescription}>Real-time messaging and collaboration tools to keep your team connected.</p>
            </div>

            {/* Feature Card 3 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Payments & Invoicing</h3>
              <p className={styles.featureDescription}>Generate invoices, track payments, and manage your finances effortlessly.</p>
            </div>

            {/* Feature Card 4 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 20V10"/>
                  <path d="M12 20V4"/>
                  <path d="M6 20v-6"/>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Advanced Analytics</h3>
              <p className={styles.featureDescription}>Gain insights with powerful analytics and visualization tools.</p>
            </div>

            {/* Feature Card 5 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>AI Assistant</h3>
              <p className={styles.featureDescription}>Get intelligent suggestions and automation powered by cutting-edge AI.</p>
            </div>

            {/* Feature Card 6 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Lightning Fast</h3>
              <p className={styles.featureDescription}>Optimized performance ensures your work flows without interruption.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transform Business Operations Section */}
      <div className={styles.transformSection}>
        <div className={styles.transformContent}>
          {/* Left Column */}
          <div className={styles.transformLeft}>
            <h2 className={styles.transformHeading}>Transform Your Business Operations</h2>
            <p className={styles.transformDescription}>
              Join thousands of companies that have streamlined their workflows and increased productivity with BusinessOps Suite.
            </p>
            
            <ul className={styles.benefitsList}>
              <li className={styles.benefitItem}>
                <span className={styles.checkIcon}>✓</span>
                Streamline operations across all departments
              </li>
              <li className={styles.benefitItem}>
                <span className={styles.checkIcon}>✓</span>
                Reduce manual tasks by up to 60%
              </li>
              <li className={styles.benefitItem}>
                <span className={styles.checkIcon}>✓</span>
                Real-time collaboration and updates
              </li>
              <li className={styles.benefitItem}>
                <span className={styles.checkIcon}>✓</span>
                Enterprise-grade security and compliance
              </li>
              <li className={styles.benefitItem}>
                <span className={styles.checkIcon}>✓</span>
                Scalable infrastructure that grows with you
              </li>
              <li className={styles.benefitItem}>
                <span className={styles.checkIcon}>✓</span>
                24/7 customer support
              </li>
            </ul>
          </div>

          {/* Right Column */}
          <div className={styles.transformRight}>
            <div className={styles.statsGrid}>
              {/* Stat Card 1 */}
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </div>
                <div className={styles.statNumber}>150+</div>
                <div className={styles.statLabel}>Countries</div>
              </div>

              {/* Stat Card 2 */}
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div className={styles.statNumber}>99.9%</div>
                <div className={styles.statLabel}>Uptime SLA</div>
              </div>

              {/* Stat Card 3 */}
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
                  </svg>
                </div>
                <div className={styles.statNumber}>2M+</div>
                <div className={styles.statLabel}>Tasks Completed</div>
              </div>

              {/* Stat Card 4 */}
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>
                  </svg>
                </div>
                <div className={styles.statNumber}>4.9/5</div>
                <div className={styles.statLabel}>User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          {/* Brand Section */}
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <span className={styles.rocketIcon}>🚀</span>
              <span className={styles.brandText}>BusinessOps</span>
            </div>
            <p className={styles.footerDescription}>
              The all-in-one platform for modern business operations.
            </p>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className={styles.socialIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className={styles.socialIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className={styles.socialIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className={styles.footerNav}>
            {/* Product Column */}
            <div className={styles.navColumn}>
              <h3 className={styles.navHeading}>Product</h3>
              <ul className={styles.navList}>
                <li><a href="#" className={styles.navLink}>Features</a></li>
                <li><a href="#" className={styles.navLink}>Pricing</a></li>
                <li><a href="#" className={styles.navLink}>Security</a></li>
                <li><a href="#" className={styles.navLink}>Roadmap</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div className={styles.navColumn}>
              <h3 className={styles.navHeading}>Company</h3>
              <ul className={styles.navList}>
                <li><a href="#" className={styles.navLink}>About</a></li>
                <li><a href="#" className={styles.navLink}>Blog</a></li>
                <li><a href="#" className={styles.navLink}>Careers</a></li>
                <li><a href="#" className={styles.navLink}>Press</a></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className={styles.navColumn}>
              <h3 className={styles.navHeading}>Resources</h3>
              <ul className={styles.navList}>
                <li><a href="#" className={styles.navLink}>Documentation</a></li>
                <li><a href="#" className={styles.navLink}>Help Center</a></li>
                <li><a href="#" className={styles.navLink}>API Reference</a></li>
                <li><a href="#" className={styles.navLink}>Community</a></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className={styles.navColumn}>
              <h3 className={styles.navHeading}>Legal</h3>
              <ul className={styles.navList}>
                <li><a href="#" className={styles.navLink}>Privacy Policy</a></li>
                <li><a href="#" className={styles.navLink}>Terms of Service</a></li>
                <li><a href="#" className={styles.navLink}>Cookie Policy</a></li>
                <li><a href="#" className={styles.navLink}>GDPR</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className={styles.footerSeparator}></div>

        {/* Bottom Section */}
        <div className={styles.footerBottom}>
          <div className={styles.footerBottomContent}>
            <p className={styles.copyright}>© 2025 BusinessOps Suite. All rights reserved.</p>
            <div className={styles.utilityLinks}>
              <a href="#" className={styles.utilityLink}>Status</a>
              <a href="#" className={styles.utilityLink}>Changelog</a>
              <a href="#" className={styles.utilityLink}>Support</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
