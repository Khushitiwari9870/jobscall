import { Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FiltersBar() {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
        </div>
        
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
            <option>Category</option>
            <option>IT & Software</option>
            <option>Business</option>
            <option>Design</option>
          </select>
          <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
        
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
            <option>Skills</option>
            <option>JavaScript</option>
            <option>React</option>
            <option>Node.js</option>
          </select>
          <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
        
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
            <option>Provider</option>
            <option>Udemy</option>
            <option>Coursera</option>
            <option>edX</option>
          </select>
          <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
        
        <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">
          More filters
        </Button>
        
        <div className="ml-auto text-sm text-gray-500">
          Showing 1-10 of 1,234 courses
        </div>
      </div>
    </div>
  );
}
