'use client';

import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const faqs = [
  {
    question: 'Why set up a free job alert?',
    answer: 'Setting up a free job alert helps you stay updated with the latest job opportunities that match your skills and preferences. You\'ll receive email notifications for new job postings, saving you time and effort in your job search.'
  },
  {
    question: 'How do I get a job alert on my email ID?',
    answer: 'Simply fill out the job alert form with your preferences (keywords, location, experience, etc.) and your email address. Click "Create Job Alert" and verify your email address if required. You\'ll start receiving job alerts based on your criteria.'
  },
  {
    question: 'How to get the best out of a free job alert?',
    answer: 'To get the most relevant job alerts: 1) Be specific with your job titles and skills, 2) Set your preferred locations, 3) Choose appropriate experience levels, 4) Update your preferences regularly, and 5) Keep your profile updated with the latest skills and experience.'
  },
  {
    question: 'Who can see my information provided to set up a job alert?',
    answer: 'Your personal information is kept confidential and is only used to send you relevant job alerts. We do not share your email address or personal details with employers without your permission. You can review our Privacy Policy for more details on how we handle your data.'
  },
  {
    question: 'Can I edit or delete my job alerts?',
    answer: 'Yes, you can manage your job alerts at any time by logging into your account. From there, you can edit your search criteria, pause alerts, or delete alerts you no longer need.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Free Job Alerts FAQs</h3>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <button
              className="flex justify-between items-center w-full text-left text-gray-700 hover:text-purple-700 focus:outline-none"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-${index}`}
            >
              <span className="font-medium">{faq.question}</span>
              {openIndex === index ? (
                <FiChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <FiChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {openIndex === index && (
              <div id={`faq-${index}`} className="mt-2 text-gray-600 text-sm">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-purple-50 rounded-md">
        <h4 className="font-medium text-purple-800 mb-2">Need Help?</h4>
        <p className="text-sm text-purple-700">
          If you have any questions about setting up job alerts, feel free to contact our support team.
        </p>
        <button className="mt-3 text-sm text-purple-600 hover:text-purple-800 font-medium">
          Contact Support
        </button>
      </div>
    </div>
  );
}
