'use client';

import React, { useState, useEffect } from 'react';
import styles from './FeatureCarousel.module.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  buttonText,
  onClick,
}) => (
  <div className={styles.featureCard}>
    <div className={styles.iconContainer}>{icon}</div>
    <h3 className={styles.cardTitle}>{title}</h3>
    <p className={styles.cardDescription}>{description}</p>
    <button onClick={onClick} className={styles.cardButton}>
      {buttonText}
    </button>
  </div>
);

const features = [
  {
    id: 1,
    title: 'Find Top Talent',
    description: 'Access a pool of qualified candidates actively looking for opportunities',
    buttonText: 'Browse Candidates',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Post Jobs',
    description: 'Create and manage job postings to attract the best candidates',
    buttonText: 'Post a Job',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Advanced Filters',
    description: 'Use our powerful filters to find the perfect match for your role',
    buttonText: 'Try Filters',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
      </svg>
    ),
  },
];

const FeatureCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === features.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? features.length - 1 : prevIndex - 1));
  };

  const handleCardClick = (id: number) => {
    // Handle button click based on feature ID
    console.log(`Feature ${id} clicked`);
    // You can add navigation or other actions here
  };

  // For mobile, show only one card at a time
  const visibleFeatures = isMobile 
    ? [features[currentIndex]] 
    : features.slice(currentIndex, currentIndex + (isMobile ? 1 : 3));

  // If we're at the end, add the beginning features to complete the set
  if (!isMobile && currentIndex > features.length - 3) {
    visibleFeatures.push(...features.slice(0, 3 - visibleFeatures.length));
  }

  return (
    <div className={styles.carouselContainer}>
      <h2 className={styles.sectionTitle}>Get Started</h2>
      <div className={styles.carouselWrapper}>
        <button 
          className={`${styles.arrowButton} ${styles.prevButton}`} 
          onClick={prevSlide}
          aria-label="Previous feature"
        >
          <FiChevronLeft />
        </button>
        
        <div className={styles.carouselTrack}>
          {visibleFeatures.map((feature, index) => (
            <div 
              key={feature.id} 
              className={styles.carouselSlide}
              style={{
                transform: `translateX(${isMobile ? 0 : (index * 33.33)}%)`,
                width: isMobile ? '100%' : 'calc(33.33% - 16px)',
              }}
            >
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                buttonText={feature.buttonText}
                onClick={() => handleCardClick(feature.id)}
              />
            </div>
          ))}
        </div>
        
        <button 
          className={`${styles.arrowButton} ${styles.nextButton}`} 
          onClick={nextSlide}
          aria-label="Next feature"
        >
          <FiChevronRight />
        </button>
      </div>
      
      {/* Mobile indicators */}
      {isMobile && (
        <div className={styles.indicators}>
          {features.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${
                index === currentIndex ? styles.activeIndicator : ''
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeatureCarousel;
