'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

// Mock data for email campaigns
const emailCampaigns = [
  {
    id: 1,
    username: 'john_doe',
    campaignName: 'Summer Sale 2023',
    campaignDate: '2023-06-15',
    status: 'Sent',
    scheduledDate: '2023-06-14',
    mailsSent: 1250,
    totalOpened: 845,
    totalClicked: 320
  },
  {
    id: 2,
    username: 'jane_smith',
    campaignName: 'New Product Launch',
    campaignDate: '2023-07-01',
    status: 'Draft',
    scheduledDate: '2023-07-10',
    mailsSent: 0,
    totalOpened: 0,
    totalClicked: 0
  },
  // Add more mock data as needed
];

export default function EmailDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(emailCampaigns.length / itemsPerPage);

  return (
    <div className={styles.dashboard}>
      {/* Notification Bar */}
      <div className={styles.notificationBar}>
        <span>ℹ️ Important: System maintenance scheduled for this weekend</span>
      </div>

      {/* Page Header */}
      <header className={styles.header}>
        <h1>Emails Dashboard</h1>
        <div className={styles.actions}>
          <button className={`${styles.button} ${styles.primary}`}>
            Create a new email template
          </button>
          <button className={styles.button}>
            My email templates
          </button>
          <button className={styles.button}>
            Email templates shared by others
          </button>
        </div>
      </header>

      {/* Email Campaigns Table */}
      <div className={styles.tableContainer}>
        <table className={styles.emailTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Campaign Name</th>
              <th>Campaign Date</th>
              <th>Status</th>
              <th>Scheduled Date</th>
              <th>Mails Sent</th>
              <th>Total Opened</th>
              <th>Total Clicked</th>
            </tr>
          </thead>
          <tbody>
            {emailCampaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td>{campaign.id}</td>
                <td>{campaign.username}</td>
                <td className={styles.campaignName}>
                  <Link href={`/email-campaigns/${campaign.id}`}>
                    {campaign.campaignName}
                  </Link>
                </td>
                <td>{campaign.campaignDate}</td>
                <td>
                  <span className={`${styles.status} ${styles[campaign.status.toLowerCase()]}`}>
                    {campaign.status}
                  </span>
                </td>
                <td>{campaign.scheduledDate}</td>
                <td className={styles.numberCell}>{campaign.mailsSent.toLocaleString()}</td>
                <td className={styles.numberCell}>{campaign.totalOpened.toLocaleString()}</td>
                <td className={styles.numberCell}>{campaign.totalClicked.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
