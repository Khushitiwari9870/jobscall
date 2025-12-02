'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import styles from './layout/Header.module.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      {/* Top Notification Banner */}
      <div className={styles.notificationBanner}>
        <div className={styles.notificationContent}>
          🚀 Recruiter Co-pilot is LIVE! Now get AI-powered candidate matching and insights.
          <button className={styles.notificationButton}>Know More</button>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className={styles.mainNav}>
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoText}>Jobscall</span>
            <span className={styles.logoDot}>.</span>
          </Link>
        </div>
        
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
            </li>
            <li className={`${styles.navItem} ${styles.navItemActive}`}>
              <Link href="/find-candidates" className={styles.navLink}>
                Find Candidates
              </Link>
            </li>
            <li className={`${styles.navItem} ${styles.hasDropdown}`}>
              <span className={styles.navLink}>
                Jobs
                <svg className={styles.dropdownIcon} viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M7 10l5 5 5-5z" />
                </svg>
              </span>
              <div className={styles.dropdown}>
                <Link href="/jobs/active" className={styles.dropdownItem}>
                  Active Jobs
                </Link>
                <Link href="/jobs/archived" className={styles.dropdownItem}>
                  Archived Jobs
                </Link>
                <Link href="/jobs/drafts" className={styles.dropdownItem}>
                  Drafts
                </Link>
              </div>
            </li>
            <li className={styles.navItem}>
              <Link href="/email-template" className={styles.navLink}>
                Email / SMS / IVR
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/folders" className={styles.navLink}>
                Folders
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/workspace" className={styles.navLink}>
                Workspace
              </Link>
            </li>
            <li className={`${styles.navItem} ${styles.hasDropdown}`}>
              <span className={styles.navLink}>
                Admin
                <svg className={styles.dropdownIcon} viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M7 10l5 5 5-5z" />
                </svg>
              </span>
              <div className={styles.dropdown}>
                <Link href="/admin/users" className={styles.dropdownItem}>
                  User Management
                </Link>
                <Link href="/admin/settings" className={styles.dropdownItem}>
                  Settings
                </Link>
                <Link href="/admin/reports" className={styles.dropdownItem}>
                  Reports
                </Link>
              </div>
            </li>
          </ul>
        </nav>
        
        <div className={styles.userActions}>
          {user ? (
            <>
              <button className={styles.notificationButton} aria-label="Notifications">
                <svg viewBox="0 0 24 24" width="24" height="24" className={styles.icon}>
                  <path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
                </svg>
              </button>
              <div className={styles.profileDropdown}>
                <button className={styles.profileButton}>
                  <div className={styles.avatar}>
                    <span className={styles.avatarText}>
                      {user.first_name?.charAt(0).toUpperCase()}{user.last_name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className={styles.userName}>{user.first_name} {user.last_name}</span>
                  <svg className={styles.dropdownIcon} viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M7 10l5 5 5-5z" />
                  </svg>
                </button>
                <div className={styles.profileMenu}>
                  <Link href="/profile" className={styles.profileMenuItem}>
                    My Profile
                  </Link>
                  <Link href="/settings" className={styles.profileMenuItem}>
                    Account Settings
                  </Link>
                  <div className={styles.divider}></div>
                  <button onClick={logout} className={styles.profileMenuItem}>
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.authButton}>
                Login
              </Link>
              <Link href="/register" className={`${styles.authButton} ${styles.authButtonPrimary}`}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
