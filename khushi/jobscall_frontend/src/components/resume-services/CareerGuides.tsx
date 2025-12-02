// src/components/resume-services/CareerGuides.tsx
'use client';

import { careerGuides } from '@/data/resume-services';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';

export default function CareerGuides() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Free Career Guides & Resources
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Download our expert-curated resources to boost your career
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerGuides.map((guide) => (
            <div key={guide.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="text-4xl mb-4">{guide.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{guide.title}</h3>
                <p className="text-gray-600 mb-6">{guide.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{guide.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    <span>{guide.downloads.toLocaleString()} downloads</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Download Guide
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            View All Resources
          </Button>
        </div>
      </div>
    </section>
  );
}