import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiCalendar, FiClock, FiShare2, FiFacebook, FiTwitter, FiLinkedin, FiBookmark } from 'react-icons/fi';

// Mock data - in a real app, this would be fetched from an API
const getBlogPost = (id: string) => {
  // This is mock data - replace with actual API call
  const posts = [
    {
      id: '1',
      title: '10 Tips for Acing Your Next Job Interview',
      content: `
        <p>Job interviews can be nerve-wracking, but with the right preparation, you can make a great impression. Here are some expert tips to help you succeed:</p>
        
        <h2>1. Research the Company</h2>
        <p>Before your interview, take time to research the company. Understand their mission, values, products, and recent news. This shows your genuine interest in the organization.</p>
        
        <h2>2. Practice Common Questions</h2>
        <p>Prepare answers for common interview questions like "Tell me about yourself" and "What are your strengths and weaknesses?" Practice with a friend or in front of a mirror.</p>
        
        <h2>3. Dress Appropriately</h2>
        <p>Dress professionally, even for video interviews. When in doubt, it's better to be slightly overdressed than underdressed.</p>
        
        <h2>4. Bring Necessary Materials</h2>
        <p>Carry extra copies of your resume, a notepad, and a pen. Have a list of questions prepared to ask the interviewer.</p>
        
        <h2>5. Use the STAR Method</h2>
        <p>When answering behavioral questions, structure your responses using the STAR method (Situation, Task, Action, Result) to provide clear and concise answers.</p>
      `,
      excerpt: 'Learn the most effective strategies to impress your interviewers and land your dream job with these expert tips.',
      image: 'https://picsum.photos/1200/600?random=1',
      author: 'Priya Sharma',
      authorRole: 'Senior HR Manager',
      authorImage: 'https://i.pravatar.cc/150?img=5',
      date: 'Oct 5, 2023',
      readTime: '8 min read',
      category: 'Career Guidance',
      tags: ['interview', 'career', 'job search']
    }
  ];
  
  return posts.find(post => post.id === id) || null;
};

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = getBlogPost(params.id);
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <FiArrowLeft className="mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">JobCall</Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/jobs" className="text-gray-700 hover:text-blue-600">Jobs</Link>
              <Link href="/companies" className="text-gray-700 hover:text-blue-600">Companies</Link>
              <Link href="/blog" className="text-blue-600 font-medium">Blog</Link>
              <Link href="/courses" className="text-gray-700 hover:text-blue-600">Courses</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-blue-600">Sign In</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <FiArrowLeft className="mr-2" />
            Back to Blog
          </Link>
          
          <article className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Featured Image */}
            <div className="h-64 md:h-96 relative">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <div className="p-6 md:p-8">
              {/* Category and Date */}
              <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">
                  {post.category}
                </span>
                <span className="flex items-center mr-4">
                  <FiCalendar className="mr-1.5 h-4 w-4" />
                  {post.date}
                </span>
                <span className="flex items-center">
                  <FiClock className="mr-1.5 h-4 w-4" />
                  {post.readTime}
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {post.title}
              </h1>
              
              {/* Author */}
              <div className="flex items-center mb-8">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={post.authorImage}
                    alt={post.author}
                    width={48}
                    height={48}
                    className="object-cover h-full w-full"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-500">{post.authorRole}</p>
                </div>
                <div className="ml-auto flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <FiShare2 className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <FiBookmark className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div 
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Share Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Share this article</h3>
                <div className="flex space-x-4">
                  <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                    <FiFacebook className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-full bg-blue-100 text-blue-400 hover:bg-blue-200">
                    <FiTwitter className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200">
                    <FiLinkedin className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </article>
          
          {/* Author Bio */}
          <div className="mt-12 bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="h-20 w-20 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
                <Image
                  src={post.authorImage}
                  alt={post.author}
                  width={80}
                  height={80}
                  className="object-cover h-full w-full"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg font-medium text-gray-900">About {post.author}</h3>
                <p className="text-gray-600 mt-1">{post.authorRole}</p>
                <p className="mt-2 text-gray-600">
                  {post.author} is a seasoned HR professional with over 10 years of experience in talent acquisition 
                  and career development. She specializes in helping job seekers present their best selves during interviews.
                </p>
              </div>
            </div>
          </div>
          
          {/* Related Articles */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="h-48 relative">
                    <Image
                      src={`https://picsum.photos/600/400?random=${100 + i}`}
                      alt={`Related article ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      <Link href={`/blog/${i + 1}`} className="hover:text-blue-600">
                        {i === 1 ? 'How to Write a Standout Resume' : 'Top 5 Interview Mistakes to Avoid'}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {i === 1 
                        ? 'Learn the key elements that make your resume stand out from the competition.'
                        : 'Common pitfalls that can cost you the job and how to avoid them.'
                      }
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="flex items-center">
                        <FiCalendar className="mr-1.5 h-4 w-4" />
                        {i === 1 ? 'Sep 28, 2023' : 'Sep 21, 2023'}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <FiClock className="mr-1.5 h-4 w-4" />
                        {i === 1 ? '6 min read' : '5 min read'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">JobCall</h3>
              <p className="text-gray-400">Connecting talent with opportunity through innovative job search solutions.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li><Link href="/jobs" className="text-gray-400 hover:text-white">Browse Jobs</Link></li>
                <li><Link href="/resume-builder" className="text-gray-400 hover:text-white">Resume Builder</Link></li>
                <li><Link href="/career-advice" className="text-gray-400 hover:text-white">Career Advice</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">For Employers</h4>
              <ul className="space-y-2">
                <li><Link href="/post-job" className="text-gray-400 hover:text-white">Post a Job</Link></li>
                <li><Link href="/find-candidates" className="text-gray-400 hover:text-white">Find Candidates</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} JobCall. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
