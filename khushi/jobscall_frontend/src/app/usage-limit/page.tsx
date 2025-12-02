// app/usage-limit/page.tsx
'use client';

import { useState } from 'react';
import { FiHelpCircle, FiAlertTriangle } from 'react-icons/fi';
import styles from './page.module.css';

type TabType = 'myLimits' | 'accountLimits';

interface UsageItem {
  id: string;
  name: string;
  hasAccess: boolean;
  dailyUsed?: number;
  dailyLimit?: number;
  monthlyUsed?: number;
  monthlyLimit?: number;
  unit?: string;
}

const UsageLimitPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('myLimits');

  const usageData: UsageItem[] = [
    {
      id: 'copilot',
      name: 'Co-Pilot',
      hasAccess: false
    },
    {
      id: 'search',
      name: 'Search',
      hasAccess: true,
      dailyUsed: 24,
      dailyLimit: 100,
      monthlyUsed: 450,
      monthlyLimit: 2000,
      unit: 'searches'
    },
    {
      id: 'smartJob',
      name: 'Smart Job',
      hasAccess: true,
      dailyUsed: 5,
      dailyLimit: 10,
      monthlyUsed: 45,
      monthlyLimit: 100,
      unit: 'jobs'
    },
    // Add other features similarly
    {
      id: 'smartMatch',
      name: 'Smart Match',
      hasAccess: true,
      dailyUsed: 15,
      dailyLimit: 50,
      monthlyUsed: 300,
      monthlyLimit: 1000,
      unit: 'matches'
    },
    {
      id: 'smartMatchPlus',
      name: 'Smart Match Plus',
      hasAccess: false
    },
    {
      id: 'smartJobPlus',
      name: 'Smart Job Plus',
      hasAccess: false
    },
    {
      id: 'profile',
      name: 'Profile',
      hasAccess: true,
      dailyUsed: 10,
      dailyLimit: 50,
      monthlyUsed: 200,
      monthlyLimit: 1000,
      unit: 'views'
    },
    {
      id: 'excel',
      name: 'Excel',
      hasAccess: true,
      dailyUsed: 2,
      dailyLimit: 5,
      monthlyUsed: 10,
      monthlyLimit: 50,
      unit: 'exports'
    },
    {
      id: 'email',
      name: 'Email',
      hasAccess: true,
      dailyUsed: 20,
      dailyLimit: 100,
      monthlyUsed: 450,
      monthlyLimit: 2000,
      unit: 'emails'
    },
    {
      id: 'sms',
      name: 'SMS',
      hasAccess: true,
      dailyUsed: 5,
      dailyLimit: 20,
      monthlyUsed: 100,
      monthlyLimit: 500,
      unit: 'messages'
    },
    {
      id: 'ivr',
      name: 'IVR',
      hasAccess: false
    }
  ];

  const calculatePercentage = (used: number = 0, total: number = 1) => {
    return Math.min(Math.round((used / total) * 100), 100);
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1>Usage Limit</h1>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'myLimits' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('myLimits')}
          >
            My Limits
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'accountLimits' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('accountLimits')}
          >
            Account Limits
          </button>
        </div>
      </div>

      {/* Usage Cards */}
      <div className={styles.usageGrid}>
        {usageData.map((item) => (
          <div key={item.id} className={styles.usageCard}>
            <div className={styles.cardHeader}>
              <h3>{item.name}</h3>
              <button className={styles.helpButton} title="Learn more">
                <FiHelpCircle size={18} />
              </button>
            </div>
            
            {!item.hasAccess ? (
              <div className={styles.noAccess}>
                <FiAlertTriangle className={styles.warningIcon} />
                <p>You do not have access to this feature</p>
                <button className={styles.ctaButton}>
                  Click here to learn more
                </button>
              </div>
            ) : (
              <div className={styles.usageContent}>
                <div className={styles.usageMeter}>
                  <div className={styles.meterHeader}>
                    <span>Daily Usage</span>
                    <span>{item.dailyUsed} / {item.dailyLimit} {item.unit}</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${calculatePercentage(item.dailyUsed, item.dailyLimit)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className={styles.usageMeter}>
                  <div className={styles.meterHeader}>
                    <span>Monthly Usage</span>
                    <span>{item.monthlyUsed} / {item.monthlyLimit} {item.unit}</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${calculatePercentage(item.monthlyUsed, item.monthlyLimit)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="/help" className={styles.footerLink}>Help Center</a>
          <span className={styles.divider}>|</span>
          <a href="/about" className={styles.footerLink}>About Us</a>
          <span className={styles.divider}>|</span>
          <a href="/fraud-alert" className={styles.footerLink}>Fraud Alert</a>
          <span className={styles.divider}>|</span>
          <a href="/terms" className={styles.footerLink}>Terms & Conditions</a>
          <span className={styles.divider}>|</span>
          <a href="/privacy" className={styles.footerLink}>Privacy Policy</a>
        </div>
        <div className={styles.contactInfo}>
          <p>© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          <p>Contact: support@yourcompany.com | +1 (555) 123-4567</p>
        </div>
      </footer>
    </div>
  );
};

export default UsageLimitPage;