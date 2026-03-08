// pages/index.js
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';

export default function Home() {
  const { isLoading, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen dark:bg-gray-900 bg-white'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='flex flex-col h-screen dark:bg-gray-900 bg-white'>
      <Header />
      <div className='flex flex-1 overflow-hidden'>
        <div className='w-80 max-md:w-full md:w-80 border-r dark:border-gray-700 border-gray-200'>
          <ConversationList />
        </div>
        <div className='flex-1 max-md:hidden md:flex'>
          <ChatWindow />
        </div>
      </div>
    </div>
  );
}
