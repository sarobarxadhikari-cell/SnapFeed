import { create } from 'zustand';
import { messagesAPI } from '../services/api';

const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: {},
  loadingConversations: false,
  loadingMessages: false,
  typingUsers: {},
  error: null,

  setConversations: (conversations) => set({ conversations }),

  fetchConversations: async () => {
    set({ loadingConversations: true });
    try {
      const res = await messagesAPI.getConversations();
      if (res.data.success) {
        set({ conversations: res.data.conversations, loadingConversations: false });
      }
    } catch (err) {
      set({ loadingConversations: false, error: 'Failed to load conversations' });
    }
  },

  fetchMessages: async (conversationId) => {
    set({ loadingMessages: true });
    try {
      const res = await messagesAPI.getMessages(conversationId);
      if (res.data.success) {
        set((state) => ({
          messages: { ...state.messages, [conversationId]: res.data.messages },
          loadingMessages: false,
        }));
      }
    } catch (err) {
      set({ loadingMessages: false, error: 'Failed to load messages' });
    }
  },

  setActiveConversation: (conversation) => {
    set({ activeConversation: conversation });
    if (conversation) {
      get().fetchMessages(conversation._id);
    }
  },

  addMessage: (message) => {
    set((state) => {
      const convId = message.conversationId || message.conversation?._id;
      if (!convId) return state;
      const existing = state.messages[convId] || [];
      const isDuplicate = existing.some((m) => m._id === message._id);
      if (isDuplicate) return state;
      return {
        messages: {
          ...state.messages,
          [convId]: [...existing, message],
        },
      };
    });
  },

  updateMessageStatus: (messageId, status) => {
    set((state) => {
      const newMessages = { ...state.messages };
      for (const key of Object.keys(newMessages)) {
        newMessages[key] = newMessages[key].map((m) =>
          m._id === messageId ? { ...m, deliveryStatus: status } : m
        );
      }
      return { messages: newMessages };
    });
  },

  setTyping: (userId, isTyping) => {
    set((state) => ({
      typingUsers: { ...state.typingUsers, [userId]: isTyping },
    }));
  },

  addConversation: (conversation) => {
    set((state) => {
      const existing = state.conversations.findIndex(
        (c) => c._id === conversation._id
      );
      if (existing >= 0) {
        const updated = [...state.conversations];
        updated[existing] = conversation;
        return { conversations: updated };
      }
      return { conversations: [conversation, ...state.conversations] };
    });
  },

  markConversationRead: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c._id === conversationId ? { ...c, unreadCount: { ...c.unreadCount, [Object.keys(c.unreadCount || {})[0]]: 0 } } : c
      ),
    }));
  },
}));

export default useChatStore;
