// app/saved-searches/page.tsx
'use client';

import { useState } from 'react';
import { FiTrash2, FiMail, FiShare2, FiClock, FiUser, FiCalendar } from 'react-icons/fi';
import styles from './page.module.css';

type TabType = 'saved' | 'ai';

interface SearchItem {
  id: string;
  query: string;
  user: string;
  date: string;
  lastPerformed: string;
  sharedWith: string[];
  emailUpdates: boolean;
  isShared: boolean;
}

const SavedSearchesPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('saved');
  const [selectedRecruiter, setSelectedRecruiter] = useState('all');
  const [selectedSearches, setSelectedSearches] = useState<string[]>([]);
  const [searches, setSearches] = useState<SearchItem[]>([
    {
      id: '1',
      query: 'React Developer in Bangalore with 3+ years experience',
      user: 'John Doe',
      date: '2023-10-01',
      lastPerformed: '2 hours ago',
      sharedWith: ['Team A', 'Team B'],
      emailUpdates: true,
      isShared: true
    },
    {
      id: '2',
      query: 'Full Stack Developer with Node.js and React',
      user: 'Jane Smith',
      date: '2023-09-28',
      lastPerformed: '1 day ago',
      sharedWith: ['Team A'],
      emailUpdates: true,
      isShared: false
    },
    {
      id: '3',
      query: 'UI/UX Designer with Figma experience',
      user: 'Alex Johnson',
      date: '2023-09-25',
      lastPerformed: '3 days ago',
      sharedWith: [],
      emailUpdates: false,
      isShared: false
    }
  ]);

  const recruiters = [
    { id: 'all', name: 'All Recruiters' },
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Alex Johnson' },
  ];

  const toggleSearchSelection = (id: string) => {
    setSelectedSearches(prev =>
      prev.includes(id)
        ? prev.filter(searchId => searchId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedSearches.length === searches.length) {
      setSelectedSearches([]);
    } else {
      setSelectedSearches(searches.map(search => search.id));
    }
  };

  const toggleShare = (id: string) => {
    setSearches(searches.map(search =>
      search.id === id ? { ...search, isShared: !search.isShared } : search
    ));
  };

  const toggleEmailUpdates = (id: string) => {
    setSearches(searches.map(search =>
      search.id === id ? { ...search, emailUpdates: !search.emailUpdates } : search
    ));
  };

  const deleteSelected = () => {
    setSearches(searches.filter(search => !selectedSearches.includes(search.id)));
    setSelectedSearches([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>SmartSearch</h1>
          <p className={styles.savedCount}>
            {searches.length} of 50 searches saved
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'saved' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved Searches
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'ai' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          AI Searches
        </button>
      </div>

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.actionButtons}>
          <button
            className={`${styles.actionButton} ${selectedSearches.length === 0 ? styles.disabled : ''}`}
            disabled={selectedSearches.length === 0}
            onClick={deleteSelected}
          >
            <FiTrash2 className={styles.actionIcon} />
            Delete
          </button>
          <button
            className={`${styles.actionButton} ${selectedSearches.length === 0 ? styles.disabled : ''}`}
            disabled={selectedSearches.length === 0}
          >
            <FiMail className={styles.actionIcon} />
            Change Email Status
          </button>
        </div>
        <div className={styles.recruiterFilter}>
          <span className={styles.filterLabel}>Recruiter:</span>
          <select
            className={styles.recruiterSelect}
            value={selectedRecruiter}
            onChange={(e) => setSelectedRecruiter(e.target.value)}
          >
            {recruiters.map(recruiter => (
              <option key={recruiter.id} value={recruiter.id}>
                {recruiter.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Table */}
      <div className={styles.tableContainer}>
        <table className={styles.searchTable}>
          <thead>
            <tr>
              <th className={styles.checkboxCell}>
                <input
                  type="checkbox"
                  checked={selectedSearches.length === searches.length && searches.length > 0}
                  onChange={toggleSelectAll}
                  className={styles.checkbox}
                />
              </th>
              <th className={styles.queryHeader}>Search Query</th>
              <th>Last Performed</th>
              <th>Share With</th>
              <th>Share</th>
              <th>Email Updates</th>
            </tr>
          </thead>
          <tbody>
            {searches.map((search) => (
              <tr key={search.id} className={styles.searchRow}>
                <td className={styles.checkboxCell}>
                  <input
                    type="checkbox"
                    checked={selectedSearches.includes(search.id)}
                    onChange={() => toggleSearchSelection(search.id)}
                    className={styles.checkbox}
                  />
                </td>
                <td className={styles.queryCell}>
                  <div className={styles.queryContent}>
                    <div className={styles.searchQuery}>
                      <a href="#" className={styles.queryLink}>{search.query}</a>
                    </div>
                    <div className={styles.searchMeta}>
                      <span className={styles.metaItem}>
                        <FiUser className={styles.metaIcon} size={12} />
                        {search.user}
                      </span>
                      <span className={styles.metaItem}>
                        <FiCalendar className={styles.metaIcon} size={12} />
                        {formatDate(search.date)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className={styles.lastPerformed}>
                  <FiClock className={styles.statusIcon} size={14} />
                  {search.lastPerformed}
                </td>
                <td className={styles.sharedWith}>
                  {search.sharedWith.length > 0 ? (
                    <div className={styles.sharedWithList}>
                      {search.sharedWith[0]}
                      {search.sharedWith.length > 1 && (
                        <span className={styles.moreTeams}>+{search.sharedWith.length - 1} more</span>
                      )}
                    </div>
                  ) : (
                    <span className={styles.notShared}>Not shared</span>
                  )}
                </td>
                <td>
                  <button
                    className={`${styles.shareButton} ${search.isShared ? styles.shared : ''}`}
                    onClick={() => toggleShare(search.id)}
                  >
                    <FiShare2 size={14} />
                    {search.isShared ? 'Shared' : 'Share'}
                  </button>
                </td>
                <td>
                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={search.emailUpdates}
                      onChange={() => toggleEmailUpdates(search.id)}
                    />
                    <span className={styles.slider}></span>
                    <span className={styles.toggleText}>
                      {search.emailUpdates ? 'ON' : 'OFF'}
                    </span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="/help" className={styles.footerLink}>Help Center</a>
          <span className={styles.divider}>|</span>
          <a href="/about" className={styles.footerLink}>About Us</a>
          <span className={styles.divider}>|</span>
          <a href="/fraud-alert" className={styles.footerLink}>Fraud Alert</a>
          <span className={styles.divider}>|</span>
          <a href="/terms" className={styles.footerLink}>Terms & Conditions</a>
          <span className={styles.divider}>|</span>
          <a href="/privacy" className={styles.footerLink}>Privacy Policy</a>
        </div>
        <div className={styles.contactInfo}>
          <p>© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          <p>Contact: support@yourcompany.com | +1 (555) 123-4567</p>
        </div>
      </footer>
    </div>
  );
};

export default SavedSearchesPage;