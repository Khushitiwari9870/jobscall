'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Paperclip } from 'lucide-react';
import { 
  FiStar, 
  FiRefreshCw, 
  FiTrash2, 
  FiArchive, 
  FiAlertCircle, 
  FiSearch, 
  FiChevronLeft, 
  FiChevronRight,
  FiInbox,
} from 'react-icons/fi';
import { Email } from '../types';

export default function InboxPage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;

  const fetchEmails = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/v1/emails/logs/?page=${currentPage}&page_size=${itemsPerPage}&search=${searchQuery}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch emails');
      }

      const data = await response.json();
      setEmails(data.results);
      setTotalPages(Math.ceil(data.count / itemsPerPage));
    } catch (error) {
      console.error('Error fetching emails:', error);
      showToast({
        title: 'Error',
        description: 'Failed to load emails. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, showToast]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const handleSelectEmail = (emailId: string) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmails(emails.map(email => email.id));
    } else {
      setSelectedEmails([]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedEmails.map(id => 
          fetch(`/api/v1/emails/logs/${id}/`, { method: 'DELETE' })
        )
      );
      
      showToast({
        title: 'Success',
        description: 'Selected emails have been deleted.',
      });
      
      setSelectedEmails([]);
      fetchEmails();
    } catch (error) {
      console.error('Error deleting emails:', error);
      showToast({
        title: 'Error',
        description: 'Failed to delete emails. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return date.toLocaleDateString();
  };

  if (isLoading && emails.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Checkbox 
            id="select-all"
            checked={selectedEmails.length > 0 && selectedEmails.length === emails.length}
            onCheckedChange={handleSelectAll}
          />
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchEmails}
            disabled={isLoading}
          >
            <FiRefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {selectedEmails.length > 0 && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDeleteSelected}
                disabled={isLoading}
              >
                <FiTrash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              
              <Button variant="ghost" size="sm" disabled={isLoading}>
                <FiArchive className="h-4 w-4 mr-2" />
                Archive
              </Button>
              
              <Button variant="ghost" size="sm" disabled={isLoading}>
                <FiAlertCircle className="h-4 w-4 mr-2" />
                Mark as Spam
              </Button>
            </>
          )}
        </div>
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search emails..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Email List */}
      <div className="divide-y divide-gray-200">
        {emails.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiInbox className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium">No emails</h3>
            <p className="mt-1 text-sm">Your inbox is empty</p>
          </div>
        ) : (
          emails.map((email) => (
            <div 
              key={email.id} 
              className={`flex items-start p-4 hover:bg-gray-50 cursor-pointer ${
                !email.isRead ? 'bg-blue-50' : ''
              }`}
              onClick={() => router.push(`/recruiter-dashboard/emails/${email.id}`)}
            >
              <div className="flex-shrink-0 pt-1">
                <Checkbox 
                  id={`email-${email.id}`}
                  checked={selectedEmails.includes(email.id)}
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={() => handleSelectEmail(email.id)}
                />
              </div>
              
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-medium ${
                    !email.isRead ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {email.from}
                  </h3>
                  <div className="text-xs text-gray-500">
                    {formatDate(email.sentAt || email.createdAt)}
                  </div>
                </div>
                
                <p className="text-sm text-gray-900 truncate">
                  {email.subject || '(No subject)'}
                </p>
                
                <p className="text-sm text-gray-500 truncate">
                  {email.body.substring(0, 100)}{email.body.length > 100 ? '...' : ''}
                </p>
                
                {email.attachments && email.attachments.length > 0 && (
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <Paperclip  className="h-3 w-3 mr-1" />
                    {email.attachments.length} attachment{email.attachments.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
              
              <div className="ml-2 flex-shrink-0">
                <button 
                  type="button"
                  className="text-gray-400 hover:text-yellow-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Toggle star/favorite
                  }}
                >
                  <FiStar className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
              className="ml-3"
            >
              Next
            </Button>
          </div>
          
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, emails.length + ((currentPage - 1) * itemsPerPage))}
                </span>{' '}
                of <span className="font-medium">{emails.length + ((currentPage - 1) * itemsPerPage)}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                      disabled={isLoading}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || isLoading}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
