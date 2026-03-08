// context/ChatContext.js
import React, { createContext, useState, useCallback, useEffect } from 'react';
import { getSocket } from '../utils/socket';
import api from '../utils/api';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    try {
      const response = await api.get('/conversations/all');
      if (response.data.success) {
        setConversations(response.data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  }, []);

  // Fetch or create conversation with a user
  const getOrCreateConversation = useCallback(async (userId) => {
    try {
      const response = await api.get(`/conversations/${userId}`);
      if (response.data.success) {
        const conversation = response.data.conversation;
        setCurrentConversation(conversation);
        
        // Join socket room
        const socket = getSocket();
        socket.emit('conversation:join', conversation._id);
        
        return conversation;
      }
    } catch (error) {
      console.error('Error getting conversation:', error);
    }
  }, []);

  // Fetch messages for current conversation
  const fetchMessages = useCallback(async (conversationId) => {
    setIsLoadingMessages(true);
    try {
      const response = await api.get(`/messages/${conversationId}`);
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (conversationId, content, media = []) => {
    try {
      const socket = getSocket();
      const response = await api.post('/messages/send', {
        conversationId,
        content,
        media,
      });

      if (response.data.success) {
        // Emit socket event
        socket.emit('message:send', {
          conversationId,
          senderId: response.data.message.sender._id,
          content,
          media,
        });

        return response.data.message;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, []);

  // Delete message
  const deleteMessage = useCallback(async (messageId, conversationId) => {
    try {
      const response = await api.delete(`/messages/${messageId}`);
      if (response.data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, isDeleted: true, content: '' } : msg
          )
        );
        return response.data;
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }, []);

  // Edit message
  const editMessage = useCallback(async (messageId, newContent) => {
    try {
      const response = await api.put(`/messages/${messageId}`, {
        content: newContent,
      });

      if (response.data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId
              ? { ...msg, content: newContent, isEdited: true }
              : msg
          )
        );
        return response.data.message;
      }
    } catch (error) {
      console.error('Error editing message:', error);
    }
  }, []);

  // Add reaction
  const addReaction = useCallback(async (messageId, emoji) => {
    try {
      const response = await api.post(`/messages/${messageId}/react`, {
        emoji,
      });

      if (response.data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, reactions: response.data.message.reactions } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  }, []);

  // Set up socket listeners
  useEffect(() => {
    const socket = getSocket();

    // Listen for new messages
    socket.on('message:received', (message) => {
      if (currentConversation?._id === message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    // Listen for typing indicators
    socket.on('user:typing', (data) => {
      if (data.isTyping) {
        setIsTyping(true);
      } else {
        setIsTyping(false);
      }
    });

    // Listen for read receipts
    socket.on('message:read', (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId ? { ...msg, status: 'read' } : msg
        )
      );
    });

    // Listen for user online status
    socket.on('user:status', (data) => {
      if (data.isOnline) {
        setOnlineUsers((prev) => new Set([...prev, data.userId]));
      } else {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      }
    });

    return () => {
      socket.off('message:received');
      socket.off('user:typing');
      socket.off('message:read');
      socket.off('user:status');
    };
  }, [currentConversation]);

  const value = {
    conversations,
    currentConversation,
    messages,
    isLoadingMessages,
    isTyping,
    onlineUsers,
    fetchConversations,
    getOrCreateConversation,
    fetchMessages,
    sendMessage,
    deleteMessage,
    editMessage,
    addReaction,
    setCurrentConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
