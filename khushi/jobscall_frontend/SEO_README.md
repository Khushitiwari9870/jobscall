# Jobs Call SEO Configuration

## Environment Variables
Add these to your `.env.local` file:

```
NEXT_PUBLIC_SITE_URL=https://jobscall.com
NEXT_PUBLIC_SITE_NAME="Jobs Call"
NEXT_PUBLIC_SITE_DESCRIPTION="India's trusted job portal connecting job seekers and employers across all industries"
```

## SEO Checklist

### ✅ Completed
- [x] Meta titles and descriptions for all pages
- [x] Open Graph tags for social media sharing
- [x] Twitter Card tags
- [x] Structured data (JSON-LD) for Organization and Website
- [x] Breadcrumb structured data
- [x] Job posting structured data
- [x] Robots.txt file
- [x] Dynamic sitemap.xml
- [x] Canonical URLs
- [x] Meta keywords
- [x] Author and publisher information
- [x] Theme color and mobile app meta tags

### 🔄 Next Steps
- [ ] Create actual Open Graph image (1200x630px)
- [ ] Add Google Analytics and Search Console verification codes
- [ ] Implement dynamic job pages with structured data
- [ ] Add FAQ structured data
- [ ] Create blog post structured data
- [ ] Add company profile structured data
- [ ] Implement breadcrumbs component
- [ ] Add schema markup for reviews and ratings

## Usage Examples

### For Job Pages
```typescript
import { generateSEOMetadata, generateJobPostingStructuredData } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: "Software Engineer - TechCorp | Jobs Call",
  description: "Join TechCorp as a Software Engineer. Full-time position in Bangalore with competitive salary. Apply now!",
  keywords: ["software engineer", "techcorp", "bangalore jobs", "IT jobs"],
  canonical: "/jobs/software-engineer-techcorp",
});

// In component
const jobStructuredData = generateJobPostingStructuredData({
  title: "Software Engineer",
  description: "Join our team...",
  company: "TechCorp",
  location: "Bangalore, India",
  salary: "8-12 LPA",
  employmentType: "Full-time",
  datePosted: "2024-01-15",
  validThrough: "2024-02-15",
  url: "https://jobscall.com/jobs/software-engineer-techcorp"
});
```

### For Company Pages
```typescript
export const metadata: Metadata = generateSEOMetadata({
  title: "TechCorp Careers - Software Jobs in Bangalore | Jobs Call",
  description: "Explore career opportunities at TechCorp. View company profile, reviews, ratings, and open positions in Bangalore.",
  keywords: ["techcorp careers", "techcorp jobs", "bangalore companies"],
  canonical: "/companies/techcorp",
});
```

## Performance Considerations
- All metadata is generated at build time for static pages
- Dynamic pages use server-side rendering for SEO
- Structured data is embedded directly in HTML for faster indexing
- Images are optimized with Next.js Image component
- Canonical URLs prevent duplicate content issues

## Testing
- Use Google's Rich Results Test: https://search.google.com/test/rich-results
- Validate structured data with Schema.org validator
- Test Open Graph tags with Facebook Sharing Debugger
- Check Twitter Card preview with Twitter Card Validator
