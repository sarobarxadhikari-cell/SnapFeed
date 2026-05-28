import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'https://snapfeed-1.onrender.com';

export default function SnapFeedSearchProfile({ token, currentUserId, onViewProfile, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [friendRequests, setFriendRequests] = useState({ received: [], sent: [] });
  const [friendsList, setFriendsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState('');
  const searchRef = useRef(null);

  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
    return res.json();
  };

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      const data = await apiFetch(`${API_BASE_URL}/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      if (data.users) setSearchResults(data.users.filter(u => u._id !== currentUserId));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadProfile = async (userId) => {
    setLoading(true);
    const data = await apiFetch(`${API_BASE_URL}/api/users/profile/${userId}`);
    if (data.user) { setProfileData(data); setSelectedProfile(userId); }
    setLoading(false);
  };

  const loadFriendRequests = async () => {
    const data = await apiFetch(`${API_BASE_URL}/api/friends/requests`);
    if (data.received) setFriendRequests(data);
  };

  const loadFriends = async () => {
    const data = await apiFetch(`${API_BASE_URL}/api/friends/list`);
    if (data.friends) setFriendsList(data.friends);
  };

  const sendFriendRequest = (receiverId) => {
    if (onViewProfile) onViewProfile({ action: 'send_friend_request', receiverId });
    setProfileData(prev => prev ? { ...prev, privacy: { ...prev.privacy, requestStatus: 'sent' } } : prev);
  };

  const sendMessage = () => {
    if (!messageText.trim() || !selectedProfile) return;
    if (onViewProfile) onViewProfile({ action: 'send_message', receiverId: selectedProfile, text: messageText });
    setMessageText('');
  };

  if (selectedProfile && profileData) {
    const { user, privacy } = profileData;
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-start justify-center pt-16 p-4 overflow-y-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl relative">
          <button onClick={() => { setSelectedProfile(null); setProfileData(null); }} className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white p-1">✕</button>

          <div className="relative h-32 rounded-t-2xl overflow-hidden">
            {user.coverPhoto ? (
              <img src={user.coverPhoto} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
          </div>

          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-12 relative z-10 mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 border-4 border-slate-900 flex items-center justify-center text-2xl font-bold text-white shadow-xl flex-shrink-0">
                {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="" /> : user.fullName?.charAt(0)}
              </div>
              <div className="flex-1 pb-1">
                <h2 className="text-lg font-bold text-white">{user.fullName}</h2>
                {user.username && <p className="text-[11px] text-slate-500">@{user.username}</p>}
              </div>
            </div>

            {user.bio && <p className="text-xs text-slate-300 italic mb-3">{user.bio}</p>}

            <div className="flex flex-col gap-2 text-[11px] text-slate-400 mb-4">
              {user.studiedAt && <div>🎓 Studied at <span className="text-slate-200 font-semibold">{user.studiedAt}</span></div>}
              {user.fromLocation && <div>📍 From <span className="text-slate-200 font-semibold">{user.fromLocation}</span></div>}
              {user.friends && <div>👥 {user.friends.length} friends</div>}
            </div>

            {user.isProfileLocked && !privacy?.isFriend && !privacy?.isSelf && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4 text-center">
                <p className="text-xs text-blue-400 font-semibold">🔒 Profile locked — only friends can see posts</p>
              </div>
            )}

            {!privacy?.isSelf && (
              <div className="flex gap-2">
                {privacy?.isFriend ? (
                  <div className="flex-1 flex gap-2">
                    <div className="flex-1 bg-emerald-500/20 text-emerald-400 text-center py-2.5 rounded-xl text-xs font-bold">✓ Friends</div>
                    <button onClick={() => { setMessageText(''); }} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition">Message</button>
                  </div>
                ) : privacy?.requestStatus === 'sent' ? (
                  <div className="flex-1 bg-slate-800 text-slate-400 text-center py-2.5 rounded-xl text-xs font-bold">Request Sent</div>
                ) : privacy?.requestStatus === 'received' ? (
                  <div className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2.5 rounded-xl text-xs font-bold cursor-pointer">Accept Request</div>
                ) : (
                  <button onClick={() => sendFriendRequest(user._id)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition">+ Add Friend</button>
                )}
              </div>
            )}

            {privacy?.isSelf && (
              <button onClick={onClose} className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-xs font-bold transition">Edit Profile</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-start justify-center pt-16 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">✕</button>

        <div className="p-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white mb-3">Search Users</h2>
          <div className="relative">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name..." autoFocus className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white text-xs">✕</button>}
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="p-2">
              {searchResults.map((user) => (
                <button key={user._id} onClick={() => loadProfile(user._id)} className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition text-left">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="" /> : user.fullName?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
                    {user.bio && <p className="text-[10px] text-slate-500 truncate">{user.bio}</p>}
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="p-8 text-center text-slate-600 text-xs">No users found</div>
          ) : (
            <div className="p-8 text-center text-slate-600 text-xs">Type to search users</div>
          )}
        </div>
      </div>
    </div>
  );
}
