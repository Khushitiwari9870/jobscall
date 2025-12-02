// app/recent-searches/page.tsx
'use client';

import { useState } from 'react';
import { FiSearch, FiClock, FiSave, FiChevronLeft, FiChevronRight, FiShare2 } from 'react-icons/fi';
import styles from './page.module.css';

type TabType = 'recent' | 'saved' | 'shared';

interface SearchItem {
  id: string;
  query: string;
  filters: string[];
  user: string;
  timestamp: string;
  isSaved: boolean;
}

const RecentSearchesPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecruiter, setSelectedRecruiter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample data - replace with your actual data
  const searchHistory: SearchItem[] = [
    {
      id: '1',
      query: 'React Developer in Bangalore',
      filters: ['Experience: 3-5 years', 'Salary: 10-15 LPA'],
      user: 'John Doe',
      timestamp: '2023-10-05T14:30:00',
      isSaved: false
    },
    {
      id: '2',
      query: 'Full Stack Developer with Node.js',
      filters: ['Remote', 'Experience: 5+ years'],
      user: 'Jane Smith',
      timestamp: '2023-10-04T11:15:00',
      isSaved: true
    },
    // Add more sample data as needed
  ];

  const recruiters = [
    { id: 'all', name: 'All Recruiters' },
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    // Add more recruiters as needed
  ];

  // Filter and paginate results
  const filteredSearches = searchHistory
    .filter(search => 
      search.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      search.filters.some(filter => 
        filter.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter(search => 
      selectedRecruiter === 'all' || search.user === selectedRecruiter
    );

  const totalPages = Math.ceil(filteredSearches.length / itemsPerPage);
  const paginatedSearches = filteredSearches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleSaveSearch = (id: string) => {
    // Implement save/unsave functionality
    console.log('Toggle save for search:', id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <h1>SmartSearch</h1>
        </div>
        <nav className={styles.navTabs}>
          <button
            className={`${styles.tab} ${activeTab === 'recent' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('recent')}
          >
            Recent Searches
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'saved' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved Searches
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'shared' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('shared')}
          >
            Shared Searches
          </button>
        </nav>
      </header>

      {/* Search Bar */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputContainer}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by keywords"
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <select
            className={styles.recruiterSelect}
            value={selectedRecruiter}
            onChange={(e) => {
              setSelectedRecruiter(e.target.value);
              setCurrentPage(1);
            }}
          >
            {recruiters.map(recruiter => (
              <option key={recruiter.id} value={recruiter.id}>
                {recruiter.name}
              </option>
            ))}
          </select>
          <button className={styles.searchButton}>
            <FiSearch className={styles.buttonIcon} />
            Search
          </button>
        </div>
      </div>

      {/* Results Count and Pagination Top */}
      <div className={styles.resultsHeader}>
        <div className={styles.resultsCount}>
          {filteredSearches.length} results found
        </div>
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className={styles.resultsContainer}>
        {paginatedSearches.length > 0 ? (
          <ul className={styles.searchList}>
            {paginatedSearches.map((search) => (
              <li key={search.id} className={styles.searchItem}>
                <div className={styles.searchContent}>
                  <h3 className={styles.searchQuery}>
                    {search.query}
                  </h3>
                  <div className={styles.searchMeta}>
                    <span className={styles.searchUser}>
                      {search.user}
                    </span>
                    <span className={styles.searchTime}>
                      <FiClock className={styles.timeIcon} />
                      {formatDate(search.timestamp)}
                    </span>
                  </div>
                  {search.filters.length > 0 && (
                    <div className={styles.searchFilters}>
                      {search.filters.map((filter, index) => (
                        <span key={index} className={styles.filterTag}>
                          {filter}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className={styles.searchActions}>
                  <button
                    className={`${styles.actionButton} ${search.isSaved ? styles.saved : ''}`}
                    onClick={() => toggleSaveSearch(search.id)}
                    title={search.isSaved ? 'Remove from saved' : 'Save search'}
                  >
                    <FiSave className={styles.actionIcon} />
                    {search.isSaved ? 'Saved' : 'Save Search'}
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.shareButton}`}
                    title="Share search"
                  >
                    <FiShare2 className={styles.actionIcon} />
                    Share
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.noResults}>
            <p>No search results found</p>
          </div>
        )}
      </div>

      {/* Pagination Bottom */}
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <div className={styles.pagination}>
            <button 
              className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
              Previous
            </button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`${styles.pageNumber} ${currentPage === pageNum ? styles.activePage : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className={styles.ellipsis}>...</span>
                  <button
                    className={`${styles.pageNumber}`}
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            <button
              className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentSearchesPage;