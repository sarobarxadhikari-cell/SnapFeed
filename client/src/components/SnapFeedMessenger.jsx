import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Minus, Maximize2, ArrowLeft, Send, Smile, Image, Phone, Video, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'https://snapfeed-1.onrender.com';

export default function SnapFeedMessenger({ token, currentUserId, socket, onClose, onVideoCall }) {
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [fullPanel, setFullPanel] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState({});
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, { ...options, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...options.headers } });
    return res.json();
  };

  useEffect(() => { loadConversations(); }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('new-message', (msg) => { setMessages(prev => [...prev, msg]); loadConversations(); playNotifSound(); });
    socket.on('typing', ({ userId, conversationId }) => { if (activeChat?._id === conversationId) setTypingUsers(p => ({ ...p, [userId]: true })); });
    socket.on('stop-typing', ({ userId }) => { setTypingUsers(p => { const n = { ...p }; delete n[userId]; return n; }); });
    socket.on('user-online', (id) => setOnlineUsers(p => new Set([...p, id])));
    socket.on('user-offline', (id) => setOnlineUsers(p => { const n = new Set(p); n.delete(id); return n; }));
    return () => { socket.off('new-message'); socket.off('typing'); socket.off('stop-typing'); socket.off('user-online'); socket.off('user-offline'); };
  }, [socket, activeChat]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      const data = await apiFetch(`${API_BASE_URL}/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      if (data.users) setSearchResults(data.users.filter(u => u._id !== currentUserId));
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const loadConversations = async () => {
    const data = await apiFetch(`${API_BASE_URL}/api/conversations`);
    if (data.conversations) setConversations(data.conversations);
  };

  const startConversation = async (userId) => {
    const data = await apiFetch(`${API_BASE_URL}/api/conversation/create`, { method: 'POST', body: JSON.stringify({ participantId: userId }) });
    if (data.conversation) {
      if (socket) socket.emit('join-conversation', data.conversation._id);
      setActiveChat(data.conversation);
      setSearchQuery('');
      loadMessages(data.conversation._id);
      loadConversations();
      if (!fullPanel) setFullPanel(true);
    }
  };

  const loadMessages = async (convoId) => {
    const data = await apiFetch(`${API_BASE_URL}/api/messages/${convoId}`);
    if (data.messages) setMessages(data.messages);
  };

  const openChat = async (convo) => {
    if (socket) socket.emit('join-conversation', convo._id);
    setActiveChat(convo);
    loadMessages(convo._id);
    if (!fullPanel) setFullPanel(true);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;
    const other = activeChat.participants?.find(p => p._id !== currentUserId);
    if (socket) socket.emit('send-message', { conversationId: activeChat._id, receiver: other?._id, text: messageInput });
    setMessageInput('');
  };

  const handleTyping = () => {
    if (socket && activeChat) {
      socket.emit('typing', { conversationId: activeChat._id });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => socket.emit('stop-typing', { conversationId: activeChat._id }), 2000);
    }
  };

  const getOtherUser = (convo) => convo.participants?.find(p => p._id !== currentUserId);
  const getOtherUserId = (convo) => getOtherUser(convo)?._id;
  const getOtherUserName = (convo) => getOtherUser(convo)?.fullName || 'User';

  const playNotifSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination); o.type = 'sine';
      o.frequency.setValueAtTime(880, ctx.currentTime);
      g.gain.setValueAtTime(0.3, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.2);
    } catch {}
  };

  const getUnreadCount = () => conversations.length;

  const ChatList = () => (
    <div className="flex-1 overflow-y-auto">
      {searchQuery ? (
        <div className="p-2">
          {searchResults.map(user => (
            <button key={user._id} onClick={() => startConversation(user._id)} className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition text-left">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{user.fullName?.charAt(0)}</div>
              <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-white truncate">{user.fullName}</p></div>
              <span className="text-[10px] text-blue-400 font-bold">Chat</span>
            </button>
          ))}
        </div>
      ) : (
        conversations.map(convo => {
          const other = getOtherUser(convo);
          const isOnline = onlineUsers.has(other?._id);
          return (
            <div key={convo._id} onClick={() => openChat(convo)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">{other?.fullName?.charAt(0) || '?'}</div>
                {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0b1220]" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{other?.fullName || 'User'}</p>
                <p className="text-[10px] text-gray-400 truncate">{convo.lastMessage?.text || 'Start chatting...'}</p>
              </div>
              <span className="text-[9px] text-gray-500 flex-shrink-0">{convo.updatedAt ? new Date(convo.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
            </div>
          );
        })
      )}
      {!searchQuery && conversations.length === 0 && <div className="p-8 text-center text-gray-500 text-xs">No conversations yet</div>}
    </div>
  );

  const ChatBox = () => {
    const other = getOtherUser(activeChat);
    const isOnline = onlineUsers.has(other?._id);
    const isTyping = Object.keys(typingUsers).some(uid => uid !== currentUserId);
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 bg-[#111c33] border-b border-white/10">
          <button onClick={() => setActiveChat(null)} className="text-gray-400 hover:text-white"><ArrowLeft size={16} /></button>
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">{other?.fullName?.charAt(0) || '?'}</div>
            {isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#111c33]" />}
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-white">{other?.fullName || 'User'}</p>
            <p className="text-[9px]">{isOnline ? <span className="text-green-400">Active</span> : <span className="text-gray-500">Offline</span>}</p>
          </div>
          {onVideoCall && <button onClick={() => onVideoCall(other)} className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center"><Video size={14} className="text-white" /></button>}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#0a0f1a]">
          {messages.map((msg) => {
            const isMe = msg.sender?._id === currentUserId || msg.sender === currentUserId;
            if (msg.deletedForEveryone) return <div key={msg._id} className="text-center text-[10px] text-gray-600 italic">Deleted</div>;
            return (
              <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white/10 text-white rounded-bl-none'}`}>
                  {msg.replyTo && <div className="bg-white/5 border-l-2 border-blue-400 rounded-t-lg px-2 py-1 mb-1"><p className="text-[9px] text-blue-300">{msg.replyTo.text || 'Media'}</p></div>}
                  {msg.text && <p>{msg.text}</p>}
                  {msg.images?.length > 0 && <div className="mt-1">{msg.images.map((img, i) => <img key={i} src={img.url} className="rounded-lg max-w-full max-h-40 object-cover" alt="" />)}</div>}
                  <span className="text-[8px] opacity-50 mt-0.5 block">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            );
          })}
          {isTyping && <div className="text-[10px] text-gray-500 animate-pulse">Typing...</div>}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="flex items-center gap-2 p-3 bg-[#111c33] border-t border-white/10">
          <input type="text" value={messageInput} onChange={(e) => { setMessageInput(e.target.value); handleTyping(); }} placeholder="Type a message..." className="flex-1 bg-white/5 border border-white/10 focus:border-blue-500 rounded-full px-4 py-2 text-xs text-white placeholder-gray-500 outline-none transition" />
          <button type="submit" disabled={!messageInput.trim()} className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-30 flex items-center justify-center flex-shrink-0"><Send size={14} className="text-white" /></button>
        </form>
      </div>
    );
  };

  return (
    <>
      {/* TOP RIGHT ICON */}
      <div className="fixed top-4 right-20 z-50">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setIsOpen(!isOpen); if (fullPanel) setFullPanel(false); }} className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xl relative">
          <MessageCircle size={18} />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[10px] flex items-center justify-center font-bold">{getUnreadCount()}</span>
        </motion.button>
      </div>

      {/* FLOATING POPUP (BOTTOM RIGHT) */}
      <AnimatePresence>
        {isOpen && !fullPanel && (
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30 }} className="fixed bottom-5 right-5 w-[320px] bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#111c33]">
              <span className="font-semibold text-white text-sm">Messenger</span>
              <div className="flex gap-2">
                <button onClick={() => setMinimized(!minimized)} className="hover:bg-white/10 rounded p-1"><Minus size={14} className="text-white" /></button>
                <button onClick={() => { setFullPanel(true); setIsOpen(false); }} className="hover:bg-white/10 rounded p-1"><Maximize2 size={14} className="text-white" /></button>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 rounded p-1"><X size={14} className="text-white" /></button>
              </div>
            </div>
            {!minimized && (
              <>
                <div className="px-3 py-2 border-b border-white/10">
                  <div className="relative">
                    <Search size={14} className="text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search people..." className="w-full bg-white/5 border border-white/10 rounded-full pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none" />
                  </div>
                </div>
                <ChatList />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL PANEL (LEFT SIDE) */}
      <AnimatePresence>
        {fullPanel && (
          <motion.div initial={{ x: -400 }} animate={{ x: 0 }} exit={{ x: -400 }} className="fixed top-0 left-0 w-[380px] h-screen bg-[#0b1220] border-r border-white/10 z-50 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-[#111c33]">
              <span className="text-white font-semibold text-sm">{activeChat ? 'Chat' : 'Messenger'}</span>
              <button onClick={() => { setFullPanel(false); setActiveChat(null); }} className="hover:bg-white/10 rounded p-1"><X className="text-white" size={16} /></button>
            </div>
            {activeChat ? <ChatBox /> : (
              <>
                <div className="px-3 py-2 border-b border-white/10">
                  <div className="relative">
                    <Search size={14} className="text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search people..." className="w-full bg-white/5 border border-white/10 rounded-full pl-8 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none" />
                  </div>
                </div>
                <ChatList />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
