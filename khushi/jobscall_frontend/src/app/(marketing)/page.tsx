'use client';

import Header from '@/components/marketing/Header';
import SearchHero from '@/components/marketing/SearchHero';
import CTASection from '@/components/marketing/CTASection';
import Footer from '@/components/marketing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <SearchHero />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
