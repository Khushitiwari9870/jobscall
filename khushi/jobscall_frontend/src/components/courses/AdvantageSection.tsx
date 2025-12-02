import { Shield, Briefcase, Headset, Award, Clock, Users } from 'lucide-react';
import { Advantage } from '@/types/courses';

const advantages: Advantage[] = [
  {
    id: '1',
    title: 'Fanatical support for outcome',
    description: 'Dedicated support team to help you succeed in your learning journey.',
    icon: 'support',
  },
  {
    id: '2',
    title: 'Job Assistance',
    description: 'Get help with resume building, interview preparation, and job search.',
    icon: 'briefcase',
  },
  {
    id: '3',
    title: 'Certificate of Completion',
    description: 'Earn a verifiable certificate upon course completion.',
    icon: 'award',
  },
  {
    id: '4',
    title: 'Learn at your own pace',
    description: 'Lifetime access to course materials and self-paced learning.',
    icon: 'clock',
  },
  {
    id: '5',
    title: 'Community Support',
    description: 'Join a community of learners and get your doubts resolved.',
    icon: 'users',
  },
];

const iconMap = {
  support: <Headset className="h-8 w-8 text-purple-600" />,
  briefcase: <Briefcase className="h-8 w-8 text-purple-600" />,
  award: <Award className="h-8 w-8 text-purple-600" />,
  clock: <Clock className="h-8 w-8 text-purple-600" />,
  users: <Users className="h-8 w-8 text-purple-600" />,
};

export default function AdvantageSection() {
  return (
    <section className="bg-purple-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Jobscall Advantage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {advantages.map((advantage) => (
            <div key={advantage.id} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="flex justify-center mb-4">
                {iconMap[advantage.icon as keyof typeof iconMap] || (
                  <Shield className="h-8 w-8 text-purple-600" />
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2">{advantage.title}</h3>
              <p className="text-sm text-gray-600">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
