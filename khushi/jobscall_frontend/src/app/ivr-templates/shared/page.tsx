'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiPlus, FiChevronDown, FiChevronUp, FiUser } from 'react-icons/fi';
import styles from './page.module.css';

type TabType = 'dashboards' | 'my-templates' | 'shared-templates';

interface SharedTemplate {
  id: string;
  name: string;
  sharedBy: string;
  createdOn: string;
  lastModified: string;
}

// Mock data for shared templates
const sharedTemplates: SharedTemplate[] = [
  {
    id: '1',
    name: 'Customer Support Flow',
    sharedBy: 'John Doe',
    createdOn: '2023-09-20',
    lastModified: '2023-10-02'
  },
  {
    id: '2',
    name: 'Appointment Reminder',
    sharedBy: 'Jane Smith',
    createdOn: '2023-09-18',
    lastModified: '2023-09-28'
  },
  {
    id: '3',
    name: 'Payment Collection',
    sharedBy: 'Alex Johnson',
    createdOn: '2023-09-15',
    lastModified: '2023-09-25'
  },
  {
    id: '4',
    name: 'Feedback Collection',
    sharedBy: 'Sarah Williams',
    createdOn: '2023-09-10',
    lastModified: '2023-09-20'
  },
  {
    id: '5',
    name: 'Order Status',
    sharedBy: 'Mike Brown',
    createdOn: '2023-09-05',
    lastModified: '2023-09-15'
  }
];

export default function SharedIvrTemplates() {
  const [activeTab, setActiveTab] = useState<TabType>('shared-templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: keyof SharedTemplate | null; direction: 'asc' | 'desc'}>({ 
    key: 'name', 
    direction: 'asc' 
  });

  // Filter templates based on search query
  const filteredTemplates = sharedTemplates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.sharedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort templates
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Handle sort request
  const requestSort = (key: keyof SharedTemplate) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get sort indicator
  const getSortIndicator = (key: keyof SharedTemplate) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <header className={styles.header}>
        <h1>Shared IVR Template</h1>
        <button className={styles.createButton}>
          <FiPlus className={styles.buttonIcon} />
          Create new IVR template
        </button>
      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'dashboards' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('dashboards')}
        >
          Dashboard
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'my-templates' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('my-templates')}
        >
          My IVR Template
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'shared-templates' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('shared-templates')}
        >
          Shared by others
        </button>
      </div>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchInput}>
          <FiSearch className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search templates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Templates Table */}
      <div className={styles.tableContainer}>
        <table className={styles.templatesTable}>
          <thead>
            <tr>
              <th 
                className={`${styles.sortableHeader} ${sortConfig.key === 'name' ? styles.sorted : ''}`}
                onClick={() => requestSort('name')}
              >
                <div className={styles.headerContent}>
                  Template Name
                  {getSortIndicator('name')}
                </div>
              </th>
              <th 
                className={`${styles.sortableHeader} ${sortConfig.key === 'sharedBy' ? styles.sorted : ''}`}
                onClick={() => requestSort('sharedBy')}
              >
                <div className={styles.headerContent}>
                  Shared By
                  {getSortIndicator('sharedBy')}
                </div>
              </th>
              <th 
                className={`${styles.sortableHeader} ${sortConfig.key === 'createdOn' ? styles.sorted : ''}`}
                onClick={() => requestSort('createdOn')}
              >
                <div className={styles.headerContent}>
                  Created On
                  {getSortIndicator('createdOn')}
                </div>
              </th>
              <th>Last Modified</th>
            </tr>
          </thead>
          <tbody>
            {sortedTemplates.length > 0 ? (
              sortedTemplates.map((template) => (
                <tr key={template.id} className={styles.tableRow}>
                  <td className={styles.templateName}>
                    <Link href={`/ivr-templates/shared/${template.id}`}>
                      {template.name}
                    </Link>
                  </td>
                  <td className={styles.sharedBy}>
                    <div className={styles.userInfo}>
                      <div className={styles.userIcon}>
                        <FiUser />
                      </div>
                      {template.sharedBy}
                    </div>
                  </td>
                  <td>{formatDate(template.createdOn)}</td>
                  <td>{formatDate(template.lastModified)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className={styles.noResults}>
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📭</div>
                    <h3>No shared templates found</h3>
                    <p>There are no IVR templates shared with you yet.</p>
                    {searchQuery && (
                      <button 
                        className={styles.clearSearchButton}
                        onClick={() => setSearchQuery('')}
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
