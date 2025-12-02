import React from 'react';
import styles from './HireTalentCard.module.css';
import Link from 'next/link';

const HireTalentCard = () => {
  return (
    <div className={styles.card}>
      <h3>Find Your Next Hire</h3>
      <p>Post a job and find qualified candidates quickly</p>
      <Link href="/post-job" className={styles.ctaButton}>
        Post a Job
      </Link>
    </div>
  );
};

export default HireTalentCard;
