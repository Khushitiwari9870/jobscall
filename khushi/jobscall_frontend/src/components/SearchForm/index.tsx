'use client';

import { useState } from 'react';
import styles from './SearchForm.module.css';

const SearchForm = () => {
  const [searchMode, setSearchMode] = useState<'boolean' | 'keyword'>('boolean');
  const [includeRelocate, setIncludeRelocate] = useState(false);
  const [includeZeroSalary, setIncludeZeroSalary] = useState(false);
  
  const locations = [
    'Bangalore, Karnataka',
    'Mumbai, Maharashtra',
    'Delhi NCR',
    'Hyderabad, Telangana',
    'Pune, Maharashtra',
    'Chennai, Tamil Nadu'
  ];
  
  const salaryRanges = [
    '0 LPA', '1 LPA', '2 LPA', '3 LPA', '4 LPA', '5 LPA', '6 LPA', '7 LPA', '8 LPA',
    '9 LPA', '10 LPA', '12 LPA', '15 LPA', '20 LPA', '25 LPA', '30 LPA', '40 LPA', '50 LPA+'
  ];
  
  const experienceRanges = [
    '0 years', '1 year', '2 years', '3 years', '4 years', '5 years', '6 years',
    '7 years', '8 years', '9 years', '10 years', '11 years', '12 years', '13 years',
    '14 years', '15+ years'
  ];
  
  const noticePeriods = [
    'Immediate Joiner (Upto 15 Days)',
    '15 Days',
    '30 Days',
    '45 Days',
    '60 Days',
    '90 Days',
    'More than 90 Days'
  ];

  return (
    <div className={styles.searchCard}>
      <div className={styles.searchHeader}>
        <h2>Find Candidates</h2>
        <div className={styles.searchToggle}>
          <button 
            className={`${styles.toggleButton} ${searchMode === 'boolean' ? styles.active : ''}`}
            onClick={() => setSearchMode('boolean')}
          >
            Boolean Search
          </button>
          <button 
            className={`${styles.toggleButton} ${searchMode === 'keyword' ? styles.active : ''}`}
            onClick={() => setSearchMode('keyword')}
          >
            Search keyword in Full Profile
          </button>
        </div>
      </div>
      
      <div className={styles.searchForm}>
        <div className={styles.formGroup}>
          <label>Any of these keywords</label>
          <div className={styles.inputWithCheckbox}>
            <input 
              type="text" 
              placeholder="e.g. Java, Python, React" 
              className={styles.textInput}
            />
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                className={styles.checkboxInput}
              />
              <span>Search IT skills with experience</span>
            </label>
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label>All of these keywords</label>
          <div className={styles.inputWithLink}>
            <input 
              type="text" 
              placeholder="e.g. Full Stack, AWS" 
              className={styles.textInput}
            />
            <button className={styles.linkButton}>+ Exclude Keywords</button>
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label>Current Location</label>
          <div className={styles.selectWrapper}>
            <select className={styles.selectInput}>
              <option value="">Select Location</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>{location}</option>
              ))}
            </select>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={includeRelocate}
                  onChange={(e) => setIncludeRelocate(e.target.checked)}
                  className={styles.checkboxInput}
                />
                <span>Include candidates who prefer to relocate to above locations</span>
              </label>
              <button className={styles.textLink}>Change Preferred Location</button>
            </div>
          </div>
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Salary</label>
            <div className={styles.selectGroup}>
              <div className={styles.selectWrapper}>
                <select className={styles.selectInput}>
                  <option value="">Min Salary</option>
                  {salaryRanges.map((range, index) => (
                    <option key={`min-${index}`} value={range}>{range}</option>
                  ))}
                </select>
              </div>
              <span className={styles.selectDivider}>to</span>
              <div className={styles.selectWrapper}>
                <select className={styles.selectInput}>
                  <option value="">Max Salary</option>
                  {salaryRanges.map((range, index) => (
                    <option key={`max-${index}`} value={range}>{range}</option>
                  ))}
                </select>
              </div>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={includeZeroSalary}
                    onChange={(e) => setIncludeZeroSalary(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <span>Also include the candidates with zero salary</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Experience</label>
            <div className={styles.selectGroup}>
              <div className={styles.selectWrapper}>
                <select className={styles.selectInput}>
                  <option value="">Min Exp</option>
                  {experienceRanges.map((exp, index) => (
                    <option key={`min-exp-${index}`} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>
              <span className={styles.selectDivider}>to</span>
              <div className={styles.selectWrapper}>
                <select className={styles.selectInput}>
                  <option value="">Max Exp</option>
                  {experienceRanges.map((exp, index) => (
                    <option key={`max-exp-${index}`} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Notice Period</label>
            <div className={styles.selectWrapper}>
              <select className={styles.selectInput} defaultValue={noticePeriods[0]}>
                {noticePeriods.map((period, index) => (
                  <option key={index} value={period}>{period}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
