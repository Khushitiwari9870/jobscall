"use client";

import { FiChevronLeft, FiChevronRight, FiMoreHorizontal } from 'react-icons/fi';
import styles from './Pagination.module.css';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages = [];
    const half = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - half);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Always show first page
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // Add pages in range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Always show last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number | string) => {
    if (typeof page === 'number' && page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      // Scroll to top of the list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPageItem = (page: number | string, index: number) => {
    if (page === '...') {
      return (
        <span key={`ellipsis-${index}`} className={styles.ellipsis}>
          <FiMoreHorizontal size={16} />
        </span>
      );
    }

    return (
      <button
        key={page}
        className={`${styles.pageItem} ${
          page === currentPage ? styles.active : ''
        }`}
        onClick={() => handlePageChange(page as number)}
        aria-current={page === currentPage ? 'page' : undefined}
      >
        {page}
      </button>
    );
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        className={`${styles.pageItem} ${styles.navButton} ${
          currentPage === 1 ? styles.disabled : ''
        }`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <FiChevronLeft size={16} />
      </button>

      <div className={styles.pages}>
        {getPageNumbers().map((page, index) => renderPageItem(page, index))}
      </div>

      <button
        className={`${styles.pageItem} ${styles.navButton} ${
          currentPage === totalPages ? styles.disabled : ''
        }`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <FiChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
