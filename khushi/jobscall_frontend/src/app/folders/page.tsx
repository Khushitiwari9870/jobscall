'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiChevronDown, FiChevronUp, FiMoreVertical, FiFolder, FiFile, FiUsers, FiTrash2, FiEdit2, FiEye } from 'react-icons/fi';
import styles from './page.module.css';

// Types
type SortField = 'name' | 'type' | 'createdOn' | 'modifiedOn' | 'fileCount' | 'sharedWith';
type SortDirection = 'asc' | 'desc';

interface Folder {
  id: string;
  name: string;
  type: 'Private' | 'Shared' | 'Public';
  createdOn: string;
  modifiedOn: string;
  fileCount: number;
  sharedWith: string[];
}

// Mock data
const mockFolders: Folder[] = [
  {
    id: '1',
    name: 'Recruitment 2023',
    type: 'Shared',
    createdOn: '2023-09-15',
    modifiedOn: '2023-09-28',
    fileCount: 24,
    sharedWith: ['John Doe', 'Jane Smith']
  },
  {
    id: '2',
    name: 'Company Policies',
    type: 'Public',
    createdOn: '2023-08-10',
    modifiedOn: '2023-09-25',
    fileCount: 15,
    sharedWith: ['All Employees']
  },
  {
    id: '3',
    name: 'Personal Files',
    type: 'Private',
    createdOn: '2023-09-01',
    modifiedOn: '2023-09-20',
    fileCount: 8,
    sharedWith: []
  },
  {
    id: '4',
    name: 'Project Alpha',
    type: 'Shared',
    createdOn: '2023-07-15',
    modifiedOn: '2023-09-29',
    fileCount: 42,
    sharedWith: ['Alex Johnson', 'Sarah Williams', 'Mike Brown']
  },
  {
    id: '5',
    name: 'Templates',
    type: 'Public',
    createdOn: '2023-06-20',
    modifiedOn: '2023-09-15',
    fileCount: 12,
    sharedWith: ['All Employees']
  },
];

