import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import styles from './MobileOptimizationOverlay.module.css';

const MobileOptimizationOverlay: React.FC = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.glassCard}>
        <div className={styles.iconContainer}>
          <div className={styles.floatingIcons}>
            <Monitor className={styles.desktopIcon} size={48} />
            <Smartphone className={styles.mobileIcon} size={32} />
          </div>
        </div>
        
        <h1 className={styles.title}>
          Mobile optimization <br />
          <span>in progress</span>
        </h1>
        
        <p className={styles.description}>
          We're currently crafting a premium mobile experience for BusinessOps Suite. 
          For the best performance and all features, please use a desktop or tablet.
        </p>
        
        <div className={styles.progressBar}>
          <div className={styles.progressFill}></div>
        </div>
        
        <div className={styles.badge}>
          Coming Soon to Mobile
        </div>
      </div>
      
      <div className={styles.backgroundBlobs}>
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
      </div>
    </div>
  );
};

export default MobileOptimizationOverlay;
