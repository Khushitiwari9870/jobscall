"use client";

import React from 'react';
import Link from 'next/link';
import styles from './TabNav.module.css';

type TabNavProps = {
  activeTab: 'email' | 'sms' | 'ivr';
};

const TabNav: React.FC<TabNavProps> = ({ activeTab = 'email' }) => {
  return (
    <div className={styles.tabContainer}>
      <nav className={styles.tabNav}>
        <Link 
          href="/email-template" 
          className={`${styles.tab} ${activeTab === 'email' ? styles.active : ''}`}
        >
          Email Template
        </Link>
        <Link 
          href="#" 
          className={`${styles.tab} ${activeTab === 'sms' ? styles.active : ''}`}
          onClick={(e) => e.preventDefault()}
        >
          SMS Template
        </Link>
        <Link 
          href="#" 
          className={`${styles.tab} ${activeTab === 'ivr' ? styles.active : ''}`}
          onClick={(e) => e.preventDefault()}
        >
          IVR Template
        </Link>
      </nav>
    </div>
  );
};

export default TabNav;
