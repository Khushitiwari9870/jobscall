'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { FiChevronRight } from 'react-icons/fi';
import { FiChevronLeft } from 'react-icons/fi';
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
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase
} from 'react-icons/fi';

export interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  tags?: string[];
  subscribed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EmailContactsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;

  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/v1/emails/recipients/?page=${currentPage}&page_size=${itemsPerPage}&search=${searchQuery}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      
      const data = await response.json();
      setContacts(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching contacts:', error);
      showToast({
        title: 'Error',
        description: 'Failed to load contacts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, showToast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(contacts.map(contact => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedContacts.map(id => 
          fetch(`/api/v1/emails/recipients/${id}/`, { method: 'DELETE' })
        )
      );
      
      showToast({
        title: 'Success',
        description: 'Selected contacts have been deleted.',
      });
      
      setSelectedContacts([]);
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contacts:', error);
      showToast({
        title: 'Error',
        description: 'Failed to delete contacts. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleSubscription = async (contactId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/v1/emails/recipients/${contactId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscribed: !currentStatus
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update subscription status');
      }
      
      fetchContacts();
      
      showToast({
        title: 'Success',
        description: `Contact has been ${!currentStatus ? 'subscribed' : 'unsubscribed'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      showToast({
        title: 'Error',
        description: 'Failed to update subscription status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (isLoading && contacts.length === 0) {
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
            checked={selectedContacts.length > 0 && selectedContacts.length === contacts.length}
            onCheckedChange={handleSelectAll}
          />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push('/recruiter-dashboard/emails/contacts/import')}
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Import Contacts
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push('/recruiter-dashboard/emails/contacts/new')}
          >
            <FiUser className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchContacts}
            disabled={isLoading}
          >
            <FiRefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {selectedContacts.length > 0 && (
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
            placeholder="Search contacts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {contacts.length === 0 ? (
          <div className="p-8 text-center">
            <FiUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new contact</p>
            <div className="mt-6 space-x-3">
              <Button
                onClick={() => router.push('/recruiter-dashboard/emails/contacts/new')}
              >
                <FiUser className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/recruiter-dashboard/emails/contacts/import')}
              >
                <FiPlus className="h-4 w-4 mr-2" />
                Import Contacts
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Checkbox 
                      id="select-all-header"
                      checked={selectedContacts.length > 0 && selectedContacts.length === contacts.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Checkbox 
                        id={`contact-${contact.id}`}
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={() => handleSelectContact(contact.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <FiUser className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {contact.firstName || contact.lastName 
                              ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim()
                              : 'No Name'}
                          </div>
                          {contact.phone && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <FiPhone className="h-3.5 w-3.5 mr-1 text-gray-400" />
                              {contact.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FiMail className="h-3.5 w-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate max-w-xs">{contact.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contact.company ? (
                        <div className="text-sm text-gray-900 flex items-center">
                          <FiBriefcase className="h-3.5 w-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
                          {contact.company}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          contact.subscribed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {contact.subscribed ? 'Subscribed' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiClock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        {formatDate(contact.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => router.push(`/recruiter-dashboard/emails/contacts/${contact.id}`)}
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleSubscription(contact.id, contact.subscribed)}
                          className={contact.subscribed ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}
                        >
                          {contact.subscribed ? 'Unsubscribe' : 'Subscribe'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
                  {Math.min(currentPage * itemsPerPage, contacts.length + ((currentPage - 1) * itemsPerPage))}
                </span>{' '}
                of <span className="font-medium">{contacts.length + ((currentPage - 1) * itemsPerPage)}</span> contacts
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
