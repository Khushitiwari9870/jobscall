import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useRef } from 'react';
import Image from 'next/image';

const companies = [
  { id: 1, name: 'Google', logo: '/logos/google.png', rating: 4.5, reviews: 12500 },
  { id: 2, name: 'Microsoft', logo: '/logos/microsoft.png', rating: 4.3, reviews: 9800 },
  { id: 3, name: 'Amazon', logo: '/logos/amazon.png', rating: 4.1, reviews: 15000 },
  { id: 4, name: 'Adobe', logo: '/logos/adobe.png', rating: 4.4, reviews: 7500 },
  { id: 5, name: 'Netflix', logo: '/logos/netflix.png', rating: 4.6, reviews: 5200 },
  { id: 6, name: 'Uber', logo: '/logos/uber.png', rating: 4.0, reviews: 6800 },
  { id: 7, name: 'Airbnb', logo: '/logos/airbnb.png', rating: 4.2, reviews: 4500 },
];

const CoolPlacesToWork = () => {
  const scrollContainer = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainer.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Cool Places to Work</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Scroll left"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Scroll right"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="relative">
          <div 
            ref={scrollContainer}
            className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {companies.map((company) => (
              <div 
                key={company.id}
                className="flex-shrink-0 w-64 bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-100"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 mb-4 relative">
                    <Image
                      src={company.logo}
                      alt={company.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{company.name}</h3>
                  <div className="flex items-center text-yellow-500 text-sm mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(company.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-gray-600">{company.rating}</span>
                  </div>
                  <p className="text-sm text-gray-500">{company.reviews.toLocaleString()} reviews</p>
                  <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View Jobs ({Math.floor(Math.random() * 100) + 10}+)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-8">
          <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center mx-auto">
            View all companies <FiChevronRight className="ml-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CoolPlacesToWork;
