// src/components/resume-services/HeroBanner.tsx
'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function HeroBanner() {
  return (
    <section className="bg-gradient-to-r from-purple-50 to-blue-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Post-Appraisal Retention Tactics
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Learn how to retain your top talent after appraisal season with our expert strategies 
              and proven techniques for employee satisfaction and engagement.
            </p>
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white">
              Download Now
            </Button>
          </div>
          <div className="relative h-80 md:h-96">
            <Image
              src="/images/resume-hero.svg"
              alt="Resume Services"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}