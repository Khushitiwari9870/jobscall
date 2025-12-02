import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import styles from './ImportantNotice.module.css';

interface ImportantNoticeProps {
  onDismiss: () => void;
}

const ImportantNotice: React.FC<ImportantNoticeProps> = ({ onDismiss }) => {
  return (
    <div className={styles.noticeBanner}>
      <div className={styles.noticeContent}>
        <div className={styles.noticeIcon}>
          <FiAlertTriangle size={20} />
        </div>
        <div className={styles.noticeText}>
          <strong>Important Notice:</strong> Be aware of fraudulent job offers. Jobscall will never ask for money or payment 
          during the recruitment process. Please verify the authenticity of any communication.
        </div>
        <button className={styles.dismissButton} onClick={onDismiss} aria-label="Dismiss notice">
          <FiX size={20} />
        </button>
      </div>
    </div>
  );
};

export default ImportantNotice;
