'use client';

import { useState, useEffect } from 'react';
import { FiInfo, FiChevronDown } from 'react-icons/fi';

type CookieType = {
  id: string;
  name: string;
  description: string;
  defaultChecked: boolean;
  required: boolean;
};

export default function CookiesPage() {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [cookies, setCookies] = useState<CookieType[]>([
    {
      id: 'necessary',
      name: 'Strictly Necessary Cookies',
      description: 'These cookies are essential for the website to function properly. They enable core functionality and security features.',
      defaultChecked: true,
      required: true
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      defaultChecked: true,
      required: false
    },
    {
      id: 'preferences',
      name: 'Preference Cookies',
      description: 'These cookies allow the website to remember choices you make and provide enhanced, more personal features.',
      defaultChecked: true,
      required: false
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      description: 'These cookies are used to track visitors across websites to display more relevant advertisements.',
      defaultChecked: false,
      required: false
    }
  ]);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const updatedCookies = cookies.map(cookie => ({
      ...cookie,
      defaultChecked: true
    }));
    setCookies(updatedCookies);
    savePreferences(updatedCookies);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    savePreferences(cookies);
    setShowBanner(false);
  };

  const savePreferences = (selectedCookies: CookieType[]) => {
    const preferences = selectedCookies.reduce((acc, cookie) => {
      acc[cookie.id] = cookie.defaultChecked;
      return acc;
    }, {} as Record<string, boolean>);
    
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    // Here you would typically set the actual cookies based on user preferences
  };

  const toggleCookie = (id: string) => {
    setCookies(cookies.map(cookie => 
      cookie.id === id && !cookie.required 
        ? { ...cookie, defaultChecked: !cookie.defaultChecked } 
        : cookie
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FiInfo className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-8">
            <p className="text-gray-700 mb-6">
              We use cookies and similar technologies to provide and improve our services, personalize content, and analyze site traffic. 
              By clicking &ldquo;Accept All&rdquo;, you consent to the use of all cookies. You can manage your preferences below.
            </p>

            <div className="mb-8">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center text-blue-600 font-medium mb-4"
              >
                {showDetails ? 'Hide cookie details' : 'Show cookie details'}
                <FiChevronDown className={`ml-2 transition-transform ${showDetails ? 'transform rotate-180' : ''}`} />
              </button>

              {showDetails && (
                <div className="space-y-4">
                  {cookies.map((cookie) => (
                    <div key={cookie.id} className="flex items-start p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-900">{cookie.name}</h3>
                          {cookie.required && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                              Always Active
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{cookie.description}</p>
                      </div>
                      {!cookie.required && (
                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={cookie.defaultChecked}
                            onChange={() => toggleCookie(cookie.id)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                onClick={() => setShowBanner(false)}
                className="px-6 py-3 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reject All
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="prose prose-blue max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Cookies</h2>
          <p className="text-gray-700 mb-4">
            Cookies are small text files that are stored on your device when you visit our website. They help us understand how you interact with our site and improve your experience.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Types of Cookies We Use</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
            <li><strong>Strictly Necessary:</strong> Essential for the website to function properly.</li>
            <li><strong>Analytics:</strong> Help us understand how visitors use our site.</li>
            <li><strong>Preference:</strong> Remember your settings and preferences.</li>
            <li><strong>Marketing:</strong> Used to deliver relevant advertisements.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Managing Cookies</h3>
          <p className="text-gray-700 mb-4">
            You can manage your cookie preferences at any time by clicking on the &ldquo;Cookie Settings&rdquo; link in the footer of our website. 
            You can also control cookies through your browser settings. However, please note that disabling certain cookies may affect your experience on our site.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Contact Us</h3>
          <p className="text-gray-700">
            If you have any questions about our use of cookies, please contact us at{' '}
            <a href="mailto:privacy@jobscall.com" className="text-blue-600 hover:underline">privacy@jobscall.com</a>.
          </p>
        </div>
      </div>

      {/* Cookie Consent Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex-1 mb-4 md:mb-0 md:mr-6">
                <p className="text-sm text-gray-700">
                  We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies.
                  <a href="/cookies" className="text-blue-600 hover:underline ml-1">Learn more</a>
                </p>
              </div>
              <div className="flex-shrink-0 flex space-x-3">
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Customize
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
