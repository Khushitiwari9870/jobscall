'use client';

import { useState, useEffect } from 'react';
import { getMyActivities } from '@/lib/api/services/activityService';
import { FiBell, FiBriefcase, FiMessageSquare, FiUser } from 'react-icons/fi';

interface Activity {
  id: string;
  type: string;
  verb?: string;
  target?: string;
  action_object?: string;
  timestamp: string;
}

const ActivityPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <FiBriefcase className="h-5 w-5 text-white" />;
      case 'message':
        return <FiMessageSquare className="h-5 w-5 text-white" />;
      case 'profile_view':
        return <FiUser className="h-5 w-5 text-white" />;
      case 'alert':
        return <FiBell className="h-5 w-5 text-white" />;
      default:
        return <FiBell className="h-5 w-5 text-white" />;
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case 'application':
        return 'bg-blue-500';
      case 'message':
        return 'bg-green-500';
      case 'profile_view':
        return 'bg-purple-500';
      case 'alert':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

    useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        const data = await getMyActivities();
        setActivities(data.results);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Activity Feed</h1>
        </div>
      </header>
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flow-root">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">Loading activity...</p>
            </div>
          ) : activities.length > 0 ? (
            <ul className="-mb-8">
              {activities.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== activities.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getIconBgColor(activity.type)}`}>
                          {getIcon(activity.type)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">{activity.verb}</p>
                          <p className="font-medium text-gray-900">{activity.target || activity.action_object}</p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime={activity.timestamp}>{new Date(activity.timestamp).toLocaleString()}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <FiBell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No recent activity</h3>
              <p className="mt-1 text-sm text-gray-500">Your recent activities will appear here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ActivityPage;
