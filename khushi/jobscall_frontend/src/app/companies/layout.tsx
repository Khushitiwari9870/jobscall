import { generateSEOMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: "Top Companies Hiring - Find Your Dream Company | Jobs Call",
  description: "Discover top companies hiring in India. Browse company profiles, ratings, reviews, and open positions. Find your ideal workplace with Jobs Call's comprehensive company directory.",
  keywords: [
    "top companies India",
    "company profiles",
    "employer reviews",
    "company ratings",
    "hiring companies",
    "best companies to work",
    "company directory",
    "employer profiles",
    "company culture",
    "job opportunities",
  ],
  canonical: "/companies",
  ogType: "website",
});

export default function CompaniesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
