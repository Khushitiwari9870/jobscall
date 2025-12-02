'use client';

import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiHelpCircle, FiMail, FiPhone } from 'react-icons/fi';

type FAQItem = {
  question: string;
  answer: string;
  category: string;
};

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const faqs: FAQItem[] = [
    {
      question: 'How do I create an account?',
      answer: 'To create an account, click on the "Sign Up" button in the top right corner and follow the registration process. You\'ll need to provide your email address and create a password.',
      category: 'account'
    },
    {
      question: 'How can I post a job?',
      answer: 'After logging in, navigate to your employer dashboard and click on "Post a Job". Fill in the required details about the position and submit for review.',
      category: 'employer'
    },
    {
      question: 'How do I apply for a job?',
      answer: 'Find a job you\'re interested in, click on the "Apply Now" button, and follow the application process. Make sure your profile is complete before applying.',
      category: 'jobseeker'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for our premium services.',
      category: 'billing'
    },
    {
      question: 'How can I edit my profile?',
      answer: 'Log in to your account, go to "My Profile" and click on the edit icon. Make your changes and remember to save them.',
      category: 'account'
    },
    {
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your email to reset your password.',
      category: 'account'
    },
  ];

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'account', name: 'Account' },
    { id: 'jobseeker', name: 'Job Seekers' },
    { id: 'employer', name: 'Employers' },
    { id: 'billing', name: 'Billing' }
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FiHelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">Find answers to common questions about our platform</p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-12">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleAccordion(index)}
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                {activeIndex === index ? (
                  <FiChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {activeIndex === index && (
                <div className="px-6 pb-4 pt-0 text-gray-600">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
            <p className="text-gray-600 mb-6">Our support team is here to help you with any questions you might have.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="mailto:support@jobscall.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                <FiMail className="mr-2" /> Email Support
              </a>
              <a
                href="tel:+18005551234"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <FiPhone className="mr-2" /> Call Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
