import React from 'react';
import Link from 'next/link';
import { FiBell, FiMessageSquare, FiUser, FiChevronDown } from 'react-icons/fi';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.topBanner}>
        <div className={styles.bannerContent}>
          <span>🚀 ChatGPT Powered Search is here! Try it now and experience smarter candidate matching.</span>
          <button className={styles.bannerClose}>×</button>
        </div>
      </div>
      
      <div className={styles.mainHeader}>
        <div className={styles.logo}>
          <Link href="/">
            <span className={styles.logoText}>Jobscall Recruiter</span>
          </Link>
        </div>
        
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={`${styles.navItem} ${styles.active}`}>
              <Link href="/find-candidates">Find Candidates</Link>
            </li>
            <li className={`${styles.navItem} ${styles.hasDropdown}`}>
              <span>Jobs <FiChevronDown size={16} /></span>
              <div className={styles.dropdown}>
                <Link href="/jobs/active">Active Jobs</Link>
                <Link href="/jobs/closed">Closed Jobs</Link>
                <Link href="/jobs/drafts">Drafts</Link>
              </div>
            </li>
            <li className={styles.navItem}>
              <Link href="/email-sms">Email/SMS/IVR</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/folders">Folders</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/workspace">Workspace</Link>
            </li>
            <li className={`${styles.navItem} ${styles.hasDropdown}`}>
              <span>Admin <FiChevronDown size={16} /></span>
              <div className={styles.dropdown}>
                <Link href="/admin/users">Users</Link>
                <Link href="/admin/settings">Settings</Link>
                <Link href="/admin/billing">Billing</Link>
              </div>
            </li>
          </ul>
        </nav>
        
        <div className={styles.headerActions}>
          <button className={styles.iconButton} aria-label="Notifications">
            <FiBell size={20} />
            <span className={styles.badge}>3</span>
          </button>
          <button className={styles.iconButton} aria-label="Messages">
            <FiMessageSquare size={20} />
          </button>
          <div className={styles.profile}>
            <div className={styles.avatar}>
              <FiUser size={20} />
            </div>
            <span>Recruiter</span>
            <FiChevronDown size={16} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
