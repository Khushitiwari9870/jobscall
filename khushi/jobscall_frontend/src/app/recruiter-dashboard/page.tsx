'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

// Custom hooks
import { useRecruiterDashboard } from '@/hooks/useRecruiterDashboard';

// Components
import ImportantNotice from '@/components/recruiter-dashboard/ImportantNotice';
import RecentJobs from '@/components/recruiter-dashboard/RecentJobs';
import RecentSearches from '@/components/recruiter-dashboard/RecentSearches';
import UsageLimits from '@/components/recruiter-dashboard/UsageLimits';
import HireTalentCard from '@/components/recruiter-dashboard/HireTalentCard';
import PromoBanner from '@/components/recruiter-dashboard/PromoBanner';
import Footer from '@/components/recruiter-dashboard/Footer';
import JustLaunchedBanner from '@/components/recruiter-dashboard/JustLaunchedBanner';

// New components
import { StatCard } from '@/components/dashboard/StatCard';
import { ApplicationsChart } from '@/components/dashboard/ApplicationsChart';
import DeveloperCredit from '@/components/ui/DeveloperCredit';

// Recruiter Dashboard Components
import { PostJobButton } from '@/components/recruiter-dashboard/PostJobButton';
import { PostWalkInButton } from '@/components/recruiter-dashboard/PostWalkInButton';

// Icons
import { Briefcase, Users, FileText, CheckCircle } from 'lucide-react';

import styles from './page.module.css';

export default function RecruiterDashboard() {
  const [dismissedNotice, setDismissedNotice] = useState(false);
  const { showToast } = useToast();
  
  const { 
    stats, 
    loading, 
    error,
    refreshData 
  } = useRecruiterDashboard();

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      const errorToast = {
        title: "Error",
        description: error,
        variant: "destructive" as const,
        action: (
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        ),
      };
      showToast(errorToast);
    }
  }, [error, refreshData, showToast]);

  // Mock data for the chart
  const chartData = [
    { name: 'Jan', applications: 12, interviews: 8, hires: 3 },
    { name: 'Feb', applications: 18, interviews: 10, hires: 5 },
    { name: 'Mar', applications: 15, interviews: 12, hires: 6 },
    { name: 'Apr', applications: 22, interviews: 14, hires: 7 },
    { name: 'May', applications: 20, interviews: 16, hires: 8 },
    { name: 'Jun', applications: 25, interviews: 18, hires: 10 },
  ];

  return (
    <div className={styles.dashboard}>
      
      <main className={styles.main}>
        <div className={styles.content}>
          {/* Promo Banner */}
          <PromoBanner />

          {/* Important Notice */}
          {!dismissedNotice && (
            <ImportantNotice onDismiss={() => setDismissedNotice(true)} />
          )}
          
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatCard 
              title="Total Jobs"
              value={loading ? '...' : stats?.total_jobs || '0'}
              icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
              loading={loading}
            />
            <StatCard 
              title="Active Jobs"
              value={loading ? '...' : stats?.active_jobs || '0'}
              icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
              loading={loading}
            />
            <StatCard 
              title="Applications"
              value={loading ? '...' : stats?.total_applications || '0'}
              description={`${stats?.new_applications || 0} new`}
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
              loading={loading}
            />
            <StatCard 
              title="Interviews"
              value={loading ? '...' : stats?.interviews_scheduled || '0'}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              loading={loading}
            />
          </div>

          {/* Charts and Activity */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <ApplicationsChart data={chartData} loading={loading}/>
          {/* <RecentActivity activities={recentActivities} loading={loading} /> */}
          </div>
          
          {/* Main Content Grid */}
          <div className={styles.grid}>
            <div className={styles.mainContent}>
              {/* Recent Jobs */}
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Recent Jobs</h3>
                  <button className={styles.viewAllBtn}>View All</button>
                </div>
                <RecentJobs />
              </section>

              {/* Just Launched Banner */}
              <JustLaunchedBanner />
            </div>
            
            <div className={styles.sidebar}>
              {/* Find Candidates Card */}
              <HireTalentCard />
              
              {/* Recent Searches */}
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Recent Searches</h3>
                  <button className={styles.clearBtn}>Clear All</button>
                </div>
                <RecentSearches />
              </section>

              {/* Usage Limits */}
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Usage Limits</h3>
                </div>
                <UsageLimits />
              </section>

              {/* Hire Talent Buttons */}
              <div className={styles.hireTalentButtons}>
                <PostJobButton />
                <PostWalkInButton />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Developer Credit */}
      <DeveloperCredit />
    </div>
  );
}
