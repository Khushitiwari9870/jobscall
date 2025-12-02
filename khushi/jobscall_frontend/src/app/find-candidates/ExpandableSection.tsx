// src/components/find-candidates/ExpandableSection.tsx
import { ReactNode, useState } from 'react';
import styles from './ExpandableSection.module.css';

type ExpandableSectionProps = {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
};

export default function ExpandableSection({ 
  title, 
  children,
  defaultExpanded = false 
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={styles.expandableSection}>
      <button 
        className={styles.header} 
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className={styles.title}>{title}</span>
        <span className={`${styles.arrow} ${isExpanded ? styles.expanded : ''}`}>
          ▼
        </span>
      </button>
      {isExpanded && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </div>
  );
}