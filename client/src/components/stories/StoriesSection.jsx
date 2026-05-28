import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const demoStories = [
  { id: 1, name: 'Your Story', isMine: true, viewed: false, color: 'from-[#1877f2] to-[#4f46e5]' },
  { id: 2, name: 'Sara Wilson', viewed: false, color: 'from-[#ffd84d] to-[#ffcd1f]' },
  { id: 3, name: 'Alex Kumar', viewed: false, color: 'from-[#00c853] to-[#1db954]' },
  { id: 4, name: 'Jordan Lee', viewed: true, color: 'from-[#ff1744] to-[#ff5252]' },
  { id: 5, name: 'Priya Sharma', viewed: true, color: 'from-[#9c27b0] to-[#673ab7]' },
  { id: 6, name: 'Mike Chen', viewed: false, color: 'from-[#1877f2] to-[#2196f3]' },
];

export default function StoriesSection() {
  const [stories] = useState(demoStories);
  const [viewing, setViewing] = useState(null);
  const [progress, setProgress] = useState(0);

  const openStory = (story) => {
    if (story.isMine) return;
    setViewing(story);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setViewing(null);
          return 0;
        }
        return p + 1;
      });
    }, 50);
  };

  return (
    <>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
        {stories.map((story, i) => (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => openStory(story)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={'w-16 h-16 rounded-full bg-gradient-to-br ' + story.color + ' flex items-center justify-center p-0.5 ' + (story.viewed ? 'opacity-60' : '')}>
              <div className="w-full h-full rounded-full bg-[#0b0f17] flex items-center justify-center">
                {story.isMine ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1877f2] to-[#4f46e5] flex items-center justify-center">
                    <Plus size={16} className="text-white" />
                  </div>
                ) : (
                  <span className="text-sm font-bold text-white">{getInitials(story.name)}</span>
                )}
              </div>
            </div>
            <span className="text-[10px] text-gray-400 truncate max-w-[64px]">{story.name}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {viewing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[8000] bg-black flex items-center justify-center"
            onClick={() => setViewing(null)}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-10">
              <motion.div
                className="h-full bg-white rounded-full"
                style={{ width: progress + '%' }}
                transition={{ duration: 0.05 }}
              />
            </div>
            <div className="text-center">
              <div className={'w-32 h-32 rounded-full bg-gradient-to-br ' + viewing.color + ' flex items-center justify-center mx-auto mb-4'}>
                <span className="text-5xl font-bold text-white">{getInitials(viewing.name)}</span>
              </div>
              <p className="text-xl font-bold">{viewing.name}</p>
              <p className="text-sm text-gray-400 mt-1">Story</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
