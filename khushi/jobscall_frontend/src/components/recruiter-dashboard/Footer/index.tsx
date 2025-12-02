import React from 'react';
import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <div className={styles.logoContainer}>
            <Image src="/logo.png" alt="JobScall Logo" width={120} height={40} className={styles.logo} />
            <h3 className={styles.footerHeading}>JobScall</h3>
          </div>
          <p className={styles.footerDescription}>
            Connecting top talent with leading companies worldwide.
          </p>
          <div className={styles.socialLinks}>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin className={styles.socialIcon} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter className={styles.socialIcon} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook className={styles.socialIcon} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className={styles.socialIcon} />
            </a>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>For Job Seekers</h4>
          <ul className={styles.footerLinks}>
            <li><Link href="/jobs">Browse Jobs</Link></li>
            <li><Link href="/profile">My Profile</Link></li>
            <li><Link href="/applications">My Applications</Link></li>
            <li><Link href="/career-advice">Career Advice</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>For Employers</h4>
          <ul className={styles.footerLinks}>
            <li><Link href="/post-job">Post a Job</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/recruiting-solutions">Recruiting Solutions</Link></li>
            <li><Link href="/employer-dashboard">Employer Dashboard</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Company</h4>
          <ul className={styles.footerLinks}>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/careers">Careers</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.footerLegal}>
          <span>© {currentYear} JobScall. All rights reserved.</span>
          <div className={styles.legalLinks}>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <span className={styles.divider}>|</span>
            <Link href="/terms-of-service">Terms of Service</Link>
            <span className={styles.divider}>|</span>
            <Link href="/cookie-policy">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
