import { GraduationCap } from 'lucide-react';

export default function TitleBar() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-4">
          <GraduationCap className="h-8 w-8 text-white" />
          <h1 className="text-3xl md:text-4xl font-bold">
            Career Guidance with personalized recommendations
          </h1>
        </div>
      </div>
    </div>
  );
}
