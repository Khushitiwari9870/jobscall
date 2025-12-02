'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiPlus, FiChevronDown, FiChevronUp, FiMoreVertical, FiShare2, FiTrash2, FiEdit2, FiEye } from 'react-icons/fi';
import styles from './page.module.css';

type TabType = 'dashboards' | 'my-templates' | 'shared-templates';
type StatusType = 'Active' | 'Inactive' | 'Draft' | 'Rejected';

interface IvrTemplate {
  id: string;
  name: string;
  createdOn: string;
  lastModified: string;
  lastUsed: string;
  status: StatusType;
  isShared: boolean;
}

// Mock data
const mockTemplates: IvrTemplate[] = [
  {
    id: '1',
    name: 'Welcome Call Flow',
    createdOn: '2023-09-15',
    lastModified: '2023-10-01',
    lastUsed: '2023-10-05',
    status: 'Active',
    isShared: true
  },
  {
    id: '2',
    name: 'Customer Support',
    createdOn: '2023-09-10',
    lastModified: '2023-09-28',
    lastUsed: '2023-10-03',
    status: 'Active',
    isShared: false
  },
  {
    id: '3',
    name: 'Appointment Reminder',
    createdOn: '2023-09-20',
    lastModified: '2023-09-25',
    lastUsed: 'Never',
    status: 'Draft',
    isShared: false
  },
  {
    id: '4',
    name: 'Payment Reminder',
    createdOn: '2023-09-05',
    lastModified: '2023-09-22',
    lastUsed: '2023-09-30',
    status: 'Inactive',
    isShared: true
  },
  {
    id: '5',
    name: 'Feedback Collection',
    createdOn: '2023-08-28',
    lastModified: '2023-09-15',
    lastUsed: '2023-09-28',
    status: 'Rejected',
    isShared: false,
  }
];

export default function ManageIvrTemplates() {
  const [activeTab, setActiveTab] = useState<TabType>('my-templates');
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: keyof IvrTemplate | null; direction: 'asc' | 'desc'}>({ key: null, direction: 'asc' });
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  // Filter templates based on search query
  const filteredTemplates = mockTemplates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (activeTab === 'my-templates' ? !template.isShared : activeTab === 'shared-templates' ? template.isShared : true)
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
  const requestSort = (key: keyof IvrTemplate) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Toggle template selection
  const toggleTemplateSelection = (id: string) => {
    setSelectedTemplates(prev => 
      prev.includes(id) 
        ? prev.filter(templateId => templateId !== id)
        : [...prev, id]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedTemplates.length === filteredTemplates.length) {
      setSelectedTemplates([]);
    } else {
      setSelectedTemplates(filteredTemplates.map(template => template.id));
    }
  };

  // Toggle share status
  const toggleShareStatus = (id: string) => {
    console.log(`Toggled share status for template ${id}`);
    // In a real app, this would update the template's shared status via an API
  };

  // Toggle actions menu
  const toggleActionsMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActionsMenu(showActionsMenu === id ? null : id);
  };

  // Close all menus when clicking outside
  const closeMenus = () => {
    setShowActionsMenu(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (dateString === 'Never') return dateString;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get sort indicator
  const getSortIndicator = (key: keyof IvrTemplate) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

  return (
    <div className={styles.container} onClick={closeMenus}>
      {/* Header Section */}
      <header className={styles.header}>
        <div>
          <h1>Manage IVR Template</h1>
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
          className={`${styles.tab} ${activeTab === 'dashboards' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('dashboards')}
        >
          Dashboards
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
            placeholder="Find template" 
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
              <th className={styles.checkboxCell}>
                <input 
                  type="checkbox" 
                  checked={selectedTemplates.length > 0 && selectedTemplates.length === filteredTemplates.length}
                  onChange={toggleSelectAll}
                  aria-label="Select all templates"
                />
              </th>
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
                className={`${styles.sortableHeader} ${sortConfig.key === 'createdOn' ? styles.sorted : ''}`}
                onClick={() => requestSort('createdOn')}
              >
                <div className={styles.headerContent}>
                  Created On
                  {getSortIndicator('createdOn')}
                </div>
              </th>
              <th 
                className={`${styles.sortableHeader} ${sortConfig.key === 'lastModified' ? styles.sorted : ''}`}
                onClick={() => requestSort('lastModified')}
              >
                <div className={styles.headerContent}>
                  Last Modified On
                  {getSortIndicator('lastModified')}
                </div>
              </th>
              <th 
                className={`${styles.sortableHeader} ${sortConfig.key === 'lastUsed' ? styles.sorted : ''}`}
                onClick={() => requestSort('lastUsed')}
              >
                <div className={styles.headerContent}>
                  Last Used On
                  {getSortIndicator('lastUsed')}
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
              <th>Share/Unshare</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTemplates.length > 0 ? (
              sortedTemplates.map((template) => (
                <tr 
                  key={template.id} 
                  className={`${styles.tableRow} ${selectedTemplates.includes(template.id) ? styles.selectedRow : ''}`}
                >
                  <td className={styles.checkboxCell}>
                    <input 
                      type="checkbox" 
                      checked={selectedTemplates.includes(template.id)}
                      onChange={() => toggleTemplateSelection(template.id)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select ${template.name}`}
                    />
                  </td>
                  <td className={styles.templateName}>
                    <Link href={`/ivr-templates/${template.id}`}>
                      {template.name}
                    </Link>
                  </td>
                  <td>{formatDate(template.createdOn)}</td>
                  <td>{formatDate(template.lastModified)}</td>
                  <td>{formatDate(template.lastUsed)}</td>
                  <td>
                    <span className={`${styles.status} ${styles[template.status.toLowerCase()]}`}>
                      {template.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`${styles.shareButton} ${template.isShared ? styles.shared : ''}`}
                      onClick={() => toggleShareStatus(template.id)}
                    >
                      <FiShare2 className={styles.shareIcon} />
                      {template.isShared ? 'Shared' : 'Share'}
                    </button>
                  </td>
                  <td className={styles.actionsCell}>
                    <div className={styles.actionsWrapper}>
                      <button 
                        className={styles.moreActionsButton}
                        onClick={(e) => toggleActionsMenu(template.id, e)}
                        aria-label="More actions"
                      >
                        <FiMoreVertical />
                      </button>
                      
                      {showActionsMenu === template.id && (
                        <div className={styles.actionsMenu} onClick={e => e.stopPropagation()}>
                          <button className={styles.actionItem}>
                            <FiEye className={styles.actionIcon} />
                            View
                          </button>
                          <button className={styles.actionItem}>
                            <FiEdit2 className={styles.actionIcon} />
                            Edit
                          </button>
                          <button className={`${styles.actionItem} ${styles.deleteAction}`}>
                            <FiTrash2 className={styles.actionIcon} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className={styles.noResults}>
                  No templates found{searchQuery ? ' matching your search' : ''}.
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
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bulk Actions */}
      {selectedTemplates.length > 0 && (
        <div className={styles.bulkActions}>
          <div className={styles.selectedCount}>
            {selectedTemplates.length} {selectedTemplates.length === 1 ? 'template' : 'templates'} selected
          </div>
          <div className={styles.bulkButtons}>
            <button className={styles.bulkButton}>
              <FiShare2 className={styles.bulkIcon} />
              Share
            </button>
            <button className={styles.bulkButton}>
              <FiTrash2 className={styles.bulkIcon} />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
