'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import SearchForm from '@/components/SearchForm';
import ExpandableSection from '@/components/ExpandableSection';
import StickyActionBar from '@/components/StickyActionBar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const FindImmediateCandidates = () => {
  const [expandedSections, setExpandedSections] = useState({
    employment: true,
    education: true,
    additional: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      
      <main className={styles.mainContent}>
        <div className={styles.searchContainer}>
          <SearchForm />
          
          <div className={styles.filterSections}>
            <ExpandableSection 
              title="Employment Details"
              isOpen={expandedSections.employment}
              onToggle={() => toggleSection('employment')}
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
              isOpen={expandedSections.education}
              onToggle={() => toggleSection('education')}
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
              isOpen={expandedSections.additional}
              onToggle={() => toggleSection('additional')}
            >
              <div className={styles.sectionContent}> 
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Show</label>
                    <select className={styles.selectInput}>
                      <option>All Candidates</option>
                      <option>With Resume</option>
                      <option>With Photo</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Experience</label>
                    <div className={styles.rangeInputs}>
                      <input type="number" className={styles.rangeInput} placeholder="Min" min="0" />
                      <span>to</span>
                      <input type="number" className={styles.rangeInput} placeholder="Max" min="0" />
                      <span>years</span>
                    </div>
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Age</label>
                    <div className={styles.rangeInputs}>
                      <input type="number" className={styles.rangeInput} placeholder="Min" min="18" />
                      <span>to</span>
                      <input type="number" className={styles.rangeInput} placeholder="Max" min="18" />
                      <span>years</span>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Gender</label>
                    <div className={styles.radioGroup}>
                      <label className={styles.radioLabel}>
                        <input type="radio" name="gender" value="any" defaultChecked /> Any
                      </label>
                      <label className={styles.radioLabel}>
                        <input type="radio" name="gender" value="male" /> Male
                      </label>
                      <label className={styles.radioLabel}>
                        <input type="radio" name="gender" value="female" /> Female
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </ExpandableSection>
          </div>
          
          <div className={styles.actionButtons}>
            <button className={styles.primaryButton}>Search Candidates</button>
            <button className={styles.secondaryButton}>Save Search</button>
            <button className={styles.textButton}>Reset All</button>
          </div>
        </div>
        
        <StickyActionBar />
      </main>
      
      <Footer />
    </div>
  );
};

export default FindImmediateCandidates;
