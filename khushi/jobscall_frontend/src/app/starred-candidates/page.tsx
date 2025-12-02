"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import FiltersSidebar from '@/components/FiltersSidebar';
import CandidateCard from '@/components/CandidateCard';
import PromoBanner from '@/components/PromoBanner';
import ListActionsBar from '@/components/ListActionsBar';
import Footer from '@/components/Footer';
import { candidates } from '@/data/candidates';
import styles from './page.module.css';

export default function StarredCandidates() {
  const [filters, setFilters] = useState({
    show: 'All Profiles',
    duration: 'Last 30 days',
    immediateJoiners: false,
    contractualJob: false,
    experience: { min: 0, max: 30 },
    searchQuery: ''
  });
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());

  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidates(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(candidateId)) {
        newSelection.delete(candidateId);
      } else {
        newSelection.add(candidateId);
      }
      return newSelection;
    });
  };

  const handleFilterChange = (updates: { [K in keyof typeof filters]?: typeof filters[K] } | ((prev: typeof filters) => typeof filters)) => {
    if (typeof updates === 'function') {
      setFilters(updates);
    } else {
      setFilters(prev => ({ ...prev, ...updates }));
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1>8 Candidates</h1>
          <ListActionsBar />
        </div>

        <div className={styles.content}>
          <aside className={styles.sidebar}>
            <FiltersSidebar 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
          </aside>

          <div className={styles.candidateList}>
            {candidates.slice(0, 4).map((candidate) => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate}
                isSelected={selectedCandidates.has(candidate.id)}
                onSelect={() => handleSelectCandidate(candidate.id)}
              />
            ))}
            
            <PromoBanner />
            
            {candidates.slice(4, 8).map((candidate) => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate}
                isSelected={selectedCandidates.has(candidate.id)}
                onSelect={() => handleSelectCandidate(candidate.id)}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
