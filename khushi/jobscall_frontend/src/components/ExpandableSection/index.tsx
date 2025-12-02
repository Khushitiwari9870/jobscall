'use client';

import { ReactNode } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import styles from './ExpandableSection.module.css';

interface ExpandableSectionProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const ExpandableSection = ({ title, children, isOpen, onToggle }: ExpandableSectionProps) => {
  return (
    <div className={styles.expandableSection}>
      <button className={styles.header} onClick={onToggle}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.actions}>
          <span className={styles.toggleText}>
            {isOpen ? 'Hide' : 'Show'}
          </span>
          {isOpen ? (
            <FiChevronUp className={styles.icon} />
          ) : (
            <FiChevronDown className={styles.icon} />
          )}
        </div>
      </button>
      
      {isOpen && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;
