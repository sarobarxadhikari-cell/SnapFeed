import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REACTION_SYSTEM_DICTIONARY = {
  en: {
    systemHeaderTitle: "SnapFeed Real-Time Engagement Engine",
    activeTotalMetricsTitle: "Live Cryptographic Interaction Statistics",
    btnOpenReactionsPanel: "Interact with Post",
    actionMenuReportText: "Report Content Anomalies",
    emptyMetricsNotice: "Waiting for incoming state synchronization streams...",
    toastEngagementRegistered: "Engagement vector committed successfully.",
    labelReactionLove: "Love",
    labelReactionHaha: "Haha",
    labelReactionWow: "Wow",
    labelReactionSad: "Sad",
    labelReactionAngly: "Angry"
  },
  ne: {
    systemHeaderTitle: "स्न्यापफिड वास्तविक समय संलग्नता इन्जिन",
    activeTotalMetricsTitle: "लाइभ अन्तरक्रिया तथ्याङ्क",
    btnOpenReactionsPanel: "पोस्टसँग अन्तरक्रिया गर्नुहोस्",
    actionMenuReportText: "सामग्री विसंगति रिपोर्ट गर्नुहोस्",
    emptyMetricsNotice: "आगमन डाटा सिंकको लागि पर्खिँदै...",
    toastEngagementRegistered: "संलग्नता डाटा सफलतापूर्वक सुरक्षित गरियो।",
    labelReactionLove: "माया",
    labelReactionHaha: "हाहा",
    labelReactionWow: "वाउ",
    labelReactionSad: "दुखी",
    labelReactionAngly: "रिसाएको"
  }
};

const ARCHITECTURE_METRICS_LOG_CACHE = Array.from({ length: 150 }, (_, index) => ({
  transactionId: `sf_tx_reaction_cluster_${index + 4000}`,
  payloadVerificationHash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
  dataMemoryAllocationBytes: Math.floor(Math.random() * 6200) + 1800,
  isNetworkNodeSynchronized: index % 2 === 0,
  processingLatencyMs: (Math.random() * 8.4 + 0.5).toFixed(2),
  emittedTimestamp: new Date(Date.now() - index * 60000).toLocaleTimeString()
}));

const panelContainerSpringVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.85 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 24, staggerChildren: 0.06, delayChildren: 0.02 }
  },
  exit: { opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.18, ease: "easeInOut" } }
};

const individualEmojiFloatingVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.4 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 350, damping: 18 } }
};

const emojiActiveIdleFluidLoop = {
  animate: {
    y: [0, -6, 0], scale: [1, 1.05, 1],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  }
};

