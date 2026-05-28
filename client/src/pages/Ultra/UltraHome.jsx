import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, Zap, X, Map, MessageCircle, Compass, Flame, ChevronDown, Image, Send, Smile } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const filters = ['Normal', 'Vibe', 'Neon', 'Ghost', 'Gold', 'Rose', 'Ocean', 'Fire'];

export default function UltraHome() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [captured, setCaptured] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('Normal');
  const [showCamera, setShowCamera] = useState(true);
  const [flash, setFlash] = useState(false);

  const handleCapture = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
    setCaptured('/api/placeholder/400/600');
    setShowCamera(false);
  };

  const handleSendSnap = () => {
    navigate('/ultra/chat');
  };

  const resetCamera = () => {
    setCaptured(null);
    setShowCamera(true);
  };

  const containerClass = `ultra-container filter-${selectedFilter.toLowerCase()}`;

  return (
    <div className={`h-screen w-full bg-black relative overflow-hidden ${containerClass}`}>
      {/* Flash effect */}
      <AnimatePresence>
        {flash && (
          <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-white z-50" />
        )}
      </AnimatePresence>

      {/* Camera viewfinder */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10 pointer-events-none" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/feed')} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
            <X size={20} className="text-white" />
          </button>
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-xl rounded-full px-3 py-1.5">
            <Flame size={16} className="text-[#ffd84d]" />
            <span className="text-white text-sm font-bold">12</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/ultra/maps')} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
            <Map size={20} className="text-white" />
          </button>
          <button onClick={() => navigate('/ultra/discover')} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
            <Compass size={20} className="text-white" />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffd84d] to-[#ff6b35] flex items-center justify-center text-sm font-bold text-white">
            {user ? getInitials(user.name) : 'U'}
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
        {/* Chat button */}
        <div className="flex justify-center mb-6">
          <motion.button
            onClick={() => navigate('/ultra/chat')}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20"
            whileHover={{ scale: 1.02 }}
          >
            <MessageCircle size={20} className="text-white" />
            <span className="text-white font-semibold text-sm">Chats</span>
            <span className="bg-[#ff3b30] text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
          </motion.button>
        </div>

        {/* Camera controls */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/ultra/stories')} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center">
              <Image size={20} className="text-white" />
            </div>
            <span className="text-white/60 text-xs">Stories</span>
          </button>

          <button onClick={handleCapture} className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/10" />
            </div>
          </button>

          <button onClick={handleSendSnap} className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full bg-[#ffd84d] flex items-center justify-center">
              <Send size={20} className="text-[#0b0f17]" />
            </div>
            <span className="text-white/60 text-xs">Send</span>
          </button>
        </div>

        {/* Filters bar */}
        <div className="flex justify-center gap-2 mt-6 overflow-x-auto scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === f ? 'bg-white text-black' : 'bg-white/10 text-white/70'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Captured preview */}
      <AnimatePresence>
        {captured && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-30 flex flex-col">
            <div className="flex-1 bg-gray-900 flex items-center justify-center">
              <Camera size={64} className="text-gray-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-black">
              <button onClick={resetCamera} className="text-white/70 text-sm">Retake</button>
              <button onClick={handleSendSnap} className="bg-[#ffd84d] text-black px-6 py-2 rounded-full font-bold text-sm">Send</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
