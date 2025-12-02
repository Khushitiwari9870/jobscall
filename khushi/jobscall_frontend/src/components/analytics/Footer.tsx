'use client';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap justify-center md:justify-start space-x-4 md:space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
              Help Center
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
              About Us
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
              Terms & Conditions
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
              Contact Us
            </a>
          </div>
          <div className="mt-4 md:mt-0 text-center md:text-right">
            <p className="text-sm text-gray-500">
              Support: support@shine.com | 1800-123-4567
            </p>
            <p className="text-xs text-gray-400 mt-1">
              © {new Date().getFullYear()} Jobscall.com. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
