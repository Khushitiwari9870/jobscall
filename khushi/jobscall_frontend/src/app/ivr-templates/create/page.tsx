// app/ivr-templates/create/page.tsx
'use client';

import { useState } from 'react';
import { FiPlus, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import Link from 'next/link';
import styles from './page.module.css';

interface IvrTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
}

const CreateIvrTemplatePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sample IVR templates
  const ivrTemplates: IvrTemplate[] = [
    {
      id: '1',
      name: 'Job Opportunity - Basic',
      content: `Hello, this is {recruiter_name} from {company_name}. We came across your profile and have an exciting opportunity for the role of {job_title} at {company_name} in {location}. The package offered is up to {salary} LPA. If interested, please reply with '1' to know more.`,
      variables: ['recruiter_name', 'company_name', 'job_title', 'location', 'salary']
    },
    {
      id: '2',
      name: 'Interview Invitation',
      content: `Hi {candidate_name}, this is {recruiter_name} from {company_name}. We are impressed with your profile for the {job_title} position. We would like to invite you for an interview on {interview_date} at {interview_time}. Please confirm your availability by replying with '1' for Yes or '2' to reschedule.`,
      variables: ['candidate_name', 'recruiter_name', 'company_name', 'job_title', 'interview_date', 'interview_time']
    },
    {
      id: '3',
      name: 'Job Offer',
      content: `Hello {candidate_name}, congratulations! We are pleased to offer you the position of {job_title} at {company_name} with a compensation of {salary} LPA. The joining date is {joining_date}. Please confirm your acceptance by replying with '1' for Yes or '2' to discuss.`,
      variables: ['candidate_name', 'job_title', 'company_name', 'salary', 'joining_date']
    },
    {
      id: '4',
      name: 'Screening Call',
      content: `Hi {candidate_name}, this is {recruiter_name} from {company_name}. We are conducting a quick screening for the {job_title} position. The call will take about 5 minutes. Press '1' to continue or '2' to schedule for later.`,
      variables: ['candidate_name', 'recruiter_name', 'company_name', 'job_title']
    },
    {
      id: '5',
      name: 'Application Update',
      content: `Hello {candidate_name}, thank you for applying to {company_name}. We have received your application for {job_title}. We will review it and get back to you within {timeline}. For any queries, call {contact_number}.`,
      variables: ['candidate_name', 'company_name', 'job_title', 'timeline', 'contact_number']
    }
  ];

  // Pagination logic
  const totalPages = Math.ceil(ivrTemplates.length / itemsPerPage);
  const currentTemplates = ivrTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatTemplateText = (text: string) => {
    return text.replace(/\{([^}]+)\}/g, '<span class="variable">{$1}</span>');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Create IVR Template</h1>
          <Link href="/ivr-templates/manage" className={styles.manageButton}>
            <FiPlus className={styles.buttonIcon} />
            Manage IVR Template
          </Link>
        </div>
      </header>

      {/* Template List */}
      <div className={styles.templateList}>
        <div className={styles.tableHeader}>
          <div className={styles.templateName}>Template name</div>
          <div className={styles.templatePreview}>Preview</div>
          <div className={styles.templateActions}>Actions</div>
        </div>

        {currentTemplates.map((template) => (
          <div key={template.id} className={styles.templateItem}>
            <div className={styles.templateName}>{template.name}</div>
            <div 
              className={styles.templatePreview}
              dangerouslySetInnerHTML={{ __html: formatTemplateText(template.content) }}
            />
            <div className={styles.templateActions}>
              <Link 
                href={`/ivr-templates/create/${template.id}`} 
                className={styles.createButton}
              >
                Create Template
              </Link>
            </div>
          </div>
        ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
              Previous
            </button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`${styles.pageNumber} ${currentPage === pageNum ? styles.activePage : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className={styles.ellipsis}>...</span>
                  <button
                    className={styles.pageNumber}
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            <button
              className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="/help" className={styles.footerLink}>Help Center</a>
          <span className={styles.divider}>|</span>
          <a href="/about" className={styles.footerLink}>About Us</a>
          <span className={styles.divider}>|</span>
          <a href="/fraud-alert" className={styles.footerLink}>Fraud Alert</a>
          <span className={styles.divider}>|</span>
          <a href="/terms" className={styles.footerLink}>Terms & Conditions</a>
          <span className={styles.divider}>|</span>
          <a href="/privacy" className={styles.footerLink}>Privacy Policy</a>
        </div>
        <div className={styles.contactInfo}>
          <p>© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          <p>Contact: support@yourcompany.com | +1 (555) 123-4567</p>
        </div>
      </footer>
    </div>
  );
};

export default CreateIvrTemplatePage;