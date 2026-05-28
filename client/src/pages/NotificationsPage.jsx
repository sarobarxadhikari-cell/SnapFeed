import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageCircle, Video, UserPlus, Heart, CheckCheck, Trash2, MoreHorizontal } from 'lucide-react';
import { getInitials } from '../utils/helpers';

const notifications = [
  { id: 1, type: 'like', user: 'Sam Wilson', action: 'liked your post', time: '2m ago', read: false, target: 'Amazing sunset 🌅' },
  { id: 2, type: 'comment', user: 'Jordan Lee', action: 'commented on your post', time: '15m ago', read: false, target: 'Great work!' },
  { id: 3, type: 'friend', user: 'Maya Patel', action: 'sent you a friend request', time: '1h ago', read: false },
  { id: 4, type: 'message', user: 'Chris Wong', action: 'sent you a message', time: '2h ago', read: true, target: 'Hey, check this out!' },
  { id: 5, type: 'call', user: 'Alex Snapfeed', action: 'missed your call', time: '3h ago', read: true },
  { id: 6, type: 'like', user: 'TechVault Nepal', action: 'liked your photo', time: '5h ago', read: true },
  { id: 7, type: 'system', user: 'Snapfeed', action: 'System update completed', time: '8h ago', read: true },
];

const getIcon = (type) => {
  switch (type) {
    case 'like': return <Heart size={16} className="text-[#ff3b30]" />;
    case 'comment': return <MessageCircle size={16} className="text-[#1877f2]" />;
    case 'friend': return <UserPlus size={16} className="text-[#22c55e]" />;
    case 'message': return <MessageCircle size={16} className="text-[#ffd84d]" />;
    case 'call': return <Video size={16} className="text-[#4f46e5]" />;
    default: return <Bell size={16} className="text-gray-400" />;
  }
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(notifications);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? notifs : filter === 'unread' ? notifs.filter(n => !n.read) : notifs;

  const markAllRead = () => setNotifs(notifs.map(n => ({ ...n, read: true })));

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-gray-500 text-sm">{notifs.filter(n => !n.read).length} unread</p>
          </div>
          <button onClick={markAllRead} className="text-[#1877f2] text-sm font-semibold hover:underline">
            Mark all read
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {['all', 'unread'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === f ? 'bg-[#1877f2] text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}>
              {f === 'all' ? 'All' : 'Unread'}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="space-y-1">
          {filtered.map((notif, i) => (
            <motion.div key={notif.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className={`flex items-start gap-3 p-4 rounded-2xl transition-colors cursor-pointer ${
                notif.read ? 'opacity-60 hover:opacity-80' : 'bg-gradient-to-r from-[#1877f2]/5 to-transparent'
              }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                notif.type === 'system' ? 'bg-gradient-to-br from-[#ffd84d] to-[#ff6b35]' : 'bg-gradient-to-br from-[#1877f2] to-[#4f46e5]'
              }`}>
                <span className="text-sm font-bold">{getInitials(notif.user)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">{notif.user}</span>
                  {' '}{notif.action}
                </p>
                {notif.target && <p className="text-gray-500 text-xs mt-1 truncate">{notif.target}</p>}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-500 text-[10px]">{notif.time}</span>
                  {!notif.read && <span className="w-2 h-2 rounded-full bg-[#1877f2]" />}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  getIcon(notif.type).props.className.includes('text-red') ? 'bg-red-500/10' : 'bg-white/5'
                }`}>
                  {getIcon(notif.type)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
