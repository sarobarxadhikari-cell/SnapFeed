import { useEffect, useCallback } from 'react';
import { getSocket } from '../socket/socket';
import { messagesAPI } from '../services/api';
import useChatStore from '../store/chatStore';
import useCallStore from '../store/callStore';
import useAuthStore from '../store/authStore';

export function useSocket() {
  const user = useAuthStore((s) => s.user);
  const addMessage = useChatStore((s) => s.addMessage);

  const sendMessage = useCallback(
    async (receiverId, text, messageType = 'text', mediaUrl = '') => {
      try {
        const res = await messagesAPI.sendMessage({ receiverId, text, messageType, mediaUrl });
        if (res.data.success) {
          return res.data.message;
        }
      } catch (err) {
        console.error('Send message error:', err);
        return null;
      }
    },
    []
  );

  const startTyping = useCallback(
    (receiverId) => {
      const socket = getSocket();
      if (socket) {
        socket.emit('message:typing', { receiverId, isTyping: true });
      }
    },
    []
  );

  const stopTyping = useCallback(
    (receiverId) => {
      const socket = getSocket();
      if (socket) {
        socket.emit('message:typing', { receiverId, isTyping: false });
      }
    },
    []
  );

  const markSeen = useCallback(
    (conversationId) => {
      const socket = getSocket();
      if (socket) {
        socket.emit('message:seen', { conversationId });
      }
      messagesAPI.markSeen(conversationId).catch(() => {});
    },
    []
  );

  const startCall = useCallback(
    (receiverId, callType = 'video') => {
      const socket = getSocket();
      if (socket) {
        socket.emit('call:start', { receiverId, callType });
      }
    },
    []
  );

  const acceptCall = useCallback(
    (callId) => {
      const socket = getSocket();
      if (socket) {
        socket.emit('call:accept', { callId });
      }
    },
    []
  );

  const rejectCall = useCallback(
    (callId) => {
      const socket = getSocket();
      if (socket) {
        socket.emit('call:reject', { callId });
      }
    },
    []
  );

  const endCall = useCallback(
    (callId, duration) => {
      const socket = getSocket();
      if (socket) {
        socket.emit('call:end', { callId, duration });
      }
    },
    []
  );

  const sendSignal = useCallback(
    (receiverId, signal) => {
      const socket = getSocket();
      if (socket) {
        socket.emit('call:signal', { receiverId, signal });
      }
    },
    []
  );

  return {
    sendMessage,
    startTyping,
    stopTyping,
    markSeen,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    sendSignal,
  };
}
