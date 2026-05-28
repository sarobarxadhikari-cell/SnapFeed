import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, Search, Plus, Video, Phone, ArrowLeft, Flame, Smile, Send, Image } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const snapChats = [
  { id: 1, name: 'Sam Wilson', online: true, streak: 7, lastSnap: '2m ago', unread: 2 },
  { id: 2, name: 'Jordan Lee', online: true, streak: 15, lastSnap: '5m ago', unread: 0 },
  { id: 3, name: 'Alex Snapfeed', online: false, streak: 30, lastSnap: '1h ago', unread: 1 },
  { id: 4, name: 'Maya Patel', online: true, streak: 3, lastSnap: 'Just now', unread: 0 },
  { id: 5, name: 'Chris Wong', online: false, streak: 0, lastSnap: '3h ago', unread: 0 },
];

export default function UltraChat() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now(), text: message, sent: true }]);
    setMessage('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: '🔥 snap!', sent: false }]);
    }, 1000);
  };

  if (activeChat) {
    return (
      <div className="h-screen flex flex-col bg-[#0b0f17]">
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <button onClick={() => { setActiveChat(null); setMessages([]); }} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10">
            <ArrowLeft size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffd84d] to-[#ff6b35] flex items-center justify-center text-sm font-bold">
            {getInitials(activeChat.name)}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{activeChat.name}</p>
            <p className="text-[#ffd84d] text-xs">{`🔥 ${activeChat.streak} day streak`}</p>
          </div>
          <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10">
            <Video size={18} />
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10">
            <Phone size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${msg.sent ? 'bg-[#ffd84d] text-black rounded-br-md' : 'bg-white/10 text-white rounded-bl-md'}`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10">
              <Camera size={18} />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10">
              <Image size={18} />
            </button>
            <div className="flex-1 flex items-center bg-white/5 rounded-full px-4 py-2">
              <input value={message} onChange={(e) => setMessage(e.target.value)}
                placeholder="Send a snap..."
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="ml-2" onClick={() => {}}>
                <Smile size={18} className="text-gray-500" />
              </button>
            </div>
            <button onClick={handleSend} className="w-10 h-10 rounded-full bg-[#ffd84d] flex items-center justify-center">
              <Send size={16} className="text-black" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0b0f17]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/ultra')} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10">
            <Camera size={18} />
          </button>
          <h1 className="text-lg font-bold">Snap Chat</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10">
            <Search size={18} />
          </button>
          <button onClick={() => navigate('/ultra')} className="w-9 h-9 rounded-full bg-[#ffd84d] flex items-center justify-center">
            <Plus size={18} className="text-black" />
          </button>
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {snapChats.map((chat, i) => (
          <motion.button key={chat.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => setActiveChat(chat)}
            className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors border-b border-white/5">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ffd84d] to-[#ff6b35] flex items-center justify-center text-lg font-bold">
                {getInitials(chat.name)}
              </div>
              {chat.online && <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0b0f17]" />}
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{chat.name}</p>
                <span className="text-gray-500 text-xs">{chat.lastSnap}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {chat.streak > 0 && (
                  <span className="flex items-center gap-0.5 text-[#ffd84d] text-xs">
                    <Flame size={12} /> {chat.streak}
                  </span>
                )}
                {chat.unread > 0 && (
                  <span className="bg-[#ff3b30] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{chat.unread}</span>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
