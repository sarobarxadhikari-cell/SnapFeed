import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SnapFeedActionIcons() {
  const [notificationCount, setNotificationCount] = useState(1);

  return (
    <div className="flex items-center space-x-2.5 bg-slate-900 p-4 rounded-xl inline-flex select-none">

      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: "rgba(51, 65, 85, 1)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => alert("Opening Applications Grid Sub-menu Layer...")}
        className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 outline-none border border-transparent cursor-pointer transition-colors duration-150"
      >
        <div className="grid grid-cols-3 gap-0.5 w-4 h-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-current rounded-sm" />
          ))}
        </div>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: "rgba(51, 65, 85, 1)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => alert("Launching Secure Chat Socket Subsystem...")}
        className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 outline-none border border-transparent cursor-pointer transition-colors duration-150"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.145 2 11.26c0 2.912 1.447 5.517 3.71 7.214V22l3.355-1.844c.895.248 1.84.384 2.82.384 5.523 0 10-4.146 10-9.26C22 6.145 17.523 2 12 2zm1 13.5l-3-3.25-5.5 3.25 6-6.375 3 3.25 5.5-3.25-6 6.375z" />
        </svg>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: "rgba(51, 65, 85, 1)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setNotificationCount(0)}
        className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 outline-none border border-transparent cursor-pointer transition-colors duration-150 relative"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1-1.5-1s-1.5.17-1.5 1v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>

        <AnimatePresence>
          {notificationCount > 0 && (
            <motion.span
              key="notification-badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1.5 -right-1.5 bg-red-600 border border-slate-950 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center font-mono shadow-lg"
            >
              {notificationCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => alert("Loading Active Profile Configuration Hub...")}
        className="w-10 h-10 rounded-full border border-slate-700 p-0.5 bg-slate-800 cursor-pointer relative overflow-hidden flex items-center justify-center flex-shrink-0"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-slate-600 to-slate-400 flex items-center justify-center text-xs font-black text-white">
          SA
        </div>
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[7px] font-black text-slate-400">
          ▼
        </div>
      </motion.div>

    </div>
  );
}
