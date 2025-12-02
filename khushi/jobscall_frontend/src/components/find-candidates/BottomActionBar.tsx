import styles from './BottomActionBar.module.css';

type BottomActionBarProps = {
  onSearch: () => void;
  onAISearch: () => void;
};

export default function BottomActionBar({ onSearch, onAISearch }: BottomActionBarProps) {
  return (
    <div className={styles.bottomActionBar}>
      <div className={styles.actionButtons}>
        <button 
          className={`${styles.actionButton} ${styles.primaryButton}`}
          onClick={onSearch}
        >
          Search Candidates
        </button>
        <button 
          className={`${styles.actionButton} ${styles.secondaryButton}`}
          onClick={onAISearch}
        >
          <span className={styles.aiIcon}>🤖</span> Search with AI
        </button>
      </div>
    </div>
  );
}
