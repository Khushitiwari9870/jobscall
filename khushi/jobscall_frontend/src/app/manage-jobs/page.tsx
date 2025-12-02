// app/manage-jobs/page.tsx
'use client';

import { useState } from 'react';
import { 
  FiSearch, 
  FiCalendar, 
  FiRefreshCw, 
  FiExternalLink, 
  FiChevronLeft, 
  FiChevronRight,
  FiMoreVertical,
  FiShare2,
  FiCopy
} from 'react-icons/fi';
import styles from './page.module.css';

type TabType = 'account' | 'shared';

interface Job {
  id: string;
  selected: boolean;
  createdDate: string;
  title: string;
  location: string;
  postedBy: string;
  applicants: number;
  status: 'Published' | 'Draft' | 'Expired' | 'Closed';
}

const ManageJobs = () => {
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      selected: false,
      createdDate: '2023-10-01',
      title: 'Senior Frontend Developer',
      location: 'Bangalore, India',
      postedBy: 'John Doe',
      applicants: 24,
      status: 'Published'
    },
    // Add more sample jobs as needed
  ]);
  const [filters, setFilters] = useState({
    searchQuery: '',
    jobStatus: 'all',
    jobType: '',
    postedBy: '',
    fromDate: '',
    toDate: ''
  });

  const jobStatuses = [
    { value: 'all', label: 'All Jobs' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'expired', label: 'Expired' },
    { value: 'closed', label: 'Closed' }
  ];

  const jobTypes = [
    { value: '', label: 'All Types' },
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' }
  ];

  const postedByOptions = [
    { value: '', label: 'All Users' },
    { value: 'me', label: 'Posted by Me' },
    { value: 'team', label: 'Posted by Team' }
  ];

  const totalPages = 5; // This would come from your API

  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching with filters:', filters);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      // Fetch jobs for the new page
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setJobs(jobs.map(job => ({ ...job, selected: checked })));
  };

  const toggleJobSelection = (id: string, checked: boolean) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, selected: checked } : job
    ));
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1>Manage Jobs</h1>
        <div className={styles.headerActions}>
          <button className={styles.republishButton}>
            <FiRefreshCw className={styles.buttonIcon} />
            Republish
          </button>
          <button className={styles.viewWorkspaceButton}>
            <FiExternalLink className={styles.buttonIcon} />
            View in Workspace
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'account' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('account')}
        >
          Account Jobs
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'shared' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('shared')}
        >
          Jobs Shared
        </button>
      </div>

      {/* Filters Section */}
      <div className={styles.filtersContainer}>
        <div className={styles.filterGroup}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Job title/ID/Ref no"
            value={filters.searchQuery}
            onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
          />
        </div>

        <div className={styles.filterGroup}>
          <select
            className={styles.selectInput}
            value={filters.jobStatus}
            onChange={(e) => setFilters({...filters, jobStatus: e.target.value})}
          >
            {jobStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <select
            className={styles.selectInput}
            value={filters.jobType}
            onChange={(e) => setFilters({...filters, jobType: e.target.value})}
          >
            {jobTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.dateInput}>
            <input
              type="date"
              className={styles.datePicker}
              placeholder="From Date"
              value={filters.fromDate}
              onChange={(e) => setFilters({...filters, fromDate: e.target.value})}
            />
            <FiCalendar className={styles.calendarIcon} />
          </div>
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.dateInput}>
            <input
              type="date"
              className={styles.datePicker}
              placeholder="To Date"
              value={filters.toDate}
              onChange={(e) => setFilters({...filters, toDate: e.target.value})}
              min={filters.fromDate}
            />
            <FiCalendar className={styles.calendarIcon} />
          </div>
        </div>

        <div className={styles.filterGroup}>
          <select
            className={styles.selectInput}
            value={filters.postedBy}
            onChange={(e) => setFilters({...filters, postedBy: e.target.value})}
          >
            {postedByOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button className={styles.searchButton} onClick={handleSearch}>
          <FiSearch className={styles.searchIcon} />
          Search
        </button>
      </div>

      {/* Jobs Table */}
      <div className={styles.tableContainer}>
        <table className={styles.jobsTable}>
          <thead>
            <tr>
              <th className={styles.checkboxCell}>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </th>
              <th>Creation Date</th>
              <th>Job Details</th>
              <th>Applicants</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className={styles.tableRow}>
                <td className={styles.checkboxCell}>
                  <input
                    type="checkbox"
                    checked={job.selected}
                    onChange={(e) => toggleJobSelection(job.id, e.target.checked)}
                  />
                </td>
                <td className={styles.dateCell}>{formatDate(job.createdDate)}</td>
                <td>
                  <div className={styles.jobDetails}>
                    <div className={styles.jobTitle}>{job.title}</div>
                    <div className={styles.jobMeta}>
                      {job.location} • Posted by {job.postedBy}
                    </div>
                  </div>
                </td>
                <td>
                  <button className={styles.applicantsLink}>
                    {job.applicants} Applicants
                  </button>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[job.status.toLowerCase()]}`}>
                    {job.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionButton} title="Republish">
                      <FiRefreshCw size={16} />
                    </button>
                    <button className={styles.actionButton} title="Copy">
                      <FiCopy size={16} />
                    </button>
                    <button className={styles.actionButton} title="Share">
                      <FiShare2 size={16} />
                    </button>
                    <button className={styles.actionButton} title="More">
                      <FiMoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Showing 1-{jobs.length} of {jobs.length * totalPages} jobs
        </div>
        <div className={styles.paginationControls}>
          <button 
            className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FiChevronLeft />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            );
          })}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <span className={styles.pageDots}>...</span>
          )}
          {totalPages > 5 && currentPage < totalPages - 1 && (
            <button
              className={`${styles.pageButton} ${currentPage === totalPages ? styles.activePage : ''}`}
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          )}
          <button
            className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;