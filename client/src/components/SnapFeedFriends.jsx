import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Check, XIcon, Users, Search, Bell } from 'lucide-react';

const API_BASE_URL = 'https://snapfeed-1.onrender.com';

export default function SnapFeedFriends({ token, currentUserId, socket, onClose }) {
  const [activeTab, setActiveTab] = useState('requests');
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, { ...options, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...options.headers } });
    return res.json();
  };

  useEffect(() => { loadAll(); }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('notification_friend_request', (data) => {
      setFriendRequests(prev => [{ _id: data.requestId, sender: data.sender }, ...prev]);
      addNotif(`${data.sender?.fullName || 'Someone'} sent you a friend request`);
      playSound();
    });
    socket.on('friend_request_accepted', () => { loadFriends(); addNotif('Friend request accepted!'); playSound(); });
    return () => { socket.off('notification_friend_request'); socket.off('friend_request_accepted'); };
  }, [socket]);

  const loadAll = () => { loadRequests(); loadFriends(); loadSuggestions(); };

  const loadRequests = async () => {
    const data = await apiFetch(`${API_BASE_URL}/api/friends/requests`);
    if (data.received) setFriendRequests(data.received);
  };

  const loadFriends = async () => {
    const data = await apiFetch(`${API_BASE_URL}/api/friends/list`);
    if (data.friends) setFriendsList(data.friends);
  };

  const loadSuggestions = async () => {
    const data = await apiFetch(`${API_BASE_URL}/api/users/search?q=a`);
    if (data.users) setSuggestions(data.users.filter(u => u._id !== currentUserId).slice(0, 10));
  };

  const acceptRequest = async (requestId) => {
    try {
      await apiFetch(`${API_BASE_URL}/api/friends/accept/${requestId}`, { method: 'PUT' });
      setFriendRequests(prev => prev.filter(r => r._id !== requestId));
      loadFriends();
      playSound();
      addNotif('Friend request accepted!');
    } catch {}
  };

  const rejectRequest = async (requestId) => {
    try {
      await apiFetch(`${API_BASE_URL}/api/friends/reject/${requestId}`, { method: 'PUT' });
      setFriendRequests(prev => prev.filter(r => r._id !== requestId));
    } catch {}
  };

  const sendRequest = async (receiverId) => {
    try {
      if (socket) socket.emit('send_friend_request', { senderId: currentUserId, receiverId });
      setSuggestions(prev => prev.filter(u => u._id !== receiverId));
      addNotif('Friend request sent!');
    } catch {}
  };

  const removeFriend = async (friendId) => {
    try {
      await apiFetch(`${API_BASE_URL}/api/friends/remove/${friendId}`, { method: 'DELETE' });
      loadFriends();
    } catch {}
  };

  const playSound = () => {
    try { const a = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg'); a.volume = 0.5; a.play().catch(() => {}); } catch {}
  };

  const addNotif = (text) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  };

  const tabs = [
    { id: 'requests', label: 'Requests', count: friendRequests.length },
    { id: 'friends', label: 'Friends', count: friendsList.length },
    { id: 'suggestions', label: 'Discover' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#18191a]/95 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#242526] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">

        <div className="flex items-center justify-between px-4 py-3 border-b border-[#3a3b3c]">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-blue-500" />
            <span className="font-bold text-white">Friends</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#3a3b3c] flex items-center justify-center hover:bg-[#4e4f50] transition"><X size={14} className="text-white" /></button>
        </div>

        <div className="flex border-b border-[#3a3b3c]">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-3 text-xs font-bold text-center transition relative ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`}>
              {tab.label} {tab.count !== undefined ? `(${tab.count})` : ''}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-500 rounded-t" />}
            </button>
          ))}
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-3 space-y-2">
          {activeTab === 'requests' && friendRequests.length === 0 && (
            <div className="py-12 text-center text-gray-500 text-sm">No pending requests</div>
          )}
          {activeTab === 'requests' && friendRequests.map(req => (
            <div key={req._id} className="flex items-center gap-3 bg-[#3a3b3c] p-3 rounded-xl pop">
              <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {req.sender?.fullName?.charAt(0) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{req.sender?.fullName || 'User'}</p>
                <p className="text-[10px] text-gray-400">wants to be your friend</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => acceptRequest(req._id)} className="btn accept flex items-center gap-1"><Check size={12} /> Accept</button>
                <button onClick={() => rejectRequest(req._id)} className="btn decline flex items-center gap-1"><XIcon size={12} /> Decline</button>
              </div>
            </div>
          ))}

          {activeTab === 'friends' && friendsList.length === 0 && (
            <div className="py-12 text-center text-gray-500 text-sm">No friends yet</div>
          )}
          {activeTab === 'friends' && friendsList.map(friend => (
            <div key={friend._id} className="flex items-center gap-3 bg-[#3a3b3c] p-3 rounded-xl slide">
              <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {friend.fullName?.charAt(0) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{friend.fullName || 'User'}</p>
                {friend.bio && <p className="text-[10px] text-gray-400 truncate">{friend.bio}</p>}
              </div>
              <button onClick={() => removeFriend(friend._id)} className="text-[10px] text-gray-500 hover:text-red-400 transition">Remove</button>
            </div>
          ))}

          {activeTab === 'suggestions' && suggestions.map(user => (
            <div key={user._id} className="flex items-center gap-3 bg-[#3a3b3c] p-3 rounded-xl slide">
              <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {user.fullName?.charAt(0) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{user.fullName || 'User'}</p>
                {user.bio && <p className="text-[10px] text-gray-400 truncate">{user.bio}</p>}
              </div>
              <button onClick={() => sendRequest(user._id)} className="btn accept flex items-center gap-1"><UserPlus size={12} /> Add</button>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="fixed top-16 right-5 space-y-2 z-[60]">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 80, opacity: 0 }} className="bg-[#242526] border border-[#3a3b3c] rounded-xl px-4 py-3 shadow-xl text-sm text-white slide">
              {n.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
