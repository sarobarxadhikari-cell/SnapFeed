import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Play, Eye, ThumbsUp, Music, TrendingUp, Clock } from 'lucide-react';

const discoverContent = [
  { id: 1, title: 'Nepal Travel Guide 🇳🇵', channel: 'Explore Nepal', views: '1.2M', likes: '85K', image: null, category: 'Travel' },
  { id: 2, title: 'React Tips & Tricks 🚀', channel: 'CodeWithMe', views: '850K', likes: '42K', image: null, category: 'Tech' },
  { id: 3, title: 'Hidden Cafes in Kathmandu ☕', channel: 'Foodie Nepal', views: '340K', likes: '28K', image: null, category: 'Food' },
  { id: 4, title: 'Street Dance Battle 🕺', channel: 'Dance Nepal', views: '2.1M', likes: '156K', image: null, category: 'Entertainment' },
  { id: 5, title: 'AI Generated Art 🤖', channel: 'TechVault', views: '560K', likes: '34K', image: null, category: 'Tech' },
  { id: 6, title: 'Mount Everest VR Tour 🏔️', channel: 'Adventure Nepal', views: '4.5M', likes: '290K', image: null, category: 'Travel' },
];

const categories = ['For You', 'Travel', 'Tech', 'Food', 'Music', 'Gaming', 'Sports', 'Fashion'];

export default function UltraDiscover() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('For You');
  const [playing, setPlaying] = useState(null);

  return (
    <div className="h-screen bg-[#0b0f17] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/ultra')} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">Discover</h1>
        </div>
        <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10">
          <Search size={18} />
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide border-b border-white/5">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Spotlight section */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffd84d] to-[#ff6b35] flex items-center justify-center">
            <TrendingUp size={16} className="text-black" />
          </div>
          <h2 className="text-sm font-bold">Spotlight</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {discoverContent.slice(0, 4).map((item) => (
            <motion.div key={item.id} whileHover={{ scale: 1.02 }} onClick={() => setPlaying(playing === item.id ? null : item.id)}
              className="min-w-[140px] aspect-[9/16] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden relative cursor-pointer group flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-semibold text-xs line-clamp-2">{item.title}</p>
                <p className="text-gray-400 text-[10px] mt-1">{item.channel}</p>
              </div>
              {playing === item.id && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Play size={20} className="text-white ml-0.5" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trending grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} className="text-gray-400" />
          <h2 className="text-sm font-bold">Trending Today</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {discoverContent.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 cursor-pointer hover:ring-1 hover:ring-white/20 transition-all">
              <div className="aspect-video bg-gradient-to-br from-[#1a1a3e] to-[#2d1b4e] flex items-center justify-center">
                <Music size={24} className="text-white/20" />
              </div>
              <div className="p-3">
                <p className="text-white font-semibold text-sm line-clamp-1">{item.title}</p>
                <p className="text-gray-500 text-xs mt-1">{item.channel}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-gray-500 text-[10px]">
                    <Play size={10} /> {item.views}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500 text-[10px]">
                    <ThumbsUp size={10} /> {item.likes}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
