import Image from 'next/image';
import Link from 'next/link';
import { generateSEOMetadata, generateBreadcrumbStructuredData } from '@/lib/seo';
import { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: "About Jobs Call - India's Leading Job Portal & Career Platform",
  description: "Learn about Jobs Call, India's trusted job portal connecting job seekers and employers since 2023. Discover our mission, vision, leadership team, and comprehensive career services.",
  keywords: [
    "about jobs call",
    "job portal India",
    "career platform",
    "recruitment services",
    "job matching",
    "career guidance",
    "employment solutions",
    "job portal company",
    "career development",
    "talent acquisition",
  ],
  canonical: "/about",
  ogType: "website",
});

export default function AboutPage() {
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: "Home", url: "https://jobscall.com" },
    { name: "About Us", url: "https://jobscall.com/about" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About JobCall</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Connecting top talent with leading companies to build successful careers and businesses since 2023.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">

          {/* Company Overview */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                JobCall was founded in 2023 with a vision to bridge the gap between talent and opportunity. We started as an innovative job platform and have grown into a comprehensive career development and recruitment solutions provider serving clients across various industries.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Our journey began when our founders recognized the challenges both job seekers and employers faced in finding the right match. Traditional recruitment methods were time-consuming, expensive, and often ineffective. We set out to revolutionize this process using innovative technology and personalized service.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Today, JobCall stands as a trusted partner for thousands of professionals and hundreds of companies, helping them achieve their career and business objectives through our comprehensive suite of services.
              </p>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-blue-600 mb-4">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  To empower individuals and organizations by connecting exceptional talent with meaningful opportunities. We strive to create lasting partnerships that drive personal growth and business success through innovative recruitment solutions and personalized career guidance.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-green-600 mb-4">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed">
                  To be the leading career development and recruitment solutions provider, recognized for our commitment to excellence, innovation, and the positive impact we create in people&apos;s professional lives.
                </p>
              </div>
            </div>
          </section>

          {/* Leadership Team */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Leadership Team</h2>
            <div className="grid md:grid-cols-2 gap-8">

              {/* CEO & Founder */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden bg-gray-200 relative">
                  <Image
                    src="/images/team/ceo-founder.jpg"
                    alt="CEO & Founder"
                    width={192}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gray-300 flex items-center justify-center text-gray-600 text-6xl font-bold" style={{display: 'none'}}>
                    CEO
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">CEO & Founder</h3>
                <p className="text-blue-600 font-medium mb-4">Visionary Leader</p>
                <p className="text-gray-700 leading-relaxed">
                  With extensive experience in technology and recruitment, our CEO & Founder leads JobCall with a vision to transform how people find meaningful work and how companies build exceptional teams.
                </p>
              </div>

              {/* CMD */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden bg-gray-200 relative">
                  <Image
                    src="/images/team/cmd-founder.jpg"
                    alt="CMD & Founder"
                    width={192}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gray-300 flex items-center justify-center text-gray-600 text-6xl font-bold" style={{display: 'none'}}>
                    CMD
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">CMD & Founder</h3>
                <p className="text-green-600 font-medium mb-4">Strategic Director</p>
                <p className="text-gray-700 leading-relaxed">
                  Our CMD & Founder brings deep expertise in business strategy and organizational development, ensuring JobCall delivers exceptional value to both job seekers and employers.
                </p>
              </div>

            </div>
          </section>

          {/* Services Overview */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Do</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Job Matching',
                  description: 'Advanced algorithms that connect the right candidates with the right opportunities based on skills, experience, and cultural fit.',
                  icon: '🎯'
                },
                {
                  title: 'Career Services',
                  description: 'Comprehensive career guidance, resume building, interview preparation, and professional development resources.',
                  icon: '👥'
                },
                {
                  title: 'Recruitment Solutions',
                  description: 'End-to-end recruitment services for companies, from job posting to candidate onboarding and retention strategies.',
                  icon: '🏢'
                }
              ].map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-3">{service.title}</h3>
                  <p className="text-gray-700">{service.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-3">📧</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <a href="mailto:info@jobcall.com" className="text-blue-600 hover:underline">
                    info@jobcall.com
                  </a>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">📞</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                  <a href="tel:+918188998899" className="text-blue-600 hover:underline">
                    +91 8188998899
                  </a>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">📍</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                  <address className="not-italic text-gray-700 text-sm">
                    UGF, 293, 294 Sahara Shopping Centre First Floor,<br />
                    Near Lekhraj Market Metro Station Gate No 3,<br />
                    Lucknow, Indira Nagar, Faizabad Road,<br />
                    Uttar Pradesh, India
                  </address>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">🌐</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Website</h3>
                  <a href="https://jobcall.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    jobcall.com
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Career?</h2>
            <p className="text-xl text-gray-700 mb-8">
              Join thousands of professionals who have found success with JobCall.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-blue-600 text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Create Free Account
              </Link>
              <Link
                href="/contact"
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-md text-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Contact Us Today
              </Link>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">JobCall</h3>
              <p className="text-gray-400">
                Connecting talent with opportunity across the globe since 2023.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li><Link href="/jobs" className="text-gray-400 hover:text-white">Browse Jobs</Link></li>
                <li><Link href="/companies" className="text-gray-400 hover:text-white">Top Companies</Link></li>
                <li><Link href="/career-advice" className="text-gray-400 hover:text-white">Career Resources</Link></li>
                <li><Link href="/resume-builder" className="text-gray-400 hover:text-white">Resume Builder</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2">
                <li><Link href="/post-job" className="text-gray-400 hover:text-white">Post a Job</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link href="/solutions" className="text-gray-400 hover:text-white">Recruitment Solutions</Link></li>
                <li><Link href="/employer-dashboard" className="text-gray-400 hover:text-white">Employer Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} JobCall. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm">Cookie Policy</Link>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
