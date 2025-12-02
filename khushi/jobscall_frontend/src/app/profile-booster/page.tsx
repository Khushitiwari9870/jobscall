'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, ChevronDown, ArrowRight, MessageSquare, FileText, Mail, Phone, Zap, Eye, Users } from 'lucide-react';
const ProfileBoosterPage = () => {
  const faqs = [
    {
      question: 'How does the Profile Booster work?',
      answer: 'Our Profile Booster enhances your job application visibility by featuring your profile, highlighting your applications, and providing priority consideration from recruiters.'
    },
    {
      question: 'How long does the Profile Booster last?',
      answer: 'The Profile Booster is active for 30 days from the date of purchase.'
    },
    {
      question: 'Can I get a refund if I don\'t see results?',
      answer: 'We offer a 7-day money-back guarantee if you don\'t see any improvement in your profile visibility.'
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Yes, we use industry-standard encryption to protect your payment information.'
    },
  ];

  const reviews = [
    {
      name: 'Rahul Sharma',
      role: 'Software Engineer',
      rating: 5,
      date: '2 weeks ago',
      content: 'The Profile Booster helped me get 3x more interview calls within the first week!',
    },
    {
      name: 'Priya Patel',
      role: 'Marketing Executive',
      rating: 5,
      date: '1 month ago',
      content: 'Worth every penny! My profile got noticed by top companies.',
    },
  ];

  const features = [
    { icon: <FileText className="h-6 w-6 text-blue-500" />, title: 'Cover Letter', description: 'Professionally crafted' },
    { icon: <FileText className="h-6 w-6 text-green-500" />, title: 'Resume Builder', description: 'ATS-optimized' },
    { icon: <Zap className="h-6 w-6 text-yellow-500" />, title: 'Featured Profile', description: '30 days' },
    { icon: <Eye className="h-6 w-6 text-purple-500" />, title: 'Application Highlighter', description: 'For all applications' },
  ];

  const howItWorks = [
    {
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      title: 'Place Order',
      description: 'Select and purchase the Profile Booster package'
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: 'Profile Featured',
      description: 'Your profile gets priority visibility'
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: 'Application Highlighted',
      description: 'Your applications stand out to recruiters'
    },
    {
      icon: <Phone className="h-8 w-8 text-purple-500" />,
      title: 'Interview Calls',
      description: 'Start receiving interview invitations'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <h1 className="text-4xl font-bold text-gray-900">Profile Booster</h1>
                <div className="ml-4 flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  <span>4.8 (1.2K+ reviews)</span>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-8">
                Get 3x more interview calls with our exclusive Profile Booster. Stand out to recruiters and get noticed by top companies.
              </p>
              <div className="flex space-x-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline">
                  Talk to Expert
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-4 bg-blue-100 rounded-2xl transform rotate-2"></div>
                <div className="relative bg-white p-2 rounded-xl shadow-lg">
                  <div className="bg-gray-200 rounded-lg overflow-hidden aspect-video">
                    <div className="h-full flex items-center justify-center text-gray-400">
                      <Users className="h-16 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why do you need Profile Booster?</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Features</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">Without Booster</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-blue-600 bg-blue-50 uppercase tracking-wider">With Booster</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Profile Visibility</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">Standard</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-blue-600 bg-blue-50">3x Higher</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Application Priority</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">Normal</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-blue-600 bg-blue-50">Priority Tag</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Recruiter Attention</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">Standard</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-blue-600 bg-blue-50">Featured</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Response Rate</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">5-10%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-blue-600 bg-blue-50">25-40%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Combo Includes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Combo Includes</h2>
          
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-blue-100">
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">Premium Profile Booster</CardTitle>
                    <CardDescription>Everything you need to get noticed by recruiters</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">₹1,999</div>
                    <div className="text-sm text-gray-500 line-through">₹4,999</div>
                    <div className="text-sm text-green-600 font-medium">60% OFF</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-500">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8">
                    Buy Now
                  </Button>
                  <Button variant="outline" className="text-lg py-6 px-8">
                    <MessageSquare className="mr-2 h-5 w-5" /> Talk to Expert
                  </Button>
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>7-day money-back guarantee • Secure payment</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4">
                  {step.icon}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                  <h3 className="font-medium text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
                      {review.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium">{review.name}</h4>
                      <p className="text-sm text-gray-500">{review.role}</p>
                    </div>
                    <div className="ml-auto flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">&ldquo;{review.content}&rdquo;</p>
                  <div className="mt-4 text-sm text-gray-500">{review.date}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button 
                  className="w-full px-6 py-4 text-left focus:outline-none"
                  onClick={() => {}}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{faq.question}</h3>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </button>
                <div className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
              <MessageSquare className="mr-2 h-4 w-4" /> Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Boost Your Profile?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of professionals who got 3x more interview calls with our Profile Booster</p>
          <Button className="bg-white text-blue-600 hover:bg-blue-50 text-lg py-6 px-8">
            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium mb-4">For Job Seekers</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Search Jobs</a></li>
                <li><a href="#" className="hover:text-white">Create Resume</a></li>
                <li><a href="#" className="hover:text-white">Job Alerts</a></li>
                <li><a href="#" className="hover:text-white">Career Advice</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium mb-4">For Employers</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Post a Job</a></li>
                <li><a href="#" className="hover:text-white">Browse Resumes</a></li>
                <li><a href="#" className="hover:text-white">Recruiting Solutions</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" /> support@jobscall.com
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" /> +91 98765 43210
                </li>
              </ul>
              <div className="mt-4">
                <p className="text-sm">Follow us on social media</p>
                <div className="flex space-x-4 mt-2">
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
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-gray-400">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p>© 2023 Jobscall. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Terms of Service</a>
                <a href="#" className="hover:text-white">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProfileBoosterPage;
