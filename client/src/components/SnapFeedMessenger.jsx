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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const allCells = buildChatCells(users, activeUser);
  const filters = ['All', 'Unread', 'Groups', 'Communities'];
  const filteredCells = allCells.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#09090b] border border-[#18181b] rounded-2xl flex flex-col overflow-hidden">
      <div className="p-3 flex justify-between items-center bg-[#09090b]/90 border-b border-[#18181b]">
        <h1 className="text-sm font-bold tracking-tight text-white select-none">Chats</h1>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="w-7 h-7 flex items-center justify-center text-[#a1a1aa] hover:text-white bg-[#18181b] hover:bg-[#27272a] rounded-full transition text-xs cursor-pointer">{isCollapsed ? '▼' : '▲'}</button>
      </div>

      {!isCollapsed && (
        <div className="flex flex-col">
          <div className="px-3 py-2">
            <div className="relative flex items-center bg-[#18181b] rounded-full px-3 py-1.5 text-[#71717a]">
              <span className="mr-2 text-[10px]">🔍</span>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search Messenger" className="bg-transparent w-full focus:outline-none text-[12px] text-white placeholder-[#71717a]" />
            </div>
          </div>

          <div className="px-3 pb-2 flex space-x-2 text-[11px] overflow-x-auto whitespace-nowrap select-none" style={{ scrollbarWidth: 'none' }}>
            {filters.map(f => (
              <span key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1 rounded-full font-semibold cursor-pointer transition ${activeFilter === f ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20' : 'bg-[#18181b] text-[#e4e4e7] hover:bg-[#27272a]'}`}>{f}</span>
            ))}
          </div>

          <div className="overflow-y-auto px-2 pb-2 space-y-0.5 max-h-[360px]" style={{ scrollbarWidth: 'thin', scrollbarColor: '#27272a #09090b' }}>
            {filteredCells.map(cell => (
              <motion.div key={cell.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center p-2 hover:bg-[#18181b]/60 rounded-xl cursor-pointer transition group">
                <div className="relative flex-shrink-0">
                  <div className={`w-9 h-9 bg-gradient-to-tr ${cell.gradient} rounded-full flex items-center justify-center font-bold text-[9px] text-white`}>{cell.initials}</div>
                  {cell.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#09090b] rounded-full" />}
                </div>
                <div className="ml-2.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[12px] font-semibold text-white truncate">{cell.name}</h2>
                  </div>
                  <p className="text-[10px] text-[#a1a1aa] truncate mt-0.5">{cell.preview}</p>
                </div>
              </motion.div>
            ))}
            {filteredCells.length === 0 && (
              <p className="text-center text-[#71717a] text-[10px] py-6">No conversations yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
