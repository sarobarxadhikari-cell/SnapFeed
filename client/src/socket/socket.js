import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';

let socket = null;

export function getSocket() {
  return socket;
}

export function initializeSocket(token) {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 20,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    forceNew: true,
  });

  socket.on('connect', () => {
    console.log('[Snapfeed Ultra] Socket connected:', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.error('[Snapfeed Ultra] Socket connection error:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Snapfeed Ultra] Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
      socket.connect();
    }
  });

  socket.on('error', (err) => {
    console.error('[Snapfeed Ultra] Socket error:', err);
  });

  socket.on('reconnect_attempt', (attempt) => {
    console.log(`[Snapfeed Ultra] Socket reconnecting attempt ${attempt}`);
  });

  socket.on('reconnect', () => {
    console.log('[Snapfeed Ultra] Socket reconnected');
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
