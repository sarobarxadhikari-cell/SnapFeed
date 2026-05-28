import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, MessageSquare, Bell, Users, ShoppingBag, Globe,
  Settings, ChevronLeft, ChevronRight, Zap, Camera, Bookmark,
  Flame, Video, Map, Compass
} from 'lucide-react';
import useUIStore from '../../store/uiStore';
import useChatStore from '../../store/chatStore';
import useAuthStore from '../../store/authStore';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const navItems = [
  { icon: Home, label: 'Feed', path: '/feed' },
  { icon: MessageSquare, label: 'Messenger', path: '/messenger' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Users, label: 'Friends', path: '/friends' },
  { icon: ShoppingBag, label: 'Marketplace', path: '/marketplace' },
  { icon: Globe, label: 'Groups', path: '/groups' },
  { icon: Bookmark, label: 'Saved', path: '/saved' },
];

const ultraItems = [
  { icon: Flame, label: 'Snapfeed Ultra', path: '/ultra', color: '#ffd84d' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const conversations = useChatStore((s) => s.conversations);
  const user = useAuthStore((s) => s.user);

  const isUltra = location.pathname.startsWith('/ultra');

  // Don't show sidebar in Ultra mode
  if (isUltra) return null;

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="hidden lg:flex flex-col border-r border-white/10 glass-dark relative z-10 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto scrollbar-hide p-3">
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1877f2] to-[#ffd84d] flex items-center justify-center">
                <span className="text-lg font-extrabold text-white">S</span>
              </div>
              <span className="text-lg font-bold">Snapfeed</span>
            </div>

            {/* Ultra button - PROMINENT */}
            <div className="mb-4">
              {ultraItems.map((item) => (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all mb-2"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,216,77,0.15), rgba(255,107,53,0.15))',
                    border: '1px solid rgba(255,216,77,0.3)',
                  }}
                  whileHover={{ scale: 1.02, x: 3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ffd84d] to-[#ff6b35] flex items-center justify-center">
                    <Zap size={18} className="text-black" />
                  </div>
                  <span className="flex-1 text-left text-[#ffd84d]">Snapfeed Ultra</span>
                  <div className="w-2 h-2 rounded-full bg-[#ffd84d] animate-pulse" />
                </motion.button>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2 px-4 mb-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-500 text-[10px] font-semibold uppercase">Main</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Navigation */}
            <div className="space-y-1 mb-4">
              {navItems.map((item) => {
                const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                return (
                  <motion.button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm transition-all ${
                      active
                        ? 'bg-gradient-to-r from-[#1877f2]/20 to-[#4f46e5]/20 text-[#1877f2] border border-[#1877f2]/20'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon size={18} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.label === 'Messenger' && (
                      <span className="bg-[#1877f2] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* User bottom */}
            {user && (
              <div className="mt-auto pt-3 border-t border-white/10">
                <button onClick={() => navigate('/feed')}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: getAvatarColor(user.name) }}>
                    {getInitials(user.name)}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-green-400">● Online</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Collapse */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2 px-4 py-3 border-t border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-all text-sm"
          >
            <ChevronLeft size={16} />
            <span>Collapse</span>
          </button>
        </motion.aside>
      )}
      {!sidebarOpen && !isUltra && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="hidden lg:flex fixed left-4 top-20 z-30 w-9 h-9 rounded-xl bg-[#151728] border border-white/10 items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      )}
    </AnimatePresence>
  );
}
