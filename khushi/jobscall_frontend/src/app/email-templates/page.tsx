'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

// Mock data for email templates
const emailTemplates = [
  {
    id: 1,
    name: 'Welcome Email',
    lastUsed: '2023-09-20',
    lastModified: '2023-09-18',
    createdOn: '2023-08-15',
    status: 'Accepted',
    isShared: true
  },
  {
    id: 2,
    name: 'Password Reset',
    lastUsed: '2023-09-15',
    lastModified: '2023-09-10',
    createdOn: '2023-07-22',
    status: 'Accepted',
    isShared: false
  },
  {
    id: 3,
    name: 'Account Verification',
    lastUsed: 'Never',
    lastModified: '2023-09-05',
    createdOn: '2023-09-01',
    status: 'Pending',
    isShared: false
  },
  {
    id: 4,
    name: 'Newsletter - October 2023',
    lastUsed: '2023-10-01',
    lastModified: '2023-09-28',
    createdOn: '2023-09-25',
    status: 'Rejected',
    isShared: true,
    rejectionReason: 'Contains promotional content'
  }
];

export default function EmailTemplates() {
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
  const [currentTab, setCurrentTab] = useState<'my-templates' | 'shared-templates'>('my-templates');

  const toggleTemplateSelection = (id: number) => {
    setSelectedTemplates(prev => 
      prev.includes(id) 
        ? prev.filter(templateId => templateId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTemplates(emailTemplates.map(template => template.id));
    } else {
      setSelectedTemplates([]);
    }
  };

  const toggleShareStatus = (id: number, currentStatus: boolean) => {
    // In a real app, this would update the template's shared status via an API
    console.log(`Template ${id} share status: ${!currentStatus}`);
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <header className={styles.header}>
        <div>
          <h1>Manage email templates</h1>
          <p className={styles.subtitle}>
            {emailTemplates.length} {emailTemplates.length === 1 ? 'template' : 'templates'} created
          </p>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={`${styles.tabButton} ${currentTab === 'my-templates' ? styles.activeTab : ''}`}
            onClick={() => setCurrentTab('my-templates')}
          >
            My email templates
          </button>
          <button 
            className={`${styles.tabButton} ${currentTab === 'shared-templates' ? styles.activeTab : ''}`}
            onClick={() => setCurrentTab('shared-templates')}
          >
            Email templates shared by others
          </button>
          <button className={styles.primaryButton}>
            Create a new email template
          </button>
        </div>
      </header>

      {/* Template Table */}
      <div className={styles.tableContainer}>
        <table className={styles.templateTable}>
          <thead>
            <tr>
              <th className={styles.checkboxCell}>
                <input 
                  type="checkbox" 
                  checked={selectedTemplates.length === emailTemplates.length && emailTemplates.length > 0}
                  onChange={toggleSelectAll}
                  aria-label="Select all templates"
                />
              </th>
              <th>Template Name</th>
              <th>Last Used On</th>
              <th>Last Modified On</th>
              <th>Created On</th>
              <th>Status</th>
              <th>Share/Unshare</th>
            </tr>
          </thead>
          <tbody>
            {emailTemplates.map((template) => (
              <tr key={template.id}>
                <td className={styles.checkboxCell}>
                  <input 
                    type="checkbox" 
                    checked={selectedTemplates.includes(template.id)}
                    onChange={() => toggleTemplateSelection(template.id)}
                    aria-label={`Select ${template.name}`}
                  />
                </td>
                <td className={styles.templateName}>
                  <Link href={`/email-templates/${template.id}`}>
                    {template.name}
                  </Link>
                </td>
                <td>{template.lastUsed}</td>
                <td>{template.lastModified}</td>
                <td>{template.createdOn}</td>
                <td>
                  <span className={`${styles.status} ${styles[template.status.toLowerCase()]}`}>
                    {template.status}
                    {template.status === 'Rejected' && template.rejectionReason && (
                      <span className={styles.tooltip}>{template.rejectionReason}</span>
                    )}
                  </span>
                </td>
                <td>
                  <button 
                    className={`${styles.shareButton} ${template.isShared ? styles.shared : ''}`}
                    onClick={() => toggleShareStatus(template.id, template.isShared)}
                  >
                    {template.isShared ? 'Shared' : 'Share'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk Actions (visible when templates are selected) */}
      {selectedTemplates.length > 0 && (
        <div className={styles.bulkActions}>
          <span>{selectedTemplates.length} {selectedTemplates.length === 1 ? 'template' : 'templates'} selected</span>
          <div className={styles.actionButtons}>
            <button className={styles.secondaryButton}>
              Share
            </button>
            <button className={styles.secondaryButton}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
