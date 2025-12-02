import React from 'react';
import Header from '@/components/layout/Header';
import TabNav from '@/components/email-template/TabNav';
import EmailTemplateForm from '@/components/email-template/EmailTemplateForm';
import JobDetailsForm from '@/components/email-template/JobDetailsForm';
import Footer from '@/components/layout/Footer';
import { Logo } from '@/components/ui/Logo';
import styles from './page.module.css';

const EmailTemplatePage = () => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <Logo withLink={false} className="mb-4" />
            <h1 className={styles.title}>New Email Template</h1>
          </div>
          <TabNav activeTab="email" />
          
          <div className={styles.formContainer}>
            <EmailTemplateForm />
            <JobDetailsForm />
            
            <div className={styles.buttonGroup}>
              <button className={`${styles.button} ${styles.primaryButton}`}>
                Preview
              </button>
              <button className={`${styles.button} ${styles.secondaryButton}`}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmailTemplatePage;
