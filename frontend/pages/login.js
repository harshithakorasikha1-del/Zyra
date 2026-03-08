// pages/login.js
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiMail, FiLock } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push('/');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen dark:bg-gray-900 bg-white'>
      <div className='w-full max-w-md p-6 dark:bg-gray-800 bg-gray-50 rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold mb-6 text-center dark:text-white text-gray-900'>
          Message Chat
        </h1>

        {error && (
          <div className='mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1'>
              Email
            </label>
            <div className='relative'>
              <FiMail className='absolute left-3 top-3 text-gray-400' size={20} />
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full pl-10 pr-4 py-2.5 dark:bg-gray-700 bg-white dark:text-white text-gray-900 border dark:border-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='your@email.com'
                required
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1'>
              Password
            </label>
            <div className='relative'>
              <FiLock className='absolute left-3 top-3 text-gray-400' size={20} />
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full pl-10 pr-4 py-2.5 dark:bg-gray-700 bg-white dark:text-white text-gray-900 border dark:border-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='••••••••'
                required
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition'
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className='mt-6 text-center'>
          <p className='dark:text-gray-400 text-gray-600'>
            Don't have an account?{' '}
            <Link href='/register' className='text-blue-500 hover:text-blue-600 font-semibold'>
              Sign Up
            </Link>
          </p>
        </div>

        <div className='mt-6 pt-6 border-t dark:border-gray-700 border-gray-200'>
          <p className='text-xs text-center text-gray-500 dark:text-gray-400'>
            Demo credentials:<br />
            Email: demo@example.com<br />
            Password: password123
          </p>
        </div>
      </div>
    </div>
  );
}
