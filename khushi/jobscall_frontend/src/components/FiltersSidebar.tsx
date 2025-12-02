import React from 'react';
import styles from './FiltersSidebar.module.css';

interface ExperienceRange {
  min: number;
  max: number;
}

interface FiltersState {
  show: string;
  duration: string;
  immediateJoiners: boolean;
  contractualJob: boolean;
  experience: ExperienceRange;
  searchQuery: string;
}

type FilterUpdate<T extends keyof FiltersState = keyof FiltersState> = {
  [K in T]?: FiltersState[K];
};

interface FiltersSidebarProps {
  filters: FiltersState;
  onFilterChange: (
    updates: FilterUpdate | ((prev: FiltersState) => FiltersState)
  ) => void;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({ filters, onFilterChange }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.filterCard}>
        <h3 className={styles.filterTitle}>Show</h3>
        <select 
          className={styles.select}
          value={filters.show}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
             onFilterChange(prev => ({
    ...prev,
    show: e.target.value
  }))
          }
        >
          <option>All Profiles</option>
          <option>Shortlisted</option>
          <option>Rejected</option>
          <option>New</option>
          <option>Contacted</option>
        </select>
      </div>

      <div className={styles.filterCard}>
        <h3 className={styles.filterTitle}>Duration</h3>
        <select 
          className={styles.select}
          value={filters.duration}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
            onFilterChange({ duration: e.target.value } as FilterUpdate<'duration'>)
          }
        >
          <option>Last 7 days</option>
          <option>Last 15 days</option>
          <option>Last 30 days</option>
          <option>Last 60 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      <div className={styles.filterCard}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search within results"
            className={styles.searchInput}
            value={filters.searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              onFilterChange({ searchQuery: e.target.value })
            }
          />
          <span className={`material-icons ${styles.searchIcon}`}>search</span>
        </div>
      </div>

      <div className={styles.filterCard}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={filters.immediateJoiners}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              onFilterChange({ immediateJoiners: e.target.checked })
            }
          />
          <span className={styles.checkboxCustom}></span>
          <span>Immediate Joiners</span>
        </label>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={filters.contractualJob}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              onFilterChange({ contractualJob: e.target.checked })
            }
          />
          <span className={styles.checkboxCustom}></span>
          <span>Open to Contractual Job</span>
        </label>
      </div>

      <div className={styles.filterCard}>
        <h3 className={styles.filterTitle}>Experience (Years)</h3>
        <div className={styles.rangeInputs}>
          <input
            type="number"
            className={styles.rangeInput}
            value={filters.experience.min}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFilterChange({
              experience: {
                ...filters.experience,
                min: parseInt(e.target.value) || 0
              }
            })}
            min="0"
            max={filters.experience.max}
          />
          <span>to</span>
          <input
            type="number"
            className={styles.rangeInput}
            value={filters.experience.max}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFilterChange({
              experience: {
                ...filters.experience,
                max: parseInt(e.target.value) || 30
              }
            })}
            min={filters.experience.min}
            max="30"
          />
          <span>Yrs</span>
        </div>
      </div>

      <div className={styles.filterActions}>
        <button className={styles.resetButton}>
          Reset
        </button>
        <button className={styles.applyButton}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default FiltersSidebar;