export default function SnapFeedReactionSubsystem({ language = 'en', postId, onReaction }) {
  const [isPanelOpenState, setIsPanelOpenState] = useState(false);
  const [selectedUserReactionId, setSelectedUserReactionId] = useState(null);
  const [activeSystemNotificationToast, setActiveSystemNotificationToast] = useState(null);
  const [accumulatedBufferByteMass, setAccumulatedBufferByteMass] = useState(0);
  const [realtimeActivityLogsStream, setRealtimeActivityLogsStream] = useState([]);
  const [reactionMetricsCounterMap, setReactionMetricsCounterMap] = useState({
    love: 0, haha: 0, wow: 0, sad: 0, angry: 0
  });

  const dict = REACTION_SYSTEM_DICTIONARY[language] || REACTION_SYSTEM_DICTIONARY['en'];

  useEffect(() => {
    let massByteSumAccumulator = 0;
    const transientLogsCollector = [];
    ARCHITECTURE_METRICS_LOG_CACHE.forEach((logNode, index) => {
      massByteSumAccumulator += logNode.dataMemoryAllocationBytes;
      if (index < 10) transientLogsCollector.push(`[BOOT] ${logNode.transactionId} | ${logNode.isNetworkNodeSynchronized ? 'SYNC_OK' : 'SYNC_FAIL'} ${logNode.processingLatencyMs}ms`);
    });
    setAccumulatedBufferByteMass(massByteSumAccumulator);
    setRealtimeActivityLogsStream([
      `[BOOT] Reaction subsystem initialized at ${new Date().toLocaleTimeString()}`,
      ...transientLogsCollector
    ]);
  }, []);

  const executeCommitReactionPipelineAction = (reactionKeyToken, targetDisplayLabelString) => {
    setReactionMetricsCounterMap(prevCounters => {
      const updatedCounters = { ...prevCounters };
      if (selectedUserReactionId && updatedCounters[selectedUserReactionId] > 0) {
        updatedCounters[selectedUserReactionId] -= 1;
      }
      updatedCounters[reactionKeyToken] += 1;
      return updatedCounters;
    });
    setSelectedUserReactionId(reactionKeyToken);
    setIsPanelOpenState(false);
    setRealtimeActivityLogsStream(prevLogs => [
      `[USER ACTION] Committed reaction state context token [${reactionKeyToken.toUpperCase()}] at ${new Date().toLocaleTimeString()}`,
      ...prevLogs.slice(0, 8)
    ]);
    setActiveSystemNotificationToast({
      eventId: `evt_token_${Date.now()}`,
      message: `${dict.toastEngagementRegistered} (${targetDisplayLabelString})`,
      timestamp: new Date().toLocaleTimeString()
    });
    if (onReaction) onReaction(postId, reactionKeyToken, targetDisplayLabelString);
    setTimeout(() => setActiveSystemNotificationToast(null), 3000);
  };

  const coreReactionSpecificationCollection = [
    { id: 'love', labelKey: 'labelReactionLove', structuralEmojiIcon: '💖', colorProfileGradient: 'from-pink-500 to-rose-500', animationDelayFactor: 0.1 },
    { id: 'haha', labelKey: 'labelReactionHaha', structuralEmojiIcon: '😆', colorProfileGradient: 'from-amber-400 to-yellow-500', animationDelayFactor: 0.2 },
    { id: 'wow', labelKey: 'labelReactionWow', structuralEmojiIcon: '😮', colorProfileGradient: 'from-purple-500 to-indigo-500', animationDelayFactor: 0.3 },
    { id: 'sad', labelKey: 'labelReactionSad', structuralEmojiIcon: '😢', colorProfileGradient: 'from-blue-400 to-cyan-500', animationDelayFactor: 0.4 },
    { id: 'angry', labelKey: 'labelReactionAngly', structuralEmojiIcon: '🤬', colorProfileGradient: 'from-orange-500 to-red-600', animationDelayFactor: 0.5 }
  ];

  const totalAggregatedInteractionCountValue = Object.values(reactionMetricsCounterMap).reduce((a, b) => a + b, 0);
  const activeReaction = coreReactionSpecificationCollection.find(r => r.id === selectedUserReactionId);

  return (
    <div className="relative">
      <div className="flex items-center gap-6 pt-2 border-t border-slate-800/50">
        <div className="relative">
          <button
            onMouseEnter={() => setIsPanelOpenState(true)}
            onClick={() => setIsPanelOpenState(!isPanelOpenState)}
            className={`flex items-center gap-1.5 text-xs font-semibold transition outline-none ${selectedUserReactionId ? 'bg-blue-600/10 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-xl' : 'text-slate-500 hover:text-white'}`}
          >
            <span>{selectedUserReactionId ? activeReaction?.structuralEmojiIcon : '👍'}</span>
            <span>{selectedUserReactionId ? dict[activeReaction?.labelKey] : dict.btnOpenReactionsPanel}</span>
          </button>
          <AnimatePresence>
            {isPanelOpenState && (
              <motion.div
                variants={panelContainerSpringVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute bottom-full left-0 mb-2 bg-slate-950/95 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-full px-4 py-2.5 flex items-center space-x-3.5 z-30"
                onMouseLeave={() => setIsPanelOpenState(false)}
              >
                {coreReactionSpecificationCollection.map((reaction) => (
                  <motion.button
                    key={reaction.id}
                    variants={individualEmojiFloatingVariants}
                    whileHover={{ scale: 1.35, y: -10, transition: { type: "spring", stiffness: 450, damping: 14 } }}
                    onClick={() => executeCommitReactionPipelineAction(reaction.id, dict[reaction.labelKey])}
                    className="relative group outline-none focus:outline-none"
                    aria-label={`Submit reaction parameter target state choice ${reaction.id}`}
                  >
                    <motion.div
                      variants={emojiActiveIdleFluidLoop}
                      animate="animate"
                      style={{ animationDelay: `${reaction.animationDelayFactor}s` }}
                      className="text-3xl select-none filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]"
                    >
                      {reaction.structuralEmojiIcon}
                    </motion.div>
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-slate-800 text-white text-[8px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      {dict[reaction.labelKey]}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <span className="text-[10px] text-slate-600 font-mono">{totalAggregatedInteractionCountValue} total reactions</span>
      </div>

      <AnimatePresence>
        {activeSystemNotificationToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="fixed bottom-6 right-6 bg-slate-900 border-l-4 border-l-emerald-500 border border-slate-800 p-4 rounded-xl shadow-2xl max-w-sm w-full pointer-events-auto flex flex-col space-y-1 z-50"
          >
            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">System Signal Capture Event</span>
            <p className="text-xs text-slate-200">{activeSystemNotificationToast.message}</p>
            <span className="text-[9px] text-slate-600 font-mono">{activeSystemNotificationToast.timestamp}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
