// components/ChatWindow.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { getSocket } from '../utils/socket';
import MessageItem from './MessageItem';
import { FiSend, FiSmile, FiPaperclip } from 'react-icons/fi';
import {
  AiOutlineDelete,
  AiOutlinePaperClip,
} from 'react-icons/ai';
import { formatDistanceToNow } from 'date-fns';

const ChatWindow = () => {
  const { currentConversation, messages, isLoadingMessages, sendMessage, isTyping } =
    useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = getSocket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages as read when displayed
  useEffect(() => {
    if (messages.length > 0 && currentConversation) {
      messages.forEach((msg) => {
        if (msg.receiver?._id === user?.id && !msg.isRead) {
          socket.emit('message:read', {
            messageId: msg._id,
            conversationId: currentConversation._id,
          });
        }
      });
    }
  }, [messages, currentConversation, user, socket]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputText.trim() || !currentConversation) return;

    setIsSubmitting(true);
    try {
      await sendMessage(currentConversation._id, inputText.trim());
      setInputText('');
      socket.emit('user:typing', {
        conversationId: currentConversation._id,
        userId: user?.id,
        isTyping: false,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTyping = (e) => {
    setInputText(e.target.value);

    // Emit typing indicator
    if (currentConversation) {
      socket.emit('user:typing', {
        conversationId: currentConversation._id,
        userId: user?.id,
        isTyping: true,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (!currentConversation) {
    return (
      <div className='flex items-center justify-center h-full dark:bg-gray-900 bg-white'>
        <p className='text-gray-500 dark:text-gray-400 text-lg'>Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full dark:bg-gray-900 bg-white'>
      {/* Chat Header */}
      <div className='border-b dark:border-gray-700 border-gray-200 p-4 flex justify-between items-center'>
        <div>
          <h2 className='text-lg font-bold dark:text-white text-gray-900'>
            {currentConversation.isGroup
              ? currentConversation.groupName
              : currentConversation.participants?.find((p) => p._id !== user?.id)?.username}
          </h2>
          <p className='text-sm dark:text-gray-400 text-gray-600'>
            {currentConversation.participants?.find((p) => p._id !== user?.id)?.isOnline
              ? 'Active now'
              : `Last seen ${formatDistanceToNow(
                  new Date(currentConversation.participants?.find((p) => p._id !== user?.id)?.lastSeen),
                  { addSuffix: true }
                )}`}
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div className='flex-1 overflow-y-auto p-4 space-y-2 dark:bg-gray-900 bg-white'>
        {isLoadingMessages ? (
          <div className='flex items-center justify-center h-full'>
            <p className='text-gray-500 dark:text-gray-400'>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className='flex items-center justify-center h-full'>
            <p className='text-gray-500 dark:text-gray-400'>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageItem
              key={message._id || index}
              message={message}
              isOwn={message.sender._id === user?.id}
              showTimestamp={
                index === 0 ||
                new Date(messages[index - 1].createdAt).getTime() -
                  new Date(message.createdAt).getTime() >
                  300000
              }
            />
          ))
        )}
        {isTyping && (
          <div className='flex items-end gap-2'>
            <div className='w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center'>
              <div className='flex gap-1'>
                <div className='w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-300 animate-bounce'></div>
                <div className='w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-300 animate-bounce' style={{ animationDelay: '0.1s' }}></div>
                <div className='w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-300 animate-bounce' style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className='border-t dark:border-gray-700 border-gray-200 p-4 dark:bg-gray-800 bg-gray-50'>
        <div className='flex gap-2'>
          <button
            type='button'
            className='p-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition'
          >
            <FiPaperclip size={20} className='dark:text-white text-gray-700' />
          </button>

          <textarea
            rows='1'
            value={inputText}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            placeholder='Type a message...'
            className='flex-1 px-4 py-2.5 dark:bg-gray-700 bg-white dark:text-white text-gray-900 rounded-lg border dark:border-gray-600 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
          />

          <button
            type='button'
            className='p-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition'
          >
            <FiSmile size={20} className='dark:text-white text-gray-700' />
          </button>

          <button
            type='submit'
            disabled={!inputText.trim() || isSubmitting}
            className='p-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition'
          >
            <FiSend size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
