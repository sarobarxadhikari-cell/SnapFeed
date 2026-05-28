import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_BASE_URL = 'https://snapfeed-1.onrender.com';

export default function SnapFeedFriends({ token, onClose, onViewProfile, socket }) {
  const [activeTab, setActiveTab] = useState('requests');
  const [friendRequests, setFriendRequests] = useState({ received: [], sent: [] });
  const [friendsList, setFriendsList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
    return res.json();
  };

  useEffect(() => {
    loadFriendRequests();
    loadFriends();
    loadSuggestions();
  }, []);

  const loadFriendRequests = async () => {
    const data = await apiFetch(`${API_BASE_URL}/api/friends/requests`);
    if (data.received) setFriendRequests(data);
  };

  const loadFriends = async () => {
    const data = await apiFetch(`${API_BASE_URL}/api/friends/list`);
    if (data.friends) setFriendsList(data.friends);
  };

  const loadSuggestions = async () => {
    const data = await apiFetch(`${API_BASE_URL}/api/users/search?q=a`);
    if (data.users) setSuggestions(data.users.slice(0, 10));
  };

  const acceptRequest = async (requestId) => {
    try {
      await apiFetch(`${API_BASE_URL}/api/friends/accept/${requestId}`, { method: 'PUT' });
      loadFriendRequests();
      loadFriends();
    } catch {}
  };

  const rejectRequest = async (requestId) => {
    try {
      await apiFetch(`${API_BASE_URL}/api/friends/reject/${requestId}`, { method: 'PUT' });
      loadFriendRequests();
    } catch {}
  };

  const sendRequest = async (receiverId) => {
    try {
      await apiFetch(`${API_BASE_URL}/api/friends/request`, { method: 'POST', body: JSON.stringify({ receiverId }) });
      setSuggestions(prev => prev.filter(u => u._id !== receiverId));
    } catch {}
  };

  const removeFriend = async (friendId) => {
    try {
      await apiFetch(`${API_BASE_URL}/api/friends/remove/${friendId}`, { method: 'DELETE' });
      loadFriends();
    } catch {}
  };

  const tabs = [
    { id: 'requests', label: 'Requests', count: friendRequests.received.length },
    { id: 'friends', label: 'Friends', count: friendsList.length },
    { id: 'suggestions', label: 'Suggestions' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-start justify-center pt-16 p-4">
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl relative">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white">Friends</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-full transition">✕</button>
          </div>
          <div className="flex gap-1 bg-slate-950 rounded-xl p-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                {tab.label} {tab.count ? `(${tab.count})` : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {activeTab === 'requests' && (
            <div className="p-2">
              {friendRequests.received.length === 0 ? (
                <div className="p-8 text-center text-slate-600 text-xs">No pending requests</div>
              ) : (
                friendRequests.received.map(req => (
                  <div key={req._id} className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 overflow-hidden">
                      {req.sender?.avatar ? <img src={req.sender.avatar} className="w-full h-full object-cover" alt="" /> : req.sender?.fullName?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{req.sender?.fullName}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => acceptRequest(req._id)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition">Accept</button>
                      <button onClick={() => rejectRequest(req._id)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] font-bold rounded-lg transition">Reject</button>
                    </div>
                  </div>
                ))
              )}
              {friendRequests.sent.length > 0 && (
                <div className="mt-2">
                  <p className="px-3 py-1 text-[10px] text-slate-500 font-bold uppercase">Sent</p>
                  {friendRequests.sent.map(req => (
                    <div key={req._id} className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 overflow-hidden">
                        {req.receiver?.avatar ? <img src={req.receiver.avatar} className="w-full h-full object-cover" alt="" /> : req.receiver?.fullName?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{req.receiver?.fullName}</p>
                      </div>
                      <span className="text-[10px] text-slate-500">Pending</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="p-2">
              {friendsList.length === 0 ? (
                <div className="p-8 text-center text-slate-600 text-xs">No friends yet</div>
              ) : (
                friendsList.map(friend => (
                  <div key={friend._id} className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 overflow-hidden">
                      {friend.avatar ? <img src={friend.avatar} className="w-full h-full object-cover" alt="" /> : friend.fullName?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{friend.fullName}</p>
                      {friend.bio && <p className="text-[10px] text-slate-500 truncate">{friend.bio}</p>}
                    </div>
                    <button onClick={() => removeFriend(friend._id)} className="text-[10px] text-slate-600 hover:text-red-400 transition">Remove</button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="p-2">
              {suggestions.map(user => (
                <div key={user._id} className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 overflow-hidden">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" /> : user.fullName?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
                    {user.bio && <p className="text-[10px] text-slate-500 truncate">{user.bio}</p>}
                  </div>
                  <button onClick={() => sendRequest(user._id)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition">Add</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
