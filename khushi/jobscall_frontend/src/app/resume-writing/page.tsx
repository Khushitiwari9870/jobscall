'use client';

import React, { useState } from 'react';
import { Check, Star, ChevronDown, ChevronUp, ArrowRight, MessageSquare, FileText, Clock, Award, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

const ResumeWritingPage = () => {
  const [selectedExperience, setSelectedExperience] = useState('0-1');
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [activeTab, setActiveTab] = useState('benefits');

  const experienceOptions = [
    { id: '0-1', label: '0-1 years', basePrice: 1999, discount: 20 },
    { id: '1-4', label: '1-4 years', basePrice: 2499, discount: 15 },
    { id: '4-8', label: '4-8 years', basePrice: 3499, discount: 10 },
    { id: '8-15', label: '8-15 years', basePrice: 4999, discount: 10 },
    { id: '15+', label: '15+ years', basePrice: 6999, discount: 10 },
  ];

  const addOns = [
    { id: 'linkedin', label: 'LinkedIn Profile Makeover', price: 1499 },
    { id: 'cover', label: 'Cover Letter', price: 999 },
    { id: 'interview', label: 'Interview Preparation', price: 1999 },
  ];

  type FAQ = {
    question: string;
    answer: string;
    isOpen?: boolean;
  };

  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      question: 'How long does it take to get my resume?',
      answer: 'Typically, you\'ll receive your first draft within 3-5 business days after we receive all your information.',
      isOpen: false,
    },
    {
      question: 'Do you offer revisions?',
      answer: 'Yes, we offer 2 rounds of revisions to ensure you\'re completely satisfied with your resume.',
      isOpen: false,
    },
    {
      question: 'What format will I receive my resume in?',
      answer: 'You\'ll receive your resume in both PDF and Word formats.',
      isOpen: false,
    },
    {
      question: 'Is my information secure?',
      answer: 'Yes, we take data privacy seriously. Your information is encrypted and never shared with third parties.',
    },
  ]);

  const reviews = [
    {
      name: 'Rahul Sharma',
      role: 'Software Engineer',
      rating: 5,
      date: '2 weeks ago',
      content: 'The resume writing service was exceptional. I got interview calls within a week of using their service!',
    },
    {
      name: 'Priya Patel',
      role: 'Marketing Executive',
      rating: 5,
      date: '1 month ago',
      content: 'Professional and well-structured resume. The ATS optimization really made a difference in my job search.',
    },
    {
      name: 'Amit Singh',
      role: 'Product Manager',
      rating: 4,
      date: '3 weeks ago',
      content: 'Good service overall. The resume looks clean and professional. Got some good feedback from recruiters.',
    },
  ];

  const selectedExpData = experienceOptions.find(exp => exp.id === selectedExperience) || experienceOptions[0];
  const finalPrice = selectedExpData.basePrice * (1 - selectedExpData.discount / 100);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">4.9/5 from 1,200+ reviews</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Professional Resume Writing Service for Entry-Level Professionals
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Get noticed by top employers with an ATS-optimized resume that highlights your potential and lands you interviews.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                  Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="px-8 py-6 text-lg">
                  <MessageSquare className="mr-2 h-5 w-5" /> Talk to an Expert
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="relative">
                  <Image
                    src="/resume-hero.png"
                    alt="Professional Resume Example"
                    width={500}
                    height={600}
                    className="rounded-lg shadow-2xl border-2 border-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why You Need It Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Do You Need a Professional Resume?</h2>
          
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="benefits" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
                <TabsTrigger 
                  value="benefits" 
                  onClick={() => setActiveTab('benefits')}
                  className={activeTab === 'benefits' ? 'bg-blue-600 text-white' : ''}
                >
                  Benefits
                </TabsTrigger>
                <TabsTrigger 
                  value="comparison" 
                  onClick={() => setActiveTab('comparison')}
                  className={activeTab === 'comparison' ? 'bg-blue-600 text-white' : ''}
                >
                  Comparison
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="benefits">
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: <FileText className="w-8 h-8 text-blue-600 mb-4" />,
                      title: 'ATS Optimization',
                      description: 'Our resumes are optimized to pass through Applicant Tracking Systems (ATS) used by 99% of employers.'
                    },
                    {
                      icon: <Award className="w-8 h-8 text-blue-600 mb-4" />,
                      title: 'Industry-Specific',
                      description: 'Tailored to your specific industry and job role by experts who understand what employers want.'
                    },
                    {
                      icon: <Clock className="w-8 h-8 text-blue-600 mb-4" />,
                      title: 'Saves Time',
                      description: 'Focus on your job search while we handle crafting the perfect resume that gets you noticed.'
                    }
                  ].map((feature, index) => (
                    <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                      <div className="flex justify-center">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="comparison">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Features</th>
                        <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">With Our Service</th>
                        <th className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Without Professional Help</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        'ATS Optimization',
                        'Professional Formatting',
                        'Keyword Optimization',
                        'Industry-Specific Content',
                        'Customized for Job Description',
                        'Interview Call Rate',
                        'Unlimited Revisions',
                        'LinkedIn Profile Optimization'
                      ].map((feature, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{feature}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {index < 3 ? (
                              <span className="text-red-500 font-medium">No</span>
                            ) : (
                              <span className="text-yellow-500 font-medium">Limited</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Select Your Experience Level</h2>
          <p className="text-xl text-center text-gray-600 mb-12">Pricing based on years of experience</p>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 gap-4 mb-8">
              {experienceOptions.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => setSelectedExperience(exp.id)}
                  className={`py-3 px-2 rounded-lg text-center border-2 transition-all ${
                    selectedExperience === exp.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-lg">{exp.label}</div>
                  <div className="text-sm text-gray-500">
                    <span className="text-lg font-bold text-gray-900">₹{exp.basePrice}</span>
                    <span className="line-through ml-2 text-sm">₹{Math.round(exp.basePrice * 1.2)}</span>
                  </div>
                  <div className="text-xs text-green-600 font-medium mt-1">{exp.discount}% OFF</div>
                </button>
              ))}
            </div>

            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="p-8 md:w-2/3">
                  <h3 className="text-2xl font-bold mb-6">Resume Writing Service</h3>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b">
                      <div>
                        <h4 className="font-medium">Professional Resume Writing</h4>
                        <p className="text-sm text-gray-500">For {selectedExpData.label} experience</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{selectedExpData.basePrice}</p>
                        <p className="text-sm text-green-600">Save {selectedExpData.discount}%</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Add-on Services</h4>
                      <div className="space-y-3">
                        {addOns.map((addOn) => (
                          <div key={addOn.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={addOn.id}
                                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              />
                              <label htmlFor={addOn.id} className="ml-3 text-sm text-gray-700">
                                {addOn.label}
                              </label>
                            </div>
                            <span className="text-sm font-medium">+ ₹{addOn.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total</span>
                        <div className="text-right">
                          <p className="text-2xl font-bold">₹{finalPrice.toFixed(2)}</p>
                          <p className="text-sm text-gray-500 line-through">₹{selectedExpData.basePrice * 1.2}</p>
                        </div>
                      </div>
                      <p className="text-sm text-green-600 mt-1">
                        You save ₹{(selectedExpData.basePrice * 0.2).toFixed(2)} ({selectedExpData.discount}% OFF)
                      </p>
                    </div>

                    <div className="pt-2">
                      <Button className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-lg">
                        Buy Now
                      </Button>
                      <Button variant="outline" className="w-full mt-3 py-6 text-lg">
                        <MessageSquare className="mr-2 h-5 w-5" /> Talk to Expert
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-8 md:w-1/3 border-l border-gray-200">
                  <h4 className="font-medium mb-4">What&apos;s Included</h4>
                  <ul className="space-y-3">
                    {[
                      'ATS-optimized resume',
                      'Professional formatting',
                      'Unlimited revisions for 30 days',
                      'Industry-specific keywords',
                      'Customized content',
                      '48-72 hours delivery',
                      'Direct communication with writer',
                      'Satisfaction guarantee'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <FileText className="w-10 h-10 text-blue-600 mb-4" />,
                step: 'Step 1',
                title: 'Place Order',
                description: 'Select your package and complete the secure checkout process.'
              },
              {
                icon: <MessageSquare className="w-10 h-10 text-blue-600 mb-4" />,
                step: 'Step 2',
                title: 'Share Details',
                description: 'Fill out our questionnaire and share your current resume (if any).'
              },
              {
                icon: <Clock className="w-10 h-10 text-blue-600 mb-4" />,
                step: 'Step 3',
                title: 'First Draft',
                description: 'Receive your professionally written resume draft within 3-5 business days.'
              },
              {
                icon: <Check className="w-10 h-10 text-blue-600 mb-4" />,
                step: 'Step 4',
                title: 'Revisions & Final',
                description: 'Review and request revisions. Get your final, polished resume.'
              }
            ].map((item, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-center">
                  {item.icon}
                </div>
                <span className="inline-block text-sm font-medium text-blue-600 mb-2">{item.step}</span>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.slice(0, showAllFaqs ? faqs.length : 2).map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left focus:outline-none flex justify-between items-center"
                  onClick={() => {
                    const newFaqs = [...faqs];
                    newFaqs[index].isOpen = !newFaqs[index].isOpen;
                    setFaqs(newFaqs);
                  }}
                >
                  <span className="font-medium text-lg">{faq.question}</span>
                  {faq.isOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {faq.isOpen && (
                  <div className="px-6 pb-4 pt-0 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
            
            {!showAllFaqs && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => setShowAllFaqs(true)}
                  className="flex items-center mx-auto"
                >
                  Show More Questions
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-auto">{review.date}</span>
                </div>
                <p className="text-gray-700 mb-4 italic">&ldquo;{review.content}&rdquo;</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                    {review.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Land Your Dream Job?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get started with our professional resume writing service and increase your chances of getting hired by 3x
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-6 text-lg font-medium">
              Get Started Now
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
              <Phone className="mr-2 h-5 w-5" /> Schedule a Call
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {['Resume Writing', 'LinkedIn Makeover', 'Cover Letter', 'Interview Prep', 'Career Coaching'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {['About Us', 'Success Stories', 'Pricing', 'Blog', 'Contact Us'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                {['Help Center', 'FAQ', 'Terms of Service', 'Privacy Policy', 'Refund Policy'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Mail className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>support@jobscall.com</span>
                </li>
                <li className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="pt-2">
                  <p className="text-sm">Available 10:00 AM - 7:00 PM, Mon-Sat</p>
                </li>
              </ul>
              <div className="mt-4 flex space-x-4">
                {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                    aria-label={social}
                  >
                    <span className="sr-only">{social}</span>
                    <span className="text-white">{social.charAt(0).toUpperCase()}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} JobScall. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResumeWritingPage;
