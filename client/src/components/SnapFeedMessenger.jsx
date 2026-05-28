import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MOCK_CHAT_CELLS = [
  { id: 'c1', name: 'Menuka Kafle Adhikari', preview: 'The video call ended • 3h', time: '3h', avatar: null, gradient: null, online: true, unread: 0 },
  { id: 'c2', name: 'Dolphin Education - Chitwan', preview: 'Hi! Please let us know how we can...', time: '18h', avatar: null, gradient: 'from-blue-700 to-cyan-500', initials: 'DE', online: false, unread: 1 },
  { id: 'c3', name: 'Ed-Mark Academy/college', preview: 'Ed-Mark Academy/college sent an...', time: '1d', avatar: null, gradient: 'from-red-600 to-orange-500', initials: 'EM', online: false, unread: 0 },
  { id: 'c4', name: 'The Next Education Consultancy', preview: 'Which level are you planning to study...', time: '1d', avatar: null, gradient: 'from-amber-600 to-yellow-500', initials: 'TN', online: false, unread: 0 },
  { id: 'c5', name: 'Bhattarai Naurath', preview: 'You: herchhu • Follow up!', time: '2d', avatar: null, gradient: null, online: false, unread: 0 },
  { id: 'c6', name: 'Pradip Adhikari', preview: '👍 You', time: '1m', avatar: null, gradient: null, online: false, unread: 0 },
  { id: 'c7', name: 'Anish Thapa Magar', preview: 'System configuration updated.', time: '30m', avatar: null, gradient: 'from-purple-600 to-pink-500', initials: 'AT', online: true, unread: 3 },
  { id: 'c8', name: 'Sushant Koirala', preview: 'See you tomorrow!', time: '2h', avatar: null, gradient: 'from-emerald-600 to-teal-500', initials: 'SK', online: false, unread: 0 },
];

export default function SnapFeedMessenger() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Unread', 'Groups', 'Communities'];
  const filteredCells = MOCK_CHAT_CELLS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-[#09090b] border-r border-[#18181b] flex flex-col w-full md:w-[380px] lg:w-[420px] flex-shrink-0">
      <div className="p-4 flex justify-between items-center bg-[#09090b]/90 backdrop-blur-md sticky top-0 z-30">
        <h1 className="text-2xl font-bold tracking-tight text-white select-none">Chats</h1>
        <div className="flex space-x-2">
          <button className="w-9 h-9 flex items-center justify-center text-[#a1a1aa] hover:text-white bg-[#18181b] hover:bg-[#27272a] rounded-full transition active:scale-90 cursor-pointer text-sm">⋯</button>
          <button className="w-9 h-9 flex items-center justify-center text-[#a1a1aa] hover:text-white bg-[#18181b] hover:bg-[#27272a] rounded-full transition active:scale-90 cursor-pointer text-sm">⊞</button>
          <button className="w-9 h-9 flex items-center justify-center text-[#a1a1aa] hover:text-white bg-[#18181b] hover:bg-[#27272a] rounded-full transition active:scale-90 cursor-pointer text-sm">✎</button>
        </div>
      </div>

      <div className="px-4 py-1">
        <div className="relative flex items-center bg-[#18181b] rounded-full px-4 py-2 text-[#71717a]">
          <span className="mr-3 text-xs">🔍</span>
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search Messenger" className="bg-transparent w-full focus:outline-none text-[14px] text-white placeholder-[#71717a]" />
        </div>
      </div>

      <div className="px-4 py-3 flex space-x-2 text-[13px] overflow-x-auto whitespace-nowrap select-none" style={{ scrollbarWidth: 'none' }}>
        {filters.map(f => (
          <span key={f} onClick={() => setActiveFilter(f)} className={`px-4 py-1.5 rounded-full font-semibold cursor-pointer transition ${activeFilter === f ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20' : 'bg-[#18181b] text-[#e4e4e7] hover:bg-[#27272a]'}`}>{f}</span>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-0.5" style={{ scrollbarWidth: 'thin', scrollbarColor: '#27272a #09090b' }}>
        {filteredCells.map(cell => (
          <motion.div key={cell.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center p-3 hover:bg-[#18181b]/60 rounded-xl cursor-pointer transition group">
            <div className="relative flex-shrink-0">
              {cell.avatar ? (
                <img src={cell.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
              ) : cell.gradient ? (
                <div className={`w-12 h-12 bg-gradient-to-tr ${cell.gradient} rounded-full flex items-center justify-center font-bold text-xs text-white`}>{cell.initials}</div>
              ) : (
                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 text-lg">👤</div>
              )}
              {cell.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#09090b] rounded-full" />}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-semibold text-white truncate">{cell.name}</h2>
                <span className={`text-[10px] ml-2 ${cell.unread > 0 ? 'text-blue-400 font-bold' : 'text-[#71717a]'}`}>{cell.time}</span>
              </div>
              <p className={`text-[12px] truncate mt-0.5 ${cell.unread > 0 ? 'text-[#f4f4f5] font-semibold' : 'text-[#a1a1aa]'}`}>{cell.preview}</p>
            </div>
            {cell.unread > 0 && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6] flex-shrink-0 ml-2" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
