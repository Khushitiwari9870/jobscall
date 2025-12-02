// src/components/resume-services/ResumeScore.tsx
'use client';

import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

export default function ResumeScore() {
  const score = 78; // Example score, you can make this dynamic

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get Your Resume Score
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload your resume to get a free, detailed analysis and improve your chances of getting hired
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">{score}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                    Good
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Resume Score</h3>
                  <p className="text-gray-600">Better than 65% of profiles</p>
                  <div className="flex mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'ATS Compatibility', value: 85 },
                  { label: 'Skills Match', value: 72 },
                  { label: 'Experience', value: 65 },
                  { label: 'Education', value: 90 },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <Progress value={item.value} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Upload Your Resume</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <button className="text-blue-600 font-medium">Click to upload</button> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX (max. 5MB)</p>
              </div>
              <Button className="w-full mt-6" size="lg">
                Get Your Free Score
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}