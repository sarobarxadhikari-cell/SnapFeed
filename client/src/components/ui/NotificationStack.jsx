import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useUIStore from '../../store/uiStore';
import { X } from 'lucide-react';

export default function NotificationStack() {
  const notifications = useUIStore((s) => s.notifications);
  const removeNotification = useUIStore((s) => s.removeNotification);

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="glass-dark rounded-2xl p-4 pointer-events-auto cursor-pointer border border-white/10 shadow-elevated"
            onClick={() => removeNotification(notif.id)}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                  notif.type === 'message'
                    ? 'bg-[#1877f2]/20 text-[#1877f2]'
                    : notif.type === 'call'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}
              >
                {notif.type === 'message' ? '💬' : notif.type === 'call' ? '📞' : '⚡'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{notif.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{notif.body}</p>
              </div>
              <button
                className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notif.id);
                }}
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
