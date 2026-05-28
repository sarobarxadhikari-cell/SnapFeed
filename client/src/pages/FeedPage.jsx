import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ThumbsUp, MessageCircle, Share2, MoreHorizontal, Bookmark, 
  Send, Image, Smile, Globe, Clock, Users, Video, Camera, Flame, Plus
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { getInitials, getAvatarColor } from '../utils/helpers';

const feedPosts = [
  { id: 1, user: 'Sam Wilson', avatar: null, time: '2h ago', content: 'Just deployed my new React project! 🚀 The future is bright with Vite and TailwindCSS.', likes: 42, comments: 7, shares: 3, liked: false },
  { id: 2, user: 'Jordan Lee', avatar: null, time: '4h ago', content: 'Exploring the streets of Kathmandu 🌄 Every corner tells a story.', image: null, likes: 128, comments: 23, shares: 12, liked: true },
  { id: 3, user: 'Maya Patel', avatar: null, time: '6h ago', content: 'Anyone else excited about the new AI tools? 🤖 The future is now!', likes: 89, comments: 31, shares: 8, liked: false },
  { id: 4, user: 'TechVault Nepal', avatar: null, time: '8h ago', content: '📢 Big announcement coming next week! Stay tuned for something revolutionary.', likes: 256, comments: 67, shares: 45, liked: true },
];

const stories = [
  { id: 1, name: 'Sam', image: null },
  { id: 2, name: 'Jordan', image: null },
  { id: 3, name: 'Maya', image: null },
  { id: 4, name: 'Chris', image: null },
  { id: 5, name: 'Alex', image: null },
];

export default function FeedPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [posts, setPosts] = useState(feedPosts);
  const [postText, setPostText] = useState('');

  const toggleLike = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const handlePost = () => {
    if (!postText.trim()) return;
    const newPost = {
      id: Date.now(), user: user?.name || 'You', avatar: null, time: 'Just now',
      content: postText, likes: 0, comments: 0, shares: 0, liked: false,
    };
    setPosts([newPost, ...posts]);
    setPostText('');
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="max-w-2xl mx-auto p-4 space-y-4 pb-24">
        {/* Stories bar */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
          <div className="flex flex-col items-center gap-1 min-w-[72px] cursor-pointer">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#1877f2] flex items-center justify-center bg-white/5">
              <Plus size={20} className="text-[#1877f2]" />
            </div>
            <span className="text-gray-400 text-[10px]">Your Story</span>
          </div>
          {stories.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-1 min-w-[72px] cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1877f2] to-[#4f46e5] flex items-center justify-center text-lg font-bold border-2 border-[#1877f2]">
                {getInitials(s.name)}
              </div>
              <span className="text-gray-400 text-[10px]">{s.name}</span>
            </div>
          ))}
        </div>

        {/* Create post */}
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1877f2] to-[#4f46e5] flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user ? getInitials(user.name) : 'U'}
            </div>
            <input value={postText} onChange={(e) => setPostText(e.target.value)}
              placeholder="What's on your mind?"
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#1877f2]"
              onKeyDown={(e) => e.key === 'Enter' && handlePost()}
            />
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-gray-400 text-xs">
              <Video size={16} className="text-[#ff3b30]" /> Live
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-gray-400 text-xs">
              <Image size={16} className="text-[#22c55e]" /> Photo
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-gray-400 text-xs">
              <Smile size={16} className="text-[#ffd84d]" /> Feeling
            </button>
          </div>
        </div>

        {/* Feed posts */}
        {posts.map((post, i) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1877f2] to-[#4f46e5] flex items-center justify-center text-sm font-bold">
                  {getInitials(post.user)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{post.user}</p>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <span>{post.time}</span>
                    <Globe size={10} />
                  </div>
                </div>
              </div>
              <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10">
                <MoreHorizontal size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
              <p className="text-sm leading-relaxed">{post.content}</p>
            </div>

            {/* Image placeholder */}
            {post.image !== undefined && (
              <div className="bg-gradient-to-br from-[#1a1a3e] to-[#2d1b4e] h-48 flex items-center justify-center">
                <Camera size={32} className="text-white/20" />
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 text-gray-500 text-xs">
              <span>{post.likes} likes</span>
              <span>{post.comments} comments · {post.shares} shares</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-around px-2 py-1">
              <button onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  post.liked ? 'text-[#1877f2]' : 'text-gray-400 hover:bg-white/5'
                }`}>
                <ThumbsUp size={16} /> Like
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-400 hover:bg-white/5">
                <MessageCircle size={16} /> Comment
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-400 hover:bg-white/5">
                <Share2 size={16} /> Share
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
