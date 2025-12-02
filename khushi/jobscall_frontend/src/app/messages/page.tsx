'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { FiMessageSquare, FiSend, FiUser, FiSearch, FiMoreVertical } from 'react-icons/fi';
import { useMessages, Conversation } from '@/hooks/useMessages';
import { useToast } from '@/components/ui/use-toast';

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const {
    conversations,
    messages,
    loading,
    fetchMessages,
    sendMessage,
  } = useMessages();

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Get messages for selected conversation
  const conversationMessages = useMemo(() =>
    selectedConversation ? messages[selectedConversation.id] || [] : [],
    [selectedConversation, messages]
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation, fetchMessages]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const recipient = selectedConversation.participants.find(p => p.name !== 'You');
    if (!recipient) return;

    const success = await sendMessage({
      recipient_id: recipient.id,
      content: newMessage.trim(),
    });

    if (success) {
      setNewMessage('');
      showToast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    } else {
      showToast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle key press in message input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="md:flex h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <div className="w-full md:w-80 border-r border-gray-200 bg-white">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-gray-900">Messages</h1>
                <span className="text-sm text-gray-500">
                  {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(100%-8rem)]">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FiUser className="text-blue-600" />
                      </div>
                      {conversation.participants.find(p => p.name !== 'You')?.is_online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conversation.participants.find(p => p.name !== 'You')?.name || 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.last_message?.content || 'No messages yet'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className="text-xs text-gray-400">
                        {conversation.last_message ? formatTime(conversation.last_message.timestamp) : ''}
                      </span>
                      {conversation.unread_count > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <FiUser className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedConversation.participants.find(p => p.name !== 'You')?.name || 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedConversation.participants.find(p => p.name !== 'You')?.is_online ? 'Active now' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <FiMoreVertical />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  <div className="space-y-4 max-w-3xl mx-auto">
                    {conversationMessages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      conversationMessages.map((message) => {
                        const isCurrentUser = message.sender_id === 2; // Current user ID (should come from auth context)
                        return (
                          <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                              <div className={`rounded-lg p-3 ${
                                isCurrentUser
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white border border-gray-200'
                              }`}>
                                <p className={`text-sm ${isCurrentUser ? 'text-white' : 'text-gray-800'}`}>
                                  {message.content}
                                </p>
                                <p className={`text-xs mt-1 ${
                                  isCurrentUser ? 'text-blue-100' : 'text-gray-400'
                                }`}>
                                  {formatTime(message.timestamp)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-end space-x-2 max-w-3xl mx-auto">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        style={{ minHeight: '40px', maxHeight: '120px' }}
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiSend />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                  <FiMessageSquare className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">Select a conversation</p>
                  <p className="text-sm">Choose a conversation from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}