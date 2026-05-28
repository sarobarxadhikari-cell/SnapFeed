import React, { Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';

const SnapFeedAuth = lazy(() => import('./components/SnapFeedAuth'));

export default function App() {
  return (
    <div className="min-h-screen bg-[#0b0f17] text-white">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#060c1a]">
          <div className="w-8 h-8 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
        </div>
      }>
        <AnimatePresence mode="wait">
          <SnapFeedAuth />
        </AnimatePresence>
      </Suspense>
    </div>
  );
}
