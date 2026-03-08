// components/ConversationList.js
import React, { useContext, useState, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import api from '../utils/api';

const ConversationList = () => {
  const { conversations, fetchConversations, currentConversation, setCurrentConversation, getOrCreateConversation, fetchMessages } =
    useContext(ChatContext);
  const { user, onlineUsers } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = conversations.filter((conv) => {
        const otherUser = conv.participants.find((p) => p._id !== user?.id);
        return otherUser?.username.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations, user]);

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await api.get('/users/search/users', { params: { query } });
      if (response.data.success) {
        setSearchResults(response.data.users);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUserSelect = async (userId) => {
    const conversation = await getOrCreateConversation(userId);
    if (conversation) {
      setCurrentConversation(conversation);
      await fetchMessages(conversation._id);
      setShowAddFriend(false);
      setSearchQuery('');
    }
  };

  const handleConversationClick = async (conversation) => {
    setCurrentConversation(conversation);
    await fetchMessages(conversation._id);
  };

  const getLastMessage = (conversation) => {
    if (!conversation.lastMessage) return 'No messages yet';
    const sender = conversation.lastMessage.sender;
    const isOwn = sender._id === user?.id;
    return `${isOwn ? 'You: ' : ''}${conversation.lastMessage.content}`;
  };

  return (
    <div className='flex flex-col h-full dark:bg-gray-800 bg-white border-r dark:border-gray-700 border-gray-200'>
      {/* Header with Search and Add Button */}
      <div className='p-4 border-b dark:border-gray-700 border-gray-200'>
        <h1 className='text-2xl font-bold dark:text-white text-gray-900 mb-4'>Messages</h1>
        
        <div className='flex gap-2'>
          <div className='flex-1 relative'>
            <FiSearch className='absolute left-3 top-3 text-gray-400' size={20} />
            <input
              type='text'
              placeholder='Search conversations...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-2 rounded-lg dark:bg-gray-700 bg-gray-100 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <button
            onClick={() => setShowAddFriend(!showAddFriend)}
            className='p-2 aspect-square rounded-lg dark:hover:bg-gray-700 hover:bg-gray-100 transition'
          >
            <FiPlus size={24} className='dark:text-white text-gray-900' />
          </button>
        </div>
      </div>

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div className='p-4 border-b dark:border-gray-700 border-gray-200'>
          <input
            type='text'
            placeholder='Search users...'
            onChange={(e) => searchUsers(e.target.value)}
            className='w-full px-4 py-2 rounded-lg dark:bg-gray-700 bg-gray-100 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2'
          />
          {isSearching && (
            <p className='text-sm text-gray-500 dark:text-gray-400'>Searching...</p>
          )}
          {searchResults.length > 0 && (
            <div className='space-y-2 max-h-48 overflow-y-auto'>
              {searchResults.map((result) => (
                <button
                  key={result._id}
                  onClick={() => handleUserSelect(result._id)}
                  className='w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-left'
                >
                  <img
                    src={result.profilePicture}
                    alt={result.username}
                    className='w-10 h-10 rounded-full object-cover'
                  />
                  <div className='flex-1'>
                    <p className='font-medium dark:text-white text-gray-900'>{result.username}</p>
                    {result.isOnline && (
                      <span className='text-xs text-green-500'>Online</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Conversations List */}
      <div className='flex-1 overflow-y-auto'>
        {filteredConversations.length === 0 ? (
          <div className='flex items-center justify-center h-full'>
            <p className='text-gray-500 dark:text-gray-400'>No conversations yet</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const otherUser = conversation.participants.find((p) => p._id !== user?.id);
            const isSelected = currentConversation?._id === conversation._id;

            return (
              <button
                key={conversation._id}
                onClick={() => handleConversationClick(conversation)}
                className={`w-full p-3 text-left border-b dark:border-gray-700 border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                  isSelected ? 'bg-blue-100 dark:bg-blue-900' : ''
                }`}
              >
                <div className='flex gap-3'>
                  <div className='relative'>
                    <img
                      src={otherUser?.profilePicture}
                      alt={otherUser?.username}
                      className='w-12 h-12 rounded-full object-cover'
                    />
                    {otherUser?.isOnline && (
                      <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800'></div>
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium dark:text-white text-gray-900'>
                      {otherUser?.username}
                    </p>
                    <p className='text-sm text-gray-600 dark:text-gray-400 truncate'>
                      {getLastMessage(conversation)}
                    </p>
                    {conversation.lastMessageTime && (
                      <p className='text-xs text-gray-500 dark:text-gray-500 mt-1'>
                        {formatDistanceToNow(new Date(conversation.lastMessageTime), {
                          addSuffix: true,
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
