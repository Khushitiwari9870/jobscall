import React from 'react';
import styles from './RecentJobs.module.css';
import Link from 'next/link';

interface JobItem {
  id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  date: string;
  status: 'active' | 'paused' | 'draft';
  applications: number;
}

const RecentJobs: React.FC = () => {
  // Sample data - replace with actual data from your API/state
  const recentJobs: JobItem[] = [
    {
      id: '1',
      title: 'Senior React Developer',
      company: 'TechCorp',
      type: 'Full-time',
      location: 'Remote',
      date: 'Posted 2 days ago',
      status: 'active',
      applications: 12
    },
    {
      id: '2',
      title: 'UX/UI Designer',
      company: 'DesignHub',
      type: 'Contract',
      location: 'New York, NY',
      date: 'Posted 1 week ago',
      status: 'paused',
      applications: 5
    }
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return styles.statusActive;
      case 'paused':
        return styles.statusPaused;
      case 'draft':
        return styles.statusDraft;
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recent Job Postings</h2>
        <Link href="/recruiter/jobs" className={styles.viewAll}>
          View All
        </Link>
      </div>
      
      <div className={styles.jobsList}>
        {recentJobs.map((job) => (
          <div key={job.id} className={styles.jobCard}>
            <div className={styles.jobInfo}>
              <h3 className={styles.jobTitle}>
                <Link href={`/recruiter/jobs/${job.id}`}>
                  {job.title}
                </Link>
              </h3>
              <p className={styles.jobCompany}>{job.company}</p>
              <div className={styles.jobMeta}>
                <span className={styles.jobType}>{job.type}</span>
                <span className={styles.jobLocation}>{job.location}</span>
                <span className={styles.jobDate}>{job.date}</span>
              </div>
            </div>
            <div className={styles.jobStats}>
              <span className={`${styles.status} ${getStatusClass(job.status)}`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
              <div className={styles.applications}>
                <span className={styles.applicationsCount}>{job.applications}</span>
                <span>Applications</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.footer}>
        <Link href="/recruiter/jobs/new" className={styles.postJobButton}>
          + Post a New Job
        </Link>
      </div>
    </div>
  );
};

export default RecentJobs;
