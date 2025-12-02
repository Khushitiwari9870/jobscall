'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getMyApplications, getDashboardStats, getRecentActivities } from '@/lib/api/services/dashboardService';
import { 
  FiBriefcase, 
  FiCheckCircle, 
  FiMessageSquare,
  FiSearch,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiEdit2,
  FiStar,
  FiBell
} from 'react-icons/fi';

type JobStatus = 'applied' | 'interview' | 'offer' | 'rejected';

interface Job {
  id: string;
  title: string;
  company: {
    name: string;
  };
  location: string;
  salary_min: number;
  salary_max: number;
}

interface Application {
  id: string;
  job: Job;
  status: JobStatus;
  applied_at: string;
  isFavorite?: boolean;
}

interface ActivityBase {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'application' | 'message' | 'reminder';
}

interface Activity extends ActivityBase {
  icon?: React.ComponentType<{ className?: string }>;
}

// Extended application interface for the UI
interface UIApplication extends Application {
  title: string;
  company: string;
  location: string;
  salary: string;
  date: string;
  isFavorite: boolean;
}

interface StatItem {
  name: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  change: string;
  changeType: 'increase' | 'decrease';
}

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<UIApplication[]>([]);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const [apps, statsData, activitiesData] = await Promise.all([
            getMyApplications(),
            getDashboardStats(),
            getRecentActivities(),
          ]);

          const formattedApplications: UIApplication[] = (apps?.results || []).map((app: unknown) => {
            const application = app as { id: string; job: { title: string; company: { name: string }; location: string; salary_min: number; salary_max: number }; status: string; applied_at: string };
            return {
              id: application.id,
              job: application.job,
              status: application.status.toLowerCase() as JobStatus,
              applied_at: application.applied_at,
              title: application.job.title,
              company: application.job.company.name,
              location: application.job.location,
              salary: `${application.job.salary_min} - ${application.job.salary_max}`,
              date: application.applied_at,
              isFavorite: false,
            };
          });
          setApplications(formattedApplications);

          // Create typed stats array
          const statsArray: StatItem[] = [
            { 
              name: 'Total Applications', 
              value: statsData?.totalApplications || 0, 
              icon: FiBriefcase, 
              change: '+12%', 
              changeType: 'increase' as const 
            },
            { 
              name: 'Interviews', 
              value: statsData?.interviews || 0, 
              icon: FiMessageSquare, 
              change: '+3', 
              changeType: 'increase' as const 
            },
            { 
              name: 'Offers', 
              value: statsData?.offers || 0, 
              icon: FiCheckCircle, 
              change: '+1', 
              changeType: 'increase' as const 
            },
            { 
              name: 'Active Searches', 
              value: statsData?.activeSearches || 0, 
              icon: FiSearch, 
              change: '-2', 
              changeType: 'decrease' as const 
            },
          ];
          setStats(statsArray);

          // Transform activities to include icons
          const formattedActivities: Activity[] = (activitiesData || []).map((activity: unknown) => {
            const act = activity as { id: string; title: string; description: string; time: string; type: string };
            return {
              id: act.id,
              title: act.title,
              description: act.description,
              time: act.time,
              type: act.type as 'application' | 'message' | 'reminder',
              icon: act.type === 'application' 
                ? FiCheckCircle 
                : act.type === 'message' 
                  ? FiMessageSquare 
                  : FiCalendar,
            };
          });
          setRecentActivities(formattedActivities);

        } catch (error) {
          console.error('Failed to fetch dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [user]);



  const getStatusBadge = (status: JobStatus) => {
    const statusClasses = {
      applied: 'bg-blue-100 text-blue-800',
      interview: 'bg-purple-100 text-purple-800',
      offer: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    
    const statusText = {
      applied: 'Applied',
      interview: 'Interview',
      offer: 'Offer',
      rejected: 'Rejected',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <FiBell className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {user?.email || 'User'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {stat.name}
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">
                              {stat.value}
                            </div>
                            <div className={`ml-2 flex items-baseline text-sm font-semibold ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                              {stat.change}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left column */}
              <div className="lg:w-2/3">
                {/* Recent Applications */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                  <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Recent Applications
                      </h3>
                      <Link href="/jobs" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        View all
                      </Link>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden">
                    {isLoading ? (
                      <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500">Loading applications...</p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {applications.slice(0, 5).map((application) => (
                          <li key={application.id} className="hover:bg-gray-50">
                            <Link href={`/applications/${application.id}`} className="block">
                              <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="text-sm font-medium text-blue-600 truncate">
                                      {application.title}
                                    </div>
                                    <div className="ml-2">
                                      <button
                                        type="button"
                                        className={`text-gray-400 hover:text-yellow-500 ${application.isFavorite ? 'text-yellow-500' : ''}`}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          // Toggle favorite
                                        }}
                                      >
                                        <FiStar className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="ml-2 flex-shrink-0 flex">
                                    {getStatusBadge(application.status)}
                                  </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                  <div className="sm:flex">
                                    <div className="flex items-center text-sm text-gray-500">
                                      <FiBriefcase className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                      {application.company}
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                      <FiMapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                      {application.location}
                                    </div>
                                  </div>
                                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                    <FiDollarSign className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                    {application.salary}
                                  </div>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                  <FiCalendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                  Applied on {new Date(application.date).toLocaleDateString()}
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Quick Actions
                    </h3>
                  </div>
                  <div className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Link
                      href="/jobs/new"
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <FiSearch className="mx-auto h-8 w-8 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Search Jobs</h3>
                      <p className="mt-1 text-sm text-gray-500">Find your next opportunity</p>
                    </Link>
                    <Link
                      href="/resume-builder"
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <FiEdit2 className="mx-auto h-8 w-8 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Update Resume</h3>
                      <p className="mt-1 text-sm text-gray-500">Keep your resume current</p>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="lg:w-1/3">
                {/* Upcoming Interviews */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                  <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Upcoming Interviews
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flow-root">
                      <ul className="-mb-8">
                        <li>
                          <div className="relative pb-8">
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                  <FiCalendar className="h-4 w-4 text-white" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    <span className="font-medium text-gray-900">Technical Interview</span> at TechCorp
                                  </p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  <time dateTime="2023-06-20">Jun 20, 2:00 PM</time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="relative pb-8">
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                                  <FiMessageSquare className="h-4 w-4 text-white" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    <span className="font-medium text-gray-900">HR Screening</span> at DesignHub
                                  </p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  <time dateTime="2023-06-22">Jun 22, 11:30 AM</time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-6">
                      <Link
                        href="/interviews"
                        className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        View all interviews
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Recent Activity
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flow-root">
                      <ul className="-mb-8">
                        {recentActivities.map((activity, activityIdx) => (
                          <li key={activity.id}>
                            <div className="relative pb-8">
                              {activityIdx !== recentActivities.length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                              ) : null}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                    activity.type === 'application' ? 'bg-blue-500' : 
                                    activity.type === 'message' ? 'bg-green-500' : 'bg-purple-500'
                                  }`}>
                                    {activity.icon && <activity.icon className="h-4 w-4 text-white" />}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      {activity.title} <span className="font-medium text-gray-900">{activity.description}</span>
                                    </p>
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                    {activity.time}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-6">
                      <Link
                        href="/activity"
                        className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        View all activity
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      );
    };
    
    export default DashboardPage;
