'use client';

import { format } from 'date-fns';
import { FiCalendar, FiChevronDown, FiFilter } from 'react-icons/fi';

interface FilterBarProps {
  dateRange: { startDate: Date; endDate: Date };
  onDateRangeChange: (range: { startDate: Date; endDate: Date }) => void;
  selectedDays: string;
  onDaysChange: (value: string) => void;
  selectedUser: string;
  onUserChange: (value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  dateRange,
  onDateRangeChange,
  selectedDays,
  onDaysChange,
  selectedUser,
  onUserChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
        <div className="flex-1">
          <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center border border-gray-300 rounded-md">
              <input
                type="date"
                className="block w-full pl-10 pr-3 py-2 border-0 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-l-md"
                value={format(dateRange.startDate, 'yyyy-MM-dd')}
                onChange={(e) =>
                  onDateRangeChange({
                    ...dateRange,
                    startDate: new Date(e.target.value),
                  })
                }
              />
              <span className="px-2 text-gray-500">to</span>
              <input
                type="date"
                className="block w-full pl-3 pr-10 py-2 border-0 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-r-md"
                value={format(dateRange.endDate, 'yyyy-MM-dd')}
                onChange={(e) =>
                  onDateRangeChange({
                    ...dateRange,
                    endDate: new Date(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-64">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Choose Days
          </label>
          <div className="flex space-x-2">
            {['today', 'yesterday', 'last7', 'last30'].map((value) => (
              <button
                key={value}
                type="button"
                className={`px-3 py-1 text-sm rounded-md ${
                  selectedDays === value
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => onDaysChange(value)}
              >
                {value === 'today' && 'Today'}
                {value === 'yesterday' && 'Yesterday'}
                {value === 'last7' && 'Last 7 Days'}
                {value === 'last30' && 'Last 30 Days'}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full md:w-48">
          <label htmlFor="user-filter" className="block text-sm font-medium text-gray-700 mb-1">
            User/Label
          </label>
          <div className="relative">
            <select
              id="user-filter"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
              value={selectedUser}
              onChange={(e) => onUserChange(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="user1">User 1</option>
              <option value="user2">User 2</option>
              <option value="user3">User 3</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <FiFilter className="mr-2 h-4 w-4" />
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
