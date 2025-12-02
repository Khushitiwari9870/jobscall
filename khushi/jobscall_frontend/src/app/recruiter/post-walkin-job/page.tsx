// app/recruiter/post-walkin-job/page.tsx
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import styles from './page.module.css';

interface JobFormData {
  jobType: string;
  jobTitle: string;
  employmentType: string;
  vacancies: number;
  industry: string;
  functionalArea: string;
  jobDescription: string;
  skills: string[];
  minExperience: number;
  maxExperience: number;
  salaryType: 'Yearly' | 'Monthly';
  minSalary: number;
  maxSalary: number;
  hideSalary: boolean;
  jobLocation: string;
  walkinLocation: string;
  walkinCity: string;
  startDate: string;
  endDate: string;
  shiftTypes: string[];
  recruiterName: string;
  recruiterEmail: string;
  recruiterPhone: string;
  companyName: string;
  hiringFor: string;
  companyDescription: string;
  telephone: string;
  email: string;
  hideCompanyInfo: boolean;
  hideContactInfo: boolean;
  subuser: string;
  termsAccepted: boolean;
}

export default function PostWalkinJob() {
  const { control, handleSubmit, watch, setValue } = useForm<JobFormData>({
    defaultValues: {
      jobType: 'Smart Job',
      salaryType: 'Yearly',
      shiftTypes: [],
      skills: [],
    },
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const addSkill = () => {
    if (skillInput.trim() && !selectedSkills.includes(skillInput)) {
      const newSkills = [...selectedSkills, skillInput];
      setSelectedSkills(newSkills);
      setValue('skills', newSkills);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = selectedSkills.filter(skill => skill !== skillToRemove);
    setSelectedSkills(newSkills);
    setValue('skills', newSkills);
  };

  const onSubmit = (data: JobFormData) => {
    console.log('Form submitted:', data);
    // Handle form submission
  };

  return (
    <div className={styles.container}>
      <h1>Post a Walkin Job</h1>
      
      <div className={styles.layout}>
        <div className={styles.mainContent}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Job Type Selection */}
            <div className={styles.section}>
              <h2>Job Type</h2>
              <div className={styles.jobTypeSelector}>
                <button 
                  type="button" 
                  className={`${styles.jobTypeButton} ${watch('jobType') === 'Smart Job' ? styles.active : ''}`}
                  onClick={() => setValue('jobType', 'Smart Job')}
                >
                  Smart Job
                </button>
                {/* Add more job type buttons as needed */}
              </div>
            </div>

            {/* Job Details */}
            <div className={styles.section}>
              <h2>Job Details</h2>
              <div className={styles.formGroup}>
                <label>Job Title*</label>
                <Controller
                  name="jobTitle"
                  control={control}
                  rules={{ required: 'Job title is required' }}
                  render={({ field }) => (
                    <input 
                      type="text" 
                      {...field} 
                      placeholder="e.g. Senior Software Engineer" 
                      className={styles.formControl}
                    />
                  )}
                />
              </div>

              {/* Add more form fields following the same pattern */}
              {/* Employment Type, Vacancies, Industry, Functional Area, etc. */}

              {/* Job Description */}
              <div className={styles.formGroup}>
                <label>Job Description*</label>
                <Controller
                  name="jobDescription"
                  control={control}
                  rules={{ required: 'Job description is required' }}
                  render={({ field }) => (
                    <div className="bg-white rounded border border-gray-300">
                      {/* <ReactQuill
                        theme="snow"
                        value={field.value || ''}
                        onChange={(content: string) => field.onChange(content)}
                        className={styles.richTextEditor}
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            ['link', 'clean']
                          ]
                        }}
                      /> */}
                    </div>
                  )}
                />
              </div>

              {/* Skills */}
              <div className={styles.formGroup}>
                <label>Skills*</label>
                <div className={styles.skillsContainer}>
                  <div className={styles.skillsInputContainer}>
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="Type and press Enter to add skills"
                      className={styles.formControl}
                    />
                    <button 
                      type="button" 
                      onClick={addSkill}
                      className={styles.addButton}
                    >
                      Add
                    </button>
                  </div>
                  <div className={styles.skillsList}>
                    {selectedSkills.map((skill) => (
                      <span key={skill} className={styles.skillTag}>
                        {skill}
                        <button 
                          type="button" 
                          onClick={() => removeSkill(skill)}
                          className={styles.removeSkill}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add more form sections following the same pattern */}
              {/* Experience, Salary, Location, Walkin Details, etc. */}
            </div>

            {/* Form actions */}
            <div className={styles.formActions}>
              <button type="submit" className={styles.publishButton}>
                Publish
              </button>
              <button type="button" className={styles.draftButton}>
                Save as Draft
              </button>
              <button type="button" className={styles.cancelButton}>
                Cancel
              </button>
              <div className={styles.termsCheckbox}>
                <Controller
                  name="termsAccepted"
                  control={control}
                  rules={{ required: 'You must accept the terms' }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <input 
                      type="checkbox" 
                      id="terms"
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      onBlur={onBlur}
                      className={styles.checkbox}
                    />
                  )}
                />
                <label htmlFor="terms">I agree to the terms of use</label>
              </div>
            </div>
          </form>

        {/* Preview Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.previewSection}>
            <h3>JD Preview</h3>
            <div className={styles.previewContent}>
              {/* Preview content will be rendered here */}
              <p>Preview will be shown here</p>
            </div>
          </div>

          <div className={styles.recruiterSection}>
            <h3>Recruiter Details</h3>
            {/* Recruiter details form */}
          </div>

          <div className={styles.companySection}>
            <h3>Company Details</h3>
            {/* Company details form */}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}