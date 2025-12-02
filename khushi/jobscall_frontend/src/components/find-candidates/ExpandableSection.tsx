// src/components/find-candidates/ExpandableSection.tsx
import { ReactNode, useState } from 'react';
import styles from './ExpandableSection.module.css';

type ExpandableSectionProps = {
  title: string;
  children: ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  defaultExpanded?: boolean;
};

export default function ExpandableSection({ 
  title, 
  children,
  isOpen: isOpenProp,
  onToggle: onToggleProp,
  defaultExpanded = false 
}: ExpandableSectionProps) {
  const [internalIsExpanded, setInternalIsExpanded] = useState(defaultExpanded);
  
  // Use controlled behavior if isOpen and onToggle are provided, otherwise use internal state
  const isExpanded = isOpenProp !== undefined ? isOpenProp : internalIsExpanded;
  const toggleExpanded = onToggleProp || (() => setInternalIsExpanded(!internalIsExpanded));

  return (
    <div className={styles.expandableSection}>
      <button 
        className={styles.header} 
        onClick={toggleExpanded}
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