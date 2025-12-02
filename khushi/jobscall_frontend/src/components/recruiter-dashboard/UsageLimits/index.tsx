import React from 'react';
import styles from './UsageLimits.module.css';

interface UsageItem {
  label: string;
  used: number;
  total: number;
  color: string;
}

const UsageLimits: React.FC = () => {
  const usageData: UsageItem[] = [
    { label: 'Job Postings', used: 3, total: 10, color: '#3b82f6' },
    { label: 'Candidate Views', used: 45, total: 100, color: '#10b981' },
    { label: 'Messages', used: 12, total: 50, color: '#8b5cf6' },
  ];

  const calculatePercentage = (used: number, total: number) => {
    return Math.min(100, Math.round((used / total) * 100));
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Usage Limits</h3>
      <div className={styles.usageList}>
        {usageData.map((item, index) => {
          const percentage = calculatePercentage(item.used, item.total);
          return (
            <div key={index} className={styles.usageItem}>
              <div className={styles.usageHeader}>
                <span className={styles.usageLabel}>{item.label}</span>
                <span className={styles.usageCount}>
                  {item.used} / {item.total}
                </span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <span className={styles.percentage}>
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
      <button className={styles.upgradeButton}>
        Upgrade Plan
      </button>
    </div>
  );
};

export default UsageLimits;
