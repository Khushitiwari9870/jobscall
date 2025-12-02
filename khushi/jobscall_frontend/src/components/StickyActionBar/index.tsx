'use client';

import { useState } from 'react';
import { FiSearch, FiZap } from 'react-icons/fi';
import styles from './StickyActionBar.module.css';

const StickyActionBar = () => {
  const [activePeriod, setActivePeriod] = useState('6 Months');
  
  const periods = [
    '3 Months',
    '6 Months',
    '1 Year',
    '2 Years',
    'All Time'
  ];

  return (
    <div className={styles.stickyBar}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <span className={styles.label}>Candidates active in</span>
          <div className={styles.dropdown}>
            <select 
              className={styles.select}
              value={activePeriod}
              onChange={(e) => setActivePeriod(e.target.value)}
            >
              {periods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className={styles.rightSection}>
          <button className={`${styles.button} ${styles.secondary}`}>
            <FiZap className={styles.buttonIcon} />
            Search with AI
            <span className={styles.betaBadge}>beta</span>
          </button>
          <button className={`${styles.button} ${styles.primary}`}>
            <FiSearch className={styles.buttonIcon} />
            Search Candidates
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyActionBar;
