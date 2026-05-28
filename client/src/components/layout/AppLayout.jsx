import React from 'react';
import { motion } from 'framer-motion';
import TopBar from './TopBar';
import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
  return (
    <div className="h-screen flex flex-col bg-[#0b0f17]">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto scrollbar-hide"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
