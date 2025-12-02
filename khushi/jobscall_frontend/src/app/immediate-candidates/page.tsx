'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import SearchCard from '@/components/SearchCard';
import ExpandableSection from '@/components/ExpandableSection';
import StickyActionBar from '@/components/StickyActionBar';
import Footer from '@/components/layout/Footer';
import styles from './page.module.css';

const ImmediateCandidates = () => {
  const [showEmploymentDetails, setShowEmploymentDetails] = useState(false);
  const [showEducationDetails, setShowEducationDetails] = useState(false);
  const [showAdditionalParams, setShowAdditionalParams] = useState(false);

  return (
    <div className={styles.pageContainer}>
      <Header />
      
      <main className={styles.mainContent}>
        <SearchCard />
        
        <div className={styles.expandableSections}>
          <ExpandableSection 
            title="Employment Details" 
            isOpen={showEmploymentDetails}
            onToggle={() => setShowEmploymentDetails(!showEmploymentDetails)}
          >
            {/* Employment Details Content */}
            <div className={styles.sectionContent}>
              <p>Employment details will be shown here</p>
            </div>
          </ExpandableSection>
          
          <ExpandableSection 
            title="Education Details" 
            isOpen={showEducationDetails}
            onToggle={() => setShowEducationDetails(!showEducationDetails)}
          >
            {/* Education Details Content */}
            <div className={styles.sectionContent}>
              <p>Education details will be shown here</p>
            </div>
          </ExpandableSection>
          
          <ExpandableSection 
            title="Additional Parameters" 
            isOpen={showAdditionalParams}
            onToggle={() => setShowAdditionalParams(!showAdditionalParams)}
          >
            {/* Additional Parameters Content */}
            <div className={styles.sectionContent}>
              <p>Additional parameters will be shown here</p>
            </div>
          </ExpandableSection>
        </div>
      </main>
      
      <StickyActionBar />
      <Footer />
    </div>
  );
};

export default ImmediateCandidates;
