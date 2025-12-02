'use client';

import { FiUserPlus, FiBell } from 'react-icons/fi';

export default function CTASection() {
  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Job Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-6 flex items-start">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <FiUserPlus className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Create Job Profile</h3>
              <p className="text-sm text-gray-500 mb-4">Let recruiters find you and get job alerts</p>
              <button className="text-purple-700 hover:text-purple-800 text-sm font-medium">
                Create Profile →
              </button>
            </div>
          </div>

          {/* Create Job Alert Card */}
          <div className="bg-white rounded-lg shadow-md p-6 flex items-start">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FiBell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Create Job Alert</h3>
              <p className="text-sm text-gray-500 mb-4">Get notified when new jobs match your profile</p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Create Alert →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
