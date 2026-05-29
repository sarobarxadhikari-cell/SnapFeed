import React, { useState } from 'react';
import { Users, Store, Tv, Gamepad2, Bookmark, ChevronRight, Compass, Music2, ShoppingBag, Archive, Newspaper, Radio, Settings, Shield, Lock, Globe, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SnapFeedLeftSidebar({ userRecord, showMore, setShowMore }) {
  const mainItems = [
    { icon: Users, name: 'Friends', color: 'from-blue-500 to-indigo-600' },
    { icon: Store, name: 'Marketplace', color: 'from-emerald-500 to-teal-600' },
    { icon: Tv, name: 'Watch', color: 'from-purple-500 to-violet-600' },
    { icon: Gamepad2, name: 'Gaming', color: 'from-rose-500 to-pink-600' },
    { icon: Bookmark, name: 'Saved', color: 'from-amber-500 to-orange-600' }
  ];

  const moreItems = [
    { icon: Compass, name: 'Explore', color: 'from-cyan-500 to-blue-600' },
    { icon: Music2, name: 'Music', color: 'from-pink-500 to-rose-600' },
    { icon: ShoppingBag, name: 'Shop', color: 'from-emerald-500 to-green-600' },
    { icon: Archive, name: 'Archive', color: 'from-slate-500 to-gray-600' },
    { icon: Newspaper, name: 'Feeds', color: 'from-blue-400 to-indigo-600' },
    { icon: Radio, name: 'Live', color: 'from-red-500 to-rose-600' },
    { icon: Shield, name: 'Privacy', color: 'from-violet-500 to-purple-600' },
    { icon: Settings, name: 'Settings', color: 'from-slate-400 to-slate-600' }
  ];

  return (
    <div className="w-[280px] h-screen sticky top-[85px] overflow-y-auto px-3 pb-20 hidden lg:block flex-shrink-0">

      <motion.div whileHover={{ x: 5 }} className="w-full h-16 rounded-2xl bg-white/5 hover:bg-white/8 flex items-center gap-3 px-3 mb-2 cursor-pointer border border-white/5 transition-all">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
          {userRecord?.avatarInitialString || 'U'}
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{userRecord?.fullName || 'User'}</h3>
          <p className="text-[10px] text-blue-400">@{userRecord?.accountHandle || 'user'}</p>
        </div>
      </motion.div>

      {mainItems.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.button key={i} whileHover={{ x: 5, scale: 1.01 }} whileTap={{ scale: 0.97 }} className="w-full h-12 rounded-2xl bg-white/5 hover:bg-white/8 flex items-center gap-3 px-3 mb-1.5 border border-white/5 transition-all">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center`}>
              <Icon size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-slate-200">{item.name}</span>
          </motion.button>
        );
      })}

      <motion.button whileHover={{ x: 5 }} whileTap={{ scale: 0.97 }} onClick={() => setShowMore(!showMore)} className="w-full h-12 rounded-2xl bg-white/5 hover:bg-white/8 flex items-center gap-3 px-3 mt-2 border border-white/5 transition-all">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
          <ChevronRight size={16} className={`text-white transition-transform duration-300 ${showMore ? 'rotate-90' : ''}`} />
        </div>
        <span className="text-sm font-medium text-slate-200">See More</span>
      </motion.button>

      <AnimatePresence>
        {showMore && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            {moreItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.button key={i} whileHover={{ x: 6, scale: 1.01 }} className="w-full h-12 rounded-2xl bg-white/5 hover:bg-white/8 flex items-center gap-3 px-3 mb-1.5 border border-white/5 transition-all">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">{item.name}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
