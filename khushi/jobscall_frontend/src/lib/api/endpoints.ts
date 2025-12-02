const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.hostname}:8000/api/v1/`
    : 'http://localhost:8000/api/v1/');

export const apiEndpoints = {
  // Auth endpoints (from api_endpoints.txt)
  // These are relative to BASE_URL (which should end with '/api/v1/')
  login: 'auth/login/',
  register: 'auth/register/',
  profile: 'auth/profile/',
  userMe: 'auth/users/me/',
  userProfile: 'auth/profile/',
  changePassword: 'auth/password/change/',
  passwordResetRequest: 'auth/password/reset/',
  passwordResetConfirm: 'auth/password/reset/confirm/',
  refreshToken: 'auth/jwt/refresh/',
  jwtCreate: 'auth/jwt/create/',
  jwtRefresh: 'auth/jwt/refresh/',
  jwtVerify: 'auth/jwt/verify/',
  jwtLogout: 'auth/jwt/logout/',

  // User management endpoints
  users: 'auth/users/',
  getUser: (id: number) => `auth/users/${id}/`,
  candidates: 'users/candidates/',
  getCandidate: (id: number) => `users/candidates/${id}/`,

  // Jobs endpoints
  jobs: 'jobs/jobs/',
  myJobs: 'jobs/jobs/my_jobs/',
  myJobsAlt: 'jobs/my-jobs/',
  jobSearch: 'jobs/search/',
  getJob: (id: number) => `jobs/jobs/${id}/`,
  applyToJob: (id: number) => `jobs/jobs/${id}/apply/`,

  // Job applications endpoints
  jobApplications: (jobId: number) => `jobs/jobs/${jobId}/applications/`,
  getJobApplication: (jobId: number, appId: number) => `jobs/jobs/${jobId}/applications/${appId}/`,
  myApplications: 'jobs/my/applications/',
  getMyApplication: (id: number) => `jobs/my/applications/${id}/`,

  // Applications endpoints (general)
  applications: 'applications/applications/',
  getApplication: (id: number) => `applications/applications/${id}/`,

  // Search endpoints
  candidateSearch: 'candidate-search/search/',
  searchFilters: 'candidate-search/search/filters/',
  searchSuggestions: 'candidate-search/search/suggestions/',
  savedSearches: 'candidate-search/saved-searches/',
  getSavedSearch: (id: number) => `candidate-search/saved-searches/${id}/`,
  runSavedSearch: (id: number) => `candidate-search/saved-searches/${id}/run/`,

  // Job search (alternative endpoint)
  jobSearchAlt: 'search/jobs/',

  // Folder endpoints
  folders: 'folders/folders/',
  getFolder: (id: number) => `folders/folders/${id}/`,
  folderProfiles: 'folders/folder-profiles/',
  getFolderProfile: (id: number) => `folders/folder-profiles/${id}/`,
  addProfilesToFolder: (folderId: number) => `folders/folders/${folderId}/add-profiles/`,

  // Immediate available profiles
  immediateProfiles: 'immediate-available/profiles/',
  myProfile: 'immediate-available/profiles/my-profile/',
  profileSearch: 'immediate-available/profiles/search/',
  getProfile: (id: number) => `immediate-available/profiles/${id}/`,

  // Company endpoints
  companies: 'companies/companies/',
  getCompany: (id: number) => `companies/companies/${id}/`,

  // Email endpoints
  emailCampaigns: 'emails/campaigns/',
  getEmailCampaign: (id: number) => `emails/campaigns/${id}/`,
  sendEmailCampaign: (id: number) => `emails/campaigns/${id}/send/`,
  emailTemplates: 'emails/templates/',
  getEmailTemplate: (id: number) => `emails/templates/${id}/`,
  sendEmail: 'emails/send/',

  // Blog endpoints
  blogPosts: 'blog/posts/',
  getBlogPost: (slug: string) => `blog/posts/${slug}/`,
  blogCategories: 'blog/categories/',
  getBlogCategory: (slug: string) => `blog/categories/${slug}/`,
  blogTags: 'blog/tags/',
  getBlogTag: (slug: string) => `blog/tags/${slug}/`,

  // Learning endpoints
  courses: 'learning/courses/',
  getCourse: (id: number) => `learning/courses/${id}/`,
  certificates: 'learning/certificates/',
  getCertificate: (id: number) => `learning/certificates/${id}/`,
  enrollments: 'learning/enrollments/',
  getEnrollment: (id: number) => `learning/enrollments/${id}/`,

  // Matching endpoints
  candidateEmbeddings: 'match/candidate-embeddings/',
  getCandidateEmbedding: (id: number) => `match/candidate-embeddings/${id}/`,
  jobEmbeddings: 'match/job-embeddings/',
  getJobEmbedding: (id: number) => `match/job-embeddings/${id}/`,
  matchScores: 'match/match-scores/',
  getMatchScore: (id: number) => `match/match-scores/${id}/`,

  // Payment endpoints
  paymentPlans: 'payments/plans/',
  getPaymentPlan: (id: number) => `payments/plans/${id}/`,
  paymentPrices: 'payments/prices/',
  getPaymentPrice: (id: number) => `payments/prices/${id}/`,
  invoices: 'payments/invoices/',
  getInvoice: (id: number) => `payments/invoices/${id}/`,
  paymentIntents: 'payments/payment-intents/',
  getPaymentIntent: (id: number) => `payments/payment-intents/${id}/`,

  // Notification endpoints
  notificationTemplates: 'notifications/templates/',
  getNotificationTemplate: (id: number) => `notifications/templates/${id}/`,
  notificationDeliveries: 'notifications/deliveries/',
  getNotificationDelivery: (id: number) => `notifications/deliveries/${id}/`,

  // Analytics endpoints
  analyticsEvents: 'analytics/events/',
  getAnalyticsEvent: (id: number) => `analytics/events/${id}/`,

  // CMS endpoints
  faqs: 'cms/faqs/',
  getFaq: (id: number) => `cms/faqs/${id}/`,
  pages: 'cms/pages/',
  getPage: (id: number) => `cms/pages/${id}/`,

  // Alert endpoints
  alertSchedules: 'alerts/schedules/',
  getAlertSchedule: (id: number) => `alerts/schedules/${id}/`,
  alertDeliveries: 'alerts/deliveries/',
  getAlertDelivery: (id: number) => `alerts/deliveries/${id}/`,
  alertSavedSearches: 'alerts/saved-searches/',
  getAlertSavedSearch: (id: number) => `alerts/saved-searches/${id}/`,

  // Admin panel endpoints
  adminActivities: 'adminpanel/activities/',
  getAdminActivity: (id: number) => `adminpanel/activities/${id}/`,

  // Search logs endpoints
  searchLogs: 'search/logs/',
  getSearchLog: (id: number) => `search/logs/${id}/`,
  searchSavedSearches: 'search/saved-searches/',
  getSearchSavedSearch: (id: number) => `search/saved-searches/${id}/`,
  executeSavedSearch: (id: number) => `search/saved-searches/${id}/execute/`,

  // Messages endpoints (for future backend integration)
  messagesConversations: 'messages/conversations/',
  getConversation: (id: string) => `messages/conversations/${id}/`,
  conversationMessages: (id: string) => `messages/conversations/${id}/messages/`,
  sendMessage: 'messages/send/',
  markConversationRead: (id: string) => `messages/conversations/${id}/read/`,
};

export const getApiUrl = (path: string) => `${API_BASE_URL}${path}`;
