import React from 'react';
import Image from 'next/image';
import { Star, Check, CheckCheck, MessageSquare, Phone, Zap, Shield, Users, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const ApplicationHighlighter = () => {
  const pricingPlans = [
    { days: 90, price: '₹999', perDay: '₹11.10', originalPrice: '₹2,999' },
    { days: 120, price: '₹1,199', perDay: '₹9.99', originalPrice: '₹3,999', popular: true },
    { days: 180, price: '₹1,599', perDay: '₹8.88', originalPrice: '₹4,999' },
  ];

  const features = [
    { icon: <Zap className="h-6 w-6 text-blue-500" />, title: 'Instant Visibility', description: 'Get 3X more profile views from recruiters' },
    { icon: <Shield className="h-6 w-6 text-green-500" />, title: 'Priority Placement', description: 'Move to the top of recruiter searches' },
    { icon: <Users className="h-6 w-6 text-purple-500" />, description: 'Access to premium recruiters' },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Select Plan',
      description: 'Choose your preferred subscription plan',
      icon: <Check className="h-6 w-6" />,
    },
    {
      step: '2',
      title: 'Get Applications Highlighted',
      description: 'Our system will highlight your profile to recruiters',
      icon: <CheckCheck className="h-6 w-6" />,
    },
    {
      step: '3',
      title: 'Get Recruiter Calls',
      description: 'Start receiving interview calls from top companies',
      icon: <Phone className="h-6 w-6" />,
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Rahul Sharma',
      role: 'Software Engineer',
      content: 'Got 5 interview calls within a week of activating Application Highlighter. Landed my dream job at a top tech company!',
      rating: 5,
    },
    {
      id: 2,
      name: 'Priya Patel',
      role: 'Marketing Manager',
      content: 'The difference was night and day. My profile visibility increased dramatically.',
      rating: 4,
    },
    {
      id: 3,
      name: 'Amit Kumar',
      role: 'Product Manager',
      content: 'Worth every penny. I received multiple interview calls from top recruiters.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Application Highlighter</h1>
              <div className="flex items-center mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">4.8/5 from 10,000+ reviews</span>
              </div>
              <p className="text-lg text-gray-600 mb-8">
                Get 3X more profile views and priority placement in recruiter searches. 
                Let top companies find you first with our Application Highlighter service.
              </p>
              <div className="flex space-x-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline">How It Works</Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-4 bg-blue-100 rounded-2xl transform rotate-2"></div>
                <div className="relative bg-white p-2 rounded-xl shadow-lg border border-gray-200">
                  <div className="aspect-w-16 aspect-h-9 w-full bg-gray-100 rounded-lg overflow-hidden">
                    <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                      <MessageSquare className="h-16 w-16 text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why do you need Application Highlighter?</h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid md:grid-cols-3 divide-x divide-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Feature</h3>
                <ul className="space-y-4">
                  <li className="text-gray-600">Profile Visibility</li>
                  <li className="text-gray-600">Priority in Search</li>
                  <li className="text-gray-600">Recruiter Calls</li>
                  <li className="text-gray-600">Application Status</li>
                </ul>
              </div>
              <div className="p-6 bg-blue-50">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">With Application Highlighter</h3>
                <ul className="space-y-4">
                  <li className="flex items-center text-green-600"><Check className="h-5 w-5 mr-2" /> 3X Higher</li>
                  <li className="flex items-center text-green-600"><Check className="h-5 w-5 mr-2" /> Top of Search</li>
                  <li className="flex items-center text-green-600"><Check className="h-5 w-5 mr-2" /> 5-10x More</li>
                  <li className="flex items-center text-green-600"><Check className="h-5 w-5 mr-2" /> Real-time Updates</li>
                </ul>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Without Application Highlighter</h3>
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-500"><X className="h-5 w-5 mr-2" /> Normal</li>
                  <li className="flex items-center text-gray-500"><X className="h-5 w-5 mr-2" /> Standard</li>
                  <li className="flex items-center text-gray-500"><X className="h-5 w-5 mr-2" /> Limited</li>
                  <li className="flex items-center text-gray-500"><X className="h-5 w-5 mr-2" /> No Updates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative overflow-hidden ${plan.popular ? 'border-2 border-blue-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 transform translate-x-2 -translate-y-2 rotate-12">
                    POPULAR
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{plan.days} Days</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-2">just {plan.perDay}/day</span>
                  </CardDescription>
                  <div className="text-sm text-gray-500 line-through">{plan.originalPrice}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature.description || feature.title}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" className="mr-4">
              <Phone className="h-4 w-4 mr-2" /> Talk to Expert
            </Button>
            <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
              View all features <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works?</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 flex-grow">&ldquo;{testimonial.content}&rdquo;</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to boost your job search?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join thousands of professionals who found their dream job with Application Highlighter
          </p>
          <Button className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-full font-semibold">
            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Application Highlighter</h3>
              <p className="mb-4">The fastest way to get noticed by top recruiters and land your dream job.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Download App</h4>
              <div className="space-y-3">
                <a href="#" className="block">
                  <Image src="/app-store.svg" alt="Download on the App Store" width={120} height={40} className="h-10 w-auto" />
                </a>
                <a href="#" className="block">
                  <Image src="/play-store.svg" alt="Get it on Google Play" width={120} height={40} className="h-10 w-auto" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-gray-400 text-center">
            <p>© {new Date().getFullYear()} Application Highlighter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ApplicationHighlighter;
