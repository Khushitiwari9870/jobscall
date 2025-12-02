import { useState } from 'react';
import styles from './SearchForm.module.css';

type SearchParams = {
  searchType: string;
  anyKeywords: string;
  allKeywords: string;
  location: string;
  minSalary: string;
  maxSalary: string;
  minExp: string;
  maxExp: string;
  noticePeriod: string;
  includeRelocation: boolean;
  searchItSkills: boolean;
};

type SearchFormProps = {
  searchParams: SearchParams;
  onParamChange: (key: string, value: string | boolean) => void;
};

const experienceRange = Array.from({ length: 31 }, (_, i) => i);
const salaryRanges = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '12', '15', '18', '20', '25', '30', '35', '40', '45', '50',
  '60', '70', '80', '90', '100', '125', '150', '200', '250', '300', '400', '500', '1000'
];

const noticePeriods = [
  'Immediate', '15 Days', '30 Days', '45 Days', '60 Days', '90 Days', 'More than 90 Days'
];

export default function SearchForm({ searchParams, onParamChange }: SearchFormProps) {
  const [expandedSections, setExpandedSections] = useState({
    employment: false,
    education: false,
    additional: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className={styles.searchForm}>
      <div className={styles.searchTypeToggle}>
        <button 
          className={`${styles.toggleButton} ${searchParams.searchType === 'boolean' ? styles.active : ''}`}
          onClick={() => onParamChange('searchType', 'boolean')}
        >
          Boolean Search
        </button>
        <button 
          className={`${styles.toggleButton} ${searchParams.searchType === 'keyword' ? styles.active : ''}`}
          onClick={() => onParamChange('searchType', 'keyword')}
        >
          Keyword Search
        </button>
      </div>

      <div className={styles.formSection}>
        <label className={styles.formLabel}>Any of these keywords</label>
        <div className={styles.inputWithCheckbox}>
          <input
            type="text"
            value={searchParams.anyKeywords}
            onChange={(e) => onParamChange('anyKeywords', e.target.value)}
            placeholder="e.g. Java, Python, React"
            className={styles.textInput}
          />
          <label className={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={searchParams.searchItSkills}
              onChange={(e) => onParamChange('searchItSkills', e.target.checked)}
            />
            <span className={styles.checkmark}></span>
            Search IT skills with experience
          </label>
        </div>
      </div>

      <div className={styles.formSection}>
        <label className={styles.formLabel}>All of these keywords</label>
        <input
          type="text"
          value={searchParams.allKeywords}
          onChange={(e) => onParamChange('allKeywords', e.target.value)}
          placeholder="e.g. Java AND Spring"
          className={styles.textInput}
        />
        <a href="#" className={styles.excludeLink}>+ Exclude Keywords</a>
      </div>

      <div className={styles.formSection}>
        <label className={styles.formLabel}>Location</label>
        <div className={styles.locationInput}>
          <select
            value={searchParams.location}
            onChange={(e) => onParamChange('location', e.target.value)}
            className={styles.selectInput}
          >
            <option value="">Select current location</option>
            <option value="bangalore">Bangalore</option>
            <option value="delhi">Delhi NCR</option>
            <option value="mumbai">Mumbai</option>
            <option value="hyderabad">Hyderabad</option>
            <option value="chennai">Chennai</option>
            <option value="pune">Pune</option>
            <option value="kolkata">Kolkata</option>
          </select>
          <a href="#" className={styles.changeLocationLink}>Change Preferred Location</a>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="relocate"
              checked={searchParams.includeRelocation}
              onChange={(e) => onParamChange('includeRelocation', e.target.checked)}
            />
            <label htmlFor="relocate">Include candidates willing to relocate</label>
          </div>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Min Salary (LPA)</label>
          <select
            value={searchParams.minSalary}
            onChange={(e) => onParamChange('minSalary', e.target.value)}
            className={styles.selectInput}
          >
            <option value="">Min</option>
            {salaryRanges.map(salary => (
              <option key={`min-${salary}`} value={salary}>
                {salary} {salary !== '0' ? 'LPA' : 'LPA (Zero Salary)'}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Max Salary (LPA)</label>
          <select
            value={searchParams.maxSalary}
            onChange={(e) => onParamChange('maxSalary', e.target.value)}
            className={styles.selectInput}
          >
            <option value="">Max</option>
            {salaryRanges.map(salary => (
              <option key={`max-${salary}`} value={salary}>
                {salary} {salary !== '0' ? 'LPA' : 'LPA (Zero Salary)'}
              </option>
            ))}
          </select>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="zeroSalary"
              checked={searchParams.minSalary === '0'}
              onChange={(e) => onParamChange('minSalary', e.target.checked ? '0' : '')}
            />
            <label htmlFor="zeroSalary">Include candidates with zero salary</label>
          </div>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Min Exp (Years)</label>
          <select
            value={searchParams.minExp}
            onChange={(e) => onParamChange('minExp', e.target.value)}
            className={styles.selectInput}
          >
            <option value="">Min</option>
            {experienceRange.map(year => (
              <option key={`min-${year}`} value={year}>
                {year} {year === 1 ? 'Year' : 'Years'}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Max Exp (Years)</label>
          <select
            value={searchParams.maxExp}
            onChange={(e) => onParamChange('maxExp', e.target.value)}
            className={styles.selectInput}
          >
            <option value="">Max</option>
            {experienceRange.map(year => (
              <option key={`max-${year}`} value={year}>
                {year} {year === 1 ? 'Year' : 'Years'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formSection}>
        <label>Notice Period</label>
        <select
          value={searchParams.noticePeriod}
          onChange={(e) => onParamChange('noticePeriod', e.target.value)}
          className={styles.selectInput}
        >
          <option value="">Select Notice Period</option>
          {noticePeriods.map(period => (
            <option key={period} value={period.toLowerCase().replace(' ', '-')}>
              {period}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.expandableSection}>
        <button 
          className={styles.expandableHeader}
          onClick={() => toggleSection('employment')}
        >
          <span>+ Employment Details</span>
        </button>
        {expandedSections.employment && (
          <div className={styles.expandableContent}>
            {/* Add employment details fields here */}
            <p>Employment details section will be expanded here</p>
          </div>
        )}
      </div>

      <div className={styles.expandableSection}>
        <button 
          className={styles.expandableHeader}
          onClick={() => toggleSection('education')}
        >
          <span>+ Education Details</span>
        </button>
        {expandedSections.education && (
          <div className={styles.expandableContent}>
            {/* Add education details fields here */}
            <p>Education details section will be expanded here</p>
          </div>
        )}
      </div>

      <div className={styles.expandableSection}>
        <button 
          className={styles.expandableHeader}
          onClick={() => toggleSection('additional')}
        >
          <span>+ Additional Parameters</span>
        </button>
        {expandedSections.additional && (
          <div className={styles.expandableContent}>
            {/* Add additional parameters fields here */}
            <p>Additional parameters section will be expanded here</p>
          </div>
        )}
      </div>
    </div>
  );
}
