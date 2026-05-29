import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Users, Bell, MessageCircle, Tv, Store, Search, Plus, Heart, Image, Video, Send, ThumbsUp, Share2, Bookmark, Settings, Moon, Sun, PlayCircle, UserPlus, Globe, Camera, Smile, Phone, Mic, Gamepad2, ChevronRight, Compass, Radio, Clapperboard, Newspaper, ShoppingBag, Archive, Flame, Music2, Trash2, Reply, Eye, User, BadgeCheck, Shield, Lock, MoreHorizontal, ChevronLeft, X, Sparkles, LayoutGrid } from 'lucide-react';
import SnapFeedMessenger from './SnapFeedMessenger';
import SnapFeedSearchProfile from './SnapFeedSearchProfile';
import SnapFeedFriends from './SnapFeedFriends';
import SnapFeedVideoCall from './SnapFeedVideoCall';
import SnapFeedLeftSidebar from './SnapFeedLeftSidebar';

const API_BASE_URL = 'https://snapfeed-1.onrender.com';

export default function SnapFeedFeed({ token, currentUserId, socket, userRecord, onLogout }) {
  const [selectedMenu, setSelectedMenu] = useState('Home');
  const [showMessenger, setShowMessenger] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [postInput, setPostInput] = useState('');
  const [feedPosts, setFeedPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [activeVideoCall, setActiveVideoCall] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const incomingCallRingRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [friendRequestPopup, setFriendRequestPopup] = useState(null);

  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, { ...options, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...options.headers } });
    return res.json();
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('new-message', () => { setUnreadCount(p => p + 1); loadConversations(); });
    socket.on('user-online', () => setOnlineCount(p => p + 1));
    socket.on('user-offline', () => setOnlineCount(p => Math.max(0, p - 1)));
    socket.on('call_offer', async ({ offer, from }) => {
      const data = await apiFetch(`${API_BASE_URL}/api/users/profile/${from}`);
      if (data.user) { setIncomingCall({ user: data.user, offer }); playRing(); }
    });
    socket.on('call_end', () => { clearInterval(incomingCallRingRef.current); setIncomingCall(null); });
    socket.on('call_answer', () => { clearInterval(incomingCallRingRef.current); });
    socket.on('notification_friend_request', (data) => {
      setFriendRequestPopup(data);
      playNotifSound();
      addNotification(`👤 ${data.sender?.fullName || 'Someone'} sent you a friend request`);
    });
    socket.on('friend_request_accepted', (data) => {
      addNotification(`✅ ${data.friendId || 'Someone'} accepted your friend request`);
      playNotifSound();
      loadData();
    });
    return () => { socket.off('new-message'); socket.off('user-online'); socket.off('user-offline'); socket.off('call_offer'); socket.off('call_end'); socket.off('call_answer'); socket.off('notification_friend_request'); socket.off('friend_request_accepted'); };
  }, [socket]);

  const loadData = async () => {
    const [friendsData, convData] = await Promise.all([
      apiFetch(`${API_BASE_URL}/api/friends/list`).catch(() => ({ friends: [] })),
      apiFetch(`${API_BASE_URL}/api/conversations`).catch(() => ({ conversations: [] }))
    ]);
    if (friendsData.friends) setContacts(friendsData.friends);
    if (convData.conversations) { setConversations(convData.conversations); setOnlineCount(friendsData.friends?.length || 0); }
    setStories(friendsData.friends?.slice(0, 8) || []);
    setFeedPosts([
      { id: '1', author: { fullName: 'SnapFeed Official', avatar: '' }, text: 'Welcome to SnapFeed! The ultimate social platform 🔥', likes: 1247, comments: 89, shares: 23, createdAt: new Date().toISOString() },
      { id: '2', author: { fullName: 'Community', avatar: '' }, text: 'Share your moments with friends and family. Real-time messaging, video calls, and more!', likes: 892, comments: 45, shares: 12, createdAt: new Date().toISOString() }
    ]);
  };

  const loadConversations = async () => {
    const data = await apiFetch(`${API_BASE_URL}/api/conversations`);
    if (data.conversations) setConversations(data.conversations);
  };

  const createPost = () => {
    if (!postInput.trim()) return;
    const newPost = { id: Date.now().toString(), author: { fullName: userRecord.fullName || 'You', avatar: userRecord.avatarInitialString || '' }, text: postInput, likes: 0, comments: 0, shares: 0, createdAt: new Date().toISOString() };
    setFeedPosts(prev => [newPost, ...prev]);
    setPostInput('');
  };

  const toggleLike = (id) => { setLikedPosts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]); };
  const toggleSave = (id) => { setSavedPosts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]); };

  const addNotification = (text) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      await apiFetch(`${API_BASE_URL}/api/friends/accept/${requestId}`, { method: 'PUT' });
      setFriendRequestPopup(null);
      addNotification('Friend request accepted!');
      loadData();
    } catch {}
  };

  const rejectFriendRequest = async (requestId) => {
    try {
      await apiFetch(`${API_BASE_URL}/api/friends/reject/${requestId}`, { method: 'PUT' });
      setFriendRequestPopup(null);
      addNotification('Friend request rejected');
    } catch {}
  };

  const playRing = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const interval = setInterval(() => {
        const o1 = ctx.createOscillator(); const o2 = ctx.createOscillator(); const g = ctx.createGain();
        o1.connect(g); o2.connect(g); g.connect(ctx.destination);
        o1.type = 'sine'; o2.type = 'sine';
        o1.frequency.setValueAtTime(440, ctx.currentTime); o2.frequency.setValueAtTime(480, ctx.currentTime);
        g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        o1.start(ctx.currentTime); o2.start(ctx.currentTime); o1.stop(ctx.currentTime + 0.8); o2.stop(ctx.currentTime + 0.8);
      }, 1000);
      incomingCallRingRef.current = interval;
    } catch {}
  };

  const formatNum = (n) => n >= 1000 ? (n/1000).toFixed(1) + 'K' : n;

  const topMenus = [
    { icon: Home, name: 'Home' },
    { icon: Clapperboard, name: 'Reels' },
    { icon: Store, name: 'Marketplace' },
    { icon: Gamepad2, name: 'GameZone' },
    { icon: Tv, name: 'Watch' }
  ];

  const hiddenMenus = [
    { icon: Users, name: 'Friends' }, { icon: Compass, name: 'Explore' }, { icon: Music2, name: 'Music' },
    { icon: ShoppingBag, name: 'Shop' }, { icon: Archive, name: 'Archive' }, { icon: Newspaper, name: 'Feeds' },
    { icon: Radio, name: 'Live' }, { icon: Bookmark, name: 'Saved' }, { icon: Settings, name: 'Settings' }
  ];

  const mainMenus = [
    { icon: Users, name: 'Friends' }, { icon: Store, name: 'Marketplace' }, { icon: Tv, name: 'Watch' },
    { icon: Gamepad2, name: 'Gaming' }, { icon: Bookmark, name: 'Saved' }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">

      {/* NAVBAR */}
      <div className="fixed top-0 left-0 right-0 h-[70px] z-50 border-b border-white/10 bg-[#0f172a]/95 backdrop-blur-3xl flex items-center justify-between px-5">
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.1, rotate: 10 }} className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xl shadow-2xl cursor-pointer">SF</motion.div>
          <div className="w-[280px] h-11 rounded-full bg-white/10 border border-white/10 flex items-center gap-3 px-4">
            <Search size={16} className="text-slate-400" />
            <input placeholder="Search SnapFeed" className="flex-1 bg-transparent outline-none text-sm text-white placeholder-slate-500" onClick={() => setShowSearch(true)} readOnly />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {topMenus.map((menu, i) => {
            const Icon = menu.icon;
            return (
                <motion.button key={i} whileHover={{ y: -3, scale: 1.05 }} whileTap={{ scale: 0.92 }} onClick={() => setSelectedMenu(menu.name)} className={`relative w-[65px] h-[52px] rounded-2xl flex items-center justify-center transition-all duration-300 border-none outline-none ${selectedMenu === menu.name ? 'bg-blue-500/15 text-blue-500' : 'bg-white/5 hover:bg-white/10 text-slate-400'}`}>
                <Icon size={22} />
                {selectedMenu === menu.name && <motion.div layoutId="activeTab" className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-blue-400" />}
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setShowFriends(true)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white relative">
            <Users size={17} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => { setShowMessenger(!showMessenger); setUnreadCount(0); }} className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white">
            <MessageCircle size={17} />
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[10px] flex items-center justify-center font-bold">{unreadCount}</span>}
          </motion.button>
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setShowNotifications(!showNotifications)} className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white">
            <Bell size={17} />
          </motion.button>
          <div className="relative">
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setShowProfile(!showProfile)} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold cursor-pointer overflow-hidden border-2 border-slate-700">
              {userRecord.avatarInitialString || 'U'}
            </motion.button>
            <AnimatePresence>
              {showProfile && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 top-12 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-slate-800">
                    <p className="text-xs font-bold text-white">{userRecord.fullName || 'User'}</p>
                    <p className="text-[10px] text-slate-500">@{userRecord.accountHandle || 'user'}</p>
                  </div>
                  <button onClick={() => { setShowProfile(false); if (onLogout) onLogout(); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="pt-[85px] flex">

        {/* LEFT SIDEBAR */}
        <SnapFeedLeftSidebar userRecord={userRecord} showMore={showMore} setShowMore={setShowMore} />

        {/* CENTER FEED */}
        <div className="flex-1 max-w-[700px] mx-auto px-4 pb-20">

          {/* STORIES */}
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            <motion.div whileHover={{ scale: 1.03, y: -4 }} className="relative min-w-[140px] h-[220px] rounded-3xl overflow-hidden shadow-xl cursor-pointer bg-gradient-to-br from-blue-600 to-indigo-800 border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center"><Plus size={18} /></div>
              <div className="absolute bottom-4 left-3 right-3"><p className="text-sm font-bold">Create Story</p></div>
            </motion.div>
            {stories.slice(0, 5).map((s, i) => (
              <motion.div key={i} whileHover={{ scale: 1.03, y: -4 }} className="relative min-w-[140px] h-[220px] rounded-3xl overflow-hidden shadow-xl cursor-pointer">
                <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-900" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-blue-400 flex items-center justify-center text-xs font-bold">{s.fullName?.charAt(0) || '?'}</div>
                <div className="absolute bottom-4 left-3 right-3"><p className="text-sm font-bold truncate">{s.fullName || 'User'}</p></div>
              </motion.div>
            ))}
          </div>

          {/* CREATE POST */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-4 backdrop-blur-3xl mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold flex-shrink-0">{userRecord.avatarInitialString || 'U'}</div>
              <input value={postInput} onChange={(e) => setPostInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') createPost(); }} placeholder="What's on your mind?" className="flex-1 h-11 rounded-full bg-white/10 px-5 outline-none text-sm text-white placeholder-slate-500 border border-white/5 focus:border-blue-500/50 transition" />
              {postInput.trim() && <motion.button whileTap={{ scale: 0.9 }} onClick={createPost} className="px-4 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"><Send size={14} /></motion.button>}
            </div>
          </div>

          {/* FEED POSTS */}
          {feedPosts.map((post) => {
            const isLiked = likedPosts.includes(post.id);
            const isSaved = savedPosts.includes(post.id);
            return (
              <motion.div key={post.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white/5 border border-white/10 mb-4 overflow-hidden backdrop-blur-3xl">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold">{post.author?.avatar || post.author?.fullName?.charAt(0) || 'U'}</div>
                      <div><p className="text-sm font-bold">{post.author?.fullName || 'User'}</p><p className="text-[10px] text-slate-500">{new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p></div>
                    </div>
                    <button className="text-slate-500 hover:text-white p-1"><MoreHorizontal size={16} /></button>
                  </div>
                  <p className="text-sm text-slate-200 mb-3">{post.text}</p>
                </div>
                <div className="flex items-center justify-between px-4 py-2 border-t border-white/5">
                  <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 py-2 px-3 rounded-xl transition text-xs font-medium ${isLiked ? 'text-blue-400' : 'text-slate-500 hover:text-white'}`}><ThumbsUp size={14} className={isLiked ? 'fill-current' : ''} /> {formatNum(post.likes + (isLiked ? 1 : 0))}</button>
                  <button className="flex items-center gap-1.5 py-2 px-3 rounded-xl text-slate-500 hover:text-white transition text-xs font-medium"><MessageCircle size={14} /> {formatNum(post.comments)}</button>
                  <button className="flex items-center gap-1.5 py-2 px-3 rounded-xl text-slate-500 hover:text-white transition text-xs font-medium"><Share2 size={14} /> {formatNum(post.shares)}</button>
                  <button onClick={() => toggleSave(post.id)} className={`py-2 px-3 rounded-xl transition text-xs ${isSaved ? 'text-yellow-400' : 'text-slate-500 hover:text-white'}`}><Bookmark size={14} className={isSaved ? 'fill-current' : ''} /></button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[280px] h-screen sticky top-[85px] overflow-y-auto px-3 pb-20 hidden lg:block flex-shrink-0">
          <div className="rounded-3xl bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold">Contacts</h3>
              <span className="text-[10px] text-emerald-400">{contacts.length} friends</span>
            </div>
            <div className="space-y-1">
              {contacts.map((c, i) => (
                <motion.div key={i} whileHover={{ x: 4, scale: 1.01 }} className="h-11 rounded-xl hover:bg-white/5 flex items-center gap-3 px-3 cursor-pointer">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold">{c.fullName?.charAt(0) || '?'}</div>
                    {i < contacts.length && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#020617]" />}
                  </div>
                  <span className="text-xs font-medium truncate">{c.fullName || 'User'}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAYS */}
      <AnimatePresence>
        {showSearch && <SnapFeedSearchProfile token={token} currentUserId={currentUserId} onClose={() => setShowSearch(false)} onMessageUser={(userId) => { setShowSearch(false); }} />}
        {showFriends && <SnapFeedFriends token={token} onClose={() => setShowFriends(false)} />}
        {showMessenger && <SnapFeedMessenger token={token} currentUserId={currentUserId} socket={socket} onClose={() => setShowMessenger(false)} onVideoCall={(user) => setActiveVideoCall({ targetUser: user, isIncoming: false })} autoOpen={true} />}
      </AnimatePresence>

      {activeVideoCall && <SnapFeedVideoCall socket={socket} currentUserId={currentUserId} targetUser={activeVideoCall.targetUser} isIncoming={false} onEndCall={() => setActiveVideoCall(null)} />}

      {/* NOTIFICATION TOASTS */}
      <div className="fixed bottom-6 right-6 z-[70] space-y-2">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div key={n.id} initial={{ opacity: 0, x: 80, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 80, scale: 0.9 }} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 max-w-xs">
              <span className="text-xs text-white">{n.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* FRIEND REQUEST POPUP */}
      <AnimatePresence>
        {friendRequestPopup && (
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.9 }} className="fixed top-24 right-6 z-[70] bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl w-80">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {friendRequestPopup.sender?.avatar ? <img src={friendRequestPopup.sender.avatar} className="w-full h-full rounded-full object-cover" /> : friendRequestPopup.sender?.fullName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white">{friendRequestPopup.sender?.fullName || 'Someone'}</p>
                <p className="text-[10px] text-slate-500">sent you a friend request</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => acceptFriendRequest(friendRequestPopup.requestId)} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition">Confirm</button>
              <button onClick={() => rejectFriendRequest(friendRequestPopup.requestId)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition">Delete</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INCOMING CALL POPUP */}
      {incomingCall && (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xs w-full p-8 shadow-2xl text-center">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-lg shadow-blue-500/30">{incomingCall.user.fullName?.charAt(0)}</motion.div>
            <h3 className="text-base font-bold text-white mb-1">{incomingCall.user.fullName}</h3>
            <p className="text-xs text-blue-400 mb-8 animate-pulse">Incoming Video Call...</p>
            <div className="flex justify-center gap-8">
              <button onClick={() => { clearInterval(incomingCallRingRef.current); setIncomingCall(null); if (socket) socket.emit('end-call', { to: incomingCall.user._id }); }} className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-lg shadow-red-600/30"><X size={24} className="text-white" /></button>
              <button onClick={() => { clearInterval(incomingCallRingRef.current); setActiveVideoCall({ targetUser: incomingCall.user, isIncoming: true, offer: incomingCall.offer }); setIncomingCall(null); }} className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-600/30"><Phone size={24} className="text-white" /></button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
