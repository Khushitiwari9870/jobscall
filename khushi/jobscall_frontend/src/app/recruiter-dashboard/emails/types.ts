export interface Email {
  id: string;
  subject: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  body: string;
  isRead: boolean;
  isDraft: boolean;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledFor?: string;
  sentAt?: string;
  recipients: Array<{
    email: string;
    status: 'pending' | 'sent' | 'failed';
    error?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EmailSettings {
  id: string;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpUseTls: boolean;
  defaultFromEmail: string;
  defaultFromName: string;
  replyToEmail?: string;
  replyToName?: string;
  dailySendLimit?: number;
}
