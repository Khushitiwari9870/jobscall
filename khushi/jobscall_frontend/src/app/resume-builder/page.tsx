'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FiDownload, FiEdit2, FiTrash2, FiPlus, FiUser, FiGithub, FiLinkedin, FiAward, FiBriefcase, FiBookOpen, FiCode, FiEye } from 'react-icons/fi';
import PageLayout from '@/components/layout/PageLayout';

// Define types
type Section = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications';

// Import client components
const PDFDownloadButton = dynamic(
  () => import('@/components/resume/PDFDownloadButton'),
  { ssr: false }
);

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  linkedin: string;
  github: string;
}

interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface Project {
  id: string;
  name: string;
  technologies: string[];
  description: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

// Initial data
const initialPersonalInfo: PersonalInfo = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '(123) 456-7890',
  address: '123 Main St, San Francisco, CA',
  website: 'johndoe.dev',
  linkedin: 'linkedin.com/in/johndoe',
  github: 'github.com/johndoe'
};

const initialExperiences: Experience[] = [
  {
    id: '1',
    jobTitle: 'Senior Software Engineer',
    company: 'Tech Innovations Inc.',
    location: 'San Francisco, CA',
    startDate: '2020-01',
    endDate: '2023-12',
    current: false,
    description: [
      'Led a team of 5 developers to build a scalable microservices architecture',
      'Improved application performance by 40% through code optimization',
      'Mentored junior developers and conducted code reviews'
    ]
  },
  {
    id: '2',
    jobTitle: 'Software Engineer',
    company: 'Digital Solutions LLC',
    location: 'San Jose, CA',
    startDate: '2018-03',
    endDate: '2019-12',
    current: false,
    description: [
      'Developed and maintained web applications using React and Node.js',
      'Collaborated with cross-functional teams to deliver new features',
      'Reduced page load time by 30% through performance optimization'
    ]
  }
];

const initialEducations: Education[] = [
  {
    id: '1',
    degree: 'Master of Science in Computer Science',
    institution: 'Stanford University',
    location: 'Stanford, CA',
    startDate: '2016',
    endDate: '2018',
    current: false,
    description: 'Specialized in Machine Learning and Data Science'
  },
  {
    id: '2',
    degree: 'Bachelor of Technology in Computer Science',
    institution: 'University of California, Berkeley',
    location: 'Berkeley, CA',
    startDate: '2012',
    endDate: '2016',
    current: false,
    description: 'Graduated with Honors'
  }
];

const initialSkills: Skill[] = [
  { id: '1', name: 'JavaScript', level: 90 },
  { id: '2', name: 'React', level: 85 },
  { id: '3', name: 'Node.js', level: 80 },
  { id: '4', name: 'TypeScript', level: 80 },
  { id: '5', name: 'Python', level: 75 },
  { id: '6', name: 'AWS', level: 70 }
];

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    description: 'A full-stack e-commerce platform with user authentication, product catalog, and payment processing.'
  },
  {
    id: '2',
    name: 'Task Management App',
    technologies: ['React Native', 'Firebase'],
    description: 'A mobile app for managing tasks with real-time synchronization across devices.'
  }
];

const initialCertifications: Certification[] = [
  { id: '1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2022' },
  { id: '2', name: 'Professional Scrum Master I', issuer: 'Scrum.org', date: '2021' }
];

