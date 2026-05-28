import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Video, Camera, Users, Bell, TrendingUp, Sparkles } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StoriesSection from '../components/stories/StoriesSection';
import useAuthStore from '../store/authStore';
import useChatStore from '../store/chatStore';
import { getInitials, getAvatarColor, formatTime } from '../utils/helpers';

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const conversations = useChatStore((s) => s.conversations);
  const fetchConversations = useChatStore((s) => s.fetchConversations);

  useEffect(() => {
    fetchConversations();
  }, []);

  const quickActions = [
    {
      icon: MessageSquare,
      label: 'New Message',
      color: 'from-[#1877f2] to-[#4f46e5]',
      onClick: () => navigate('/chat'),
    },
    {
      icon: Video,
      label: 'Video Call',
      color: 'from-[#00c853] to-[#1db954]',
      onClick: () => navigate('/call'),
    },
    {
      icon: Camera,
      label: 'Add Story',
      color: 'from-[#ffd84d] to-[#ffcd1f]',
      onClick: () => {},
    },
    {
      icon: Users,
      label: 'Find Friends',
      color: 'from-[#ff1744] to-[#ff5252]',
      onClick: () => {},
    },
  ];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg"
              style={{ background: getAvatarColor(user?.name) }}
            >
              {getInitials(user?.name)}
            </div>
            <div>
              <h1 className="text-xl font-bold">Welcome back, {user?.name?.split(' ')[0]}</h1>
              <p className="text-sm text-gray-400">Connect with your world</p>
            </div>
          </div>
        </motion.div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={action.onClick}
              className="glass rounded-2xl p-4 text-left hover:bg-white/10 transition-all group"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >
                <action.icon size={20} className="text-white" />
              </div>
              <p className="font-semibold text-sm">{action.label}</p>
            </motion.button>
          ))}
        </div>

        {/* Stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Camera size={18} className="text-[#ffd84d]" /> Stories
            </h2>
            <button className="text-sm text-[#1877f2] hover:underline">See all</button>
          </div>
          <StoriesSection />
        </motion.div>

        {/* Recent conversations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <MessageSquare size={18} className="text-[#1877f2]" /> Recent Chats
            </h2>
            <button
              onClick={() => navigate('/chat')}
              className="text-sm text-[#1877f2] hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-1">
            {conversations.slice(0, 5).map((conv, i) => {
              const other = conv.participants?.find((p) => p._id !== user?._id);
              if (!other) return null;
              const unread = conv.unreadCount ? Object.values(conv.unreadCount).reduce((a, b) => a + (b || 0), 0) : 0;
              return (
                <motion.button
                  key={conv._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  onClick={() => navigate(`/chat/${conv._id}`)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 transition-all"
                >
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: getAvatarColor(other.name) }}
                    >
                      {getInitials(other.name)}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0b0f17] ${other.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm truncate">{other.name}</p>
                      <span className="text-[10px] text-gray-500">
                        {conv.lastMessage?.createdAt ? formatTime(conv.lastMessage.createdAt) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {conv.lastMessage?.text || 'Start chatting'}
                    </p>
                  </div>
                  {unread > 0 && (
                    <span className="bg-[#1877f2] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unread}
                    </span>
                  )}
                </motion.button>
              );
            })}
            {conversations.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
                <p>No conversations yet</p>
                <button
                  onClick={() => navigate('/chat')}
                  className="mt-3 text-sm text-[#1877f2] hover:underline"
                >
                  Start a new chat
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
