import { FiMapPin, FiBriefcase } from 'react-icons/fi';
import Image from 'next/image';

const companies = [
  {
    id: 1,
    name: 'Google',
    logo: '/logos/google.png',
    location: 'Bangalore, India',
    jobs: 124,
    rating: 4.5,
    reviews: 12500,
    hiring: true,
    featured: true
  },
  {
    id: 2,
    name: 'Microsoft',
    logo: '/logos/microsoft.png',
    location: 'Hyderabad, India',
    jobs: 89,
    rating: 4.3,
    reviews: 9800,
    hiring: true,
    featured: true
  },
  {
    id: 3,
    name: 'Amazon',
    logo: '/logos/amazon.png',
    location: 'Bangalore, India',
    jobs: 156,
    rating: 4.1,
    reviews: 15000,
    hiring: true,
    featured: true
  },
  {
    id: 4,
    name: 'Adobe',
    logo: '/logos/adobe.png',
    location: 'Noida, India',
    jobs: 67,
    rating: 4.4,
    reviews: 7500,
    hiring: true,
    featured: false
  },
  {
    id: 5,
    name: 'Netflix',
    logo: '/logos/netflix.png',
    location: 'Mumbai, India',
    jobs: 42,
    rating: 4.6,
    reviews: 5200,
    hiring: true,
    featured: false
  },
  {
    id: 6,
    name: 'Uber',
    logo: '/logos/uber.png',
    location: 'Bangalore, India',
    jobs: 78,
    rating: 4.0,
    reviews: 6800,
    hiring: true,
    featured: false
  },
  {
    id: 7,
    name: 'Airbnb',
    logo: '/logos/airbnb.png',
    location: 'Gurgaon, India',
    jobs: 35,
    rating: 4.2,
    reviews: 4500,
    hiring: true,
    featured: false
  },
  {
    id: 8,
    name: 'Flipkart',
    logo: '/logos/flipkart.png',
    location: 'Bangalore, India',
    jobs: 112,
    rating: 4.0,
    reviews: 8900,
    hiring: true,
    featured: false
  }
];

const TopHiringCompanies = () => {
  const featuredCompanies = companies.filter(company => company.featured);
  const otherCompanies = companies.filter(company => !company.featured);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Top Hiring Companies</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of professionals who found their dream jobs with these leading companies
          </p>
        </div>

        {/* Featured Companies */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} featured />
          ))}
        </div>

        {/* Other Companies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {otherCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
            View All Companies ({companies.length}+)
          </button>
        </div>
      </div>
    </section>
  );
};

interface Company {
  logo: string;
  name: string;
  location: string;
  jobs: number;
  rating: number;
  featured?: boolean;
}

interface CompanyCardProps {
  company: Company;
  featured?: boolean;
}

const CompanyCard = ({ company, featured = false }: CompanyCardProps) => {
  return (
    <div className={`rounded-xl overflow-hidden border ${featured ? 'border-2 border-blue-500 shadow-lg' : 'border-gray-200 shadow-sm'} hover:shadow-md transition-shadow`}>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="h-12 w-12 relative mr-4">
              <Image
                src={company.logo}
                alt={company.name}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{company.name}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <FiMapPin className="mr-1" />
                <span>{company.location}</span>
              </div>
            </div>
          </div>
          {/* {company.hiring && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Hiring
            </span> */}
          {/* )} */}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center text-yellow-500">
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
              <span className="ml-1 text-gray-600 text-sm">{company.rating}</span>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FiBriefcase className="mr-1" />
            <span>{company.jobs} jobs</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium">
            View Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopHiringCompanies;
