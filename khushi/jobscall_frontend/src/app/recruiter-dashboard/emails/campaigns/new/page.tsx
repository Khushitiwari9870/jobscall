// src/app/recruiter-dashboard/emails/campaigns/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiFileText, FiChevronRight } from 'react-icons/fi';

interface Template {
  id: number;
  name: string;
  subject: string;
  content: string;
}

const emailTemplates: Template[] = [
  {
    id: 1,
    name: 'Initial Outreach',
    subject: 'Exciting Opportunity at Our Company',
    content: 'Hello {candidate_name},\n\nWe came across your profile and think you would be a great fit for our {job_title} position at {company_name}...'
  },
  {
    id: 2,
    name: 'Interview Invitation',
    subject: 'Interview Invitation for {job_title} at {company_name}',
    content: 'Dear {candidate_name},\n\nThank you for your interest in the {job_title} position...'
  },
  {
    id: 3,
    name: 'Follow Up',
    subject: 'Following up on your application for {job_title}',
    content: 'Hi {candidate_name},\n\nI wanted to follow up regarding your application for the {job_title} position...'
  }
];

export default function NewEmailCampaign() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [campaign, setCampaign] = useState({
    name: '',
    templateId: '',
    subject: '',
    content: '',
    recipientGroup: 'all', // 'all', 'saved_search', 'custom'
    savedSearchId: '',
    customRecipients: '',
    scheduleType: 'now', // 'now' or 'later'
    scheduledTime: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCampaign(prev => ({ ...prev, [name]: value }));
  };

  const handleTemplateSelect = (template: Template) => {
    setCampaign(prev => ({
      ...prev,
      templateId: template.id.toString(),
      subject: template.subject,
      content: template.content
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In a real app, you would send this data to your API
      const response = await fetch('/api/v1/alerts/deliveries/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: campaign.name,
          subject: campaign.subject,
          content: campaign.content,
          recipient_type: campaign.recipientGroup,
          scheduled_at: campaign.scheduleType === 'later' ? campaign.scheduledTime : null,
          // Add other necessary fields based on your API
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      // Redirect to campaigns list on success
      router.push('/recruiter-dashboard/emails/campaigns');
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError('Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <div className="flex items-center">
                  <Link href="/recruiter-dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                    Dashboard
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <FiChevronRight className="h-5 w-5 text-gray-400" />
                  <Link href="/recruiter-dashboard/emails" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                    Emails
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <FiChevronRight className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-500">New Campaign</span>
                </div>
              </li>
            </ol>
          </nav>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">Create New Email Campaign</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step === stepNum
                      ? 'bg-blue-600 text-white'
                      : step > stepNum
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNum}
                </div>
                <span className="mt-2 text-sm font-medium text-gray-700">
                  {stepNum === 1 ? 'Template' : stepNum === 2 ? 'Recipients' : 'Schedule'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 h-1 bg-gray-200 rounded-full">
            <div
              className="h-1 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Step 1: Choose Template */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Choose a template</h2>
              
              <div>
                <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700">
                  Campaign Name
                </label>
                <input
                  type="text"
                  id="campaignName"
                  name="name"
                  value={campaign.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="E.g., Senior Developer Outreach"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {emailTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors ${
                      campaign.templateId === template.id.toString() ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{template.subject}</p>
                    <div className="mt-2 text-xs text-blue-600">Preview</div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700">Or start from scratch</h3>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCampaign(prev => ({
                        ...prev,
                        templateId: 'custom',
                        subject: '',
                        content: ''
                      }));
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FiFileText className="mr-2 h-4 w-4" />
                    Create Custom Email
                  </button>
                </div>
              </div>

              {campaign.templateId === 'custom' && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={campaign.subject}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Email subject"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      Email Content
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      rows={8}
                      value={campaign.content}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Write your email content here..."
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      You can use variables like {"{candidate_name}"}, {"{job_title}"}, {"{company_name}"}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!campaign.templateId}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    campaign.templateId
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next: Select Recipients
                  <FiChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select Recipients */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Select Recipients</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="all-candidates"
                    name="recipientGroup"
                    type="radio"
                    value="all"
                    checked={campaign.recipientGroup === 'all'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="all-candidates" className="ml-3 block text-sm font-medium text-gray-700">
                    All Candidates
                  </label>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="saved-search"
                      name="recipientGroup"
                      type="radio"
                      value="saved_search"
                      checked={campaign.recipientGroup === 'saved_search'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="saved-search" className="font-medium text-gray-700">
                      Saved Search
                    </label>
                    <select
                      id="savedSearchId"
                      name="savedSearchId"
                      value={campaign.savedSearchId}
                      onChange={handleChange}
                      disabled={campaign.recipientGroup !== 'saved_search'}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Select a saved search</option>
                      <option value="frontend">Frontend Developers</option>
                      <option value="backend">Backend Developers</option>
                      <option value="fullstack">Full Stack Developers</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="custom-recipients"
                      name="recipientGroup"
                      type="radio"
                      value="custom"
                      checked={campaign.recipientGroup === 'custom'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                  </div>
                  <div className="ml-3 text-sm flex-1">
                    <label htmlFor="custom-recipients" className="font-medium text-gray-700">
                      Custom List
                    </label>
                    <textarea
                      id="customRecipients"
                      name="customRecipients"
                      rows={4}
                      value={campaign.customRecipients}
                      onChange={handleChange}
                      disabled={campaign.recipientGroup !== 'custom'}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter email addresses, one per line"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter one email address per line
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FiChevronRight className="h-4 w-4 transform rotate-180 mr-2" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Next: Schedule
                  <FiChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Schedule */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Schedule Your Campaign</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="send-now"
                    name="scheduleType"
                    type="radio"
                    value="now"
                    checked={campaign.scheduleType === 'now'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="send-now" className="ml-3 block text-sm font-medium text-gray-700">
                    Send immediately
                  </label>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="schedule-later"
                      name="scheduleType"
                      type="radio"
                      value="later"
                      checked={campaign.scheduleType === 'later'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="schedule-later" className="font-medium text-gray-700">
                      Schedule for later
                    </label>
                    <input
                      type="datetime-local"
                      id="scheduledTime"
                      name="scheduledTime"
                      value={campaign.scheduledTime}
                      onChange={handleChange}
                      disabled={campaign.scheduleType !== 'later'}
                      className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 mt-8">
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-blue-800">Campaign Summary</h3>
                  <dl className="mt-2 grid grid-cols-2 gap-4 text-sm text-blue-700">
                    <div>
                      <dt className="font-medium">Template</dt>
                      <dd className="mt-1">
                        {emailTemplates.find(t => t.id.toString() === campaign.templateId)?.name || 'Custom'}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium">Recipients</dt>
                      <dd className="mt-1">
                        {campaign.recipientGroup === 'all' && 'All Candidates'}
                        {campaign.recipientGroup === 'saved_search' && 'Saved Search'}
                        {campaign.recipientGroup === 'custom' && 'Custom List'}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium">Scheduled</dt>
                      <dd className="mt-1">
                        {campaign.scheduleType === 'now' 
                          ? 'Send immediately' 
                          : new Date(campaign.scheduledTime).toLocaleString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FiChevronRight className="h-4 w-4 transform rotate-180 mr-2" />
                  Back
                </button>
                <div className="space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {loading ? 'Sending...' : 'Send Campaign'}
                    {!loading && <FiMail className="ml-2 h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}