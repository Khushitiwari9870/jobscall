"use client";

import { useState, useMemo } from 'react';
import { FiFilter, FiChevronDown, FiMove, FiMail, FiDownload } from 'react-icons/fi';
import styles from './ListToolbar.module.css';

type ListToolbarProps = {
  selectedCount: number;
  totalCount?: number;
  sortBy: string;
  onSortChange: (value: string) => void;
  onSelectAll: (checked: boolean) => void;
  isAllSelected: boolean;
  appliedFilters: Record<string, string | string[]>;
  onRemoveFilter: (filterKey: string, value?: string) => void;
  onClearAllFilters: () => void;
};

const ListToolbar = ({
  selectedCount,
  sortBy,
  onSortChange,
  onSelectAll,
  isAllSelected,
  appliedFilters,
  onRemoveFilter,
  onClearAllFilters,
}: ListToolbarProps) => {
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Get filter chips from applied filters
  const filterChips = useMemo(() => {
    const chips: { key: string; label: string; value: string }[] = [];
    
    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val: string) => {
          chips.push({
            key: `${key}-${val}`,
            label: `${key.replace(/_/g, ' ')}: ${val}`,
            value: val,
          });
        });
      } else if (value) {
        chips.push({
          key,
          label: `${key.replace(/_/g, ' ')}: ${value}`,
          value: value.toString(),
        });
      }
    });
    
    return chips;
  }, [appliedFilters]);

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarMain}>
        <div className={styles.leftSection}>
          <div className={styles.selectAll}>
            <input
              type="checkbox"
              id="selectAll"
              checked={isAllSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
              className={styles.checkbox}
            />
            <label htmlFor="selectAll" className={styles.selectAllLabel}>
              {selectedCount > 0 ? `${selectedCount} selected` : 'Select All'}
            </label>
          </div>

          {selectedCount > 0 && (
            <div className={styles.bulkActions}>
              <button 
                className={styles.bulkActionButton}
                onClick={() => setShowBulkActions(!showBulkActions)}
              >
                <FiChevronDown size={16} />
                <span>Actions</span>
              </button>
              
              {showBulkActions && (
                <div className={styles.bulkActionMenu}>
                  <button className={styles.bulkMenuItem}>
                    <FiMove size={16} />
                    <span>Move to folder</span>
                  </button>
                  <button className={styles.bulkMenuItem}>
                    <FiMail size={16} />
                    <span>Send email</span>
                  </button>
                  <button className={styles.bulkMenuItem}>
                    <FiDownload size={16} />
                    <span>Download CVs</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.rightSection}>
          <div className={styles.sortContainer}>
            <span className={styles.sortLabel}>Sort by:</span>
            <div className={styles.sortSelect}>
              <button 
                className={styles.sortButton}
                onClick={() => setShowSortMenu(!showSortMenu)}
              >
                {sortBy === 'relevance' ? 'Relevance' : 'Latest'}
                <FiChevronDown size={16} className={styles.sortIcon} />
              </button>
              
              {showSortMenu && (
                <div className={styles.sortMenu}>
                  <button 
                    className={`${styles.sortMenuItem} ${sortBy === 'relevance' ? styles.active : ''}`}
                    onClick={() => {
                      onSortChange('relevance');
                      setShowSortMenu(false);
                    }}
                  >
                    Relevance
                  </button>
                  <button 
                    className={`${styles.sortMenuItem} ${sortBy === 'latest' ? styles.active : ''}`}
                    onClick={() => {
                      onSortChange('latest');
                      setShowSortMenu(false);
                    }}
                  >
                    Latest
                  </button>
                </div>
              )}
            </div>
          </div>

          <button className={styles.filterButton}>
            <FiFilter size={16} />
            <span>Filters</span>
          </button>
        </div>
      </div>
      
      {/* Filter Chips */}
      {filterChips.length > 0 && (
        <div className={styles.filterChips}>
          <div className={styles.chipsContainer}>
            {filterChips.map((chip) => (
              <div key={chip.key} className={styles.chip}>
                <span className={styles.chipLabel}>{chip.label}</span>
                <button 
                  className={styles.chipRemove}
                  onClick={() => onRemoveFilter(chip.key, chip.value)}
                  aria-label={`Remove filter ${chip.label}`}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <button 
            className={styles.clearAllButton}
            onClick={onClearAllFilters}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default ListToolbar;
