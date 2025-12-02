'use client';

import Link from 'next/link';
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram, FiYoutube } from 'react-icons/fi';
import { Logo } from '@/components/ui/Logo';

const footerLinks = {
  about: {
    title: 'About Us',
    links: [
      { name: 'About Company', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Our Team', href: '/team' },
      { name: 'Testimonials', href: '/testimonials' },
      { name: 'Contact Us', href: '/contact' },
    ],
  },
  jobSeekers: {
    title: 'Job Seekers',
    links: [
      { name: 'Browse Jobs', href: '/jobs' },
      { name: 'Browse Categories', href: '/categories' },
      { name: 'Submit Resume', href: '/resume' },
      { name: 'Job Alerts', href: '/alerts' },
      { name: 'Career Advice', href: '/advice' },
    ],
  },
  employers: {
    title: 'Employers',
    links: [
      { name: 'Browse Candidates', href: '/candidates' },
      { name: 'Post a Job', href: '/post-job' },
      { name: 'Browse Categories', href: '/employer/categories' },
      { name: 'Recruitment Solutions', href: '/solutions' },
      { name: 'Pricing', href: '/pricing' },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Sitemap', href: '/sitemap' },
    ],
  },
};

const socialLinks = [
  { name: 'Facebook', icon: <FiFacebook className="h-5 w-5" />, href: '#' },
  { name: 'Twitter', icon: <FiTwitter className="h-5 w-5" />, href: '#' },
  { name: 'LinkedIn', icon: <FiLinkedin className="h-5 w-5" />, href: '#' },
  { name: 'Instagram', icon: <FiInstagram className="h-5 w-5" />, href: '#' },
  { name: 'YouTube', icon: <FiYoutube className="h-5 w-5" />, href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About Section */}
          <div className="col-span-1 lg:col-span-2">
            <div className="mb-4">
              <Logo withLink={false} className="h-8" />
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Find your dream job with our comprehensive job search platform. Connect with top employers and find the perfect career opportunity.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-white"
                  aria-label={item.name}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} JobSearch. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-gray-400 hover:text-white">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
