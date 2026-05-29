import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'https://snapfeed-1.onrender.com';

const playMessageSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    osc2.frequency.setValueAtTime(1320, ctx.currentTime + 0.06);
    osc1.frequency.setValueAtTime(1100, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime + 0.06);
    osc1.stop(ctx.currentTime + 0.35);
    osc2.stop(ctx.currentTime + 0.4);
    const osc3 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc3.connect(gain2);
    gain2.connect(ctx.destination);
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(1760, ctx.currentTime + 0.12);
    gain2.gain.setValueAtTime(0.4, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc3.start(ctx.currentTime + 0.12);
    osc3.stop(ctx.currentTime + 0.4);
  } catch {}
};

export default function SnapFeedMessageBox({ token, currentUserId, socket, onClose, openChatWith, onNewMessage, onStartVideoCall }) {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
    return res.json();
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (openChatWith) {
      openChat(openChatWith);
    }
  }, [openChatWith]);

  useEffect(() => {
    if (!socket) return;
    socket.on('receive_message', (msg) => {
      if (activeChat && (msg.sender?._id === activeChat._id || msg.sender === activeChat._id)) {
        setChatMessages(prev => [...prev, msg]);
      }
      playMessageSound();
      if (onNewMessage && (!activeChat || (msg.sender?._id !== activeChat._id && msg.sender !== activeChat._id))) {
        const senderName = msg.sender?.fullName || 'Someone';
        const senderText = msg.text?.length > 30 ? msg.text.substring(0, 30) + '...' : msg.text;
        onNewMessage(`${senderName}: ${senderText}`);
      }
      loadConversations();
    });
    socket.on('message_sent_confirm', (msg) => {
      setChatMessages(prev => {
        const exists = prev.find(m => m._id === msg._id);
        if (exists) return prev;
        return [...prev, msg];
      });
    });
    socket.on('user_typing', () => setIsTyping(true));
    socket.on('user_stop_typing', () => setIsTyping(false));
    return () => {
      socket.off('receive_message');
      socket.off('message_sent_confirm');
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      const data = await apiFetch(`${API_BASE_URL}/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      if (data.users) setSearchResults(data.users.filter(u => u._id !== currentUserId));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadConversations = async () => {
    const data = await apiFetch(`${API_BASE_URL}/api/messages`);
    if (data.conversations) setConversations(data.conversations);
  };

  const openChat = async (userId) => {
    setIsSearching(false);
    setSearchQuery('');
    const userData = await apiFetch(`${API_BASE_URL}/api/users/profile/${userId}`);
    setActiveChat(userData.user);
    const msgData = await apiFetch(`${API_BASE_URL}/api/messages/${userId}`);
    if (msgData.messages) setChatMessages(msgData.messages);
    await apiFetch(`${API_BASE_URL}/api/messages/read/${userId}`, { method: 'PUT' });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;
    if (socket) {
      socket.emit('send_message', { senderId: currentUserId, receiverId: activeChat._id, text: messageInput });
    }
    setMessageInput('');
    loadConversations();
  };

  const handleTyping = () => {
    if (socket && activeChat) {
      socket.emit('typing_start', { senderId: currentUserId, receiverId: activeChat._id });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', { senderId: currentUserId, receiverId: activeChat._id });
      }, 2000);
    }
  };

  if (activeChat) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full h-[500px] shadow-2xl flex flex-col relative">

          <div className="flex items-center gap-3 p-4 border-b border-slate-800">
            <button onClick={() => { setActiveChat(null); setChatMessages([]); }} className="text-slate-400 hover:text-white p-1"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
              {activeChat.avatar ? <img src={activeChat.avatar} className="w-full h-full object-cover" alt="" /> : activeChat.fullName?.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-white">{activeChat.fullName}</p>
              <p className="text-[10px] text-slate-500">Online</p>
            </div>
            <button onClick={() => { if (onStartVideoCall) onStartVideoCall(activeChat); }} className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center transition">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
            </button>
            <button onClick={() => { setActiveChat(null); setChatMessages([]); }} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-full">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {chatMessages.length === 0 && <div className="text-center text-slate-600 text-xs py-8">No messages yet. Say hello!</div>}
            {chatMessages.map((msg, idx) => {
              const isMe = msg.sender?._id === currentUserId || msg.sender === currentUserId;
              return (
                <motion.div key={msg._id || idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs font-medium ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                </motion.div>
              );
            })}
            {isTyping && <div className="text-[10px] text-slate-500 animate-pulse">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="p-3 border-t border-slate-800 flex items-center gap-2">
            <input type="text" value={messageInput} onChange={(e) => { setMessageInput(e.target.value); handleTyping(); }} placeholder="Type a message..." className="flex-1 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-full px-4 py-2 text-xs text-white placeholder-slate-600 outline-none transition" />
            <button type="submit" disabled={!messageInput.trim()} className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-30 flex items-center justify-center transition">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </form>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-start justify-center pt-16 p-4">
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl relative">

        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white">Messages</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-full transition">✕</button>
          </div>
          <div className="relative">
            <svg className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setIsSearching(true); }} onFocus={() => setIsSearching(true)} placeholder="Search people to message..." className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition" />
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {isSearching && searchQuery ? (
            <div className="p-2">
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-slate-600 text-xs">No users found</div>
              ) : (
                searchResults.map(user => (
                  <button key={user._id} onClick={() => openChat(user._id)} className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition text-left">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white overflow-hidden">
                      {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" /> : user.fullName?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
                      {user.bio && <p className="text-[10px] text-slate-500 truncate">{user.bio}</p>}
                    </div>
                    <span className="text-[10px] text-blue-400 font-bold">Message</span>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="p-2">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-slate-600 text-xs">No conversations yet. Search to start chatting.</div>
              ) : (
                conversations.map(conv => {
                  const other = conv.lastMessage?.sender?._id === currentUserId ? conv.lastMessage?.receiver : conv.lastMessage?.sender;
                  return (
                    <button key={conv._id} onClick={() => openChat(other?._id)} className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition text-left">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white overflow-hidden">
                        {other?.avatar ? <img src={other.avatar} className="w-full h-full object-cover" alt="" /> : other?.fullName?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{other?.fullName}</p>
                        <p className="text-[10px] text-slate-500 truncate">{conv.lastMessage?.text}</p>
                      </div>
                      <span className="text-[9px] text-slate-600">{new Date(conv.lastMessage?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
