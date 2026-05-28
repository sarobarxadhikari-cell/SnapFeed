import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Eye, Trash2 } from 'lucide-react';
import { getInitials } from '../../utils/helpers';

const myStories = [
  { id: 1, image: null, caption: 'Morning vibes 🌅', time: '5m ago', views: 12 },
  { id: 2, image: null, caption: 'Code mode 🚀', time: '2h ago', views: 8 },
];

const friendStories = [
  { id: 3, name: 'Sam Wilson', image: null, time: '10m ago', viewed: false },
  { id: 4, name: 'Jordan Lee', image: null, time: '1h ago', viewed: false },
  { id: 5, name: 'Maya Patel', image: null, time: '3h ago', viewed: true },
  { id: 6, name: 'Chris Wong', image: null, time: '5h ago', viewed: true },
  { id: 7, name: 'Alex Snapfeed', image: null, time: '8h ago', viewed: false },
];

export default function UltraStories() {
  const navigate = useNavigate();
  const [viewingStory, setViewingStory] = useState(null);

  if (viewingStory) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="h-screen bg-black flex flex-col items-center justify-center relative">
        <div className="w-full max-w-sm aspect-[9/16] bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full bg-white rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
          <p className="text-white text-lg font-semibold">{viewingStory.caption || `${viewingStory.name}'s story`}</p>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <p className="text-white/70 text-sm">{viewingStory.time}</p>
            <button onClick={() => setViewingStory(null)} className="bg-white/10 px-4 py-1.5 rounded-full text-white text-xs">
              Close
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-screen bg-[#0b0f17] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/ultra')} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">Stories</h1>
        </div>
        <button className="w-9 h-9 rounded-full bg-[#ffd84d] flex items-center justify-center">
          <Plus size={18} className="text-black" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* My stories */}
        <div>
          <p className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">My Stories</p>
          <div className="space-y-2">
            {myStories.map((s) => (
              <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => setViewingStory(s)}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffd84d] to-[#ff6b35] flex items-center justify-center">
                  <span className="text-2xl">🌅</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{s.caption}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-gray-500 text-xs">{s.time}</span>
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <Eye size={12} /> {s.views}
                    </span>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-500">
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Friend stories */}
        <div>
          <p className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Recent Stories</p>
          <div className="grid grid-cols-2 gap-3">
            {friendStories.map((s) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => setViewingStory(s)}
                className={`rounded-2xl overflow-hidden cursor-pointer aspect-[3/4] ${
                  s.viewed ? 'opacity-60' : ''
                } bg-gradient-to-br from-gray-800 to-gray-900 relative group`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffd84d] to-[#ff6b35] flex items-center justify-center text-[10px] font-bold">
                      {getInitials(s.name)}
                    </div>
                    <p className="text-white font-semibold text-sm">{s.name}</p>
                  </div>
                  <p className="text-white/60 text-xs mt-1">{s.time}</p>
                </div>
                {!s.viewed && (
                  <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-[#ff3b30]" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
