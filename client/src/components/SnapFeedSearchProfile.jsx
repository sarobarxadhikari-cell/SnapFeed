import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'https://snapfeed-1.onrender.com';

export default function SnapFeedSearchProfile({ token, currentUserId, onViewProfile, onClose, onMessageUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('snapfeed_recent_searches');
    return saved ? JSON.parse(saved) : [];
  });
  const searchRef = useRef(null);

  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
    return res.json();
  };

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await apiFetch(`${API_BASE_URL}/api/users/search?q=${encodeURIComponent(searchQuery)}`);
        if (data.users) setSearchResults(data.users.filter(u => u._id !== currentUserId));
      } catch {}
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsFocused(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadProfile = async (userId) => {
    setLoading(true);
    try {
      const data = await apiFetch(`${API_BASE_URL}/api/users/profile/${userId}`);
      if (data.user) { setProfileData(data); setSelectedProfile(userId); }
      else { console.log('Profile error:', data); }
    } catch (e) { console.log('Profile fetch error:', e); }
    setLoading(false);
  };

  const handleSelectUser = (user) => {
    if (!recentSearches.find(r => r.id === user._id)) {
      const updated = [{ id: user._id, name: user.fullName, avatar: user.avatar }, ...recentSearches.slice(0, 7)];
      setRecentSearches(updated);
      localStorage.setItem('snapfeed_recent_searches', JSON.stringify(updated));
    }
    setIsFocused(false);
    loadProfile(user._id);
  };

  const removeRecent = (e, id) => {
    e.stopPropagation();
    const updated = recentSearches.filter(r => r.id !== id);
    setRecentSearches(updated);
    localStorage.setItem('snapfeed_recent_searches', JSON.stringify(updated));
  };

  const sendFriendRequest = (receiverId) => {
    if (onViewProfile) onViewProfile({ action: 'send_friend_request', receiverId });
    setProfileData(prev => prev ? { ...prev, privacy: { ...prev.privacy, requestStatus: 'sent' } } : prev);
  };

  if (selectedProfile && profileData) {
    const { user, privacy } = profileData;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-start justify-center pt-16 p-4 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl relative">
          <button onClick={() => { setSelectedProfile(null); setProfileData(null); }} className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-full transition">✕</button>

          <div className="relative h-36 rounded-t-2xl overflow-hidden">
            {user.coverPhoto ? <img src={user.coverPhoto} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" />}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          </div>

          <div className="px-6 pb-6 -mt-14 relative z-10">
            <div className="flex items-end gap-4 mb-4">
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }} className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 border-4 border-slate-900 flex items-center justify-center text-3xl font-bold text-white shadow-2xl flex-shrink-0 overflow-hidden">
                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" /> : user.fullName?.charAt(0)}
              </motion.div>
              <div className="flex-1 pb-2">
                <motion.h2 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="text-xl font-extrabold text-white flex items-center gap-2">
                  {user.fullName}
                  {privacy?.isFriend && <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full font-bold">Friend</span>}
                </motion.h2>
                {user.username && <p className="text-[11px] text-slate-500">@{user.username}</p>}
                {user.friends && <p className="text-[10px] text-slate-500 mt-1">{user.friends.length} friends</p>}
              </div>
            </div>

            {user.bio && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-xs text-slate-300 italic mb-4 bg-slate-800/50 rounded-xl px-4 py-2">"{user.bio}"</motion.p>}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="flex flex-col gap-2 text-[11px] text-slate-400 mb-4">
              {user.studiedAt && <div className="flex items-center gap-2">🎓 <span>Studied at <span className="text-slate-200 font-semibold">{user.studiedAt}</span></span></div>}
              {user.fromLocation && <div className="flex items-center gap-2">📍 <span>From <span className="text-slate-200 font-semibold">{user.fromLocation}</span></span></div>}
            </motion.div>

            {user.isProfileLocked && !privacy?.isFriend && !privacy?.isSelf && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4 text-center">
                <p className="text-xs text-blue-400 font-semibold">🔒 Profile locked — only friends can see posts</p>
              </motion.div>
            )}

            {!privacy?.isSelf && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex gap-2">
                {privacy?.isFriend ? (
                  <div className="flex-1 flex gap-2">
                    <div className="flex-1 bg-emerald-500/20 text-emerald-400 text-center py-2.5 rounded-xl text-xs font-bold border border-emerald-500/20">✓ Friends</div>
                    <button onClick={() => { if (onMessageUser) onMessageUser(user._id); onClose(); }} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition">Message</button>
                  </div>
                ) : privacy?.requestStatus === 'sent' ? (
                  <div className="flex-1 bg-slate-800 text-slate-400 text-center py-2.5 rounded-xl text-xs font-bold">Request Sent</div>
                ) : privacy?.requestStatus === 'received' ? (
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2.5 rounded-xl text-xs font-bold transition">Accept Request</button>
                ) : (
                  <button onClick={() => sendFriendRequest(user._id)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/20">+ Add Friend</button>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-start justify-center pt-16 p-4">
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl relative" ref={searchRef}>
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-full transition"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></button>
            <h2 className="text-sm font-bold text-white">Search SnapFeed</h2>
          </div>
          <div className="relative">
            <svg className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsFocused(true)} placeholder="Search by name..." autoFocus className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white text-xs">✕</button>}
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading && <div className="p-6 text-center text-xs text-slate-500 animate-pulse">Searching...</div>}

          {!searchQuery && !isLoading && recentSearches.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase">Recent</div>
              {recentSearches.map((item) => (
                <button key={item.id} onClick={() => loadProfile(item.id)} className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition text-left group">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 overflow-hidden">
                    {item.avatar ? <img src={item.avatar} className="w-full h-full object-cover" alt="" /> : item.name?.charAt(0)}
                  </div>
                  <span className="flex-1 text-xs text-slate-200 truncate">{item.name}</span>
                  <button onClick={(e) => removeRecent(e, item.id)} className="text-slate-600 hover:text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">✕</button>
                </button>
              ))}
            </div>
          )}

          {searchQuery && !isLoading && searchResults.length > 0 && (
            <div className="p-2">
              {searchResults.map((user) => (
                <button key={user._id} onClick={() => handleSelectUser(user)} className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition text-left">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 overflow-hidden">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" /> : user.fullName?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
                    {user.bio && <p className="text-[10px] text-slate-500 truncate">{user.bio}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}

          {searchQuery && !isLoading && searchResults.length === 0 && (
            <div className="p-8 text-center text-slate-600 text-xs">No users found</div>
          )}

          {!searchQuery && !isLoading && recentSearches.length === 0 && (
            <div className="p-8 text-center text-slate-600 text-xs">Type to search users</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
