import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, Zap, X, Grid, Smile, Sparkles, RotateCw } from 'lucide-react';

const filters = [
  { name: 'Original', class: '' },
  { name: 'Vibe', class: 'filter-vibe', color: '#ff6b9d' },
  { name: 'Neon', class: 'filter-neon', color: '#00f5ff' },
  { name: 'Gold', class: 'filter-gold', color: '#ffd700' },
  { name: 'Ghost', class: 'filter-ghost', color: '#e0e0ff' },
  { name: 'Rose', class: 'filter-rose', color: '#ff4081' },
  { name: 'Ocean', class: 'filter-ocean', color: '#0066ff' },
  { name: 'Fire', class: 'filter-fire', color: '#ff4500' },
];

export default function UltraCamera() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(0);
  const [facing, setFacing] = useState('rear');
  const [flash, setFlash] = useState(false);

  const handleCapture = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
  };

  return (
    <div className="h-screen w-full bg-black relative overflow-hidden">
      {flash && <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} className="absolute inset-0 bg-white z-50" />}

      {/* Camera view */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <Camera size={80} className="text-gray-700" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none z-10" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
        <button onClick={() => navigate('/ultra')} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
          <X size={20} className="text-white" />
        </button>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </button>
          <button onClick={() => setFacing(facing === 'rear' ? 'front' : 'rear')} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
            <RotateCw size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-8">
        {/* Capture button */}
        <div className="flex items-center justify-center gap-10 mb-6">
          <button className="w-14 h-14 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
            <Grid size={20} className="text-white" />
          </button>
          <button onClick={handleCapture} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20" />
          </button>
          <button className="w-14 h-14 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
            <Smile size={20} className="text-white" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-3 overflow-x-auto px-4 scrollbar-hide">
          {filters.map((f, i) => (
            <button key={f.name} onClick={() => setActiveFilter(i)}
              className={`flex flex-col items-center gap-1 min-w-[60px] transition-all ${activeFilter === i ? 'scale-110' : 'opacity-60'}`}>
              <div className="w-14 h-20 rounded-2xl border-2 border-white/30 flex items-center justify-center overflow-hidden" style={{ borderColor: activeFilter === i ? f.color || '#fff' : 'rgba(255,255,255,0.3)' }}>
                <div className="w-full h-full" style={{ background: f.color || '#333' }} />
              </div>
              <span className="text-white text-[10px] font-medium">{f.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
