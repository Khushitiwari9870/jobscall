import React from 'react';
import styles from './RecentSearches.module.css';

interface RecentSearchItem {
  id: string;
  title: string;
  location: string;
  date: string;
}

const RecentSearches: React.FC = () => {
  // Sample data - replace with actual data from your API/state
  const recentSearches: RecentSearchItem[] = [
    { id: '1', title: 'React Developer', location: 'Remote', date: '2 days ago' },
    { id: '2', title: 'Full Stack Developer', location: 'Bangalore', date: '1 week ago' },
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Recent Searches</h3>
      <div className={styles.searchList}>
        {recentSearches.map((search) => (
          <div key={search.id} className={styles.searchItem}>
            <div className={styles.searchInfo}>
              <h4 className={styles.searchTitle}>{search.title}</h4>
              <p className={styles.searchLocation}>{search.location}</p>
            </div>
            <span className={styles.searchDate}>{search.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
