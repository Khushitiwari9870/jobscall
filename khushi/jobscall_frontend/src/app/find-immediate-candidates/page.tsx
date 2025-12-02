'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import SearchForm from '@/components/SearchForm';
import ExpandableSection from '@/app/find-candidates/ExpandableSection';
import StickyActionBar from '@/components/StickyActionBar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const FindImmediateCandidates = () => {
  const [expandedSections] = useState({
    employment: true,
    education: true,
    additional: true
  });

  return (
    <div className={styles.pageContainer}>
      <Header />
      
      <main className={styles.mainContent}>
        <div className={styles.searchContainer}>
          <SearchForm />
          
          <div className={styles.filterSections}>
            <ExpandableSection 
              title="Employment Details"
              defaultExpanded={expandedSections.employment}
              
            >
              <div className={styles.sectionContent}>
                <div className={styles.filterGroup}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" />
                    Designation and Previous Designation
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" />
                    Industry and Previous Industry
                  </label>
                  <div className={styles.selectGroup}>
                    <select className={styles.selectInput}>
                      <option value="">Select Functional Area</option>
                      <option>IT Software - Application Programming</option>
                      <option>Sales & Business Development</option>
                      <option>Marketing & Communication</option>
                    </select>
                  </div>
                  <div className={styles.linkGroup}>
                    <button className={styles.textLink}>+ Team Size Managed</button>
                    <button className={styles.textLink}>+ Include/Exclude Companies</button>
                  </div>
                </div>
              </div>
            </ExpandableSection>
            
            <ExpandableSection 
              title="Education Details"
              defaultExpanded={expandedSections.education}
            >
              <div className={styles.sectionContent}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Degree/Institute</label>
                    <input type="text" className={styles.textInput} placeholder="e.g. B.Tech, IIT" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Course</label>
                    <select className={styles.selectInput}>
                      <option value="">Select Course</option>
                      <option>B.Tech/B.E.</option>
                      <option>MBA/PGDM</option>
                      <option>B.Sc</option>
                    </select>
                  </div>
                </div>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" />
                    Add PG and Above
                  </label>
                </div>
              </div>
            </ExpandableSection>
            
            <ExpandableSection 
              title="Additional Parameters"
              defaultExpanded={expandedSections.additional}

            >
              <div className={styles.sectionContent}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Show</label>
                    <select className={styles.selectInput}>
                      <option>All Profiles</option>
                      <option>Only Active</option>
                      <option>Only Verified</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Sort By</label>
                    <select className={styles.selectInput}>
                      <option>Relevance</option>
                      <option>Most Recent</option>
                      <option>Experience (High to Low)</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Age</label>
                    <div className={styles.rangeInputs}>
                      <select className={styles.smallSelect}>
                        <option>Min</option>
                        {Array.from({length: 50}, (_, i) => i + 18).map(age => (
                          <option key={`min-${age}`}>{age}</option>
                        ))}
                      </select>
                      <span>to</span>
                      <select className={styles.smallSelect}>
                        <option>Max</option>
                        {Array.from({length: 33}, (_, i) => i + 18).map(age => (
                          <option key={`max-${age}`}>{age}</option>
                        ))}
                      </select>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" />
                        Include zero age
                      </label>
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Gender</label>
                    <div className={styles.checkboxGroup}>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" defaultChecked />
                        Male
                      </label>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" defaultChecked />
                        Female
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" />
                    With Verified Email
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" />
                    With Mobile Number
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked />
                    With Resume Attached
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" />
                    Show candidates with similar skills
                  </label>
                </div>
              </div>
            </ExpandableSection>
          </div>
        </div>
      </main>
      
      <Footer />
      <StickyActionBar />
    </div>
  );
};

export default FindImmediateCandidates;
