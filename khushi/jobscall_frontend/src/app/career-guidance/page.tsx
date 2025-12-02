import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TitleBar from '@/components/career-guidance/TitleBar';
import RecommendationWizard from '@/components/career-guidance/RecommendationWizard';

export const metadata: Metadata = {
  title: 'Career Guidance with Personalized Recommendations',
  description: 'Get personalized career recommendations based on your goals and skills',
};

export default function CareerGuidancePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <TitleBar />
        <div className="container mx-auto px-4 py-8">
          <RecommendationWizard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
