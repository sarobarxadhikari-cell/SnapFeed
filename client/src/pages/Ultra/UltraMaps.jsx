import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Users, MapPin, Flame } from 'lucide-react';

const mapLocations = [
  { id: 1, name: 'Kathmandu', users: 12, emoji: '🏔️', color: '#ff6b9d' },
  { id: 2, name: 'Pokhara', users: 5, emoji: '🌊', color: '#00f5ff' },
  { id: 3, name: 'Lalitpur', users: 8, emoji: '🏛️', color: '#ffd700' },
  { id: 4, name: 'Bhaktapur', users: 3, emoji: '🎭', color: '#ff4081' },
  { id: 5, name: 'Chitwan', users: 2, emoji: '🌿', color: '#00e676' },
];

export default function UltraMaps() {
  const navigate = useNavigate();
  const [activeLocation, setActiveLocation] = useState(null);

  return (
    <div className="h-screen bg-[#0b0f17] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/ultra')} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">Snap Map</h1>
        </div>
        <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10">
          <Search size={18} />
        </button>
      </div>

      {/* Map placeholder */}
      <div className="flex-1 relative bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] overflow-hidden">
        {/* Grid overlay for map feel */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Location dots */}
        {mapLocations.map((loc, i) => (
          <motion.button key={loc.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1, type: 'spring' }}
            onClick={() => setActiveLocation(activeLocation === loc.id ? null : loc.id)}
            className="absolute"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}>
            <div className="relative">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform"
                style={{ background: `${loc.color}30`, borderColor: loc.color, borderWidth: 2 }}>
                <span className="drop-shadow-lg">{loc.emoji}</span>
              </div>
              <span className="absolute -bottom-1 -right-1 bg-[#ff3b30] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{loc.users}</span>
            </div>
            {activeLocation === loc.id && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white/10 backdrop-blur-xl rounded-xl p-3 min-w-[140px] border border-white/20">
                <p className="text-white font-semibold text-sm">{loc.name}</p>
                <div className="flex items-center gap-1 text-[#ffd84d] text-xs mt-1">
                  <Users size={12} />
                  <span>{loc.users} friends here</span>
                </div>
              </motion.div>
            )}
          </motion.button>
        ))}

        {/* Bottom friend list */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white/70 text-xs font-semibold mb-3 ml-1">Friends on Snap Map</p>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {mapLocations.map((loc) => (
              <div key={loc.id} className="flex flex-col items-center gap-1 min-w-[60px]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ffd84d] to-[#ff6b35] flex items-center justify-center text-sm font-bold border-2 border-white/30">
                  {loc.emoji}
                </div>
                <span className="text-white/60 text-[10px] truncate w-14 text-center">{loc.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
