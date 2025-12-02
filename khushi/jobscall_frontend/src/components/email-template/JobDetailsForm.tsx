"use client";

import React, { useState } from 'react';
import styles from './JobDetailsForm.module.css';

const JobDetailsForm = () => {
  const [sendExistingJob, setSendExistingJob] = useState(false);
  const [jobDetails, setJobDetails] = useState({
    jobTitle: '',
    minExperience: '',
    maxExperience: '',
    locations: [] as string[],
    minSalary: '',
    maxSalary: '',
  });

  const experienceOptions = Array.from({ length: 31 }, (_, i) => i.toString());
  const salaryOptions = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '12', '15', '18', '20', '25', '30', '35', '40', '45', '50',
    '60', '70', '80', '90', '100', '125', '150', '200', '250', '300', '400', '500', '1000'
  ];
  const locationOptions = [
    'Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 
    'Gurgaon', 'Noida', 'Kolkata', 'Ahmedabad'
  ];

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendExistingJob(e.target.checked);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedLocations: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedLocations.push(options[i].value);
      }
    }
    setJobDetails(prev => ({
      ...prev,
      locations: selectedLocations
    }));
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Job details</h2>
      
      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={sendExistingJob}
            onChange={handleCheckboxChange}
            className={styles.checkboxInput}
          />
          Send an existing job
        </label>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="jobTitle" className={styles.label}>
          Job Title <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="jobTitle"
          name="jobTitle"
          value={jobDetails.jobTitle}
          onChange={handleInputChange}
          className={styles.input}
          placeholder="Enter job title"
          required
        />
      </div>

      <div className={styles.formRow}>
        <div className={`${styles.formGroup} ${styles.halfWidth}`}>
          <label htmlFor="minExperience" className={styles.label}>
            Experience (Min) <span className={styles.required}>*</span>
          </label>
          <select
            id="minExperience"
            name="minExperience"
            value={jobDetails.minExperience}
            onChange={handleInputChange}
            className={styles.select}
            required
          >
            <option value="">Select min</option>
            {experienceOptions.map(exp => (
              <option key={`min-${exp}`} value={exp}>
                {exp} {exp === '1' ? 'year' : 'years'}
              </option>
            ))}
          </select>
        </div>
        
        <div className={`${styles.formGroup} ${styles.halfWidth}`}>
          <label htmlFor="maxExperience" className={styles.label}>
            Experience (Max) <span className={styles.required}>*</span>
          </label>
          <select
            id="maxExperience"
            name="maxExperience"
            value={jobDetails.maxExperience}
            onChange={handleInputChange}
            className={styles.select}
            required
          >
            <option value="">Select max</option>
            {experienceOptions.map(exp => (
              <option key={`max-${exp}`} value={exp}>
                {exp} {exp === '1' ? 'year' : 'years'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="locations" className={styles.label}>
          Location <span className={styles.required}>*</span>
        </label>
        <select
          id="locations"
          name="locations"
          multiple
          value={jobDetails.locations}
          onChange={handleLocationChange}
          className={`${styles.select} ${styles.multiSelect}`}
          required
        >
          {locationOptions.map(location => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <div className={styles.helperText}>
          Hold Ctrl (Windows) or Command (Mac) to select multiple locations
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={`${styles.formGroup} ${styles.halfWidth}`}>
          <label htmlFor="minSalary" className={styles.label}>
            Salary (Min) <span className={styles.required}>*</span>
          </label>
          <div className={styles.selectWithIcon}>
            <select
              id="minSalary"
              name="minSalary"
              value={jobDetails.minSalary}
              onChange={handleInputChange}
              className={styles.select}
              required
            >
              <option value="">Min</option>
              {salaryOptions.map(salary => (
                <option key={`min-${salary}`} value={salary}>
                  {salary} LPA
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className={`${styles.formGroup} ${styles.halfWidth}`}>
          <label htmlFor="maxSalary" className={styles.label}>
            Salary (Max) <span className={styles.required}>*</span>
          </label>
          <div className={styles.selectWithIcon}>
            <select
              id="maxSalary"
              name="maxSalary"
              value={jobDetails.maxSalary}
              onChange={handleInputChange}
              className={styles.select}
              required
            >
              <option value="">Max</option>
              {salaryOptions.map(salary => (
                <option key={`max-${salary}`} value={salary}>
                  {salary} LPA
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsForm;
