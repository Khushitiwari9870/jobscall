// src/components/resume-services/PremiumServices.tsx
'use client';

import { PremiumService } from '@/types/resume-services';
import { premiumServices } from '@/data/resume-services';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

function PremiumServiceCard({ service }: { service: PremiumService }) {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${service.popular ? 'ring-2 ring-yellow-400' : ''}`}>
      {service.popular && (
        <div className="bg-yellow-400 text-center py-1 text-sm font-medium">
          MOST POPULAR
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
        <p className="text-gray-600 mb-6">{service.description}</p>
        <div className="text-3xl font-bold text-gray-900 mb-6">{service.price}</div>
        
        <ul className="space-y-3 mb-8">
          {service.features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="space-y-3">
          <Button className="w-full" size="lg">
            {service.buttonText}
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            Talk to Expert <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PremiumServices() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Increase Your Recruiter Reach By 10x
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get noticed by top recruiters with our premium services
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {premiumServices.map((service) => (
            <PremiumServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}