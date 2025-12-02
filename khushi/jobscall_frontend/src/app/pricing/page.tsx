'use client';

import { motion } from 'framer-motion';
import { FiCheck, FiX, FiZap, FiBriefcase, FiAward, FiGlobe } from 'react-icons/fi';
import Link from 'next/link';

const pricingPlans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for individuals getting started with their job search',
    features: [
      '5 job applications per month',
      'Basic job search filters',
      'Email alerts for new jobs',
      'Company profiles',
      'Resume builder (basic)',
      'Community support',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Professional',
    price: '₹999',
    period: '/month',
    description: 'For professionals looking to accelerate their career growth',
    features: [
      'Unlimited job applications',
      'Advanced job search filters',
      'Priority job alerts',
      'Company insights & reviews',
      'Resume builder (premium)',
      'Direct messaging with recruiters',
      'Interview preparation tools',
      'Email support',
    ],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For organizations and premium career services',
    features: [
      'Everything in Professional',
      'Dedicated career coach',
      'Personalized job matching',
      'Resume review by experts',
      'Interview coaching',
      'Salary negotiation support',
      '24/7 priority support',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
];

const features = [
  {
    name: 'Job Applications',
    description: 'Unlimited applications to job postings',
    icon: FiBriefcase,
  },
  {
    name: 'Advanced Search',
    description: 'Powerful filters to find your perfect job',
    icon: FiZap,
  },
  {
    name: 'Career Growth',
    description: 'Tools and resources to advance your career',
    icon: FiAward,
  },
  {
    name: 'Global Opportunities',
    description: 'Access to jobs from around the world',
    icon: FiGlobe,
  },
];

const faqs = [
  {
    question: 'Can I change plans later?',
    answer: 'Yes, you can upgrade, downgrade, or cancel your plan at any time.'
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes, the Professional plan comes with a 14-day free trial.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, UPI, and net banking.'
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription at any time from your account settings.'
  },
];

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">JobCall</Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/jobs" className="text-gray-700 hover:text-blue-600">Jobs</Link>
              <Link href="/companies" className="text-gray-700 hover:text-blue-600">Companies</Link>
              <Link href="/blog" className="text-gray-700 hover:text-blue-600">Blog</Link>
              <Link href="/pricing" className="text-blue-600 font-medium">Pricing</Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-blue-600"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <motion.div 
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Choose the perfect plan that fits your career goals. No hidden fees, cancel anytime.
          </p>
          
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center bg-blue-500 bg-opacity-20 rounded-full p-1">
              <button className="px-6 py-2 rounded-full bg-white text-blue-700 font-medium">Monthly</button>
              <button className="px-6 py-2 text-white font-medium">Yearly <span className="text-blue-200 ml-1">(Save 20%)</span></button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {pricingPlans.map((plan) => (
              <motion.div 
                key={plan.name}
                variants={item}
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
                className={`bg-white rounded-xl overflow-hidden border ${
                  plan.featured 
                    ? 'border-blue-500 transform scale-105 z-10 shadow-lg' 
                    : 'border-gray-200'
                }`}
              >
                {plan.featured && (
                  <div className="bg-blue-600 text-white text-center py-1 text-sm font-medium">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      {plan.period && (
                        <span className="ml-2 text-gray-500">{plan.period}</span>
                      )}
                    </div>
                    {plan.name === 'Professional' && (
                      <p className="text-sm text-gray-500 mt-1">Billed annually or ₹1,199 month-to-month</p>
                    )}
                  </div>
                  
                  <Link 
                    href={plan.name === 'Enterprise' ? '/contact' : '/register'}
                    className={`block w-full py-3 px-6 rounded-md text-center font-medium ${
                      plan.featured 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    {plan.cta}
                  </Link>
                  
                  <div className="mt-8 space-y-4">
                    <h4 className="font-medium text-gray-900">Features include:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <FiCheck className={`h-5 w-5 flex-shrink-0 ${
                            plan.featured ? 'text-blue-500' : 'text-green-500'
                          } mt-0.5`} />
                          <span className="ml-3 text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Compare Plans</h2>
            <p className="text-xl text-gray-600">
              See how our plans stack up against each other to find the perfect fit for your needs.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Starter</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-blue-600 uppercase tracking-wider">Professional</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Enterprise</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  'Job Applications',
                  'Advanced Search Filters',
                  'Resume Builder',
                  'Company Insights',
                  'Email Support',
                  'Priority Support',
                  'Dedicated Career Coach',
                  'Interview Coaching'
                ].map((feature, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{feature}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {feature === 'Job Applications' ? '5/month' : index < 3 ? <FiCheck className="h-5 w-5 text-green-500 mx-auto" /> : <FiX className="h-5 w-5 text-gray-300 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center bg-blue-50">
                      {feature === 'Dedicated Career Coach' || feature === 'Interview Coaching' ? 
                        <FiX className="h-5 w-5 text-gray-300 mx-auto" /> : 
                        <FiCheck className="h-5 w-5 text-blue-500 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <FiCheck className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
            <p className="text-xl text-gray-600">
              Our platform provides all the tools and resources you need to find your dream job.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <motion.div 
                key={feature.name}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-blue-100 transition-colors"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div 
                  key={index}
                  className="border-b border-gray-200 pb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                  <p className="mt-2 text-gray-600">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-6">Still have questions? We&apos;re here to help!</p>
              <Link 
                href="/contact" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find your dream job?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who found their perfect job through JobCall.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/register" 
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Get Started for Free
            </Link>
            <Link 
              href="/contact" 
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">JobCall</h3>
              <p className="text-gray-400">Connecting talent with opportunity across the globe.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li><Link href="/jobs" className="text-gray-400 hover:text-white">Browse Jobs</Link></li>
                <li><Link href="/companies" className="text-gray-400 hover:text-white">Top Companies</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Career Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2">
                <li><Link href="/post-job" className="text-gray-400 hover:text-white">Post a Job</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link href="/solutions" className="text-gray-400 hover:text-white">Recruitment Solutions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
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
          </div>
        </div>
      </footer>
    </div>
  );
}
