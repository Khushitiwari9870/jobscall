import { apiRequest } from '../apiClient';

export interface Notification {
  id: number;
  user: number;
  title: string;
  message: string;
  is_read: boolean;
  notification_type: 'info' | 'success' | 'warning' | 'error' | 'job_alert' | 'application_update';
  related_url?: string;
  created_at: string;
  read_at?: string;
}

export interface NotificationListParams {
  is_read?: boolean;
  notification_type?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export const notificationService = {
  // Get all notifications for the current user
  getMyNotifications: async (params?: NotificationListParams) => {
    return apiRequest<{ count: number; next: string | null; previous: string | null; results: Notification[] }>(
      'get',
      '/notifications/',
      undefined,
      { params }
    );
  },

  // Get a single notification by ID
  getNotification: async (id: number): Promise<Notification> => {
    return apiRequest<Notification>('get', `/notifications/${id}/`);
  },

  // Mark a notification as read
  markAsRead: async (id: number): Promise<Notification> => {
    return apiRequest<Notification>('patch', `/notifications/${id}/`, { is_read: true });
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<{ count: number }> => {
    return apiRequest<{ count: number }>('post', '/notifications/mark-all-as-read/');
  },

  // Get unread notifications count
  getUnreadCount: async (): Promise<{ count: number }> => {
    return apiRequest<{ count: number }>('get', '/notifications/unread-count/');
  },

  // Subscribe to push notifications
  subscribeToPushNotifications: async (subscription: PushSubscription): Promise<void> => {
    return apiRequest('post', '/notifications/subscribe/', {
      endpoint: subscription.endpoint,
      keys: subscription.toJSON().keys,
    });
  },
};
