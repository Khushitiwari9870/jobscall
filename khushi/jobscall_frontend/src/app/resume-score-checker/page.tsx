import { Button } from '@/components/ui/button';
import { Upload, FileText, Zap, Award, Search, FileCheck, Edit3, BarChart2, FileSearch, Download, User, GraduationCap, Star, Briefcase, Phone, Mail, Linkedin, Twitter, Facebook } from 'lucide-react';

export default function ResumeScoreChecker() {
  const features = [
    {
      icon: <FileCheck className="h-8 w-8 text-blue-500" />,
      title: 'Formatting & Layout',
      description: 'Check for professional formatting and optimal layout'
    },
    {
      icon: <Edit3 className="h-8 w-8 text-green-500" />,
      title: 'Content Review',
      description: 'Get tips to improve your content and impact'
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-purple-500" />,
      title: 'Section Analysis',
      description: 'Detailed review of each resume section'
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      title: 'Expert Guidance',
      description: 'Get professional recommendations'
    }
  ];

  const parameters = [
    {
      category: 'Format & Style',
      description: 'Professional formatting, consistent styling, and proper spacing',
      icon: <FileText className="h-5 w-5 text-blue-500" />
    },
    {
      category: 'Contact Details',
      description: 'Complete and properly formatted contact information',
      icon: <User className="h-5 w-5 text-green-500" />
    },
    {
      category: 'Professional Summary',
      description: 'Impactful summary highlighting your value proposition',
      icon: <FileText className="h-5 w-5 text-purple-500" />
    },
    {
      category: 'Education Details',
      description: 'Proper formatting of education history and achievements',
      icon: <GraduationCap className="h-5 w-5 text-yellow-500" />
    },
    {
      category: 'Skills Section',
      description: 'Relevant skills that match job requirements',
      icon: <Star className="h-5 w-5 text-red-500" />
    },
    {
      category: 'Work Experience',
      description: 'Strong action verbs and quantifiable achievements',
      icon: <Briefcase className="h-5 w-5 text-indigo-500" />
    }
  ];

  const benefits = [
    {
      title: 'Professional Writer Support',
      description: 'Get expert help to refine your resume',
      icon: <Edit3 className="h-6 w-6 text-blue-500" />
    },
    {
      title: 'ATS Optimization',
      description: 'Ensure your resume passes through automated systems',
      icon: <FileSearch className="h-6 w-6 text-green-500" />
    },
    {
      title: 'Job Search Strategy',
      description: 'Optimize your job search funnel',
      icon: <Search className="h-6 w-6 text-purple-500" />
    },
    {
      title: 'Keyword Optimization',
      description: 'Incorporate the right keywords for your industry',
      icon: <Award className="h-6 w-6 text-yellow-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Zap className="h-4 w-4 mr-1" />
                Get Hired Faster
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Smart Resume Score Checker</h1>
              <p className="text-lg text-gray-600 mb-8">
                Get an instant, detailed analysis of your resume. Find out what&apos;s working and what needs improvement to land more interviews.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-8">
                  <Upload className="mr-2 h-5 w-5" /> Upload Resume
                </Button>
                <Button variant="outline" className="h-12 px-8">
                  <Download className="mr-2 h-5 w-5" /> Import from Shine
                </Button>
              </div>
              
              <div className="text-sm text-gray-500">
                <p className="mb-1">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
                <p>Your data is secure and will not be shared</p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-4 bg-blue-50 rounded-2xl transform rotate-1"></div>
                <div className="relative bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-md mb-4">
                      <div className="text-2xl font-bold text-blue-600">87</div>
                      <span className="text-sm text-gray-500">/100</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Good Start!</h3>
                    <p className="text-sm text-gray-600">Your resume is better than 65% of profiles</p>
                    <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How Resume Checker Works?</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-1/2"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {[
                  {
                    icon: <Upload className="h-8 w-8 text-white" />,
                    title: 'Upload Resume',
                    description: 'Upload your resume in any standard format'
                  },
                  {
                    icon: <FileSearch className="h-8 w-8 text-white" />,
                    title: 'Instant Analysis',
                    description: 'Our AI scans your resume in seconds'
                  },
                  {
                    icon: <FileText className="h-8 w-8 text-white" />,
                    title: 'Get Detailed Report',
                    description: 'Receive a comprehensive score and feedback'
                  }
                ].map((step, index) => (
                  <div key={index} className="bg-white">
                    <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <Button className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-3 px-8 rounded-full shadow-lg">
              Check Your Score Now <Zap className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Resume Checker Parameters */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Resume Checker Parameters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {parameters.map((param, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      {param.icon}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{param.category}</h3>
                    <p className="mt-1 text-gray-600">{param.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Get More Than Just a Score</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center shadow-sm mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Improve Your Resume?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Get your free resume score and detailed feedback in less than 30 seconds.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 text-lg py-3 px-8 rounded-full">
              Check My Score Now <Zap className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg py-3 px-8 rounded-full">
              See Sample Report
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Jobscall</h3>
              <p className="mb-4">Helping job seekers find their dream jobs with smart tools and expert guidance.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium mb-4">For Job Seekers</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Search Jobs</a></li>
                <li><a href="#" className="hover:text-white">Resume Builder</a></li>
                <li><a href="#" className="hover:text-white">Resume Score Checker</a></li>
                <li><a href="#" className="hover:text-white">Career Advice</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Support</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Mail className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <a href="mailto:support@jobscall.com" className="hover:text-white">support@jobscall.com</a>
                </li>
                <li className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <a href="tel:+919876543210" className="hover:text-white">+91 98765 43210</a>
                </li>
              </ul>
              <div className="mt-4">
                <h4 className="text-white text-sm font-medium mb-2">We accept</h4>
                <div className="flex space-x-2">
                  <span className="text-xs bg-white text-gray-800 px-2 py-1 rounded">Visa</span>
                  <span className="text-xs bg-white text-gray-800 px-2 py-1 rounded">Mastercard</span>
                  <span className="text-xs bg-white text-gray-800 px-2 py-1 rounded">UPI</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm">© {new Date().getFullYear()} Jobscall. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-sm hover:text-white">Privacy Policy</a>
                <a href="#" className="text-sm hover:text-white">Terms of Service</a>
                <a href="#" className="text-sm hover:text-white">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
