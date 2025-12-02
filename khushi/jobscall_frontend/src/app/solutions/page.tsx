'use client';

import { useState } from 'react';
import { 
  FiSearch, 
  FiCheck, 
  FiAward, 
  FiLayers, 
  FiUsers, 
  FiTrendingUp, 
  FiShield, 
  FiMessageSquare, 
  FiBarChart2, 
  FiSmartphone, 
  FiMinus, 
  FiPlus 
} from 'react-icons/fi';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';

const solutions = {
  jobSeekers: [
    {
      title: 'Personalized Job Matches',
      description: 'Get matched with jobs that fit your skills and preferences',
      icon: <FiSearch className="w-8 h-8 text-blue-600" />
    },
    {
      title: 'Company Insights',
      description: 'Access company reviews and salary information',
      icon: <FiBarChart2 className="w-8 h-8 text-blue-600" />
    },
    {
      title: 'Application Tracking',
      description: 'Manage all your job applications in one place',
      icon: <FiCheck className="w-8 h-8 text-blue-600" />
    },
    {
      title: 'Skill Development',
      description: 'Access courses to improve your skills',
      icon: <FiAward className="w-8 h-8 text-blue-600" />
    }
  ],
  employers: [
    {
      title: 'Smart Candidate Matching',
      description: 'Find the best candidates with our AI-powered matching',
      icon: <FiUsers className="w-8 h-8 text-blue-600" />
    },
    {
      title: 'Branded Career Pages',
      description: 'Showcase your company culture and open positions',
      icon: <FiLayers className="w-8 h-8 text-blue-600" />
    },
    {
      title: 'Applicant Tracking',
      description: 'Streamline your hiring process with our ATS',
      icon: <FiTrendingUp className="w-8 h-8 text-blue-600" />
    },
    {
      title: 'Diversity Hiring',
      description: 'Reach a diverse pool of candidates',
      icon: <FiShield className="w-8 h-8 text-blue-600" />
    }
  ]
};

const features = [
  {
    title: 'Advanced Search',
    description: 'Powerful search filters to find exactly what you\'re looking for',
    icon: <FiSearch className="w-6 h-6 text-blue-600" />
  },
  {
    title: 'Real-time Updates',
    description: 'Get instant notifications about your applications',
    icon: <FiMessageSquare className="w-6 h-6 text-blue-600" />
  },
  {
    title: 'Analytics Dashboard',
    description: 'Track your job search or hiring metrics',
    icon: <FiBarChart2 className="w-6 h-6 text-blue-600" />
  },
  {
    title: 'Mobile Friendly',
    description: 'Access your account from any device',
    icon: <FiSmartphone className="w-6 h-6 text-blue-600" />
  }
];

const pricingPlans = [
  {
    name: 'Basic',
    price: 'Free',
    period: 'forever',
    features: [
      'Basic job search',
      '5 job applications/month',
      'Email support',
      'Basic company profiles'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: 'per month',
    features: [
      'Unlimited job applications',
      'Advanced search filters',
      'Priority support',
      'Company insights',
      'Resume review'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'per month',
    features: [
      'Everything in Premium',
      'Dedicated account manager',
      'Custom integrations',
      'API access',
      'Advanced analytics'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

const faqs = [
  {
    question: 'How does the job matching work?',
    answer: 'Our AI analyzes your profile, skills, and preferences to match you with the most relevant job opportunities.'
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes, we offer a 14-day free trial for our Premium plan with full access to all features.'
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription at any time from your account settings.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers.'
  }
];

export default function SolutionsPage() {
  const [activeTab, setActiveTab] = useState('jobSeekers');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <PageLayout
      title="Solutions for Job Seekers & Employers | JobCall"
      description="Discover how our platform helps job seekers find their dream jobs and employers find the best talent with our comprehensive hiring solutions."
    >
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Solutions for Every Hiring Need</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Whether you&apos;re looking for your next career move or your next great hire, we&apos;ve got you covered.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
              Get Started Free
            </Link>
            <Link href="#pricing" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
              View Pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Solutions Tabs */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Solutions Tailored for You</h2>
            <p className="text-lg text-gray-600">
              Our platform offers powerful tools for both job seekers and employers to achieve their goals.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
              <button
                onClick={() => setActiveTab('jobSeekers')}
                className={`px-6 py-3 rounded-md font-medium ${activeTab === 'jobSeekers' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                For Job Seekers
              </button>
              <button
                onClick={() => setActiveTab('employers')}
                className={`px-6 py-3 rounded-md font-medium ${activeTab === 'employers' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                For Employers
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(solutions[activeTab as keyof typeof solutions] as Array<{title: string, description: string, icon: JSX.Element}>).map((solution, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  {solution.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{solution.title}</h3>
                <p className="text-gray-600">{solution.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600">
              Everything you need to find the perfect job or candidate, all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600">
              Choose the plan that works best for you. No hidden fees, ever.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 ${plan.popular ? 'border-blue-500' : 'border-transparent'}`}
              >
                {plan.popular && (
                  <div className="bg-blue-600 text-white text-sm font-semibold py-2 text-center">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="ml-1 text-gray-500">/ {plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <FiCheck className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    className={`w-full py-3 px-4 rounded-lg font-semibold ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} transition-colors`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {activeFaq === index ? (
                      <FiMinus className="w-5 h-5 text-gray-500" />
                    ) : (
                      <FiPlus className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {activeFaq === index && (
                    <div className="px-6 pb-4 pt-0 text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers and employers who have found success with our platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
              Sign Up Free
            </Link>
            <Link href="/contact" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
