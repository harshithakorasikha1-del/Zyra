// components/Header.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className='border-b dark:border-gray-700 border-gray-200 dark:bg-gray-800 bg-white p-4 flex justify-between items-center'>
      <div className='flex items-center gap-3'>
        {user?.profilePicture && (
          <img
            src={user.profilePicture}
            alt={user.username}
            className='w-10 h-10 rounded-full object-cover'
          />
        )}
        <div>
          <p className='font-semibold dark:text-white text-gray-900'>{user?.username}</p>
          <p className='text-xs text-green-500'>Online</p>
        </div>
      </div>

      <div className='flex gap-2 items-center'>
        <ThemeToggle />
        <button className='p-2 rounded-lg dark:hover:bg-gray-700 hover:bg-gray-100 transition'>
          <FiSettings size={20} className='dark:text-white text-gray-700' />
        </button>
        <button
          onClick={handleLogout}
          className='p-2 rounded-lg dark:hover:bg-gray-700 hover:bg-gray-100 transition text-red-500'
        >
          <FiLogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
