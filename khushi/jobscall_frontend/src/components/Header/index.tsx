'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiChevronDown, FiBell, FiUser } from 'react-icons/fi';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.logoContainer}>
          <Link href="/">
            <Image 
              src="/logo.png" 
              alt="Jobscall" 
              width={100} 
              height={40} 
              className={styles.logo}
            />
          </Link>
        </div>
        
        <nav className={styles.mainNav}>
          <div className={styles.navItem}>
            <span>Find Candidates</span>
            <FiChevronDown className={styles.dropdownIcon} />
          </div>
          <div className={styles.navItem}>
            <span>Jobs</span>
            <FiChevronDown className={styles.dropdownIcon} />
          </div>
          <div className={styles.navItem}>
            <span>Email/SMS/IVR</span>
            <FiChevronDown className={styles.dropdownIcon} />
          </div>
          <div className={styles.navItem}>
            <span>Folders</span>
            <FiChevronDown className={styles.dropdownIcon} />
          </div>
          <div className={styles.navItem}>
            <span>Workspace</span>
            <FiChevronDown className={styles.dropdownIcon} />
          </div>
          <div className={styles.navItem}>
            <span>Admin</span>
            <FiChevronDown className={styles.dropdownIcon} />
          </div>
        </nav>
        
        <div className={styles.actions}>
          <button className={styles.actionButton}>
            <FiBell size={20} />
          </button>
          <button className={styles.profileButton}>
            <FiUser size={20} />
          </button>
        </div>
      </div>
      
      <div className={styles.subNav}>
        <div className={styles.searchLinks}>
          <Link href="/recent-searches" className={styles.searchLink}>Recent Searches</Link>
          <span className={styles.divider}>|</span>
          <Link href="/saved-searches" className={styles.searchLink}>Saved Searches</Link>
          <span className={styles.divider}>|</span>
          <Link href="/shared-searches" className={styles.searchLink}>Shared Searches</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
