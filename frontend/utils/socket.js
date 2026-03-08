// utils/socket.js
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

let socket = null;

export const initSocket = () => {
  if (socket) return socket;

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    auth: {
      token: Cookies.get('token'),
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Connected to socket server');
    const user = JSON.parse(Cookies.get('user') || '{}');
    if (user.id) {
      socket.emit('user:online', user.id);
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
