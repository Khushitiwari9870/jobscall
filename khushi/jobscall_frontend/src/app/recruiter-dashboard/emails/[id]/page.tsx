'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/api/apiClient';
import { Badge } from '@/components/ui/badge';
import {
  FiArrowLeft,
  FiCornerUpLeft as FiReply,
  FiCornerUpRight as FiForward,
  FiTrash2,
  FiArchive,
  FiPaperclip,
  FiDownload
} from 'react-icons/fi';
import { Email } from '../types';

export default function EmailDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const emailId = params.id as string;

  const [email, setEmail] = useState<Email | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        setIsLoading(true);
        // Use the API client to fetch the email from Django backend
        const response = await axiosInstance.get(`/api/emails/emails/${emailId}/`);
        setEmail(response.data);
      } catch (error) {
        console.error('Error fetching email:', error);
        showToast({
          title: 'Error',
          description: 'Failed to load email. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (emailId) {
      fetchEmail();
    }
  }, [emailId, showToast]);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/emails/emails/${emailId}/`);

      showToast({
        title: 'Success',
        description: 'Email deleted successfully.',
      });

      router.push('/recruiter-dashboard/emails/inbox');
    } catch (error) {
      console.error('Error deleting email:', error);
      showToast({
        title: 'Error',
        description: 'Failed to delete email. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Email not found</h3>
          <p className="text-gray-500">The email you&apos;re looking for doesn&apos;t exist.</p>
          <Button
            onClick={() => router.push('/recruiter-dashboard/emails/inbox')}
            className="mt-4"
          >
            Back to Inbox
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/recruiter-dashboard/emails/inbox')}
          >
            <FiArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 truncate">
            {email.subject || '(No subject)'}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <FiReply className="h-4 w-4 mr-2" />
            Reply
          </Button>
          <Button variant="ghost" size="sm">
            <FiForward className="h-4 w-4 mr-2" />
            Forward
          </Button>
          <Button variant="ghost" size="sm">
            <FiArchive className="h-4 w-4 mr-2" />
            Archive
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <FiTrash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Email Content */}
      <div className="p-6">
        {/* Email Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <span className="font-medium">From:</span>
                <span>{email.from}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <span className="font-medium">To:</span>
                <span>{Array.isArray(email.to) ? email.to.join(', ') : email.to}</span>
              </div>
              {email.cc && email.cc.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <span className="font-medium">CC:</span>
                  <span>{Array.isArray(email.cc) ? email.cc.join(', ') : email.cc}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-2">
                {formatDate(email.sentAt || email.createdAt)}
              </div>
              <Badge variant={email.isRead ? 'secondary' : 'default'}>
                {email.isRead ? 'Read' : 'Unread'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-900">
            {email.body}
          </div>
        </div>

        {/* Attachments */}
        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Attachments</h3>
            <div className="space-y-2">
              {email.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FiPaperclip className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                      <p className="text-xs text-gray-500">
                        {(attachment.size / 1024 / 1024).toFixed(2)} MB • {attachment.type}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <FiDownload className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
