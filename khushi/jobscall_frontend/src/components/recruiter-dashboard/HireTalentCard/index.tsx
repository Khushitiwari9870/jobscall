import React from 'react';
import styles from './HireTalentCard.module.css';
import Link from 'next/link';
import { FiSearch, FiZap, FiUsers, FiClock } from 'react-icons/fi';

const HireTalentCard: React.FC = () => {
  const features = [
    {
      icon: <FiSearch className={styles.featureIcon} />,
      title: 'Find Candidates',
      description: 'Search through thousands of qualified candidates',
      link: '/candidates'
    },
    {
      icon: <FiZap className={styles.featureIcon} />,
      title: 'Quick Hire',
      description: 'Fill positions faster with our quick match',
      link: '/quick-hire'
    },
    {
      icon: <FiUsers className={styles.featureIcon} />,
      title: 'Team Collaboration',
      description: 'Work with your team to find the best fit',
      link: '/team'
    },
    {
      icon: <FiClock className={styles.featureIcon} />,
      title: 'Save Time',
      description: 'Reduce hiring time with our tools',
      link: '/solutions'
    }
  ];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Hire Top Talent</h3>
        <p className={styles.cardSubtitle}>Find the perfect candidate for your open positions</p>
      </div>
      
      <div className={styles.featuresGrid}>
        {features.map((feature, index) => (
          <Link href={feature.link} key={index} className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              {feature.icon}
            </div>
            <div className={styles.featureContent}>
              <h4 className={styles.featureTitle}>{feature.title}</h4>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          </Link>
        ))}
      </div>
      
      <div className={styles.cardFooter}>
        <Link href="/post-job" className={styles.primaryButton}>
          Post a Job
        </Link>
        <Link href="/candidates" className={styles.secondaryButton}>
          Browse Candidates
        </Link>
      </div>
    </div>
  );
};

export default HireTalentCard;
