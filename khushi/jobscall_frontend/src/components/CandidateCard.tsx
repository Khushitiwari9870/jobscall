"use client";

import { useState } from 'react';
import { FiBookmark, FiShare2, FiMoreVertical, FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi';
import { Candidate } from '@/types/candidate';
import styles from './CandidateCard.module.css';

type CandidateCardProps = {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

const CandidateCard = ({ candidate, isSelected, onSelect }: CandidateCardProps) => {
  const [isShortlisted, setIsShortlisted] = useState(candidate.isShortlisted);
  const [showActions, setShowActions] = useState(false);

  const handleShortlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShortlisted(!isShortlisted);
    // In a real app, you would update this in your state management
  };

  const toggleActions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div 
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(candidate.id)}
    >
      <div className={styles.cardHeader}>
        <div className={styles.avatar}>
          {getInitials(candidate.name)}
        </div>
        
        <div className={styles.candidateInfo}>
          <div className={styles.nameRow}>
            <h3 className={styles.name}>{candidate.name}</h3>
            <span className={styles.experience}>
              {candidate.experience.years}.{candidate.experience.months} yrs
            </span>
            <span className={styles.location}>
              <i className={styles.locationIcon}>📍</i> {candidate.location}
            </span>
          </div>
          
          <div className={styles.roleCompany}>
            {candidate.currentRole} at {candidate.currentCompany}
          </div>
          
          <div className={styles.lastActive}>
            Active {candidate.lastActive}
          </div>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={`${styles.actionButton} ${isShortlisted ? styles.shortlisted : ''}`}
            onClick={handleShortlist}
            aria-label={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
          >
            <FiBookmark />
          </button>
          
          <button className={styles.actionButton} aria-label="Share profile">
            <FiShare2 />
          </button>
          
          <div className={styles.moreActions}>
            <button 
              className={styles.actionButton}
              onClick={toggleActions}
              aria-label="More actions"
            >
              <FiMoreVertical />
            </button>
            
            {showActions && (
              <div className={styles.actionMenu}>
                <button className={styles.menuItem}>
                  <FiMail className={styles.menuIcon} /> Email
                </button>
                <button className={styles.menuItem}>
                  <FiPhone className={styles.menuIcon} /> Call
                </button>
                <button className={styles.menuItem}>
                  <FiMessageSquare className={styles.menuIcon} /> Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className={styles.cardBody}>
        <div className={styles.skills}>
          {candidate.skills.slice(0, 4).map((skill, index) => (
            <span key={index} className={styles.skillTag}>
              {skill}
            </span>
          ))}
          {candidate.skills.length > 4 && (
            <span className={styles.moreSkills}>+{candidate.skills.length - 4} more</span>
          )}
        </div>
        
        <p className={styles.summary}>
          {candidate.summary}
        </p>
        
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Notice:</span>
            <span className={styles.metaValue}>{candidate.noticePeriod}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Current CTC:</span>
            <span className={styles.metaValue}>{candidate.currentCTC} LPA</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Expected CTC:</span>
            <span className={styles.metaValue}>{candidate.expectedCTC} LPA</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Preference:</span>
            <span className={styles.metaValue}>
              {candidate.preferredLocations.join(', ')}
            </span>
          </div>
        </div>
      </div>
      
      <div className={styles.cardFooter}>
        <button className={`${styles.footerButton} ${styles.primary}`}>
          View CV
        </button>
        <button className={styles.footerButton}>
          Contact
        </button>
        <button className={styles.footerButton}>
          Send Mail
        </button>
        <button className={styles.footerButton}>
          Download
        </button>
        <button className={styles.notesButton}>
          Notes
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;
