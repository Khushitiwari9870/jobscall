"use client";

import { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import SidebarFilters from '@/components/SidebarFilters';
import ListToolbar from '@/components/ListToolbar';
import CandidateCard from '@/components/CandidateCard';
import Pagination from '@/components/Pagination';
import Footer from '@/components/layout/Footer';
import AssistantTipCard from '@/components/AssistantTipCard';
import { candidates, filters } from '@/data/candidates';
import styles from './page.module.css';

// Define specific types for filter values
type FilterValue =
  | string        // Single string value (for radio buttons)
  | number        // Single number value (for range inputs)
  | string[]      // Array of strings (for checkboxes, multi-select)
  | number[];     // Array of numbers (for multi-select with numbers)

type FilterState = Record<string, FilterValue>;

// Mock folder data
const folderData = {
  id: '3013809',
  name: 'Frontend Developers',
  total: 125,
  shortlisted: 42,
  rejected: 18,
  new: 12,
  contacted: 53,
  lastUpdated: '2 hours ago'
};

export default function FolderPage({ params }: { params: { id: string } }) {
  // Use the folder ID from params
  const folderId = params.id;

  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({});
  const [sortBy, setSortBy] = useState('relevance');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const itemsPerPage = 12;
  const totalPages = Math.ceil(candidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  
  // Filter candidates based on applied filters
  const filteredCandidates = useMemo(() => {
    return candidates.filter(() => {
      // Implement your filtering logic here based on appliedFilters
      return true; // Placeholder - implement actual filtering
    });
  }, []); // Remove appliedFilters dependency since it's not used yet
  
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectCandidate = (id: string) => {
    setSelectedCandidates(prev => 
      prev.includes(id) 
        ? prev.filter(candidateId => candidateId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedCandidates(checked ? paginatedCandidates.map(c => c.id) : []);
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setAppliedFilters(newFilters);
    setCurrentPage(1);
    setIsFilterOpen(false); // Close mobile filter on apply
  };
  
  const handleRemoveFilter = (filterKey: string, value?: string) => {
    if (value) {
      setAppliedFilters(prev => {
        const currentValue = prev[filterKey];
        if (Array.isArray(currentValue)) {
          const filteredArray = (currentValue as string[]).filter((v: string) => v !== value);
          return {
            ...prev,
            [filterKey]: filteredArray.length > 0 ? filteredArray : []
          };
        }
        return prev;
      });
    } else {
      const newFilters = { ...appliedFilters };
      delete newFilters[filterKey];
      setAppliedFilters(newFilters);
    }
  };
  
  const handleClearAllFilters = () => {
    setAppliedFilters({});
  };

  return (
    <div className={styles.container}>
      <Header />
      
      {/* Promo Banner */}
      <div className={styles.promoBanner}>
        <div className={styles.promoContent}>
          <span className={styles.promoIcon}>🚀</span>
          <span>Upgrade to Recruiter Pro to unlock advanced features and get 10 free candidate contacts!</span>
          <button className={styles.upgradeButton}>Upgrade Now</button>
        </div>
      </div>
      
      <div className={styles.mainContent}>
        {/* Mobile Filter Toggle */}
        <button 
          className={styles.mobileFilterButton}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
        
        {/* Sidebar Filters */}
        <aside className={`${styles.sidebar} ${isFilterOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <h2>{folderData.name}</h2>
            <div className={styles.folderStats}>
              <div>Total: <strong>{folderData.total}</strong></div>
              <div>Shortlisted: <strong className={styles.shortlisted}>{folderData.shortlisted}</strong></div>
              <div>Rejected: <strong className={styles.rejected}>{folderData.rejected}</strong></div>
              <div>New: <strong className={styles.new}>{folderData.new}</strong></div>
              <div>Contacted: <strong>{folderData.contacted}</strong></div>
              <div className={styles.lastUpdated}>Updated {folderData.lastUpdated}</div>
            </div>
          </div>
          
          <SidebarFilters 
            filters={filters} 
            onApplyFilters={handleApplyFilters} 
            selectedFilters={appliedFilters}
          />
        </aside>
        
        <main className={styles.content}>
          <ListToolbar 
            totalCount={filteredCandidates.length}
            selectedCount={selectedCandidates.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onSelectAll={handleSelectAll}
            isAllSelected={selectedCandidates.length > 0 && selectedCandidates.length === paginatedCandidates.length}
            appliedFilters={appliedFilters as Record<string, string | string[]>}
            onRemoveFilter={handleRemoveFilter}
            onClearAllFilters={handleClearAllFilters}
          />
          
          <div className={styles.candidateList}>
            {paginatedCandidates.length > 0 ? (
              paginatedCandidates.map((candidate, index) => (
                <div key={candidate.id} className={styles.candidateCardWrapper}>
                  <CandidateCard 
                    candidate={candidate} 
                    isSelected={selectedCandidates.includes(candidate.id)}
                    onSelect={handleSelectCandidate}
                  />
                  
                  {/* Insert Assistant Tip Card after every 3rd candidate */}
                  {(index + 1) % 3 === 0 && (
                    <AssistantTipCard 
                      title="Need help finding the right candidates?"
                      description="Our AI can help you find candidates that match your requirements."
                      ctaText="Try AI Match"
                      onCtaClick={() => console.log('AI Match clicked')}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className={styles.noResults}>
                <h3>No candidates found</h3>
                <p>Try adjusting your filters to see more results.</p>
                <button 
                  className={styles.clearFiltersButton}
                  onClick={handleClearAllFilters}
                >
                  Clear all filters
                </button>
              </div>
            )}
            
            {paginatedCandidates.length > 0 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </main>
      </div>
      
      <Footer />
      
      {/* Mobile Filter Overlay */}
      {isFilterOpen && (
        <div 
          className={styles.mobileOverlay}
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
}
