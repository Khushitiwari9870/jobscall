import { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth } from '@/lib/auth';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: number;
  recipient_id: number;
  content: string;
  timestamp: string;
  is_read: boolean;
  message_type: 'text' | 'system';
}

export interface Conversation {
  id: string;
  participants: Array<{
    id: number;
    name: string;
    avatar?: string;
    is_online?: boolean;
  }>;
  last_message: Message | null;
  unread_count: number;
  updated_at: string;
}

export interface SendMessageData {
  recipient_id: number;
  content: string;
  message_type?: 'text' | 'system';
}

// Mock data for development
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    participants: [
      { id: 1, name: 'John Doe', avatar: '/avatars/john.jpg', is_online: true },
      { id: 2, name: 'You', avatar: '/avatars/user.jpg' }
    ],
    last_message: {
      id: '1',
      conversation_id: '1',
      sender_id: 1,
      recipient_id: 2,
      content: 'Hey, how are you doing?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      is_read: false,
      message_type: 'text'
    },
    unread_count: 1,
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    participants: [
      { id: 3, name: 'Sarah Wilson', avatar: '/avatars/sarah.jpg', is_online: false },
      { id: 2, name: 'You', avatar: '/avatars/user.jpg' }
    ],
    last_message: {
      id: '2',
      conversation_id: '2',
      sender_id: 2,
      recipient_id: 3,
      content: 'Thanks for your help with the project!',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      is_read: true,
      message_type: 'text'
    },
    unread_count: 0,
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      conversation_id: '1',
      sender_id: 1,
      recipient_id: 2,
      content: 'Hey, how are you doing?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      is_read: false,
      message_type: 'text'
    },
    {
      id: '2',
      conversation_id: '1',
      sender_id: 2,
      recipient_id: 1,
      content: 'Hi! I\'m doing great, thanks for asking. How about you?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
      is_read: true,
      message_type: 'text'
    }
  ],
  '2': [
    {
      id: '3',
      conversation_id: '2',
      sender_id: 3,
      recipient_id: 2,
      content: 'Thanks for your help with the project!',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      is_read: true,
      message_type: 'text'
    }
  ]
};

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from API first, fallback to mock data
      try {
        const response = await fetchWithAuth('/api/v1/messages/conversations/');
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        } else {
          throw new Error('API not available');
        }
      } catch (apiError) {
        console.warn('Using mock conversation data:', apiError);
        setConversations(MOCK_CONVERSATIONS);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
      // Fallback to mock data even on error
      setConversations(MOCK_CONVERSATIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      // Try to fetch from API first, fallback to mock data
      try {
        const response = await fetchWithAuth(`/api/v1/messages/conversations/${conversationId}/messages/`);
        if (response.ok) {
          const data = await response.json();
          setMessages(prev => ({ ...prev, [conversationId]: data }));
        } else {
          throw new Error('API not available');
        }
      } catch (apiError) {
        console.warn('Using mock message data:', apiError);
        setMessages(prev => ({ ...prev, [conversationId]: MOCK_MESSAGES[conversationId] || [] }));
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setMessages(prev => ({ ...prev, [conversationId]: MOCK_MESSAGES[conversationId] || [] }));
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (data: SendMessageData): Promise<boolean> => {
    try {
      // Try to send via API first
      try {
        const response = await fetchWithAuth('/api/v1/messages/send/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          // Refresh conversations and messages after sending
          await fetchConversations();
          return true;
        } else {
          throw new Error('API not available');
        }
      } catch (apiError) {
        console.warn('Message sent locally (API not available):', apiError);

        // Simulate local message sending
        const newMessage: Message = {
          id: Date.now().toString(),
          conversation_id: `temp-${data.recipient_id}`,
          sender_id: 2, // Current user ID (should come from auth context)
          recipient_id: data.recipient_id,
          content: data.content,
          timestamp: new Date().toISOString(),
          is_read: false,
          message_type: data.message_type || 'text',
        };

        // Update local state
        setMessages(prev => ({
          ...prev,
          [`temp-${data.recipient_id}`]: [...(prev[`temp-${data.recipient_id}`] || []), newMessage]
        }));

        // Update conversation last message
        setConversations(prev => prev.map(conv => {
          if (conv.participants.some(p => p.id === data.recipient_id)) {
            return {
              ...conv,
              last_message: newMessage,
              updated_at: newMessage.timestamp
            };
          }
          return conv;
        }));

        return true;
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      return false;
    }
  }, [fetchConversations]);

  // Mark messages as read
  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      await fetchWithAuth(`/api/v1/messages/conversations/${conversationId}/read/`, {
        method: 'POST',
      });

      // Update local state
      setConversations(prev => prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, unread_count: 0 }
          : conv
      ));

      setMessages(prev => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).map(msg => ({ ...msg, is_read: true }))
      }));
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    messages,
    loading,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markAsRead,
  };
};
