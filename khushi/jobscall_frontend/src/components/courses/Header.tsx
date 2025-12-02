import Link from 'next/link';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-purple-600">
              JobCall
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Courses, Assessments and Certifications"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-purple-600">
              Home
            </Link>
            <Link href="/jobs" className="text-sm font-medium text-gray-700 hover:text-purple-600">
              Jobs
            </Link>
            <Link href="/job-seeking" className="text-sm font-medium text-gray-700 hover:text-purple-600">
              Job Seeking Assistance
            </Link>
            <Link href="/courses" className="text-sm font-medium text-purple-600 hover:text-purple-700">
              Courses
            </Link>
            <Link href="/career-guidance" className="text-sm font-medium text-gray-700 hover:text-purple-600">
              Career Guidance
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hidden md:flex">
              Download App
            </Button>
            <Button variant="ghost" className="hidden md:flex">
              For Employers
            </Button>
            <Button variant="ghost">Help</Button>
            <Button variant="outline">Login</Button>
            <Button className="bg-purple-600 hover:bg-purple-700">Register</Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
