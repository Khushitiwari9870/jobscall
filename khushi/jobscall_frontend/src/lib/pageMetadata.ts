import { Metadata } from 'next';

interface PageSEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  structuredData?: object;
}

export function createPageMetadata({
  title,
  description,
  keywords = [],
  canonical,
  ogImage = "/og-image.jpg",
  ogType = "website",
  noIndex = false,
}: PageSEOProps): Metadata {
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
      card: "summary_large_image",
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

// Common page metadata templates
export const pageMetadataTemplates = {
  jobListing: (jobTitle: string, company: string, location: string) => 
    createPageMetadata({
      title: `${jobTitle} - ${company} | Jobs Call`,
      description: `Apply for ${jobTitle} position at ${company} in ${location}. View job details, requirements, and apply now on Jobs Call.`,
      keywords: [jobTitle.toLowerCase(), company.toLowerCase(), `${location.toLowerCase()} jobs`, "job opportunities"],
      canonical: `/jobs/${jobTitle.toLowerCase().replace(/\s+/g, '-')}-${company.toLowerCase().replace(/\s+/g, '-')}`,
    }),

  companyProfile: (companyName: string, industry: string, location: string) =>
    createPageMetadata({
      title: `${companyName} Careers - ${industry} Jobs in ${location} | Jobs Call`,
      description: `Explore career opportunities at ${companyName}. View company profile, reviews, ratings, and open ${industry} positions in ${location}.`,
      keywords: [`${companyName.toLowerCase()} careers`, `${companyName.toLowerCase()} jobs`, `${industry.toLowerCase()} jobs`, `${location.toLowerCase()} companies`],
      canonical: `/companies/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
    }),

  blogPost: (postTitle: string, excerpt: string, author: string) =>
    createPageMetadata({
      title: `${postTitle} | Jobs Call Blog`,
      description: excerpt,
      keywords: ["career advice", "job search tips", "employment", "career development"],
      canonical: `/blog/${postTitle.toLowerCase().replace(/\s+/g, '-')}`,
      ogType: "article",
    }),

  categoryPage: (category: string, location?: string) =>
    createPageMetadata({
      title: `${category} Jobs${location ? ` in ${location}` : ''} | Jobs Call`,
      description: `Find ${category.toLowerCase()} jobs${location ? ` in ${location}` : ''}. Browse latest ${category.toLowerCase()} job opportunities and apply today.`,
      keywords: [`${category.toLowerCase()} jobs`, location ? `${location.toLowerCase()} jobs` : '', "job opportunities", "career"],
      canonical: `/jobs/${category.toLowerCase().replace(/\s+/g, '-')}${location ? `-${location.toLowerCase().replace(/\s+/g, '-')}` : ''}`,
    }),
};
