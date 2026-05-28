import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Phone, Video, MoreVertical, Send, Paperclip, ArrowLeft, CheckCheck, MessageSquare } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import useChatStore from '../store/chatStore';
import useAuthStore from '../store/authStore';
import { useSocket } from '../hooks/useSocket';
import { getInitials, getAvatarColor, formatTime } from '../utils/helpers';
import { getSocket } from '../socket/socket';

export default function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { conversations, fetchConversations, messages, fetchMessages, activeConversation, setActiveConversation, typingUsers } = useChatStore();
  const { startCall } = useSocket();
  const [text, setText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => { fetchConversations(); }, []);
  useEffect(() => {
    if (conversationId) {
      const conv = conversations.find((c) => c._id === conversationId);
      if (conv) { setActiveConversation(conv); fetchMessages(conversationId); }
    } else { setActiveConversation(null); }
  }, [conversationId, conversations]);

  useEffect(() => { setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50); }, [messages[conversationId]]);

  const other = activeConversation?.participants?.find((p) => p._id !== user?._id);

  const handleSend = () => {
    if (!text.trim() || !other) return;
    const s = getSocket();
    if (s) s.emit('message:send', { receiverId: other._id, text: text.trim(), messageType: 'text' });
    setText('');
  };

  const handleTyping = () => {
    if (!other) return;
    const s = getSocket();
    if (s) s.emit('message:typing', { receiverId: other._id, isTyping: true });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (s) s.emit('message:typing', { receiverId: other._id, isTyping: false });
    }, 1000);
  };

  const convMessages = messages[conversationId] || [];
  const convId = conversationId;
  const filtered = conversations.filter((c) => {
    const o = c.participants?.find((p) => p._id !== user?._id);
    if (!o) return false;
    if (!searchQuery) return true;
    return o.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const listVisible = convId ? 'hidden lg:flex' : '';

  return (
    <AppLayout>
      <div className="flex h-full">
        <div className={'w-full lg:w-80 xl:w-96 border-r border-white/10 flex flex-col ' + listVisible}>
          <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-bold mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search conversations" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#1877f2]" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {filtered.map((conv) => {
              const o = conv.participants?.find((p) => p._id !== user?._id);
              if (!o) return null;
              const unread = conv.unreadCount ? Object.values(conv.unreadCount).reduce((a, b) => a + (b || 0), 0) : 0;
              const isActive = conv._id === convId;
              const isTyping = typingUsers[o._id];
              return (
                <motion.button key={conv._id} onClick={() => navigate('/chat/' + conv._id)} className={'w-full flex items-center gap-3 px-4 py-3 transition-all text-left ' + (isActive ? 'bg-[#1877f2]/10 border-l-2 border-[#1877f2]' : 'hover:bg-white/5 border-l-2 border-transparent')} whileTap={{ scale: 0.99 }}>
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: getAvatarColor(o.name) }}>{getInitials(o.name)}</div>
                    <div className={'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0b0f17] ' + (o.isOnline ? 'bg-green-500' : 'bg-gray-500')} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm truncate">{o.name}</p>
                      <span className="text-[10px] text-gray-500 ml-2">{conv.lastMessage?.createdAt ? formatTime(conv.lastMessage.createdAt) : ''}</span>
                    </div>
                    <p className="text-xs mt-0.5 truncate text-gray-500">{isTyping ? <span className="text-[#1877f2] italic">typing...</span> : (conv.lastMessage?.text || 'No messages yet')}</p>
                  </div>
                  {unread > 0 && <span className="bg-[#1877f2] text-white text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center">{unread}</span>}
                </motion.button>
              );
            })}
            {filtered.length === 0 && <div className="text-center py-10 text-gray-500 text-sm">No conversations found</div>}
          </div>
        </div>
        <div className={'flex-1 flex flex-col ' + (convId ? '' : 'hidden lg:flex')}>
          {activeConversation && other ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 glass-dark">
                <button className="lg:hidden" onClick={() => navigate('/chat')}><ArrowLeft size={20} /></button>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: getAvatarColor(other.name) }}>{getInitials(other.name)}</div>
                  <div className={'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0b0f17] ' + (other.isOnline ? 'bg-green-500' : 'bg-gray-500')} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{other.name}</p>
                  <p className="text-xs text-gray-500">{typingUsers[other._id] ? <span className="text-[#1877f2]">typing...</span> : other.isOnline ? 'Online' : 'Last seen ' + formatTime(other.lastSeen)}</p>
                </div>
                <button onClick={() => { startCall(other._id, 'audio'); navigate('/call'); }} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10"><Phone size={18} /></button>
                <button onClick={() => { startCall(other._id, 'video'); navigate('/call'); }} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10"><Video size={18} /></button>
                <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10"><MoreVertical size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-2">
                <AnimatePresence initial={false}>
                  {convMessages.map((msg, idx) => {
                    const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
                    const showAvatar = idx === 0 || convMessages[idx - 1]?.sender?._id !== msg.sender?._id;
                    return (
                      <motion.div key={msg._id || idx} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={'flex items-end gap-2 ' + (isMine ? 'flex-row-reverse' : '')}>
                        {!isMine && showAvatar ? <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: getAvatarColor(other.name) }}>{getInitials(other.name)}</div> : <div className="w-7" />}
                        <div className={'max-w-[75%] ' + (isMine ? 'items-end' : 'items-start') + ' flex flex-col'}>
                          <div className={'px-4 py-2.5 rounded-2xl text-sm leading-relaxed ' + (isMine ? 'bg-gradient-to-r from-[#1877f2] to-[#4f46e5] text-white rounded-br-md' : 'glass rounded-bl-md text-gray-200')}>
                            {msg.messageType === 'image' || msg.mediaUrl ? (
                              <div><img src={msg.mediaUrl} alt="" className="max-w-full rounded-lg mb-1" loading="lazy" />{msg.text && <p>{msg.text}</p>}</div>
                            ) : <p className="whitespace-pre-wrap break-words">{msg.text}</p>}
                          </div>
                          <div className={'flex items-center gap-1 mt-1 ' + (isMine ? 'flex-row-reverse' : '')}>
                            <span className="text-[9px] text-gray-500">{msg.createdAt ? formatTime(msg.createdAt) : ''}</span>
                            {isMine && (msg.deliveryStatus === 'seen' ? <CheckCheck size={12} className="text-[#1877f2]" /> : <CheckCheck size={12} className="text-gray-500" />)}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {typingUsers[other._id] && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 italic">
                    <div className="flex gap-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    {other.name} is typing
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="px-4 py-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10"><Paperclip size={18} className="text-gray-400" /></button>
                  <div className="flex-1 relative">
                    <input value={text} onChange={(e) => { setText(e.target.value); handleTyping(); }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Type a message..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#1877f2]" />
                  </div>
                  <button onClick={handleSend} disabled={!text.trim()} className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#1877f2] to-[#4f46e5] flex items-center justify-center disabled:opacity-40 transition-all"><Send size={18} /></button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare size={60} className="mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-semibold mb-1">Your Messages</h3>
                <p className="text-sm">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
