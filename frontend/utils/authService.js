// utils/authService.js
import api from './api';
import Cookies from 'js-cookie';

export const authService = {
  register: async (username, email, password, confirmPassword) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
      confirmPassword,
    });
    
    if (response.data.success) {
      Cookies.set('token', response.data.token, { expires: 30 });
      Cookies.set('user', JSON.stringify(response.data.user), { expires: 30 });
    }
    
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    
    if (response.data.success) {
      Cookies.set('token', response.data.token, { expires: 30 });
      Cookies.set('user', JSON.stringify(response.data.user), { expires: 30 });
    }
    
    return response.data;
  },

  logout: () => {
    Cookies.remove('token');
    Cookies.remove('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  getStoredUser: () => {
    const user = Cookies.get('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return Cookies.get('token');
  },
};
