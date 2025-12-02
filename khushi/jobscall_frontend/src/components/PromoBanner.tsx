import React from 'react';
import styles from './PromoBanner.module.css';

const PromoBanner: React.FC = () => {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <h3 className={styles.title}>Effortless Hiring Starts Today!</h3>
        <p className={styles.subtitle}>Your Recruiter Co-pilot is now LIVE!</p>
      </div>
      <button className={styles.ctaButton}>
        Know More
      </button>
    </div>
  );
};

export default PromoBanner;
