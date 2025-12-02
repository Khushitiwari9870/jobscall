import React, { useState } from 'react';
import styles from './NotificationPrompt.module.css';
import { FiX, FiBell } from 'react-icons/fi';

interface NotificationPromptProps {
  onDismiss: () => void;
}

const NotificationPrompt: React.FC<NotificationPromptProps> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  const enableNotifications = () => {
    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
          // You can add logic to subscribe to push notifications here
        }
      });
    }
    handleDismiss();
  };

  if (!isVisible) return null;

  return (
    <div className={styles.notificationPrompt}>
      <div className={styles.iconContainer}>
        <FiBell className={styles.bellIcon} />
      </div>
      <div className={styles.content}>
        <h4 className={styles.title}>Enable Notifications</h4>
        <p className={styles.message}>
          Get real-time updates on applications and messages. Never miss an important update.
        </p>
        <div className={styles.buttons}>
          <button 
            className={styles.allowButton}
            onClick={enableNotifications}
          >
            Allow Notifications
          </button>
          <button 
            className={styles.laterButton}
            onClick={handleDismiss}
          >
            Maybe Later
          </button>
        </div>
      </div>
      <button 
        className={styles.closeButton}
        onClick={handleDismiss}
        aria-label="Dismiss notification prompt"
      >
        <FiX />
      </button>
    </div>
  );
};

export default NotificationPrompt;
