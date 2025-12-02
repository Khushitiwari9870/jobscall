'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiPlus,
  FiRefreshCw,
  FiClock,
  FiSend,
  FiUsers,
  FiFileText,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledFor?: string;
  sentAt?: string;
  recipients: number;
  opened: number;
  clicked: number;
  createdAt: string;
  updatedAt: string;
}

export default function EmailCampaignsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchCampaigns = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/v1/emails/campaigns/?page=${currentPage}&page_size=${itemsPerPage}&search=${searchQuery}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      
      const data = await response.json();
      setCampaigns(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      showToast({
        title: 'Error',
        description: 'Failed to load email campaigns. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, showToast]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleSelectCampaign = (campaignId: string) => {
    setSelectedCampaigns(prev => 
      prev.includes(campaignId) 
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCampaigns(campaigns.map(campaign => campaign.id));
    } else {
      setSelectedCampaigns([]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedCampaigns.map(id => 
          fetch(`/api/v1/emails/campaigns/${id}/`, { method: 'DELETE' })
        )
      );
      
      showToast({
        title: 'Success',
        description: 'Selected campaigns have been deleted.',
      });
      
      setSelectedCampaigns([]);
      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaigns:', error);
      showToast({
        title: 'Error',
        description: 'Failed to delete campaigns. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      sending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading && campaigns.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="border-b border-gray-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Checkbox 
            id="select-all"
            checked={selectedCampaigns.length > 0 && selectedCampaigns.length === campaigns.length}
            onCheckedChange={handleSelectAll}
          />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push('/recruiter-dashboard/emails/campaigns/new')}
          >
            <FiPlus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchCampaigns}
            disabled={isLoading}
          >
            <FiRefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {selectedCampaigns.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDeleteSelected}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700"
            >
              <FiTrash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          )}
        </div>
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search campaigns..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {campaigns.length === 0 ? (
          <div className="p-8 text-center">
            <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new campaign</p>
            <div className="mt-6">
              <Button
                onClick={() => router.push('/recruiter-dashboard/emails/campaigns/new')}
              >
                <FiPlus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </div>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <div 
              key={campaign.id} 
              className="flex items-start p-4 hover:bg-gray-50"
            >
              <div className="flex-shrink-0 pt-1">
                <Checkbox 
                  id={`campaign-${campaign.id}`}
                  checked={selectedCampaigns.includes(campaign.id)}
                  onCheckedChange={() => handleSelectCampaign(campaign.id)}
                />
              </div>
              
              <div 
                className="ml-3 flex-1 min-w-0 cursor-pointer"
                onClick={() => router.push(`/recruiter-dashboard/emails/campaigns/${campaign.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-gray-900">
                      {campaign.name || 'Untitled Campaign'}
                    </h3>
                    <div className="ml-2">
                      {getStatusBadge(campaign.status)}
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="flex items-center mr-2">
                      <FiClock className="h-3.5 w-3.5 text-gray-400 mr-1" />
                      {campaign.status === 'scheduled' ? (
                        `Scheduled for ${campaign.scheduledFor ? formatDate(campaign.scheduledFor) : 'N/A'}`
                      ) : campaign.status === 'sent' && campaign.sentAt ? (
                        `Sent on ${formatDate(campaign.sentAt)}`
                      ) : (
                        `Updated ${formatDate(campaign.updatedAt)}`
                      )}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {campaign.subject || 'No subject'}
                </p>
                
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FiUsers className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{campaign.recipients} recipients</span>
                  </div>
                  {campaign.status === 'sent' && (
                    <>
                      <div className="flex items-center">
                        <span className="text-blue-600 font-medium">
                          {Math.round((campaign.opened / campaign.recipients) * 100) || 0}%
                        </span>
                        <span className="ml-1">opened</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 font-medium">
                          {Math.round((campaign.clicked / campaign.recipients) * 100) || 0}%
                        </span>
                        <span className="ml-1">clicked</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="ml-2 flex-shrink-0 flex space-x-1">
                {campaign.status === 'draft' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/recruiter-dashboard/emails/campaigns/${campaign.id}/edit`);
                    }}
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </Button>
                )}
                
                {campaign.status === 'draft' && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to send this campaign now?')) {
                        try {
                          const response = await fetch(`/api/v1/emails/campaigns/${campaign.id}/send/`, {
                            method: 'POST',
                          });
                          
                          if (!response.ok) {
                            throw new Error('Failed to send campaign');
                          }
                          
                          showToast({
                            title: 'Success',
                            description: 'Campaign has been queued for sending.',
                          });
                          
                          fetchCampaigns();
                        } catch (error) {
                          console.error('Error sending campaign:', error);
                          showToast({
                            title: 'Error',
                            description: 'Failed to send campaign. Please try again.',
                            variant: 'destructive',
                          });
                        }
                      }
                    }}
                  >
                    <FiSend className="h-4 w-4 text-green-600" />
                  </Button>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this campaign?')) {
                      try {
                        await fetch(`/api/v1/emails/campaigns/${campaign.id}/`, { 
                          method: 'DELETE' 
                        });
                        showToast({
                          title: 'Success',
                          description: 'Campaign has been deleted.',
                        });
                        fetchCampaigns();
                      } catch (error) {
                        console.error('Error deleting campaign:', error);
                        showToast({
                          title: 'Error',
                          description: 'Failed to delete campaign. Please try again.',
                          variant: 'destructive',
                        });
                      }
                    }
                  }}
                >
                  <FiTrash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      
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
                  {Math.min(currentPage * itemsPerPage, campaigns.length + ((currentPage - 1) * itemsPerPage))}
                </span>{' '}
                of <span className="font-medium">{campaigns.length + ((currentPage - 1) * itemsPerPage)}</span> campaigns
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
