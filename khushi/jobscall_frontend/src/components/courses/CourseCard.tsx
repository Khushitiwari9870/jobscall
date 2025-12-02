import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CourseMode = 'Online' | 'Offline' | 'Hybrid';

interface CourseCardProps {
  id: string;
  type: 'Course' | 'Assessment with Certification';
  title: string;
  provider: string;
  rating: number; // Should be between 0 and 5
  duration: string; // e.g., '3 months', '6 weeks'
  hours: number;
  mode: CourseMode;
  price: number;
  originalPrice: number;
  discount: number; // Should be between 0 and 100
}

export default function CourseCard({
  title,
  provider,
  rating,
  duration,
  hours,
  mode,
  price,
  originalPrice,
  discount,
}: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
            {mode}
          </span>
          <div className="flex items-center text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm text-gray-700">{rating}</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 h-14">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{provider}</p>
        
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-4">
          <div>
            <div className="font-medium">Duration</div>
            <div>{duration}</div>
          </div>
          <div>
            <div className="font-medium">Hours</div>
            <div>{hours} Hrs</div>
          </div>
          <div>
            <div className="font-medium">Mode</div>
            <div>{mode}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-2xl font-bold">₹{price.toLocaleString()}</span>
            <span className="ml-2 text-sm text-gray-500 line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
            <span className="ml-2 text-sm font-medium text-green-600">
              {discount}% OFF
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <Button variant="outline" className="flex-1 border-purple-600 text-purple-600 hover:bg-purple-50">
            Explore
          </Button>
          <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
