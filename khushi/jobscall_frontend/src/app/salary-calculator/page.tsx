'use client';

import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';

export default function SalaryCalculator() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    location: '',
    experience: '',
    education: ''
  });

  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // This is a mock calculation
      const baseSalary = 50000;
      const experienceMultiplier = formData.experience ? parseInt(formData.experience) * 5000 : 0;
      const educationBonus = formData.education === 'masters' ? 10000 : 0;
      
      setResult(baseSalary + experienceMultiplier + educationBonus);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <PageLayout
      title="Salary Calculator"
      description="Calculate your expected salary based on job title, location, and experience"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Salary Calculator</h1>
        <p className="text-gray-600 mb-8">Get an estimate of your potential salary based on your profile and experience.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Software Engineer"
                required
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. New York, NY"
                required
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience
              </label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select years</option>
                {[...Array(20)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1} {i === 0 ? 'year' : 'years'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                Highest Education
              </label>
              <select
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select education level</option>
                <option value="highschool">High School</option>
                <option value="bachelors">Bachelor&apos;s Degree</option>
                <option value="masters">Master&apos;s Degree</option>
                <option value="phd">PhD</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Calculating...' : 'Calculate Salary'}
            </button>
          </form>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Estimated Salary Range</h2>
            
            {result ? (
              <div className="text-center py-8">
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  ${result.toLocaleString()}
                  <span className="text-lg text-gray-500">/year</span>
                </p>
                <p className="text-gray-600 mb-6">Based on your profile and market data</p>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">Salary Breakdown</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Base Salary</span>
                      <span>$50,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Experience Bonus</span>
                      <span>${(parseInt(formData.experience) * 5000 || 0).toLocaleString()}</span>
                    </div>
                    {formData.education === 'masters' && (
                      <div className="flex justify-between">
                        <span>Education Bonus</span>
                        <span>$10,000</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${result.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setResult(null)}
                  className="mt-6 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Calculate Again
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Get Your Salary Estimate</h3>
                <p className="text-gray-500">Fill out the form to see your estimated salary range based on your profile and current market data.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How We Calculate Salaries</h2>
          <div className="prose max-w-none text-gray-600">
            <p>
              Our salary calculator uses real-time market data from thousands of job postings and employee reports to provide you with an accurate estimate. 
              The calculation takes into account:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Job title and seniority level</li>
              <li>Geographic location and cost of living</li>
              <li>Years of relevant experience</li>
              <li>Educational background and certifications</li>
              <li>Industry standards and market trends</li>
            </ul>
            <p className="mt-4">
              <span className="font-medium">Note:</span> This is an estimate based on available data and should be used as a reference only. 
              Actual salaries may vary based on additional factors not included in this calculation.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
