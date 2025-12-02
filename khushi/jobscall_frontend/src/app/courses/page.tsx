import { Suspense } from 'react';
import Header from '@/components/courses/Header';
import FiltersBar from '@/components/courses/FiltersBar';
import CourseList from '@/components/courses/CourseList';
import AdvantageSection from '@/components/courses/AdvantageSection';
import Footer from '@/components/layout/Footer';

export default function CoursesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <FiltersBar />
          <Suspense fallback={<div>Loading courses...</div>}>
            <CourseList />
          </Suspense>
        </div>
        <AdvantageSection />
      </main>
      <Footer />
    </div>
  );
}
