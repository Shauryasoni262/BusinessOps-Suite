'use client';

import Skeleton from '@/components/ui/Skeleton';
import styles from './page.module.css';

export default function DashboardSkeleton() {
  return (
    <div className={styles.dashboardLayout}>
      <div className={styles.sidebarSkeleton}>
        <Skeleton height="100%" width="280px" borderRadius="0" />
      </div>
      <div className={styles.mainContent}>
        <div className={styles.topBarSkeleton}>
          <Skeleton height="70px" width="100%" borderRadius="0" />
        </div>
        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <Skeleton width="200px" height="32px" className="mb-2" />
            <Skeleton width="400px" height="20px" />
          </div>

          <div className={styles.statsGridSkeleton} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height="120px" borderRadius="12px" />
            ))}
          </div>
          
          <Skeleton height="400px" borderRadius="12px" />
        </div>
      </div>
    </div>
  );
}
