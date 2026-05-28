import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Phone, Video, MoreHorizontal, Send, Image, Paperclip, Smile, ArrowLeft, MessageCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useChatStore from '../store/chatStore';
import { getInitials, getAvatarColor } from '../utils/helpers';

const conversations = [
  { id: 'c1', user: 'Sam Wilson', online: true, lastMsg: 'See you tomorrow!', time: '2m ago', unread: 2, messages: [
    { id: 'm1', text: 'Hey, are you free for a call?', sent: true, time: '10:30 AM' },
    { id: 'm2', text: 'Yeah sure, give me 5 mins', sent: false, time: '10:31 AM' },
    { id: 'm3', text: 'See you tomorrow!', sent: true, time: '10:32 AM' },
  ]},
  { id: 'c2', user: 'Jordan Lee', online: true, lastMsg: 'Great work on the UI! 🔥', time: '1h ago', unread: 0, messages: [] },
  { id: 'c3', user: 'Maya Patel', online: false, lastMsg: 'Can you review my PR?', time: '3h ago', unread: 1, messages: [] },
  { id: 'c4', user: 'Alex Snapfeed', online: false, lastMsg: 'System update at 2pm', time: '5h ago', unread: 0, messages: [] },
  { id: 'c5', user: 'Chris Wong', online: true, lastMsg: 'New design mockups', time: 'Just now', unread: 3, messages: [] },
];

export default function MessengerPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef(null);

  const activeConv = conversationId ? conversations.find(c => c.id === conversationId) : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  const handleSend = () => {
    if (!message.trim() || !activeConv) return;
    setMessage('');
  };

  // Conversation list (sidebar)
  const renderConversations = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h1 className="text-xl font-bold mb-3">Messages</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#1877f2]"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv, i) => (
          <motion.button key={conv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
            onClick={() => navigate(`/messenger/${conv.id}`)}
            className={`w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors ${
              activeConv?.id === conv.id ? 'bg-white/5' : ''
            }`}>
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1877f2] to-[#4f46e5] flex items-center justify-center text-sm font-bold">
                {getInitials(conv.user)}
              </div>
              {conv.online && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#0b0f17]" />}
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{conv.user}</p>
                <span className="text-gray-500 text-xs">{conv.time}</span>
              </div>
              <p className="text-gray-400 text-xs truncate mt-0.5">{conv.lastMsg}</p>
            </div>
            {conv.unread > 0 && (
              <span className="bg-[#1877f2] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{conv.unread}</span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );

  // Chat view
  const renderChat = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <button onClick={() => navigate('/messenger')} className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10">
          <ArrowLeft size={20} />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1877f2] to-[#4f46e5] flex items-center justify-center text-sm font-bold">
          {getInitials(activeConv.user)}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">{activeConv.user}</p>
          <p className="text-green-400 text-xs">{activeConv.online ? 'Online' : 'Offline'}</p>
        </div>
        <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10">
          <Phone size={18} />
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10">
          <Video size={18} />
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {activeConv.messages.map((msg) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
              msg.sent ? 'bg-[#1877f2] text-white rounded-br-md' : 'bg-white/10 text-white rounded-bl-md'
            }`}>
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.sent ? 'text-blue-200' : 'text-gray-500'}`}>{msg.time}</p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10">
            <Paperclip size={18} className="text-gray-500" />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10">
            <Image size={18} className="text-gray-500" />
          </button>
          <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <input value={message} onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button><Smile size={18} className="text-gray-500" /></button>
          </div>
          <button onClick={handleSend} className="w-10 h-10 rounded-full bg-[#1877f2] flex items-center justify-center">
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex">
      {/* Conversation list - always visible on desktop */}
      <div className={`${conversationId ? 'hidden lg:block' : 'block'} w-full lg:w-96 border-r border-white/10`}>
        {renderConversations()}
      </div>
      {/* Chat area */}
      <div className={`${conversationId ? 'flex' : 'hidden lg:flex'} flex-1 flex-col`}>
        {activeConv ? renderChat() : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold">Select a conversation</p>
              <p className="text-sm">Choose from your existing conversations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
