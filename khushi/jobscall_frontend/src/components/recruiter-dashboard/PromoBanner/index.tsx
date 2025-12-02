import React from 'react';
import styles from './PromoBanner.module.css';

const PromoBanner = () => {
  return (
    <div className={styles.promoBanner}>
      <div className={styles.bannerContent}>
        <div className={styles.bannerText}>
          <h2>ChatGPT Powered Search</h2>
          <p>Find the perfect candidates faster with AI-powered search and matching</p>
        </div>
        <button className={styles.tryNowButton}>Try Now</button>
      </div>
    </div>
  );
};

export default PromoBanner;
