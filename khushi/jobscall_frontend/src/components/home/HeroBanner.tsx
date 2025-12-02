import { FiPlay, FiArrowRight } from 'react-icons/fi';
import Image from 'next/image';

const HeroBanner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center
         justify-between">
          {/* Left side - Content */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <FiPlay className="mr-1" />
                <span>Join Us on YouTube</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Great Careers <br />Start Here
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Find the perfect job that matches your skills and experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-md font-medium flex items-center justify-center transition-colors">
                Find Jobs <FiArrowRight className="ml-2" />
              </button>
              <button className="bg-transparent border-2 border-white hover:bg-white hover:bg-opacity-10 px-6 py-3 rounded-md font-medium flex items-center justify-center transition-colors">
                Post a Job
              </button>
            </div>
            
            <div className="mt-8 flex items-center text-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gray-200"></div>
                ))}
              </div>
              <span className="ml-3 text-blue-100">
                <span className="font-medium">10,000+</span> professionals got jobs last month
              </span>
            </div>
          </div>
          
          {/* Right side - Image */}
          <div className="md:w-1/2 relative">
            <div className="relative">
              <div className="bg-white bg-opacity-10 rounded-2xl p-1 inline-block">
                <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden">
                  <Image
                    src="/hero-image.jpg"
                    alt="Happy professionals"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              
              {/* Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-800 p-4 rounded-xl shadow-lg w-40">
                <div className="text-2xl font-bold text-blue-600">50K+</div>
                <div className="text-sm">Jobs Available</div>
              </div>
              
              {/* Review Card */}
              <div className="absolute -top-6 -right-6 bg-yellow-400 text-yellow-900 p-3 rounded-xl shadow-lg w-48">
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 text-yellow-700" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="mt-1 text-sm font-medium">Rated 4.8/5</div>
                <div className="text-xs">by 10,000+ reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
