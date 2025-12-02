import React from 'react';
import styles from './ListActionsBar.module.css';

const ListActionsBar: React.FC = () => {
  return (
    <div className={styles.actionsBar}>
      <div className={styles.actionGroup}>
        <button className={styles.actionButton}>
          <span className="material-icons">bookmark_border</span>
          <span>Save</span>
        </button>
        <button className={styles.actionButton}>
          <span className="material-icons">download</span>
          <span>Excel</span>
        </button>
        <button className={styles.actionButton}>
          <span className="material-icons">email</span>
          <span>Email</span>
        </button>
        <button className={styles.actionButton}>
          <span className="material-icons">description</span>
          <span>Resume</span>
        </button>
        <button className={styles.actionButton}>
          <span className="material-icons">phone</span>
          <span>IVR</span>
        </button>
      </div>
    </div>
  );
};

export default ListActionsBar;
