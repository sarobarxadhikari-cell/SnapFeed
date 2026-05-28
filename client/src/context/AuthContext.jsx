import React, { createContext, useContext, useEffect, useCallback } from 'react';
import useAuthStore from '../store/authStore';
import { initializeSocket, disconnectSocket, getSocket } from '../socket/socket';
import useChatStore from '../store/chatStore';
import useCallStore from '../store/callStore';
import useUIStore from '../store/uiStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { user, token, isAuthenticated, isLoading, loadUser, logout } = useAuthStore();
  const addConversation = useChatStore((s) => s.addConversation);
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessageStatus = useChatStore((s) => s.updateMessageStatus);
  const setTyping = useChatStore((s) => s.setTyping);
  const conversations = useChatStore((s) => s.conversations);
  const setConversations = useChatStore((s) => s.setConversations);
  const receiveCall = useCallStore((s) => s.receiveCall);
  const endCall = useCallStore((s) => s.endCall);
  const callStatus = useCallStore((s) => s.callStatus);
  const addNotification = useUIStore((s) => s.addNotification);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    document.documentElement.className = localStorage.getItem('sf_theme') || 'dark';
  }, []);

  const setupSocketListeners = useCallback(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('connect', () => {
      console.log('[Snapfeed] Socket connected');
    });

    socket.on('users:online', (onlineUserIds) => {
      useChatStore.getState().setConversations(
        useChatStore.getState().conversations.map((conv) => ({
          ...conv,
          participants: conv.participants?.map((p) => ({
            ...p,
            isOnline: onlineUserIds.includes(p._id || p.id),
          })),
        }))
      );
    });

    socket.on('message:new', (message) => {
      addMessage(message);
      const convId = message.conversationId || message.conversation?._id;
      if (convId) {
        useChatStore.getState().fetchConversations();
      }
      if (message.sender?._id !== useAuthStore.getState().user?._id) {
        addNotification({
          title: message.sender?.name || 'New message',
          body: message.text || 'Sent a message',
          type: 'message',
        });
      }
    });

    socket.on('message:sent', (message) => {
      addMessage(message);
    });

    socket.on('message:status', ({ messageId, status }) => {
      updateMessageStatus(messageId, status);
    });

    socket.on('messages:seen', ({ conversationId }) => {
      useChatStore.getState().fetchConversations();
    });

    socket.on('message:typing', ({ userId, isTyping }) => {
      setTyping(userId, isTyping);
    });

    socket.on('conversation:updated', (conversation) => {
      addConversation(conversation);
    });

    socket.on('conversations:list', (conversations) => {
      setConversations(conversations);
    });

    socket.on('call:incoming', (data) => {
      receiveCall(data);
      addNotification({
        title: data.fromName,
        body: `Incoming ${data.callType || 'video'} call`,
        type: 'call',
      });
    });

    socket.on('call:accepted', () => {
      useCallStore.getState().connectCall();
    });

    socket.on('call:rejected', () => {
      useCallStore.getState().rejectCall();
      addNotification({ title: 'Call rejected', body: 'They declined your call', type: 'system' });
    });

    socket.on('call:ended', () => {
      if (useCallStore.getState().callStatus === 'connected') {
        endCall();
      }
    });

    socket.on('call:signal', ({ signal }) => {
      if (useCallStore.getState().callStatus === 'connected' && window.pcRef) {
        const pc = window.pcRef.current;
        if (pc && signal.candidate) {
          pc.addIceCandidate(new RTCIceCandidate(signal.candidate)).catch(console.error);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated && token) {
      const socket = initializeSocket(token);
      setupSocketListeners();
    } else if (!isAuthenticated && !isLoading) {
      disconnectSocket();
    }

    return () => {
      // cleanup handled by disconnect
    };
  }, [isAuthenticated, token, isLoading]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
