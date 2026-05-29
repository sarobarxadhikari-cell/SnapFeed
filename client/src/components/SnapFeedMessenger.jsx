import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'https://snapfeed-1.onrender.com';

export default function SnapFeedMessenger({ token, currentUserId, socket, onClose, onVideoCall }) {
  const [view, setView] = useState('list');
  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [replyTo, setReplyTo] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, { ...options, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...options.headers } });
    return res.json();
  };

  useEffect(() => { loadConversations(); }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('new-message', (msg) => {
      setMessages(prev => [...prev, msg]);
      loadConversations();
    });
    socket.on('typing', ({ userId, conversationId }) => {
      if (activeConvo?._id === conversationId) setTypingUsers(prev => ({ ...prev, [userId]: true }));
    });
    socket.on('stop-typing', ({ userId, conversationId }) => {
      setTypingUsers(prev => { const n = { ...prev }; delete n[userId]; return n; });
    });
    socket.on('message-seen', ({ messageId, userId }) => {
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, seenBy: [...(m.seenBy || []), userId] } : m));
    });
    socket.on('reaction-update', ({ messageId, emoji, userId }) => {
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, reactions: [...(m.reactions || []), { user: userId, emoji }] } : m));
    });
    socket.on('message-deleted', ({ messageId }) => {
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, deletedForEveryone: true } : m));
    });
    socket.on('user-online', (userId) => setOnlineUsers(prev => new Set([...prev, userId])));
    socket.on('user-offline', (userId) => setOnlineUsers(prev => { const n = new Set(prev); n.delete(userId); return n; }));
    return () => { socket.off('new-message'); socket.off('typing'); socket.off('stop-typing'); socket.off('message-seen'); socket.off('reaction-update'); socket.off('message-deleted'); socket.off('user-online'); socket.off('user-offline'); };
  }, [socket, activeConvo]);

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
      setActiveConvo(data.conversation);
      setView('chat');
      setSearchQuery('');
      loadMessages(data.conversation._id);
      loadConversations();
    }
  };

  const loadMessages = async (convoId) => {
    const data = await apiFetch(`${API_BASE_URL}/api/messages/${convoId}`);
    if (data.messages) { setMessages(data.messages); markSeen(convoId); }
  };

  const markSeen = (convoId) => {
    if (!socket) return;
    messages.forEach(m => {
      if (m.sender?._id !== currentUserId && !(m.seenBy || []).includes(currentUserId)) {
        socket.emit('seen-message', { messageId: m._id, conversationId: convoId });
      }
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConvo) return;
    const other = activeConvo.participants?.find(p => p._id !== currentUserId);
    if (socket) {
      socket.emit('send-message', {
        conversationId: activeConvo._id,
        receiver: other?._id,
        text: messageInput,
        replyTo: replyTo?._id || null
      });
    }
    setMessageInput('');
    setReplyTo(null);
    loadConversations();
  };

  const handleTyping = () => {
    if (socket && activeConvo) {
      socket.emit('typing', { conversationId: activeConvo._id });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => socket.emit('stop-typing', { conversationId: activeConvo._id }), 2000);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files.length || !activeConvo) return;
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('files', f));
    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
      const data = await res.json();
      if (data.files && socket) {
        const other = activeConvo.participants?.find(p => p._id !== currentUserId);
        socket.emit('send-message', { conversationId: activeConvo._id, receiver: other?._id, text: '', images: data.files.map(f => ({ url: f.url })), files: data.files.map(f => ({ url: f.url, name: f.name, size: f.size })) });
      }
    } catch {}
    setUploading(false);
  };

  const reactToMessage = (messageId, emoji) => {
    if (socket && activeConvo) {
      socket.emit('react-message', { messageId, emoji, conversationId: activeConvo._id });
    }
    setShowEmojiPicker(null);
  };

  const deleteMessage = (messageId) => {
    if (socket && activeConvo) {
      socket.emit('delete-message', { messageId, conversationId: activeConvo._id });
    }
  };

  const getOtherUser = (convo) => convo.participants?.find(p => p._id !== currentUserId);

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🔥', '👏'];

  if (view === 'chat' && activeConvo) {
    const other = getOtherUser(activeConvo);
    const isOtherOnline = onlineUsers.has(other?._id);
    const typingInChat = Object.keys(typingUsers).filter(uid => uid !== currentUserId).length > 0;

    return (
      <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
        <div className="flex items-center gap-3 p-3 bg-slate-900 border-b border-slate-800">
          <button onClick={() => { setView('list'); setActiveConvo(null); setMessages([]); if (socket) socket.emit('leave-conversation', activeConvo._id); }} className="text-slate-400 hover:text-white p-1"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white overflow-hidden relative flex-shrink-0">
            {other?.profilePic ? <img src={other.profilePic} className="w-full h-full object-cover" /> : other?.fullName?.charAt(0)}
            {isOtherOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{other?.fullName}</p>
            <p className="text-[10px]">{isOtherOnline ? <span className="text-emerald-400">Active now</span> : <span className="text-slate-500">Offline</span>}</p>
          </div>
          <button onClick={() => { if (onVideoCall) onVideoCall(other); }} className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center transition">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b0f1a]">
          {messages.map((msg) => {
            const isMe = msg.sender?._id === currentUserId || msg.sender === currentUserId;
            if (msg.deletedForEveryone) return <div key={msg._id} className={`text-center text-[10px] text-slate-600 italic ${isMe ? 'text-right' : 'text-left'}`}>This message was deleted</div>;
            return (
              <motion.div key={msg._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group relative`}>
                <div className="max-w-[75%] relative">
                  {msg.replyTo && (
                    <div className="bg-slate-800/50 border-l-2 border-blue-500 rounded-t-xl px-3 py-1 mb-0.5">
                      <p className="text-[9px] text-blue-400 font-semibold">{msg.replyTo.sender?.fullName || 'Message'}</p>
                      <p className="text-[9px] text-slate-500 truncate">{msg.replyTo.text || 'Media'}</p>
                    </div>
                  )}
                  <div className={`px-3 py-2 rounded-2xl text-xs font-medium ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
                    {msg.text && <p>{msg.text}</p>}
                    {msg.images?.length > 0 && <div className="mt-1 space-y-1">{msg.images.map((img, i) => <img key={i} src={img.url} className="rounded-lg max-w-full max-h-48 object-cover" alt="" />)}</div>}
                    {msg.files?.length > 0 && <div className="mt-1 space-y-1">{msg.files.map((f, i) => <a key={i} href={f.url} target="_blank" rel="noreferrer" className="block bg-slate-700/50 rounded-lg px-3 py-2 text-[10px] text-blue-300 hover:text-blue-200">📎 {f.name} ({(f.size / 1024).toFixed(1)}KB)</a>)}</div>}
                  </div>
                  {msg.reactions?.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5 flex-wrap">
                      {[...new Set(msg.reactions.map(r => r.emoji))].map((emoji, i) => (
                        <span key={i} className="bg-slate-800 text-[10px] px-1.5 py-0.5 rounded-full border border-slate-700">{emoji} {msg.reactions.filter(r => r.emoji === emoji).length}</span>
                      ))}
                    </div>
                  )}
                  <div className={`flex items-center gap-1 mt-0.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[9px] text-slate-600">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMe && <span className="text-[9px]">{(msg.seenBy?.length || 0) > 0 ? '✓✓' : '✓'}</span>}
                  </div>
                  <div className="absolute top-0 opacity-0 group-hover:opacity-100 transition flex gap-1 bg-slate-800 rounded-lg p-0.5 shadow-lg z-10" style={isMe ? { left: '-120px' } : { right: '-120px' }}>
                    <button onClick={() => setReplyTo(msg)} className="text-[10px] px-2 py-1 hover:bg-slate-700 rounded text-slate-400">Reply</button>
                    <button onClick={() => setShowEmojiPicker(showEmojiPicker === msg._id ? null : msg._id)} className="text-[10px] px-2 py-1 hover:bg-slate-700 rounded text-slate-400">React</button>
                    {isMe && <button onClick={() => deleteMessage(msg._id)} className="text-[10px] px-2 py-1 hover:bg-red-900/50 rounded text-red-400">Delete</button>}
                  </div>
                  {showEmojiPicker === msg._id && (
                    <div className="absolute bottom-full mb-1 bg-slate-800 border border-slate-700 rounded-xl p-2 flex gap-1 shadow-xl z-20" style={isMe ? { right: 0 } : { left: 0 }}>
                      {emojis.map(e => <button key={e} onClick={() => reactToMessage(msg._id, e)} className="text-lg hover:scale-125 transition">{e}</button>)}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
          {typingInChat && <div className="text-[10px] text-slate-500 animate-pulse">Typing...</div>}
          <div ref={messagesEndRef} />
        </div>

        {replyTo && (
          <div className="bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center justify-between">
            <div className="border-l-2 border-blue-500 pl-2">
              <p className="text-[10px] text-blue-400 font-semibold">Reply to {replyTo.sender?.fullName || 'Message'}</p>
              <p className="text-[10px] text-slate-500 truncate">{replyTo.text || 'Media'}</p>
            </div>
            <button onClick={() => setReplyTo(null)} className="text-slate-500 hover:text-white text-xs">✕</button>
          </div>
        )}

        <form onSubmit={sendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <label className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer transition flex-shrink-0">
            <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h16v2H4v-2z"/></svg>
            <input type="file" multiple className="hidden" onChange={handleFileUpload} />
          </label>
          <input type="text" value={messageInput} onChange={(e) => { setMessageInput(e.target.value); handleTyping(); }} placeholder="Type a message..." className="flex-1 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-full px-4 py-2 text-xs text-white placeholder-slate-600 outline-none transition" />
          <button type="submit" disabled={!messageInput.trim()} className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-30 flex items-center justify-center transition flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      <div className="p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white">Messenger</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-full transition">✕</button>
        </div>
        <div className="relative">
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search people to message..." className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {searchQuery ? (
          <div className="p-2">
            {searchResults.map(user => (
              <button key={user._id} onClick={() => startConversation(user._id)} className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition text-left">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white overflow-hidden flex-shrink-0">
                  {user.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" /> : user.fullName?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
                  {user.bio && <p className="text-[10px] text-slate-500 truncate">{user.bio}</p>}
                </div>
                <span className="text-[10px] text-blue-400 font-bold">Chat</span>
              </button>
            ))}
            {searchResults.length === 0 && <div className="p-6 text-center text-slate-600 text-xs">No users found</div>}
          </div>
        ) : (
          <div className="p-2">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-slate-600 text-xs">No conversations yet. Search to start chatting.</div>
            ) : (
              conversations.map(convo => {
                const other = getOtherUser(convo);
                const isOnline = onlineUsers.has(other?._id);
                return (
                  <button key={convo._id} onClick={() => { if (socket) socket.emit('join-conversation', convo._id); setActiveConvo(convo); setView('chat'); loadMessages(convo._id); }} className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition text-left">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white overflow-hidden flex-shrink-0 relative">
                      {other?.profilePic ? <img src={other.profilePic} className="w-full h-full object-cover" /> : other?.fullName?.charAt(0)}
                      {isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-white truncate">{other?.fullName}</p>
                        <span className="text-[9px] text-slate-600 flex-shrink-0">{convo.updatedAt ? new Date(convo.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{convo.lastMessage?.text || 'Start chatting...'}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
