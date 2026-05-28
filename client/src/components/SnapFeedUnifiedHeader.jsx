import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SnapFeedUnifiedHeader({ onChatClick, isChatActive, onProfileClick, onSearchClick }) {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  const NAV_TABS = [
    { id: 'home', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> },
    { id: 'video', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg> },
    { id: 'marketplace', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/></svg> },
    { id: 'profile', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
    { id: 'gaming', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg> }
  ];

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800/90 sticky top-0 z-50 shadow-xl">
      <div className="w-full h-12 px-3 flex flex-row items-center">

        <div className="flex flex-row items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-600/10 flex-shrink-0">
            SF
          </div>
          <input
            type="text"
            placeholder="Search..."
            onClick={() => onSearchClick && onSearchClick()}
            readOnly
            className="w-[160px] bg-slate-950 border border-slate-800/80 focus:border-blue-500 rounded-full px-4 py-1.5 text-[11px] text-white placeholder-slate-600 outline-none transition cursor-pointer"
          />
        </div>

        <div className="flex-1 flex flex-row items-center justify-center">
          {NAV_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'profile') onProfileClick && onProfileClick();
              }}
              className={`relative px-5 py-2.5 rounded-lg transition-all duration-200 ${
                activeTab === tab.id ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.icon}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-1 right-1 h-[3px] bg-blue-500 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-row items-center gap-2 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChatClick && onChatClick()}
            className={`w-8 h-8 rounded-full border flex items-center justify-center outline-none cursor-pointer transition ${
              isChatActive ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-800/80 border-slate-700/40 text-slate-200'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700/40 flex items-center justify-center text-slate-200 outline-none cursor-pointer transition relative"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1-1.5-1s-1.5.17-1.5 1v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">1</span>
          </motion.button>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onProfileClick && onProfileClick()}
            className="w-8 h-8 rounded-full border-2 border-slate-700 p-0.5 bg-slate-800 cursor-pointer flex items-center justify-center flex-shrink-0"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-slate-600 to-slate-400 flex items-center justify-center text-[9px] font-black text-white">SA</div>
          </motion.div>
        </div>

      </div>
    </header>
  );
}
