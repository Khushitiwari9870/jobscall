import { Metadata } from 'next';

interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  noIndex?: boolean;
  structuredData?: object;
}

export function generateSEOMetadata({
  title = "Jobs Call – India's Trusted Job Portal for Employers & Job Seekers",
  description = "Find your dream job with Jobs Call, India's trusted job portal connecting job seekers and employers across all industries. Explore the latest vacancies, walk-in interviews, and career opportunities near you today!",
  keywords = [
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
  ],
  canonical,
  ogImage = "/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  noIndex = false,
}: SEOConfig): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jobscall.com";
  const fullTitle = title.includes("Jobs Call") ? title : `${title} | Jobs Call`;
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : undefined;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: "Jobs Call" }],
    robots: noIndex ? "noindex,nofollow" : "index,follow",
    openGraph: {
      title: fullTitle,
      description,
      type: ogType as any,
      url: fullCanonical || siteUrl,
      siteName: "Jobs Call",
      images: [
        {
          url: `${siteUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "en_IN",
    },
    twitter: {
      card: twitterCard as any,
      title: fullTitle,
      description,
      images: [`${siteUrl}${ogImage}`],
      site: "@jobscall",
      creator: "@jobscall",
    },
    alternates: {
      canonical: fullCanonical,
    },
    other: {
      "theme-color": "#2563eb",
      "msapplication-TileColor": "#2563eb",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title": "Jobs Call",
    },
  };
}

// Structured Data Generators
export function generateJobPostingStructuredData(job: {
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: string;
  employmentType: string;
  datePosted: string;
  validThrough: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    identifier: {
      "@type": "PropertyValue",
      name: job.company,
      value: job.title,
    },
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "IN",
      },
    },
    ...(job.salary && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "INR",
        value: {
          "@type": "QuantitativeValue",
          value: job.salary,
        },
      },
    }),
    url: job.url,
  };
}

export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Jobs Call",
    description: "India's trusted job portal connecting job seekers and employers across all industries",
    url: "https://jobscall.com",
    logo: "https://jobscall.com/logo.png",
    sameAs: [
      "https://www.facebook.com/jobscall",
      "https://www.twitter.com/jobscall",
      "https://www.linkedin.com/company/jobscall",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-XXXXXXXXXX",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: "English",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressLocality: "Lucknow",
    },
  };
}

export function generateWebSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Jobs Call",
    description: "India's trusted job portal connecting job seekers and employers across all industries",
    url: "https://jobscall.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://jobscall.com/jobs?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Jobs Call",
      logo: {
        "@type": "ImageObject",
        url: "https://jobscall.com/logo.png",
      },
    },
  };
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
