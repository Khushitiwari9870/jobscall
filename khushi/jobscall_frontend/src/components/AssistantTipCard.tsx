import React from 'react';
import styles from './AssistantTipCard.module.css';

interface AssistantTipCardProps {
  title: string;
  description: string;
  ctaText: string;
  onCtaClick: () => void;
}

const AssistantTipCard: React.FC<AssistantTipCardProps> = ({
  title,
  description,
  ctaText,
  onCtaClick,
}) => {
  return (
    <div className={styles.assistantTipCard}>
      <div className={styles.tipHeader}>
        <div className={styles.tipIcon}>💡</div>
        <h3 className={styles.tipTitle}>{title}</h3>
      </div>
      <div className={styles.tipContent}>
        <p className={styles.description}>{description}</p>
        <button 
          className={styles.ctaButton}
          onClick={onCtaClick}
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
};

export default AssistantTipCard;
