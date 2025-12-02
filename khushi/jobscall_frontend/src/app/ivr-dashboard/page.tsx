'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiPlus, FiChevronDown, FiChevronUp, FiBarChart2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import styles from './page.module.css';
type TabType = 'dashboard' | 'my-templates' | 'shared-templates';
type StatusType = 'Active' | 'Inactive' | 'Draft' | 'Rejected';

interface IvrTemplate {
  id: string;
  name: string;
  totalCalls: number;
  positiveResponse: number;
  createdOn: string;
  status: StatusType;
}

// Mock data for IVR templates
const mockTemplates: IvrTemplate[] = [
  {
    id: '1',
    name: 'Welcome Call Flow',
    totalCalls: 1245,
    positiveResponse: 856,
    createdOn: '2023-09-15',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Customer Support',
    totalCalls: 892,
    positiveResponse: 721,
    createdOn: '2023-09-10',
    status: 'Active'
  },
  {
    id: '3',
    name: 'Appointment Reminder',
    totalCalls: 0,
    positiveResponse: 0,
    createdOn: '2023-09-20',
    status: 'Draft'
  },
  {
    id: '4',
    name: 'Payment Reminder',
    totalCalls: 453,
    positiveResponse: 0,
    createdOn: '2023-09-05',
    status: 'Inactive'
  },
  {
    id: '5',
    name: 'Feedback Collection',
    totalCalls: 0,
    positiveResponse: 0,
    createdOn: '2023-08-28',
    status: 'Rejected'
  }
];

export default function IvrDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: keyof IvrTemplate | null; direction: 'asc' | 'desc'}>({ 
    key: null, 
    direction: 'asc' 
  });

  // Filter templates based on search query and active tab
  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'my-templates') return matchesSearch;
    if (activeTab === 'shared-templates') return matchesSearch && template.status === 'Active';
    return matchesSearch; // For dashboard tab, show all matching
  });

  // Sort templates
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    // Handle different data types for sorting
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      // For numbers
      return sortConfig.direction === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }
  });

  // Handle sort request
  const requestSort = (key: keyof IvrTemplate) => {
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

  // Calculate positive response rate
  const calculateResponseRate = (total: number, positive: number) => {
    if (total === 0) return '0%';
    return `${Math.round((positive / total) * 100)}%`;
  };

  // Get sort indicator
  const getSortIndicator = (key: keyof IvrTemplate) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>Manage IVR Template</h1>
          <p className={styles.subtitle}>
            {mockTemplates.length} of 50 templates created
          </p>
        </div>
        <button className={styles.createButton}>
          <FiPlus className={styles.buttonIcon} />
          Create new IVR template
        </button>
      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'dashboard' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('dashboard')}
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
            className={styles.searchInputField}
            type="text" 
            placeholder="Search templates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Templates Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
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
                className={`${styles.sortableHeader} ${sortConfig.key === 'totalCalls' ? styles.sorted : ''}`}
                onClick={() => requestSort('totalCalls')}
              >
                <div className={styles.headerContent}>
                  Total Calls
                  {getSortIndicator('totalCalls')}
                </div>
              </th>
              <th>Positive Response</th>
              <th 
                className={`${styles.sortableHeader} ${sortConfig.key === 'createdOn' ? styles.sorted : ''}`}
                onClick={() => requestSort('createdOn')}
              >
                <div className={styles.headerContent}>
                  Created On
                  {getSortIndicator('createdOn')}
                </div>
              </th>
              <th 
                className={`${styles.sortableHeader} ${sortConfig.key === 'status' ? styles.sorted : ''}`}
                onClick={() => requestSort('status')}
              >
                <div className={styles.headerContent}>
                  Status
                  {getSortIndicator('status')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTemplates.length > 0 ? (
              sortedTemplates.map((template) => (
                <tr key={template.id} className={styles.tableRow}>
                  <td>
                    <Link href={`/ivr-dashboard/${template.id}`} className={styles.templateLink}>
                      {template.name}
                    </Link>
                  </td>
                  <td className={styles.numberCell}>
                    <div className={styles.metricWithIcon}>
                      <FiBarChart2 className={styles.metricIcon} />
                      {template.totalCalls.toLocaleString()}
                    </div>
                  </td>
                  <td className={styles.numberCell}>
                    <div className={styles.metricWithIcon}>
                      {template.positiveResponse > 0 ? (
                        <FiCheckCircle className={`${styles.metricIcon} ${styles.positiveIcon}`} />
                      ) : (
                        <FiXCircle className={`${styles.metricIcon} ${styles.negativeIcon}`} />
                      )}
                      {template.totalCalls > 0 ? (
                        <span>{calculateResponseRate(template.totalCalls, template.positiveResponse)}</span>
                      ) : (
                        <span>N/A</span>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(template.createdOn)}</td>
                  <td>
                    <span className={`${styles.status} ${styles[template.status.toLowerCase()]}`}>
                      {template.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.noResults}>
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📋</div>
                    <h3>No templates found</h3>
                    <p>{searchQuery ? 'No templates match your search.' : 'You have not created any templates yet.'}</p>
                    {searchQuery ? (
                      <button 
                        className={styles.clearSearchButton}
                        onClick={() => setSearchQuery('')}
                      >
                        Clear search
                      </button>
                    ) : (
                      <button 
                        className={styles.createTemplateButton}
                        onClick={() => {}}
                      >
                        Create your first template
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
