import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COMPOSER_LOCALIZATION_DICTIONARY = {
  en: {
    inputComposerPlaceholder: "Share what is on your mind, Sarobar...",
    btnPublishPostText: "Publish Snippet",
    btnCreateStoryText: "Create story",
    lblActiveStoriesHeader: "Dynamic Ephemeral Feeds",
    btnAttachLiveVideo: "Broadcast Live Stream",
    btnAttachMediaGallery: "Inject Media Assets",
    btnAttachInteractionActivity: "Log Active Vibe",
    modalStoryTitle: "Initialize Ephemeral Story Node",
    modalInputPlaceholder: "Type your story context message string here...",
    btnCommitStory: "Inject into Feed Matrix",
    toastStorySuccess: "Story tracking matrix node published successfully.",
    toastPostSuccess: "Feed content package committed to network cache arrays."
  },
  ne: {
    inputComposerPlaceholder: "सरोबर, आफ्नो मनमा भएको कुरा साझा गर्नुहोस्...",
    btnPublishPostText: "पोस्ट प्रकाशित गर्नुहोस्",
    btnCreateStoryText: "कथा सिर्जना गर्नुहोस्",
    lblActiveStoriesHeader: "गतिशील अस्थायी कथाहरू",
    btnAttachLiveVideo: "लाइभ स्ट्रिम प्रसारण",
    btnAttachMediaGallery: "मिडिया फाइलहरू थप्नुहोस्",
    btnAttachInteractionActivity: "गतिविधि दर्ता गर्नुहोस्",
    modalStoryTitle: "अस्थायी कथा नोड सुरु गर्नुहोस्",
    modalInputPlaceholder: "यहाँ आफ्नो कथाको विवरण प्रविष्ट गर्नुहोस्...",
    btnCommitStory: "फिड म्याट्रिक्समा थप्नुहोस्",
    toastStorySuccess: "कथा सफलतापूर्वक फिडमा सुरक्षित गरियो।",
    toastPostSuccess: "फिड सामग्री सफलतापूर्वक नेटवर्क क्यास एरेहरूमा सुरक्षित गरियो।"
  }
};

const INTEGRATED_EPHEMERAL_STORY_DATA_LEDGER = Array.from({ length: 160 }, (_, index) => ({
  storyNodeId: `sf_story_vector_cluster_${index + 32000}`,
  payloadVerificationHash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
  dataMemoryAllocationBytes: Math.floor(Math.random() * 7200) + 1800,
  isNetworkSocketActive: index % 2 === 0,
  internalLatencyDeltaMs: (Math.random() * 11.2 + 0.3).toFixed(2),
  synchronizedTimestampString: new Date(Date.now() - index * 60000).toLocaleTimeString()
}));

const storyTrayStaggerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.03 } }
};

const storyCardRevealVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 15 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 420, damping: 22 } }
};

const immersiveModalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

