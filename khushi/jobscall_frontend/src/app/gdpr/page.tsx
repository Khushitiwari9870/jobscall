'use client';

import { useState } from 'react';
import { FiDownload, FiMail, FiPhone, FiLock, FiUser, FiTrash2, FiEdit3, FiCheck, FiChevronDown } from 'react-icons/fi';

type Right = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

type DataCategory = {
  id: string;
  name: string;
  description: string;
  purpose: string;
  retention: string;
};

export default function GDPRPage() {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedRights, setExpandedRights] = useState<Record<string, boolean>>({});
  const [requestStatus, setRequestStatus] = useState<{[key: string]: 'idle' | 'success' | 'error' | 'loading'}>({});

  const rights: Right[] = [
    {
      id: 'access',
      title: 'Right to Access',
      description: 'You have the right to request copies of your personal data.',
      icon: <FiDownload className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'rectification',
      title: 'Right to Rectification',
      description: 'You have the right to request correction of any information you believe is inaccurate.',
      icon: <FiEdit3 className="w-6 h-6 text-green-600" />
    },
    {
      id: 'erasure',
      title: 'Right to Erasure',
      description: 'You have the right to request erasure of your personal data under certain conditions.',
      icon: <FiTrash2 className="w-6 h-6 text-red-600" />
    },
    {
      id: 'restrict',
      title: 'Right to Restrict Processing',
      description: 'You have the right to request restriction of processing your personal data.',
      icon: <FiLock className="w-6 h-6 text-yellow-600" />
    },
    {
      id: 'object',
      title: 'Right to Object',
      description: 'You have the right to object to our processing of your personal data.',
      icon: <FiUser className="w-6 h-6 text-purple-600" />
    },
    {
      id: 'portability',
      title: 'Right to Data Portability',
      description: 'You have the right to request transfer of your data to another organization.',
      icon: <FiDownload className="w-6 h-6 text-indigo-600" />
    }
  ];

  const dataCategories: DataCategory[] = [
    {
      id: 'account',
      name: 'Account Information',
      description: 'Your name, email, contact details, and account settings.',
      purpose: 'To create and manage your account, provide services, and communicate with you.',
      retention: 'Until account deletion or 2 years of inactivity'
    },
    {
      id: 'profile',
      name: 'Profile Data',
      description: 'Your professional information, skills, work experience, and education.',
      purpose: 'To match you with relevant job opportunities and enhance your profile.',
      retention: 'Until account deletion or 2 years of inactivity'
    },
    {
      id: 'usage',
      name: 'Usage Data',
      description: 'Information about how you use our platform and services.',
      purpose: 'To improve our services and user experience.',
      retention: '24 months'
    },
    {
      id: 'marketing',
      name: 'Marketing Preferences',
      description: 'Your preferences for receiving marketing communications.',
      purpose: 'To send you relevant offers and updates (with your consent).',
      retention: 'Until consent is withdrawn'
    }
  ];

  const handleRequest = (rightId: string) => {
    setRequestStatus(prev => ({ ...prev, [rightId]: 'loading' }));
    
    // Simulate API call
    setTimeout(() => {
      setRequestStatus(prev => ({ ...prev, [rightId]: 'success' }));
      // Reset status after 3 seconds
      setTimeout(() => {
        setRequestStatus(prev => ({ ...prev, [rightId]: 'idle' }));
      }, 3000);
    }, 1000);
  };

  const toggleRight = (rightId: string) => {
    setExpandedRights(prev => ({
      ...prev,
      [rightId]: !prev[rightId]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">GDPR Compliance</h1>
          <p className="text-xl md:text-2xl max-w-3xl">Your data protection rights and how we handle your personal information</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h2 className="font-semibold text-lg mb-4 text-gray-800">Sections</h2>
              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'rights', label: 'Your Rights' },
                  { id: 'data', label: 'Data We Collect' },
                  { id: 'cookies', label: 'Cookies' },
                  { id: 'contact', label: 'Contact DPO' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">GDPR Compliance Overview</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">
                    At Jobscall, we are committed to protecting your personal data and respecting your privacy in compliance with the General Data Protection Regulation (GDPR) and other applicable data protection laws.
                  </p>
                  <p className="text-gray-700 mb-6">
                    This page explains your rights under GDPR and provides information about how we collect, use, and protect your personal data.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Our Commitment</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
                    <li>We only collect data that is necessary for providing our services</li>
                    <li>We are transparent about how we use your data</li>
                    <li>We implement appropriate security measures to protect your data</li>
                    <li>We respect your rights regarding your personal information</li>
                  </ul>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                    <p className="text-blue-700">
                      <strong>Note:</strong> This page is for informational purposes only and does not constitute legal advice. 
                      For specific questions about your rights, please consult with a legal professional.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Your Rights Section */}
            {activeSection === 'rights' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Data Protection Rights</h2>
                <p className="text-gray-700 mb-6">
                  Under GDPR, you have several important rights regarding your personal data. Click on each right to learn more and take action.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rights.map((right) => (
                    <div 
                      key={right.id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => toggleRight(right.id)}
                        className="w-full p-4 text-left flex items-start justify-between focus:outline-none"
                      >
                        <div className="flex items-start">
                          <div className="mr-4 mt-1">
                            {right.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{right.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{right.description}</p>
                          </div>
                        </div>
                        <FiChevronDown 
                          className={`w-5 h-5 text-gray-400 transition-transform ${expandedRights[right.id] ? 'transform rotate-180' : ''}`} 
                        />
                      </button>
                      
                      {expandedRights[right.id] && (
                        <div className="px-4 pb-4 pt-0">
                          <button
                            onClick={() => handleRequest(right.id)}
                            disabled={requestStatus[right.id] === 'loading'}
                            className={`w-full mt-2 px-4 py-2 rounded-md text-sm font-medium ${
                              requestStatus[right.id] === 'success'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            } transition-colors flex items-center justify-center`}
                          >
                            {requestStatus[right.id] === 'loading' ? (
                              'Processing...'
                            ) : requestStatus[right.id] === 'success' ? (
                              <>
                                <FiCheck className="mr-2" /> Request Submitted
                              </>
                            ) : (
                              `Request ${right.title}`
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data We Collect Section */}
            {activeSection === 'data' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Data We Collect</h2>
                <p className="text-gray-700 mb-6">
                  We collect various types of personal data to provide and improve our services. Below is an overview of the categories of data we collect and how we use them.
                </p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retention</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dataCategories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{category.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{category.description}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{category.purpose}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.retention}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Data Security</h3>
                  <p className="text-sm text-gray-600">
                    We implement appropriate technical and organizational measures to ensure a level of security 
                    appropriate to the risk, including encryption, access controls, and regular security assessments.
                  </p>
                </div>
              </div>
            )}

            {/* Cookies Section */}
            {activeSection === 'cookies' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookie Policy</h2>
                <p className="text-gray-700 mb-6">
                  We use cookies and similar tracking technologies to enhance your experience on our website.
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Essential Cookies</h3>
                    <p className="text-sm text-blue-700">
                      These cookies are necessary for the website to function and cannot be switched off.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Analytics Cookies</h3>
                    <p className="text-sm text-gray-700 mb-4">
                      These cookies help us understand how visitors interact with our website.
                    </p>
                    <button 
                      onClick={() => window.location.href = '/cookies'}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Manage Cookie Preferences →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Contact DPO Section */}
            {activeSection === 'contact' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Our Data Protection Officer</h2>
                <p className="text-gray-700 mb-6">
                  If you have any questions about our data protection practices or wish to exercise your rights, 
                  please contact our Data Protection Officer using the information below.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-blue-100 rounded-full mr-4">
                        <FiMail className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Email</h3>
                        <a href="mailto:dpo@jobscall.com" className="text-blue-600 hover:underline">dpo@jobscall.com</a>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      For general inquiries about your data protection rights
                    </p>
                  </div>
                  
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-green-100 rounded-full mr-4">
                        <FiPhone className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Phone</h3>
                        <a href="tel:+18005551234" className="text-blue-600 hover:underline">+1 (800) 555-1234</a>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Monday to Friday, 9:00 AM to 5:00 PM (EST)
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">Data Protection Authority</h3>
                  <p className="text-gray-700 mb-4">
                    If you believe that we have not complied with data protection laws, you have the right to lodge a complaint 
                    with your local data protection authority.
                  </p>
                  <a 
                    href="#" 
                    className="inline-flex items-center text-blue-600 hover:underline"
                  >
                    Find your local DPA →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-300">© {new Date().getFullYear()} Jobscall. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</a>
              <a href="/terms" className="text-gray-300 hover:text-white">Terms of Service</a>
              <a href="/cookies" className="text-gray-300 hover:text-white">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
