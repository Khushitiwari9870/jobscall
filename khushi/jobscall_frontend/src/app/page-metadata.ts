import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Jobscall – Find Your Next Opportunity",
  description: "Search thousands of jobs, internships, and career opportunities at Jobscall. Apply easily and get hired faster.",
  openGraph: {
    title: "Jobscall – Find Your Next Opportunity",
    description: "Discover new job opportunities tailored for you.",
    url: "https://jobscall.in",
    siteName: "Jobscall",
    images: [
      {
        url: "https://jobscall.in/logo.png", // change this to your logo URL
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
    images: ["https://jobscall.in/logo.png"], // your logo or banner image
  },
};


