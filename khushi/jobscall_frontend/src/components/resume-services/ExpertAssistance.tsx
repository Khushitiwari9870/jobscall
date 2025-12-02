// src/components/resume-services/ExpertAssistance.tsx
'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle, CheckCircle, Users, Clock } from 'lucide-react';

export default function ExpertAssistance() {
  const features = [
    {
      icon: <MessageCircle className="h-6 w-6 text-blue-600" />,
      title: "1:1 Career Consultation",
      description: "Get personalized advice from our career experts"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      title: "Resume Review",
      description: "Get detailed feedback on your resume from industry professionals"
    },
    {
      icon: <Users className="h-6 w-6 text-purple-600" />,
      title: "Mock Interviews",
      description: "Practice with experts to ace your next interview"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Get Expert Career Assistance
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Connect with our career experts to get personalized guidance and support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Book a Session</h3>
              <p className="text-gray-600 mb-6">
                Schedule a 1:1 session with our career experts to get personalized guidance
                on your job search, resume, or interview preparation.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "30-minute or 60-minute sessions",
                  "Expert career coaches",
                  "Flexible scheduling",
                  "Personalized action plan"
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" className="w-full md:w-auto">
                Book Now
              </Button>
            </div>
            <div className="bg-gray-50 p-8 md:p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Available Slots</h4>
                <p className="text-gray-600 mb-6">Monday - Friday, 9:00 AM - 8:00 PM</p>
                <div className="inline-flex space-x-2">
                  {['30 min', '45 min', '60 min'].map((duration) => (
                    <Button key={duration} variant="outline">
                      {duration}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}