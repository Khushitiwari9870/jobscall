"use client";

import { useState, useEffect } from 'react';
import styles from './SidebarFilters.module.css';

type FilterOption = {
  id: string;
  label: string;
  count?: number;
};

export type FilterSection = {
  id: string;
  title: string;
  type: 'checkbox' | 'radio' | 'range' | 'multi-select';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
};

// Define specific types for filter values
type FilterValue =
  | string        // Single string value (for radio buttons)
  | number        // Single number value (for range inputs)
  | string[]      // Array of strings (for checkboxes, multi-select)
  | number[];     // Array of numbers (for multi-select with numbers)

type FilterState = Record<string, FilterValue>;

type SidebarFiltersProps = {
  filters: {
    sections: FilterSection[];
  };
  onApplyFilters: (filters: FilterState) => void;
  selectedFilters: FilterState;
};

const SidebarFilters = ({ filters, onApplyFilters, selectedFilters }: SidebarFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(selectedFilters);
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLocalFilters(selectedFilters);
  }, [selectedFilters]);

  // Helper functions for type-safe array operations
  const addToStringArray = (arr: string[], value: string | number): string[] => {
    if (typeof value === 'string') {
      return [...arr, value];
    }
    return arr; // Don't add numbers to string arrays
  };

  const addToNumberArray = (arr: number[], value: string | number): number[] => {
    if (typeof value === 'number') {
      return [...arr, value];
    }
    return arr; // Don't add strings to number arrays
  };

  const removeFromStringArray = (arr: string[], value: string): string[] => {
    return arr.filter(v => v !== value);
  };

  const removeFromNumberArray = (arr: number[], value: number): number[] => {
    return arr.filter(v => v !== value);
  };

  const handleFilterChange = (sectionId: string, value: string | number, isChecked: boolean) => {
    setLocalFilters(prev => {
      const currentValues = prev[sectionId];

      let newValues: FilterValue;

      if (isChecked) {
        if (Array.isArray(currentValues) && currentValues.length > 0) {
          // Check the type of the first element to determine array type
          const firstElement = currentValues[0];
          if (typeof firstElement === 'string') {
            newValues = addToStringArray(currentValues as string[], value as string);
          } else if (typeof firstElement === 'number') {
            newValues = addToNumberArray(currentValues as number[], value as number);
          } else {
            newValues = [value] as FilterValue;
          }
        } else {
          newValues = [value] as FilterValue;
        }
      } else {
        if (Array.isArray(currentValues)) {
          // Check the type of the first element to determine array type
          const firstElement = currentValues[0];
          if (typeof firstElement === 'string') {
            newValues = removeFromStringArray(currentValues as string[], value as string);
          } else if (typeof firstElement === 'number') {
            newValues = removeFromNumberArray(currentValues as number[], value as number);
          } else {
            newValues = [];
          }
        } else {
          newValues = [];
        }
      }

      return {
        ...prev,
        [sectionId]: newValues,
      };
    });
  };

  const handleRangeChange = (sectionId: string, value: number) => {
    setLocalFilters(prev => ({
      ...prev,
      [sectionId]: value,
    }));
  };

  const toggleSection = (sectionId: string) => {
    setIsExpanded(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {};
    filters.sections.forEach(section => {
      if (section.type === 'range') {
        resetFilters[section.id] = section.min || 0;
      } else {
        resetFilters[section.id] = [];
      }
    });
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  const renderFilterControl = (section: FilterSection) => {
    const isSectionExpanded = isExpanded[section.id] ?? true;
    
    if (!isSectionExpanded) {
      return null;
    }

    switch (section.type) {
      case 'checkbox':
      case 'radio':
        return (
          <div className={styles.optionsList}>
            {section.options?.map(option => (
              <label key={option.id} className={styles.optionLabel}>
                <input
                  type={section.type}
                  checked={
                    Array.isArray(localFilters[section.id]) &&
                    (localFilters[section.id] as string[]).includes(option.id)
                  }
                  onChange={(e) => handleFilterChange(section.id, option.id, e.target.checked)}
                  className={styles.optionInput}
                />
                <span className={styles.optionText}>
                  {option.label}
                  {option.count !== undefined && (
                    <span className={styles.optionCount}>({option.count})</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        );

      case 'range':
        return (
          <div className={styles.rangeContainer}>
            <input
              type="range"
              min={section.min}
              max={section.max}
              step={section.step}
              value={(localFilters[section.id] as number) || (section.min || 0)}
              onChange={(e) => handleRangeChange(section.id, Number(e.target.value))}
              className={styles.rangeInput}
            />
            <div className={styles.rangeValues}>
              <span>{section.min}+</span>
              <span>{typeof (localFilters[section.id] as number) === 'number' ? (localFilters[section.id] as number) : (section.min || 0)}+ {section.title.includes('CTC') ? 'LPA' : 'Years'}</span>
            </div>
          </div>
        );

      case 'multi-select':
        return (
          <div className={styles.multiSelect}>
            <div className={styles.selectedOptions}>
              {Array.isArray(localFilters[section.id]) && (localFilters[section.id] as string[]).map((value: string) => {
                const option = section.options?.find(opt => opt.id === value);
                return option ? (
                  <span key={value} className={styles.selectedTag}>
                    {option.label}
                    <button 
                      onClick={() => handleFilterChange(section.id, value, false)}
                      className={styles.removeTag}
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
            </div>
            <select
              className={styles.selectInput}
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  handleFilterChange(section.id, e.target.value, true);
                  e.target.value = '';
                }
              }}
            >
              <option value="">Select {section.title}...</option>
              {section.options
                ?.filter(opt => !Array.isArray(localFilters[section.id]) || !(localFilters[section.id] as string[]).includes(opt.id))
                .map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label} {option.count !== undefined ? `(${option.count})` : ''}
                  </option>
                ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>Filters</h2>
        <button onClick={handleReset} className={styles.resetButton}>
          Reset All
        </button>
      </div>

      <div className={styles.filterSections}>
        {filters.sections.map(section => (
          <div key={section.id} className={styles.filterSection}>
            <div 
              className={styles.sectionHeader}
              onClick={() => toggleSection(section.id)}
            >
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              <span className={styles.sectionToggle}>
                {isExpanded[section.id] === false ? '+' : '−'}
              </span>
            </div>
            {renderFilterControl(section)}
          </div>
        ))}
      </div>

      <div className={styles.sidebarFooter}>
        <button 
          onClick={handleApply}
          className={styles.applyButton}
        >
          Apply Filters
        </button>
      </div>
    </aside>
  );
};

export default SidebarFilters;
