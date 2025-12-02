'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { FiRefreshCw } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FiEdit2,
  FiTrash2, 
  FiSearch, 
  FiChevronLeft, 
  FiChevronRight,
  FiFileText,
  FiClock,
  FiPaperclip
} from 'react-icons/fi';
import { Email } from '../types';

export default function DraftsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [drafts, setDrafts] = useState<Email[]>([]);
  const [selectedDrafts, setSelectedDrafts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;

  const fetchDrafts = useCallback(async () => {
    try {
      setIsLoading(true);
      // Filter for draft emails by adding a query parameter
      const response = await fetch(
        `/api/v1/emails/logs/?page=${currentPage}&page_size=${itemsPerPage}&search=${searchQuery}&is_draft=true`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch drafts');
      }
      
      const data = await response.json();
      setDrafts(data.results);
      setTotalPages(Math.ceil(data.count / itemsPerPage));
    } catch (error) {
      console.error('Error fetching drafts:', error);
      showToast({
        title: 'Error',
        description: 'Failed to load drafts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, showToast]);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  const handleSelectDraft = (draftId: string) => {
    setSelectedDrafts(prev => 
      prev.includes(draftId) 
        ? prev.filter(id => id !== draftId)
        : [...prev, draftId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDrafts(drafts.map(draft => draft.id));
    } else {
      setSelectedDrafts([]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedDrafts.map(id => 
          fetch(`/api/v1/emails/logs/${id}/`, { method: 'DELETE' })
        )
      );
      
      showToast({
        title: 'Success',
        description: 'Selected drafts have been deleted.',
      });
      
      setSelectedDrafts([]);
      fetchDrafts();
    } catch (error) {
      console.error('Error deleting drafts:', error);
      showToast({
        title: 'Error',
        description: 'Failed to delete drafts. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleEditDraft = (draftId: string) => {
    router.push(`/recruiter-dashboard/emails/compose?draftId=${draftId}`);
  };

  if (isLoading && drafts.length === 0) {
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
            checked={selectedDrafts.length > 0 && selectedDrafts.length === drafts.length}
            onCheckedChange={handleSelectAll}
          />
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchDrafts}
            disabled={isLoading}
          >
            <FiRefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {selectedDrafts.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDeleteSelected}
              disabled={isLoading}
            >
              <FiTrash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search drafts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Drafts List */}
      <div className="divide-y divide-gray-200">
        {drafts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium">No drafts</h3>
            <p className="mt-1 text-sm">Drafts you save will appear here</p>
          </div>
        ) : (
          drafts.map((draft) => (
            <div 
              key={draft.id} 
              className="flex items-start p-4 hover:bg-gray-50"
            >
              <div className="flex-shrink-0 pt-1">
                <Checkbox 
                  id={`draft-${draft.id}`}
                  checked={selectedDrafts.includes(draft.id)}
                  onCheckedChange={() => handleSelectDraft(draft.id)}
                />
              </div>
              
              <div 
                className="ml-3 flex-1 min-w-0 cursor-pointer"
                onClick={() => handleEditDraft(draft.id)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    To: {Array.isArray(draft.to) ? draft.to.join(', ') : draft.to || '(No recipient)'}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="flex items-center mr-2">
                      <FiClock className="h-3.5 w-3.5 text-gray-400 mr-1" />
                      Draft saved {formatDate(draft.updatedAt || draft.createdAt)}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-900 truncate">
                  {draft.subject || '(No subject)'}
                </p>
                
                <p className="text-sm text-gray-500 truncate">
                  {draft.body.substring(0, 100)}{draft.body.length > 100 ? '...' : ''}
                </p>
                
                {draft.attachments && draft.attachments.length > 0 && (
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <FiPaperclip className="h-3 w-3 mr-1" />
                    {draft.attachments.length} attachment{draft.attachments.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
              
              <div className="ml-2 flex-shrink-0 flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditDraft(draft.id);
                  }}
                >
                  <FiEdit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this draft?')) {
                      try {
                        await fetch(`/api/v1/emails/logs/${draft.id}/`, { method: 'DELETE' });
                        showToast({
                          title: 'Success',
                          description: 'Draft has been deleted.',
                        });
                        fetchDrafts();
                      } catch (error) {
                        console.error('Error deleting draft:', error);
                        showToast({
                          title: 'Error',
                          description: 'Failed to delete draft. Please try again.',
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
                  {Math.min(currentPage * itemsPerPage, drafts.length + ((currentPage - 1) * itemsPerPage))}
                </span>{' '}
                of <span className="font-medium">{drafts.length + ((currentPage - 1) * itemsPerPage)}</span> results
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
