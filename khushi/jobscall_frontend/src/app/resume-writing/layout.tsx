import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Professional Resume Writing Service | JobScall',
  description: 'Get a professionally written, ATS-optimized resume that helps you land more interviews. Our expert writers craft resumes that highlight your skills and experience.',
  keywords: 'resume writing service, professional resume, ATS resume, resume writer, job search, career services',
  openGraph: {
    title: 'Professional Resume Writing Service | JobScall',
    description: 'Get a professionally written, ATS-optimized resume that helps you land more interviews.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'JobScall',
  },
};

export default function ResumeWritingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {children}
    </div>
  );
}
