import React from 'react';
import { Candidate } from '../../types/candidate';
import styles from './CandidateCard.module.css';

interface CandidateCardProps {
  candidate: Candidate;
  isSelected?: boolean;
  onSelect?: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.avatar}>
          {candidate.name.charAt(0).toUpperCase()}
        </div>
        <div className={styles.candidateInfo}>
          <h3 className={styles.name}>
            <a href={`/candidate/${candidate.id}`}>{candidate.name}</a>
            {candidate.isImmediateJoiner && (
              <span className={`${styles.badge} ${styles.immediateJoiner}`}>
                Immediate Joiner
              </span>
            )}
            {candidate.isActivelyLooking && (
              <span className={`${styles.badge} ${styles.activelyLooking}`}>
                Actively Looking
              </span>
            )}
          </h3>
          
          <div className={styles.meta}>
            <span>{candidate.experience.years} years</span>
            <span className={styles.divider}>•</span>
            <span>₹{candidate.currentCTC} LPA</span>
            <span className={styles.divider}>•</span>
            <span>{candidate.location}</span>
          </div>

          <div className={styles.companyInfo}>
            <div>
              <span className={styles.currentCompany}>{candidate.currentCompany}</span>
              {candidate.currentRole && (
                <span className={styles.role}> • {candidate.currentRole}</span>
              )}
            </div>
            {candidate.previousCompany && (
              <div className={styles.previousCompany}>
                Ex: {candidate.previousCompany}
              </div>
            )}
            <div className={styles.education}>
              {candidate.education.degree} • {candidate.education.university} • {candidate.education.year}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.skills}>
        {candidate.skills.map((skill, index) => (
          <span key={index} className={styles.skillTag}>
            {skill}
          </span>
        ))}
        {candidate.relatedSkills && candidate.relatedSkills.length > 0 && (
          <div className={styles.relatedSkills}>
            <span className={styles.relatedLabel}>May also know: </span>
            {candidate.relatedSkills.join(', ')}
          </div>
        )}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.actions}>
          <button className={styles.actionButton}>
            <span className="material-icons">chat_bubble_outline</span>
          </button>
          <button className={styles.actionButton}>
            <span className="material-icons">star_border</span>
          </button>
          <button className={styles.actionButton}>
            <span className="material-icons">share</span>
          </button>
          <button className={styles.actionButton}>
            <span className="material-icons">more_vert</span>
          </button>
        </div>
        
        <div className={styles.communicationActions}>
          <button className={styles.commButton}>
            <span className="material-icons">mail_outline</span>
          </button>
          <button className={styles.commButton}>
            <span className="material-icons">call</span>
          </button>
          <button className={styles.commButton}>
            <span className="material-icons">whatsapp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
