"use client";

import React, { useState } from 'react';
import styles from './EmailTemplateForm.module.css';

const EmailTemplateForm = () => {
  const [formData, setFormData] = useState({
    templateType: 'search',
    templateName: '',
    email: 'recruiter@company.com',
    subject: '',
    emailBody: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Message Details</h2>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Template Type <span className={styles.required}>*</span>
        </label>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="templateType"
              value="search"
              checked={formData.templateType === 'search'}
              onChange={handleChange}
              className={styles.radioInput}
            />
            Search
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="templateType"
              value="application"
              disabled
              className={styles.radioInput}
            />
            Application
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="templateType"
              value="workspace"
              disabled
              className={styles.radioInput}
            />
            Workspace
          </label>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="templateName" className={styles.label}>
          Template Name <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="templateName"
          name="templateName"
          value={formData.templateName}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter template name"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Your Email ID <span className={styles.required}>*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`${styles.input} ${styles.disabledInput}`}
          disabled
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="subject" className={styles.label}>
          Subject Line <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter subject line"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="emailBody" className={styles.label}>
          Email Body <span className={styles.required}>*</span>
        </label>
        <div className={styles.editorToolbar}>
          <button type="button" className={styles.toolbarButton}>B</button>
          <button type="button" className={styles.toolbarButton}>I</button>
          <button type="button" className={styles.toolbarButton}>U</button>
          <button type="button" className={styles.toolbarButton}>
            <i className="fa fa-list-ul"></i>
          </button>
          <button type="button" className={styles.toolbarButton}>
            <i className="fa fa-list-ol"></i>
          </button>
          <button type="button" className={styles.toolbarButton}>
            <i className="fa fa-link"></i>
          </button>
        </div>
        <textarea
          id="emailBody"
          name="emailBody"
          value={formData.emailBody}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Type your email content here..."
          rows={10}
          required
        />
      </div>
    </div>
  );
};

export default EmailTemplateForm;
