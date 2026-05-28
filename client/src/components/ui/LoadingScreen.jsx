import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0b0f17] z-[9999]">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1877f2] to-[#ffd84d] flex items-center justify-center mx-auto mb-6"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-2xl font-extrabold text-white">S</span>
        </motion.div>
        <motion.div
          className="text-xl font-semibold bg-gradient-to-r from-[#1877f2] to-[#ffd84d] bg-clip-text text-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Snapfeed Ultra
        </motion.div>
        <div className="mt-4 flex gap-1 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#1877f2]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
