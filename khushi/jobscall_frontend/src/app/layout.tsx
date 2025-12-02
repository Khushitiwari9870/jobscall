import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import Navbar from '@/components/layout/Navbar';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { AuthProvider } from '@/contexts/AuthContext';
import { generateOrganizationStructuredData, generateWebSiteStructuredData } from '@/lib/seo';

// Initialize Geist fonts
const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: {
    default: "Jobscall – Find Your Next Opportunity",
    template: "%s | Jobscall",
  },
  description: "Search thousands of jobs, internships, and career opportunities at Jobscall. Apply easily and get hired faster.",
  keywords: [
    "jobs in India",
    "Lucknow jobs",
    "healthcare jobs",
    "teaching jobs",
    "pharma jobs",
    "IT jobs",
    "government jobs",
    "walk-in jobs",
    "fresher jobs",
    "experienced jobs",
    "recruiter platform",
    "job portal India",
    "career opportunities",
    "employment",
    "hiring",
    "job search",
    "job vacancies",
    "walk-in interviews",
    "job alerts",
    "resume builder",
  ],
  authors: [{ name: "Jobscall" }],
  creator: "Jobscall",
  publisher: "Jobscall",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Jobscall – Find Your Next Opportunity",
    description: "Discover new job opportunities tailored for you.",
    url: "https://jobscall.in",
    siteName: "Jobscall",
    images: [
      {
        url: "https://jobscall.in/logo.png",
        width: 800,
        height: 600,
        alt: "Jobscall Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jobscall – Find Your Next Opportunity",
    description: "Find jobs, internships, and opportunities that fit your goals.",
    images: ["https://jobscall.in/logo.png"],
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://jobscall.in",
  },
  other: {
    "theme-color": "#2563eb",
    "msapplication-TileColor": "#2563eb",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Jobscall",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationStructuredData = generateOrganizationStructuredData();
  const websiteStructuredData = generateWebSiteStructuredData();

  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.className} ${geistMono.className} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pt-16">
            <div className="container mx-auto px-4 py-4">
              <Breadcrumb />
            </div>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
