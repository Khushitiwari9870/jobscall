import Link from 'next/link';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'For Job Seekers',
      links: [
        { name: 'Browse Jobs', href: '/jobs' },
        { name: 'Browse Companies', href: '/companies' },
        { name: 'Salary Calculator', href: '/salary-calculator' },
        { name: 'Career Advice', href: '/career-advice' },
        { name: 'Create Resume', href: '/resume-builder' },
      ],
    },
    {
      title: 'For Employers',
      links: [
        { name: 'Post a Job', href: '/employers/post-job' },
        { name: 'Browse Resumes', href: '/employers/browse-resumes' },
        { name: 'Recruitment Solutions', href: '/employers/solutions' },
        { name: 'Pricing', href: '/pricing' },
      ],
    },
    {
      title: 'About Us',
      links: [
        { name: 'About Jobscall', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'GDPR', href: '/gdpr' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FaFacebook className="w-5 h-5" />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <FaTwitter className="w-5 h-5" />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <FaLinkedin className="w-5 h-5" />, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <FaInstagram className="w-5 h-5" />, href: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Jobscall</h3>
            <p className="text-gray-400 mb-6">
              Connecting talented professionals with top employers. Find your dream job or the perfect candidate today.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Jobscall. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm">Sitemap</Link>
              <Link href="/accessibility" className="text-gray-400 hover:text-white text-sm">Accessibility</Link>
              <Link href="/security" className="text-gray-400 hover:text-white text-sm">Security</Link>
              <Link href="/help" className="text-gray-400 hover:text-white text-sm">Help Center</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
