// src/app/resume-services/page.tsx
import HeroBanner from '@/components/resume-services/HeroBanner';
import ResumeScore from '@/components/resume-services/ResumeScore';
import PremiumServices from '@/components/resume-services/PremiumServices';
import CareerGuides from '@/components/resume-services/CareerGuides';
import ExpertAssistance from '@/components/resume-services/ExpertAssistance';
import SuccessStories from '@/components/resume-services/SuccessStories';
import Footer from '@/components/resume-services/Footer';

export default function ResumeServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroBanner />
      <ResumeScore />
      <PremiumServices />
      <CareerGuides />
      <ExpertAssistance />
      <SuccessStories />
      <Footer />
    </div>
  );
}