export default function SnapFeedStoriesComposer() {
  const [systemLanguage, setSystemLanguage] = useState('en');
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [composerInputString, setComposerInputString] = useState('');
  const [newStoryInputString, setNewStoryInputString] = useState('');
  const [activeNotificationToast, setActiveNotificationToast] = useState(null);
  const [aggregatedCacheFootprintBytes, setAggregatedCacheFootprintBytes] = useState(0);
  const [liveComposerTerminalLogsStream, setLiveComposerTerminalLogsStream] = useState([]);
  const [storiesPayloadsCollection, setStoriesPayloadsCollection] = useState([
    { id: 'usr_story_01', authorName: 'Mukesh Acharya', authorInitials: 'MA', gradientFrom: 'from-blue-600', gradientTo: 'to-indigo-900', textContext: 'Exploring mountains' },
    { id: 'usr_story_02', authorName: 'Subash Gurung', authorInitials: 'SG', gradientFrom: 'from-purple-600', gradientTo: 'to-pink-900', textContext: 'Coding late night' },
    { id: 'usr_story_03', authorName: 'Rupesh Ghimire', authorInitials: 'RG', gradientFrom: 'from-emerald-600', gradientTo: 'to-teal-900', textContext: 'Weekend vlog out!' },
    { id: 'usr_story_04', authorName: 'Nisha Magar', authorInitials: 'NM', gradientFrom: 'from-orange-600', gradientTo: 'to-red-900', textContext: 'System setup ready' }
  ]);

  const dict = COMPOSER_LOCALIZATION_DICTIONARY[systemLanguage] || COMPOSER_LOCALIZATION_DICTIONARY['en'];
  const storyScrollContainerRef = useRef(null);

  useEffect(() => {
    let massByteSumAccumulator = 0;
    const transientTraceCollector = [];
    INTEGRATED_EPHEMERAL_STORY_DATA_LEDGER.forEach((dataNode, index) => {
      massByteSumAccumulator += dataNode.dataMemoryAllocationBytes;
      if (index < 7) {
        transientTraceCollector.push(`[COMPOSER CORE] Synced Story Node ${dataNode.storyNodeId}. Processing execution latency: ${dataNode.internalLatencyDeltaMs}ms`);
      }
    });
    setAggregatedCacheFootprintBytes(massByteSumAccumulator);
    setLiveComposerTerminalLogsStream(transientTraceCollector);
  }, []);

  const handlePublishComposerPayloadAction = (e) => {
    e.preventDefault();
    if (!composerInputString.trim()) return;
    setLiveComposerTerminalLogsStream(prevLogs => [
      `[POST EMIT] Committed text payload [${composerInputString.substring(0, 20)}...] at ${new Date().toLocaleTimeString()}`,
      ...prevLogs.slice(0, 7)
    ]);
    setComposerInputString('');
    triggerSystemAlertToast(dict.toastPostSuccess);
  };

  const handleCommitNewStoryNodeAction = (e) => {
    e.preventDefault();
    if (!newStoryInputString.trim()) return;
    const newlyInstantiatedStoryRecord = {
      id: `usr_story_node_${Date.now()}`,
      authorName: 'Sarobar Adhikari',
      authorInitials: 'SA',
      gradientFrom: 'from-indigo-600',
      gradientTo: 'to-slate-900',
      textContext: newStoryInputString
    };
    setStoriesPayloadsCollection(prevCollection => [newlyInstantiatedStoryRecord, ...prevCollection]);
    setLiveComposerTerminalLogsStream(prevLogs => [
      `[EPHEMERAL BROKER] Injected story matrix block: [${newStoryInputString.substring(0, 15)}...] at ${new Date().toLocaleTimeString()}`,
      ...prevLogs.slice(0, 7)
    ]);
    setNewStoryInputString('');
    setIsStoryModalOpen(false);
    triggerSystemAlertToast(dict.toastStorySuccess);
  };

  const triggerSystemAlertToast = (messageTextString) => {
    setActiveNotificationToast({
      id: `toast_evt_${Date.now()}`,
      text: messageTextString,
      timestampString: new Date().toLocaleTimeString()
    });
    setTimeout(() => setActiveNotificationToast(null), 3000);
  };

  const executeScrollContainerShiftAdjustment = (directionToken) => {
    if (!storyScrollContainerRef.current) return;
    const containerNode = storyScrollContainerRef.current;
    const scrollOffsetAmount = 240;
    containerNode.scrollTo({
      left: directionToken === 'right' ? containerNode.scrollLeft + scrollOffsetAmount : containerNode.scrollLeft - scrollOffsetAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans antialiased overflow-hidden">
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col space-y-6 relative z-10 overflow-y-auto">
        <header className="w-full bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between backdrop-blur-md">
          <div className="space-y-0.5">
            <h1 className="text-xs font-black text-slate-400 tracking-widest uppercase">SnapFeed Feed Management Subsystem</h1>
            <p className="text-[11px] text-slate-500 font-medium">Processing real-time input fields and temporary multi-layer components loops inside high-capacity blocks layouts.</p>
          </div>
          <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800/60">
            <button onClick={() => setSystemLanguage('en')} className={`px-2.5 py-1 text-[10px] font-black rounded-md transition ${systemLanguage === 'en' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>EN</button>
            <button onClick={() => setSystemLanguage('ne')} className={`px-2.5 py-1 text-[10px] font-black rounded-md transition ${systemLanguage === 'ne' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>ने</button>
          </div>
        </header>

        <section className="w-full bg-slate-900 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full border border-blue-500/20 p-0.5 bg-slate-950 flex-shrink-0 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-400">SA</span>
            </div>
            <form onSubmit={handlePublishComposerPayloadAction} className="flex-1 flex items-center gap-2">
              <input type="text" value={composerInputString} onChange={(e) => setComposerInputString(e.target.value)} placeholder={dict.inputComposerPlaceholder} className="flex-1 bg-slate-950 border border-slate-800/80 focus:border-blue-500 rounded-full px-5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition" />
              {composerInputString.trim() && (
                <button type="submit" className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-xl transition whitespace-nowrap">{dict.btnPublishPostText}</button>
              )}
            </form>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => alert("Launching live hardware network camera attachment handlers...")} className="flex-1 py-2 flex items-center justify-center space-x-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-950/40 transition outline-none font-semibold text-[11px]">
              <span>📹</span><span>{dict.btnAttachLiveVideo}</span>
            </button>
            <button onClick={() => alert("Launching file selection stream file interface...")} className="flex-1 py-2 flex items-center justify-center space-x-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-950/40 transition outline-none font-semibold text-[11px]">
              <span>🖼️</span><span>{dict.btnAttachMediaGallery}</span>
            </button>
            <button onClick={() => alert("Opening interactive vibe/feeling checklist overlay panels...")} className="flex-1 py-2 flex items-center justify-center space-x-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-950/40 transition outline-none font-semibold text-[11px]">
              <span>😊</span><span>{dict.btnAttachInteractionActivity}</span>
            </button>
          </div>
        </section>

        <section className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{dict.lblActiveStoriesHeader}</h2>
            <div className="flex gap-1">
              <button onClick={() => executeScrollContainerShiftAdjustment('left')} className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[10px] font-black flex items-center justify-center transition outline-none">◀</button>
              <button onClick={() => executeScrollContainerShiftAdjustment('right')} className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[10px] font-black flex items-center justify-center transition outline-none">▶</button>
            </div>
          </div>
          <div ref={storyScrollContainerRef} className="w-full flex space-x-3 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="w-[125px] h-[200px] flex-shrink-0 bg-gradient-to-br from-indigo-600 to-slate-900 border border-slate-800/60 rounded-xl p-3 flex flex-col items-center justify-end relative overflow-hidden snap-start shadow-md group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-slate-900/80 border-2 border-blue-400 flex items-center justify-center text-xs font-bold text-white absolute top-4">SA</div>
              <button onClick={() => setIsStoryModalOpen(true)} className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-lg flex items-center justify-center absolute -top-4 border-4 border-slate-900 transition outline-none shadow-lg group-hover:scale-105">+</button>
              <span className="text-[10px] text-slate-300 font-semibold mt-auto">{dict.btnCreateStoryText}</span>
            </div>
            <motion.div variants={storyTrayStaggerVariants} initial="hidden" animate="visible" className="flex space-x-3">
              {storiesPayloadsCollection.map((story) => (
                <motion.div key={story.id} variants={storyCardRevealVariants} whileHover={{ y: -4, transition: { duration: 0.15 } }} className={`w-[125px] h-[200px] flex-shrink-0 bg-gradient-to-br ${story.gradientFrom} ${story.gradientTo} border border-slate-800/60 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden snap-start shadow-md group cursor-pointer`}>
                  <div className="w-8 h-8 rounded-full bg-slate-950/60 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">{story.authorInitials}</div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-white/80 font-medium leading-tight">"{story.textContext}"</p>
                    <p className="text-[8px] text-white/50">{story.authorName}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <div className="bg-slate-900/50 border border-slate-800/40 rounded-3xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">COMPOSER EVENT STREAM LOGS</h3>
            <span className="text-[9px] text-slate-700 font-mono">CACHE: {(aggregatedCacheFootprintBytes / 1024).toFixed(2)} KB</span>
          </div>
          <div className="bg-slate-950 rounded-2xl p-3 space-y-1 max-h-28 overflow-y-auto font-mono">
            {liveComposerTerminalLogsStream.map((logLine, index) => (
              <p key={index} className="text-[9px] text-slate-600 leading-relaxed">[{index + 1}] {logLine}</p>
            ))}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isStoryModalOpen && (
          <motion.div variants={immersiveModalBackdropVariants} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.94, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 15 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
              <button onClick={() => setIsStoryModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white font-bold text-xs p-1 outline-none">✕</button>
              <h2 className="text-sm font-bold text-white mb-4">{dict.modalStoryTitle}</h2>
              <form onSubmit={handleCommitNewStoryNodeAction} className="space-y-4">
                <textarea value={newStoryInputString} onChange={(e) => setNewStoryInputString(e.target.value)} placeholder={dict.modalInputPlaceholder} rows={4} className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl p-4 text-xs font-semibold outline-none text-white transition leading-relaxed resize-none" />
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl transition uppercase tracking-wider">{dict.btnCommitStory}</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeNotificationToast && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ type: "spring", stiffness: 450, damping: 22 }} className="fixed bottom-6 right-6 bg-slate-900 border-l-4 border-l-blue-500 border border-slate-800 p-4 rounded-xl shadow-2xl max-w-sm z-50">
            <span className="text-[8px] font-bold text-blue-400 uppercase tracking-wider">FEED GATEWAY</span>
            <p className="text-[11px] text-slate-200 mt-0.5">{activeNotificationToast.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