export default function FoldersPage() {
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'name',
    direction: 'asc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  // Handle folder selection
  const toggleFolderSelection = (folderId: string) => {
    setSelectedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  // Handle select all/none
  const toggleSelectAll = () => {
    if (selectedFolders.length === mockFolders.length) {
      setSelectedFolders([]);
    } else {
      setSelectedFolders(mockFolders.map(folder => folder.id));
    }
  };

  // Handle sorting
  const requestSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Sort folders
  const sortedFolders = [...mockFolders].sort((a, b) => {
    if (a[sortConfig.field] < b[sortConfig.field]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.field] > b[sortConfig.field]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedFolders.length / itemsPerPage);
  const paginatedFolders = sortedFolders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Toggle actions menu
  const toggleActionsMenu = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActionsMenu(showActionsMenu === folderId ? null : folderId);
  };

  // Close menu when clicking outside
  const closeMenus = () => {
    setShowActionsMenu(null);
  };

  // Handle click outside to close menus
  if (typeof window !== 'undefined') {
    document.addEventListener('click', closeMenus);
  }

  return (
    <div className={styles.container} onClick={closeMenus}>
      <div className={styles.header}>
        <h1>Folders</h1>
        <button className={styles.createButton}>
          <FiFolder className={styles.buttonIcon} />
          Create New Folder
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.foldersTable}>
          <thead>
            <tr>
              <th className={styles.checkboxCell}>
                <input 
                  type="checkbox" 
                  checked={selectedFolders.length === mockFolders.length && mockFolders.length > 0}
                  onChange={toggleSelectAll}
                  aria-label="Select all folders"
                />
              </th>
              <th 
                className={`${styles.sortable} ${sortConfig.field === 'name' ? styles.sorted : ''}`}
                onClick={() => requestSort('name')}
              >
                <div className={styles.columnHeader}>
                  <span>Folder Name</span>
                  {sortConfig.field === 'name' && (
                    sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                  )}
                </div>
              </th>
              <th 
                className={`${styles.sortable} ${sortConfig.field === 'type' ? styles.sorted : ''}`}
                onClick={() => requestSort('type')}
              >
                <div className={styles.columnHeader}>
                  <span>Folder Type</span>
                  {sortConfig.field === 'type' && (
                    sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                  )}
                </div>
              </th>
              <th 
                className={`${styles.sortable} ${sortConfig.field === 'createdOn' ? styles.sorted : ''}`}
                onClick={() => requestSort('createdOn')}
              >
                <div className={styles.columnHeader}>
                  <span>Created On</span>
                  {sortConfig.field === 'createdOn' && (
                    sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                  )}
                </div>
              </th>
              <th 
                className={`${styles.sortable} ${sortConfig.field === 'modifiedOn' ? styles.sorted : ''}`}
                onClick={() => requestSort('modifiedOn')}
              >
                <div className={styles.columnHeader}>
                  <span>Modified On</span>
                  {sortConfig.field === 'modifiedOn' && (
                    sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                  )}
                </div>
              </th>
              <th 
                className={`${styles.sortable} ${styles.numberCell} ${sortConfig.field === 'fileCount' ? styles.sorted : ''}`}
                onClick={() => requestSort('fileCount')}
              >
                <div className={styles.columnHeader}>
                  <span>Files</span>
                  {sortConfig.field === 'fileCount' && (
                    sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                  )}
                </div>
              </th>
              <th 
                className={`${styles.sortable} ${sortConfig.field === 'sharedWith' ? styles.sorted : ''}`}
                onClick={() => requestSort('sharedWith')}
              >
                <div className={styles.columnHeader}>
                  <span>Shared With</span>
                  {sortConfig.field === 'sharedWith' && (
                    sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                  )}
                </div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedFolders.map((folder) => (
              <tr key={folder.id} className={selectedFolders.includes(folder.id) ? styles.selectedRow : ''}>
                <td className={styles.checkboxCell}>
                  <input 
                    type="checkbox" 
                    checked={selectedFolders.includes(folder.id)}
                    onChange={() => toggleFolderSelection(folder.id)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Select ${folder.name}`}
                  />
                </td>
                <td className={styles.folderNameCell}>
                  <Link href={`/folders/${folder.id}`} className={styles.folderLink}>
                    <FiFolder className={styles.folderIcon} />
                    {folder.name}
                  </Link>
                </td>
                <td>
                  <span className={`${styles.folderType} ${styles[folder.type.toLowerCase()]}`}>
                    {folder.type}
                  </span>
                </td>
                <td>{new Date(folder.createdOn).toLocaleDateString()}</td>
                <td>{new Date(folder.modifiedOn).toLocaleDateString()}</td>
                <td className={styles.numberCell}>
                  <div className={styles.fileCount}>
                    <FiFile className={styles.fileIcon} />
                    {folder.fileCount}
                  </div>
                </td>
                <td>
                  {folder.sharedWith.length > 0 ? (
                    <div className={styles.sharedWith}>
                      <FiUsers className={styles.sharedIcon} />
                      <span>
                        {folder.sharedWith.length === 1 
                          ? folder.sharedWith[0] 
                          : `${folder.sharedWith[0]} +${folder.sharedWith.length - 1} more`}
                      </span>
                    </div>
                  ) : (
                    <span className={styles.notShared}>-</span>
                  )}
                </td>
                <td className={styles.actionsCell}>
                  <div className={styles.actionsWrapper}>
                    <button 
                      className={styles.moreActionsButton}
                      onClick={(e) => toggleActionsMenu(folder.id, e)}
                      aria-label="More actions"
                    >
                      <FiMoreVertical />
                    </button>
                    
                    {showActionsMenu === folder.id && (
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className={styles.pageNumbers}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5 || currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  className={`${styles.pageNumber} ${currentPage === pageNum ? styles.active : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className={styles.ellipsis}>...</span>
            )}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                className={`${styles.pageNumber} ${currentPage === totalPages ? styles.active : ''}`}
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </button>
            )}
          </div>
          
          <button 
            className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedFolders.length > 0 && (
        <div className={styles.bulkActions}>
          <div className={styles.selectedCount}>
            {selectedFolders.length} {selectedFolders.length === 1 ? 'item' : 'items'} selected
          </div>
          <div className={styles.bulkButtons}>
            <button className={styles.bulkButton}>
              <FiUsers className={styles.bulkIcon} />
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