// Main Component
export default function ResumeBuilder() {
  const [activeSection, setActiveSection] = useState<Section>('personal');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(initialPersonalInfo);
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExperienceChange = (id: string, field: string, value: string | boolean | string[]) => {
    setExperiences(prev =>
      prev.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const addNewExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ['']
    };
    setExperiences([newExperience, ...experiences]);
  };

  const removeExperience = (id: string) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
  };

  const addDescriptionItem = (expId: string) => {
    setExperiences(prev =>
      prev.map(exp =>
        exp.id === expId
          ? { ...exp, description: [...exp.description, ''] }
          : exp
      )
    );
  };

  const updateDescriptionItem = (expId: string, index: number, value: string) => {
    setExperiences(prev =>
      prev.map(exp => {
        if (exp.id === expId) {
          const newDescriptions = [...exp.description];
          newDescriptions[index] = value;
          return { ...exp, description: newDescriptions };
        }
        return exp;
      })
    );
  };

  const removeDescriptionItem = (expId: string, index: number) => {
    setExperiences(prev =>
      prev.map(exp => {
        if (exp.id === expId) {
          const newDescriptions = exp.description.filter((_, i) => i !== index);
          return { ...exp, description: newDescriptions };
        }
        return exp;
      })
    );
  };

  const generateResume = () => {
    setIsGenerating(true);
    setShowPreview(true);
    // Simulate processing time
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const downloadResume = () => {
    // This will trigger the PDF download
    const doc = document.getElementById('download-resume');
    if (doc) {
      doc.click();
    }
  };

  return (
    <PageLayout
      title="Resume Builder"
      description="Create a professional resume in minutes with our free resume builder"
    >
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Builder</h1>
            <p className="text-gray-600 mb-8">Create a professional resume in minutes. Fill in your details and download as PDF.</p>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar */}
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Sections</h2>
                  <nav className="space-y-1">
                    {[
                      { id: 'personal', label: 'Personal Info', icon: <FiUser className="mr-2 h-4 w-4" /> },
                      { id: 'summary', label: 'Summary', icon: <FiEdit2 className="mr-2 h-4 w-4" /> },
                      { id: 'experience', label: 'Experience', icon: <FiBriefcase className="mr-2 h-4 w-4" /> },
                      { id: 'education', label: 'Education', icon: <FiBookOpen className="mr-2 h-4 w-4" /> },
                      { id: 'skills', label: 'Skills', icon: <FiCode className="mr-2 h-4 w-4" /> },
                      { id: 'projects', label: 'Projects', icon: <FiAward className="mr-2 h-4 w-4" /> },
                      { id: 'certifications', label: 'Certifications', icon: <FiAward className="mr-2 h-4 w-4" /> },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id as Section)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                          activeSection === item.id
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </nav>

                  <div className="mt-8">
                    <button
                      onClick={generateResume}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
                    >
                      <FiEye className="mr-2 h-4 w-4" />
                      {isGenerating ? 'Generating...' : 'Preview Resume'}
                    </button>
                    
                    <div className="mt-4">
                      <PDFDownloadButton
                        resumeData={{
                          personalInfo,
                          experiences,
                          educations: initialEducations,
                          skills: initialSkills,
                          projects: initialProjects,
                          certifications: initialCertifications
                        }}
                        fileName={`${personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center"
                      >
                        <FiDownload className="mr-2 h-4 w-4" />
                        Download PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {activeSection === 'personal' && (
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={personalInfo.fullName}
                          onChange={handlePersonalInfoChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={personalInfo.email}
                          onChange={handlePersonalInfoChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={personalInfo.phone}
                          onChange={handlePersonalInfoChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="(123) 456-7890"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={personalInfo.address}
                          onChange={handlePersonalInfoChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="123 Main St, City, Country"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            https://
                          </span>
                          <input
                            type="text"
                            name="website"
                            value={personalInfo.website}
                            onChange={handlePersonalInfoChange}
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="yourwebsite.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            linkedin.com/in/
                          </span>
                          <input
                            type="text"
                            name="linkedin"
                            value={personalInfo.linkedin}
                            onChange={handlePersonalInfoChange}
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="username"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            github.com/
                          </span>
                          <input
                            type="text"
                            name="github"
                            value={personalInfo.github}
                            onChange={handlePersonalInfoChange}
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="username"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'experience' && (
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
                      <button
                        onClick={addNewExperience}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FiPlus className="mr-2 h-4 w-4" />
                        Add Experience
                      </button>
                    </div>

                    <div className="space-y-6">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                  <input
                                    type="text"
                                    value={exp.jobTitle}
                                    onChange={(e) => handleExperienceChange(exp.id, 'jobTitle', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g. Senior Software Engineer"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                  <input
                                    type="text"
                                    value={exp.company}
                                    onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Company Name"
                                  />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                  <input
                                    type="text"
                                    value={exp.location}
                                    onChange={(e) => handleExperienceChange(exp.id, 'location', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g. San Francisco, CA"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                      type="month"
                                      value={exp.startDate}
                                      onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      {exp.current ? 'Currently Working Here' : 'End Date'}
                                    </label>
                                    {!exp.current && (
                                      <input
                                        type="month"
                                        value={exp.endDate}
                                        onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        disabled={exp.current}
                                      />
                                    )}
                                    <div className="flex items-center mt-1">
                                      <input
                                        id={`current-${exp.id}`}
                                        type="checkbox"
                                        checked={exp.current}
                                        onChange={(e) => handleExperienceChange(exp.id, 'current', e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                      />
                                      <label htmlFor={`current-${exp.id}`} className="ml-2 block text-sm text-gray-700">
                                        I currently work here
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <div className="space-y-2">
                                  {exp.description.map((desc, index) => (
                                    <div key={index} className="flex items-start">
                                      <span className="mr-2 mt-2.5">•</span>
                                      <input
                                        type="text"
                                        value={desc}
                                        onChange={(e) => updateDescriptionItem(exp.id, index, e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Describe your responsibilities and achievements"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeDescriptionItem(exp.id, index)}
                                        className="ml-2 p-2 text-gray-400 hover:text-red-500"
                                        disabled={exp.description.length <= 1}
                                      >
                                        <FiTrash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => addDescriptionItem(exp.id)}
                                    className="mt-1 ml-6 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                  >
                                    <FiPlus className="mr-1 h-3 w-3" /> Add another bullet point
                                  </button>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeExperience(exp.id)}
                              className="ml-4 p-1 text-gray-400 hover:text-red-500"
                              disabled={experiences.length <= 1}
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'education' && (
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Education</h2>
                    <div className="space-y-4">
                      {initialEducations.map((edu) => (
                        <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(_e) => {}} // eslint-disable-line @typescript-eslint/no-unused-vars
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g. Bachelor of Science in Computer Science"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(_e) => {}} // eslint-disable-line @typescript-eslint/no-unused-vars
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="University Name"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                              <input
                                type="text"
                                value={edu.location}
                                onChange={(_e) => {}} // eslint-disable-line @typescript-eslint/no-unused-vars
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g. Cambridge, MA"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Year</label>
                                <input
                                  type="number"
                                  value={edu.startDate}
                                  onChange={(_e) => {}} // eslint-disable-line @typescript-eslint/no-unused-vars
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="YYYY"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {edu.current ? 'Expected Graduation' : 'End Year'}
                                </label>
                                <input
                                  type="number"
                                  value={edu.endDate}
                                  onChange={(_e) => {}} // eslint-disable-line @typescript-eslint/no-unused-vars
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="YYYY"
                                  disabled={edu.current}
                                />
                                <div className="flex items-center mt-1">
                                  <input
                                    id={`current-edu-${edu.id}`}
                                    type="checkbox"
                                    checked={edu.current}
                              onChange={() => {}}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <label htmlFor={`current-edu-${edu.id}`} className="ml-2 block text-sm text-gray-700">
                                    Currently Enrolled
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                            <textarea
                              value={edu.description}
                              onChange={(_e) => {}} // eslint-disable-line @typescript-eslint/no-unused-vars
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Relevant coursework, achievements, or activities"
                            />
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FiPlus className="mr-2 h-4 w-4" />
                        Add Education
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === 'skills' && (
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills</h2>
                    <div className="space-y-4">
                      {initialSkills.map((skill) => (
                        <div key={skill.id} className="flex items-center">
                          <div className="w-1/3">
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(_e) => {}} // eslint-disable-line @typescript-eslint/no-unused-vars
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Skill name"
                            />
                          </div>
                          <div className="flex-1 px-4">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={skill.level}
                              onChange={(_e) => {}} // eslint-disable-line @typescript-eslint/no-unused-vars
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                          <span className="w-12 text-sm font-medium text-gray-700 text-right">
                            {skill.level}%
                          </span>
                          <button
                            type="button"
                            className="ml-4 p-1 text-gray-400 hover:text-red-500"
                            disabled={initialSkills.length <= 1}
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FiPlus className="mr-2 h-4 w-4" />
                        Add Skill
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === 'projects' && (
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FiPlus className="mr-2 h-4 w-4" />
                        Add Project
                      </button>
                    </div>
                    <div className="space-y-4">
                      {initialProjects.map((project) => (
                        <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between">
                            <div className="flex-1">
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                                <input
                                  type="text"
                                  value={project.name}
                                  onChange={(_e) => {}} // eslint-disable-line @typescript-eslint/no-unused-vars
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="e.g. E-commerce Platform"
                                />
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
                                <input
                                  type="text"
                                  value={project.technologies.join(', ')}
                                  onChange={(_e) => {}} // eslint-disable-line @typescript-eslint/no-unused-vars
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="e.g. React, Node.js, MongoDB"
                                />
                                <p className="mt-1 text-xs text-gray-500">Separate technologies with commas</p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                  value={project.description}
                                  onChange={(_e) => {}} // eslint-disable-line @typescript-eslint/no-unused-vars
                                  rows={3}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Briefly describe the project, your role, and key achievements"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              className="ml-4 p-1 text-gray-400 hover:text-red-500 self-start"
                              disabled={initialProjects.length <= 1}
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'certifications' && (
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FiPlus className="mr-2 h-4 w-4" />
                        Add Certification
                      </button>
                    </div>
                    <div className="space-y-4">
                      {initialCertifications.map((cert) => (
                        <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between">
                            <div className="flex-1">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
                                  <input
                                    type="text"
                                    value={cert.name}
                                    onChange={(_e) => {}} // eslint-disable-line @typescript-eslint/no-unused-vars
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g. AWS Certified Solutions Architect"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
                                  <input
                                    type="text"
                                    value={cert.issuer}
                                    onChange={(_e) => {}} // eslint-disable-line @typescript-eslint/no-unused-vars
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g. Amazon Web Services"
                                  />
                                </div>
                              </div>
                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date Earned</label>
                                <input
                                  type="month"
                                  value={cert.date}
                                  onChange={(_e) => {}} // eslint-disable-line @typescript-eslint/no-unused-vars
                                  className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              className="ml-4 p-1 text-gray-400 hover:text-red-500 self-start"
                              disabled={initialCertifications.length <= 1}
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'summary' && (
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Professional Summary</h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Write a short summary highlighting your experience and skills
                      </label>
                      <textarea
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Example: Results-driven software engineer with 5+ years of experience in full-stack development. Specialized in building scalable web applications using modern JavaScript frameworks. Strong problem-solving skills and a passion for writing clean, efficient code."
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Keep it concise (3-5 sentences). Highlight your most relevant experience and skills.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">Resume Preview</h3>
              <div className="flex space-x-3">
                <button
                  onClick={downloadResume}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isGenerating}
                >
                  <FiDownload className="mr-2 h-4 w-4" />
                  {isGenerating ? 'Generating...' : 'Download PDF'}
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="bg-white p-8 max-w-4xl mx-auto shadow-sm border border-gray-200">
                <div className="border-b-2 border-blue-800 pb-4 mb-6">
                  <h1 className="text-2xl font-bold text-blue-900">{personalInfo.fullName}</h1>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                    {personalInfo.address && <span>• {personalInfo.address}</span>}
                    {personalInfo.website && (
                      <span>• <a href={`https://${personalInfo.website}`} className="text-blue-600 hover:underline">{personalInfo.website}</a></span>
                    )}
                  </div>
                  <div className="flex space-x-4 mt-2">
                    {personalInfo.linkedin && (
                      <a 
                        href={`https://linkedin.com/in/${personalInfo.linkedin}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center"
                      >
                        <FiLinkedin className="mr-1 h-4 w-4" />
                        LinkedIn
                      </a>
                    )}
                    {personalInfo.github && (
                      <a 
                        href={`https://github.com/${personalInfo.github}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center"
                      >
                        <FiGithub className="mr-1 h-4 w-4" />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-blue-800 border-b border-gray-200 pb-1 mb-3">PROFESSIONAL SUMMARY</h2>
                  <p className="text-gray-700">
                    Experienced software engineer with a passion for building scalable web applications. 
                    Strong problem-solving skills and a track record of delivering high-quality software.
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-blue-800 border-b border-gray-200 pb-1 mb-3">EXPERIENCE</h2>
                  {experiences.map((exp) => (
                    <div key={exp.id} className="mb-4">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                        <div className="text-sm text-gray-600">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-700 mb-2">
                        <span className="font-medium">{exp.company}</span>
                        <span>{exp.location}</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {exp.description.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-blue-800 border-b border-gray-200 pb-1 mb-3">EDUCATION</h2>
                  {initialEducations.map((edu) => (
                    <div key={edu.id} className="mb-4">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                        <div className="text-sm text-gray-600">
                          {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">
                        {edu.institution}, {edu.location}
                      </div>
                      {edu.description && (
                        <p className="text-sm text-gray-600 mt-1">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-blue-800 border-b border-gray-200 pb-1 mb-3">SKILLS</h2>
                  <div className="flex flex-wrap gap-2">
                    {initialSkills.map((skill) => (
                      <span key={skill.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                {initialProjects.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-blue-800 border-b border-gray-200 pb-1 mb-3">PROJECTS</h2>
                    <div className="space-y-4">
                      {initialProjects.map((project) => (
                        <div key={project.id}>
                          <h3 className="font-semibold text-gray-900">{project.name}</h3>
                          <div className="flex flex-wrap gap-2 my-1">
                            {project.technologies.map((tech, i) => (
                              <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {tech}
                              </span>
                            ))}
                          </div>
                          <p className="text-gray-700 text-sm">{project.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {initialCertifications.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-blue-800 border-b border-gray-200 pb-1 mb-3">CERTIFICATIONS</h2>
                    <ul className="space-y-2">
                      {initialCertifications.map((cert) => (
                        <li key={cert.id} className="text-gray-700">
                          <span className="font-medium">{cert.name}</span> - {cert.issuer} ({cert.date})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
