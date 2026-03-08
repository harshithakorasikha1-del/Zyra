// components/MessageItem.js
import React, { useContext, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import { FiMoreVertical, FiTrash2, FiEdit2 } from 'react-icons/fi';

const MessageItem = ({ message, isOwn, showTimestamp }) => {
  const { deleteMessage, editMessage } = useContext(ChatContext);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.content);

  const handleDelete = async () => {
    if (window.confirm('Delete this message?')) {
      await deleteMessage(message._id);
    }
  };

  const handleEdit = async () => {
    if (editedText.trim() && editedText !== message.content) {
      await editMessage(message._id, editedText.trim());
      setIsEditing(false);
    } else {
      setIsEditing(false);
    }
  };

  const getMessageStatusIcon = () => {
    if (message.status === 'sent') return '✓';
    if (message.status === 'delivered') return '✓✓';
    if (message.status === 'read') return '✓✓';
    return '';
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} gap-2 group`}>
      <div className='max-w-xs relative'>
        {showTimestamp && (
          <p className='text-xs text-gray-500 dark:text-gray-400 text-center mb-2'>
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </p>
        )}

        <div
          className={`px-3 py-2 rounded-lg ${
            isOwn
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
          }`}
        >
          {isEditing ? (
            <div className='flex gap-1'>
              <input
                autoFocus
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onBlur={handleEdit}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleEdit();
                  }
                }}
                className='bg-transparent outline-none w-full'
              />
            </div>
          ) : (
            <>
              <p className='break-words'>{message.content}</p>
              {message.isEdited && (
                <p className='text-xs opacity-70 mt-1'>(edited)</p>
              )}
            </>
          )}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className='flex flex-wrap gap-1 mt-1 pt-1 border-t border-opacity-20 border-current'>
              {message.reactions.map((reaction) => (
                <span key={`${reaction.userId}`} className='text-sm'>
                  {reaction.emoji}
                </span>
              ))}
            </div>
          )}
        </div>

        {isOwn && (
          <div className='flex gap-1 mt-1'>
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              {getMessageStatusIcon()}
            </span>
          </div>
        )}

        {/* Message Menu */}
        {isOwn && (
          <div className='absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity'>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className='p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded'
            >
              <FiMoreVertical size={16} className='text-gray-600 dark:text-gray-400' />
            </button>
            {showMenu && (
              <div className='absolute right-0 mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 border-gray-200 rounded-lg shadow-lg z-50'>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className='flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm'
                >
                  <FiEdit2 size={16} /> Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className='flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-red-500'
                >
                  <FiTrash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
