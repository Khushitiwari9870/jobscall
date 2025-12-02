import { Search, RefreshCw, User, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const options = [
  {
    id: 1,
    title: 'Find the right job',
    description: 'Discover jobs that match your skills and experience',
    icon: <Search className="h-12 w-12 text-purple-600 mb-4" />,
  },
  {
    id: 2,
    title: 'Make a career change',
    description: 'Explore new career paths that suit your interests',
    icon: <RefreshCw className="h-12 w-12 text-purple-600 mb-4" />,
  },
  {
    id: 3,
    title: 'Improve your profile',
    description: 'Enhance your resume and online presence',
    icon: <User className="h-12 w-12 text-purple-600 mb-4" />,
  },
  {
    id: 4,
    title: 'Progress your career',
    description: 'Take the next step in your professional journey',
    icon: <TrendingUp className="h-12 w-12 text-purple-600 mb-4" />,
  },
];

export default function RecommendationWizard() {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      {/* Step Indicator */}
      <div className="flex justify-between items-center mb-12">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {step}
            </div>
            <span className="mt-2 text-sm text-gray-600">Step {step}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8">
          How can we help you? Make your choice to go ahead
        </h2>
        
        {/* Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {options.map((option) => (
            <div 
              key={option.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center"
            >
              {option.icon}
              <h3 className="text-xl font-medium text-gray-800 mb-2">{option.title}</h3>
              <p className="text-gray-600 mb-4">{option.description}</p>
              <Button variant="outline" className="mt-auto border-purple-600 text-purple-600 hover:bg-purple-50">
                Select
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Already have an account? <a href="/login" className="text-purple-600 hover:underline">Sign in</a> for personalized recommendations</p>
        </div>
      </div>
    </div>
  );
}
