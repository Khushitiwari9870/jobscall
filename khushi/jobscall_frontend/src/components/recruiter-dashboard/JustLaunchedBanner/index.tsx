import React from 'react';
import styles from './JustLaunchedBanner.module.css';

const JustLaunchedBanner: React.FC = () => {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.icon}>🚀</div>
        <div className={styles.text}>
          <h3>Just Launched: AI-Powered Candidate Search</h3>
          <ul className={styles.features}>
            <li>• Smart matching with AI algorithms</li>
            <li>• 2x more responses from candidates</li>
            <li>• 3x faster hiring process</li>
          </ul>
        </div>
        <button className={styles.ctaButton}>Try Now</button>
      </div>
    </div>
  );
};

export default JustLaunchedBanner;
