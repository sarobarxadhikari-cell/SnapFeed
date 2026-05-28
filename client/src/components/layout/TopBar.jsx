import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Sun, Moon, LogOut, Menu, Zap } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';
import { getInitials } from '../../utils/helpers';

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme, toggleSidebar } = useUIStore();

  const isUltra = location.pathname.startsWith('/ultra');
  // Ultra has its own full-screen UI, no topbar
  if (isUltra) return null;

  return (
    <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 lg:px-6 glass-dark relative z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1877f2] to-[#ffd84d] flex items-center justify-center cursor-pointer"
          onClick={() => navigate('/feed')}
        >
          <span className="text-lg font-extrabold text-white">S</span>
        </div>
        <div className="hidden sm:block relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            placeholder="Search Snapfeed..."
            className="w-64 bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#1877f2] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Ultra quick button */}
        <motion.button
          onClick={() => navigate('/ultra')}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ffd84d]/20 to-[#ff6b35]/20 border border-[#ffd84d]/30 text-[#ffd84d] text-xs font-bold"
          whileHover={{ scale: 1.05 }}
        >
          <Zap size={14} />
          <span>Ultra</span>
        </motion.button>
        <motion.button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.05 }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>
        <motion.button
          onClick={logout}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors"
          whileHover={{ scale: 1.05 }}
          title="Logout"
        >
          <LogOut size={18} />
        </motion.button>
        <div
          className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1877f2] to-[#4f46e5] flex items-center justify-center text-sm font-bold cursor-pointer ml-2"
          onClick={() => navigate('/feed')}
        >
          {user ? getInitials(user.name) : 'U'}
        </div>
      </div>
    </header>
  );
}
