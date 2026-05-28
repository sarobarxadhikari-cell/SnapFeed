import React, { useState } from 'react';
import { motion } from 'framer-motion';

const GRADIENTS = ['from-blue-700 to-cyan-500', 'from-red-600 to-orange-500', 'from-amber-600 to-yellow-500', 'from-purple-600 to-pink-500', 'from-emerald-600 to-teal-500', 'from-rose-600 to-pink-500', 'from-violet-600 to-purple-500'];

function buildChatCells(users, activeUser) {
  return users.filter(u => u.name !== activeUser.fullName).map((u, i) => ({
    id: `chat-${u.id}`,
    name: u.name,
    initials: u.init,
    gradient: GRADIENTS[i % GRADIENTS.length],
    online: u.status === 'Online',
    preview: u.status,
    time: '',
    unread: 0,
  }));
}

export default function SnapFeedMessenger({ users = [], activeUser = {} }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const allCells = buildChatCells(users, activeUser);
  const filters = ['All', 'Unread', 'Groups', 'Communities'];
  const filteredCells = allCells.filter(c =>
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
              <div className={`w-12 h-12 bg-gradient-to-tr ${cell.gradient} rounded-full flex items-center justify-center font-bold text-xs text-white`}>{cell.initials}</div>
              {cell.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#09090b] rounded-full" />}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-semibold text-white truncate">{cell.name}</h2>
              </div>
              <p className="text-[12px] text-[#a1a1aa] truncate mt-0.5">{cell.preview}</p>
            </div>
          </motion.div>
        ))}
        {filteredCells.length === 0 && (
          <p className="text-center text-[#71717a] text-xs py-8">No conversations yet</p>
        )}
      </div>
    </div>
  );
}
