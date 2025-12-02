import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiClock, FiUser, FiCalendar, FiChevronRight } from 'react-icons/fi';

// Mock data - replace with actual API calls
const featuredPost = {
  id: 1,
  title: '10 Tips for Acing Your Next Job Interview',
  excerpt: 'Learn the most effective strategies to impress your interviewers and land your dream job with these expert tips.',
  image: 'https://picsum.photos/800/500?random=1',
  author: 'Priya Sharma',
  date: 'Oct 5, 2023',
  readTime: '5 min read',
  category: 'Career Guidance'
};

const categories = [
  'Live Job Update',
  'Interview Questions',
  'Career Guidance',
  'Job Application',
  'Leave Application',
  'Resume Format',
  'Salary',
  'Generic',
  'Export Edge',
  'Popular Courses',
  'Contributors'
];

const popularJobs = [
  'Software Engineer',
  'Product Manager',
  'Data Scientist',
  'UX Designer',
  'Digital Marketer'
];

const topCities = [
  'Bangalore',
  'Mumbai',
  'Delhi NCR',
  'Hyderabad',
  'Pune',
  'Chennai'
];

const contributors = [
  { name: 'Rahul Verma', avatar: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Priya Patel', avatar: 'https://i.pravatar.cc/150?img=2' },
  { name: 'Amit Kumar', avatar: 'https://i.pravatar.cc/150?img=3' },
  { name: 'Neha Gupta', avatar: 'https://i.pravatar.cc/150?img=4' },
];

// Mock post data - replace with actual API call
const getPostsByCategory = (category: string) => {
  // In a real app, this would be an API call
  return Array(5).fill({
    id: Math.random().toString(36).substr(2, 9),
    title: `${category} Article ${Math.floor(Math.random() * 10) + 1}`,
    excerpt: `This is a sample excerpt for a ${category.toLowerCase()} article.`,
    image: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`,
    author: 'Author Name',
    date: 'Oct 2023',
    readTime: `${Math.floor(Math.random() * 8) + 2} min read`
  });
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Featured Post */}
        <section className="mb-12 bg-white rounded-xl overflow-hidden shadow-md">
          <div className="md:flex">
            <div className="md:w-2/3 p-8">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                {featuredPost.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{featuredPost.title}</h1>
              <p className="text-gray-600 text-lg mb-6">{featuredPost.excerpt}</p>
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <div className="flex items-center mr-6">
                  <FiUser className="mr-1" />
                  <span>{featuredPost.author}</span>
                </div>
                <div className="flex items-center mr-6">
                  <FiCalendar className="mr-1" />
                  <span>{featuredPost.date}</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-1" />
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
              <Link 
                href={`/blog/${featuredPost.id}`}
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
              >
                Read full article <FiArrowRight className="ml-1" />
              </Link>
            </div>
            <div className="md:w-1/3 h-64 md:h-auto">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                width={500}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Category Sections */}
        {categories.map((category) => (
          <section key={category} className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
              <Link 
                href={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-blue-600 hover:underline flex items-center text-sm font-medium"
              >
                View all <FiChevronRight className="ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getPostsByCategory(category).map((post) => (
                <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-100 relative">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{post.author}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Popular Jobs & Top Cities */}
        <section className="bg-white p-6 rounded-xl shadow-sm mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Jobs</h3>
              <div className="flex flex-wrap gap-2">
                {popularJobs.map((job) => (
                  <Link 
                    key={job} 
                    href={`/jobs?q=${encodeURIComponent(job)}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                  >
                    {job}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Cities</h3>
              <div className="flex flex-wrap gap-2">
                {topCities.map((city) => (
                  <Link 
                    key={city} 
                    href={`/jobs?location=${encodeURIComponent(city)}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                  >
                    {city}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contributors */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Top Contributors</h2>
          <div className="flex flex-wrap gap-6">
            {contributors.map((contributor, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mb-2">
                  <Image
                    src={contributor.avatar}
                    alt={contributor.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">{contributor.name}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
            <div className="col-span-2">
              <h3 className="text-xl font-bold mb-4">JobCall</h3>
              <p className="text-gray-400 mb-4">Find your dream job with our comprehensive job search platform.</p>
              <div className="flex space-x-4">
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
            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Browse Jobs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Salary Tools</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Career Advice</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Resume Builder</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">For Employers</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Post a Job</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Browse Candidates</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Recruiting Solutions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">© {new Date().getFullYear()} JobCall. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-sm text-gray-400 hover:text-white">Privacy Policy</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white">Terms of Service</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
