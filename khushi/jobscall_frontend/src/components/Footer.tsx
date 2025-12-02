import React from 'react';
import Link from 'next/link';
import { Logo } from './ui/Logo';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <Logo withLink={false} className="mb-4" />
          <p className={styles.brandDescription}>
            Connecting top talent with leading companies to build successful careers and businesses.
          </p>
        </div>

        <div className={styles.footerLinks}>
          <Link href="/help-center" className={styles.footerLink}>
            Help Center
          </Link>
          <span className={styles.divider}>•</span>
          <Link href="/about" className={styles.footerLink}>
            About Us
          </Link>
          <span className={styles.divider}>•</span>
          <Link href="/fraud-alert" className={styles.footerLink}>
            Fraud Alert
          </Link>
          <span className={styles.divider}>•</span>
          <Link href="/terms" className={styles.footerLink}>
            Terms & Conditions
          </Link>
          <span className={styles.divider}>•</span>
          <Link href="/privacy" className={styles.footerLink}>
            Privacy Policy
          </Link>
        </div>

        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📞</span>
            <span>+91 80 100 55 401</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>✉️</span>
            <span>recruiter@shine.com</span>
          </div>
        </div>
      </div>

      <div className={styles.copyright}>
        © {new Date().getFullYear()} Jobscall.com. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
