import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SYSTEM_UI_DICTIONARY = {
  en: {
    engineHeaderTitle: "SnapFeed High-Fidelity Vector Animation Subsystem",
    engineSubtitle: "Hardware-accelerated CSS vector art engines running isolated frame loops natively.",
    btnInteract: "Interact",
    labelLove: "Love",
    labelHaha: "Haha",
    labelWow: "Wow",
    labelSad: "Sad",
    labelAngry: "Angry",
    activeStatsTitle: "Active Ingestion Vector Core Statistics Matrix",
    logPanelHeader: "REAL-TIME RENDERING FRAME BROKER STREAM LOGS"
  },
  ne: {
    engineHeaderTitle: "स्न्यापफिड हाइ-फिडेलिटी भेक्टर एनिमेसन सबसिस्टम",
    engineSubtitle: "हार्डवेयर-त्वरित CSS भेक्टर आर्ट इन्जिनहरूले नेटिभ रूपमा फ्रेम लुपहरू चलाउँदैछन्।",
    btnInteract: "अन्तरक्रिया गर्नुहोस्",
    labelLove: "माया",
    labelHaha: "हाहा",
    labelWow: "वाउ",
    labelSad: "दुखी",
    labelAngry: "रिसाएको",
    activeStatsTitle: "सक्रिय इन्जेक्सन भेक्टर कोर तथ्याङ्क म्याट्रिक्स",
    logPanelHeader: "वास्तविक समय रेन्डरिङ फ्रेम ब्रोकर स्ट्रिम लगहरू"
  }
};

const SYSTEM_DIAGNOSTICS_PAYLOAD_GRID = Array.from({ length: 160 }, (_, index) => ({
  frameId: `sf_frame_engine_node_${index + 7000}`,
  cryptographicValidationToken: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
  allocationWeightBytes: Math.floor(Math.random() * 5400) + 2200,
  isRenderEnginePipelineStable: index % 2 === 0,
  hardwareProcessingTimeMs: (Math.random() * 6.8 + 0.2).toFixed(2),
  synchronizedTimestampString: new Date(Date.now() - index * 1000).toLocaleTimeString()
}));

const overlayPanelSpringVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.88 },
  visible: { 
    opacity: 1, y: 0, scale: 1, 
    transition: { type: "spring", stiffness: 420, damping: 22, staggerChildren: 0.05, delayChildren: 0.01 } 
  },
  exit: { opacity: 0, y: 15, scale: 0.92, transition: { duration: 0.15, ease: "easeInOut" } }
};

const individualItemRevealVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.5 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 380, damping: 16 } }
};

function renderCSSVectorEmojiGraphicElement(targetKeyId) {
  switch (targetKeyId) {
    case 'love':
      return (
        <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center relative shadow-lg shadow-rose-500/20 group-hover:bg-rose-400 transition-colors">
          <div className="w-5 h-5 relative animate-[cssHeartPulse_1.2s_infinite_cubic-bezier(0.215,0.610,0.355,1)]">
            <div className="absolute top-0 left-[10px] w-[10px] h-[16px] bg-white rounded-t-full rounded-r-none rotate-[-45deg] origin-[0_100%]" />
            <div className="absolute top-0 left-0 w-[10px] h-[16px] bg-white rounded-t-full rounded-l-none rotate-[45deg] origin-[100%_100%]" />
          </div>
        </div>
      );
    case 'haha':
      return (
        <div className="w-10 h-10 bg-amber-400 rounded-full border border-amber-300 relative flex flex-col items-center justify-center shadow-lg shadow-amber-500/10 animate-[cssHahaBounce_0.8s_infinite_ease-in-out]">
          <div className="flex space-x-2 mb-1">
            <div className="w-2.5 h-1.5 border-t-2 border-slate-900 rounded-t-full rotate-[15deg]" />
            <div className="w-2.5 h-1.5 border-t-2 border-slate-900 rounded-t-full -rotate-[15deg]" />
          </div>
          <div className="w-5 h-3 bg-slate-900 rounded-b-full relative overflow-hidden">
            <div className="w-4 h-2 bg-rose-400 rounded-t-full absolute bottom-0 left-0 right-0 mx-auto" />
          </div>
        </div>
      );
    case 'wow':
      return (
        <div className="w-10 h-10 bg-yellow-400 rounded-full border border-yellow-300 relative flex flex-col items-center justify-center shadow-lg shadow-yellow-500/10 animate-[cssWowScale_1.4s_infinite_ease-in-out]">
          <div className="flex space-x-3 mb-1">
            <div className="w-2 h-2 bg-slate-900 rounded-full" />
            <div className="w-2 h-2 bg-slate-900 rounded-full" />
          </div>
          <div className="w-3.5 h-4 bg-slate-900 rounded-full animate-[cssMouthGasp_1.4s_infinite_ease-in-out]" />
        </div>
      );
    case 'sad':
      return (
        <div className="w-10 h-10 bg-blue-400 rounded-full border border-blue-300 relative flex flex-col items-center justify-center shadow-lg shadow-blue-500/10 animate-[cssSadSway_2.5s_infinite_ease-in-out]">
          <div className="flex space-x-3 mb-1.5 relative">
            <div className="w-2.5 h-1 bg-slate-900 rounded-full rotate-[-10deg]" />
            <div className="w-2.5 h-1 bg-slate-900 rounded-full rotate-[10deg]" />
            <div className="absolute top-2 left-[-2px] w-1.5 h-2 bg-cyan-200 rounded-b-full animate-[cssTearDrop_1.8s_infinite_ease-in]" />
          </div>
          <div className="w-4 h-1.5 border-b-2 border-slate-900 rounded-b-full" />
        </div>
      );
    case 'angry':
      return (
        <div className="w-10 h-10 bg-gradient-to-b from-orange-500 to-red-600 rounded-full relative flex flex-col items-center justify-center shadow-lg shadow-red-600/20 animate-[cssAngryVibrate_0.15s_infinite_linear]">
          <div className="flex space-x-2.5 mb-1.5">
            <div className="w-3 h-1 bg-slate-950 rounded-full rotate-[25deg] origin-right" />
            <div className="w-3 h-1 bg-slate-950 rounded-full rotate-[-25deg] origin-left" />
          </div>
          <div className="flex space-x-3 mb-1">
            <div className="w-2 h-2 bg-white rounded-full flex items-center justify-center"><div className="w-1 h-1 bg-slate-950 rounded-full"/></div>
            <div className="w-2 h-2 bg-white rounded-full flex items-center justify-center"><div className="w-1 h-1 bg-slate-950 rounded-full"/></div>
          </div>
          <div className="w-4 h-0.5 bg-slate-950 rounded-full" />
        </div>
      );
    default:
      return <span className="text-xl">👍</span>;
  }
}

export default function SnapFeedLiveReactions() {
  const [systemLanguageCode, setSystemLanguageCode] = useState('en');
  const [isReactionPanelRevealed, setIsReactionPanelRevealed] = useState(false);
  const [activeUserSelectedReaction, setActiveUserSelectedReaction] = useState(null);
  const [activeNotificationToast, setActiveNotificationToast] = useState(null);
  const [computedTotalStorageFootprintBytes, setComputedTotalStorageFootprintBytes] = useState(0);
  const [liveRenderLogsStreamConsole, setLiveRenderLogsStreamConsole] = useState([]);
  const [telemetryCountersStore, setTelemetryCountersStore] = useState({
    love: 2450, haha: 1120, wow: 489, sad: 156, angry: 88
  });

  const dict = SYSTEM_UI_DICTIONARY[systemLanguageCode] || SYSTEM_UI_DICTIONARY['en'];

  useEffect(() => {
    let internalByteAccumulationSum = 0;
    const diagnosticsStreamCollector = [];
    SYSTEM_DIAGNOSTICS_PAYLOAD_GRID.forEach((dataNode, index) => {
      internalByteAccumulationSum += dataNode.allocationWeightBytes;
      if (index < 6) {
        diagnosticsStreamCollector.push(`[FRAME MONITOR] Injected Node ${dataNode.frameId}. Processing latency: ${dataNode.hardwareProcessingTimeMs}ms`);
      }
    });
    setComputedTotalStorageFootprintBytes(internalByteAccumulationSum);
    setLiveRenderLogsStreamConsole(diagnosticsStreamCollector);
  }, []);

  const processReactionSelectionSequenceAction = (reactionKey, localizedLabelString) => {
    setTelemetryCountersStore(prevCounters => {
      const configurationMap = { ...prevCounters };
      if (activeUserSelectedReaction && configurationMap[activeUserSelectedReaction] > 0) {
        configurationMap[activeUserSelectedReaction] -= 1;
      }
      configurationMap[reactionKey] += 1;
      return configurationMap;
    });
    setActiveUserSelectedReaction(reactionKey);
    setIsReactionPanelRevealed(false);
    setLiveRenderLogsStreamConsole(prevLogs => [
      `[PIPELINE TRANSFER] Active session committed interaction payload [${reactionKey.toUpperCase()}] at ${new Date().toLocaleTimeString()}`,
      ...prevLogs.slice(0, 7)
    ]);
    setActiveNotificationToast({
      id: `toast_token_${Date.now()}`,
      text: `${localizedLabelString} reaction validation token synchronized.`,
      timestamp: new Date().toLocaleTimeString()
    });
    setTimeout(() => setActiveNotificationToast(null), 2800);
  };

  const reactionSpecCollection = [
    { id: 'love', translationKey: 'labelLove' },
    { id: 'haha', translationKey: 'labelHaha' },
    { id: 'wow', translationKey: 'labelWow' },
    { id: 'sad', translationKey: 'labelSad' },
    { id: 'angry', translationKey: 'labelAngry' }
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100 antialiased overflow-hidden selection:bg-blue-600/30">
      <style dangerouslySetInnerHTML={{__html: `
@keyframes cssHeartPulse { 0%,100%{transform:scale3d(1,1,1)} 30%{transform:scale3d(1.22,1.22,1)} 45%{transform:scale3d(1.1,1.1,1)} 60%{transform:scale3d(1.28,1.28,1)} }
@keyframes cssHahaBounce { 0%,100%{transform:translate3d(0,0,0) scale3d(1,1,1)} 50%{transform:translate3d(0,-5px,0) scale3d(1.04,0.96,1)} }
@keyframes cssWowScale { 0%,100%{transform:scale3d(1,1,1)} 50%{transform:scale3d(1.08,1.08,1)} }
@keyframes cssMouthGasp { 0%,100%{transform:scale3d(1,1,1)} 50%{transform:scale3d(1.15,1.3,1)} }
@keyframes cssSadSway { 0%,100%{transform:rotate3d(0,0,1,-2deg)} 50%{transform:rotate3d(0,0,1,2deg)} }
@keyframes cssTearDrop { 0%{opacity:0;transform:translate3d(0,0,0) scale3d(0.4,0.4,1)} 30%{opacity:1;transform:translate3d(0,2px,0) scale3d(1,1,1)} 90%,100%{opacity:0;transform:translate3d(0,14px,0) scale3d(0.6,0.8,1)} }
@keyframes cssAngryVibrate { 0%{transform:translate3d(0.5px,0.5px,0) rotate(0.5deg)} 100%{transform:translate3d(-0.5px,-0.5px,0) rotate(-0.5deg)} }
      `}} />
      <main className="flex-1 max-w-4xl w-full mx-auto p-8 flex flex-col justify-between relative z-10 space-y-8">
        <header className="w-full bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between backdrop-blur-md">
          <div className="space-y-1">
            <h1 className="text-sm font-black text-white tracking-widest uppercase">{dict.engineHeaderTitle}</h1>
            <p className="text-xs text-slate-500 font-medium">{dict.engineSubtitle}</p>
          </div>
          <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800/80">
            <button onClick={() => setSystemLanguageCode('en')} className={`px-2.5 py-1 text-[10px] font-black rounded-md transition ${systemLanguageCode === 'en' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>EN</button>
            <button onClick={() => setSystemLanguageCode('ne')} className={`px-2.5 py-1 text-[10px] font-black rounded-md transition ${systemLanguageCode === 'ne' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>ने</button>
          </div>
        </header>
        <section className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl relative">
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-sm font-black text-white shadow-xl shadow-blue-500/10">SA</div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Sarobar Adhikari</h3>
              <span className="text-[10px] text-slate-500 font-semibold font-mono">NODE_PIPELINE_ENGINE_ACTIVE</span>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            This subsystem renders pure CSS vector art elements with hardware-accelerated keyframe physics. Hover, scale, bounce, gasp, sway, tear, and vibrate are handled natively through CSS transform layers.
          </p>
          <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800/60 relative overflow-hidden flex items-center justify-center group">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15)_0%,transparent_60%)]" />
            <div className="text-center space-y-2">
              <div className="text-4xl opacity-30">🎨</div>
              <p className="text-[10px] text-slate-600 font-mono">VECTOR CANVAS RENDER TARGET // FRAME: 0x7F3A</p>
            </div>
          </div>
          <AnimatePresence>
            {isReactionPanelRevealed && (
              <motion.div
                variants={overlayPanelSpringVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute bottom-16 left-0 bg-slate-950/95 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-3xl px-5 py-3 flex items-center space-x-5 z-30"
                onMouseLeave={() => setIsReactionPanelRevealed(false)}
              >
                {reactionSpecCollection.map((reaction) => (
                  <motion.button
                    key={reaction.id}
                    variants={individualItemRevealVariants}
                    whileHover={{ scale: 1.3, y: -8, transition: { type: "spring", stiffness: 480, damping: 12 } }}
                    onClick={() => processReactionSelectionSequenceAction(reaction.id, dict[reaction.translationKey])}
                    className="relative group outline-none focus:outline-none flex flex-col items-center"
                  >
                    {renderCSSVectorEmojiGraphicElement(reaction.id)}
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-slate-800 text-white text-[8px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      {dict[reaction.translationKey]}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onMouseEnter={() => setIsReactionPanelRevealed(true)}
            onClick={() => setIsReactionPanelRevealed(!isReactionPanelRevealed)}
            className={`px-5 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition flex items-center space-x-2.5 border outline-none ${activeUserSelectedReaction ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' : 'bg-slate-950 border-slate-800/80 hover:bg-slate-900 text-slate-400 hover:text-slate-200'}`}
          >
            {activeUserSelectedReaction
              ? renderCSSVectorEmojiGraphicElement(activeUserSelectedReaction)
              : <span className="text-xl">👍</span>}
            <span>{activeUserSelectedReaction
              ? dict[reactionSpecCollection.find(r => r.id === activeUserSelectedReaction)?.translationKey]
              : dict.btnInteract}</span>
          </button>
        </section>
        <section className="bg-slate-900/50 border border-slate-800/60 rounded-3xl p-6 space-y-4 shadow-xl">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{dict.activeStatsTitle}</h2>
          <div className="grid grid-cols-5 gap-4">
            {reactionSpecCollection.map((r) => (
              <div key={r.id} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center gap-2 text-center">
                {renderCSSVectorEmojiGraphicElement(r.id)}
                <div>
                  <p className="text-[9px] text-slate-500 font-semibold uppercase">{dict[r.translationKey]}</p>
                  <p className="text-lg font-black text-white">{telemetryCountersStore[r.id].toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-slate-900/30 border border-slate-800/40 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{dict.logPanelHeader}</h3>
            <span className="text-[9px] text-slate-700 font-mono">CACHE WEIGHT: {(computedTotalStorageFootprintBytes / 1024).toFixed(2)} KB</span>
          </div>
          <div className="bg-slate-950 rounded-2xl p-4 space-y-1.5 max-h-32 overflow-y-auto font-mono">
            {liveRenderLogsStreamConsole.map((logLine, logIndex) => (
              <p key={logIndex} className="text-[9px] text-slate-600 leading-relaxed">[{logIndex + 1}] {logLine}</p>
            ))}
          </div>
        </section>
        <footer className="text-center text-[9px] text-slate-700 border-t border-slate-800/30 pt-6">© 2026 SnapFeed Global Technologies Corporation. Vector transform nodes rendered independently.</footer>
      </main>
      <AnimatePresence>
        {activeNotificationToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 410, damping: 20 }}
            className="fixed bottom-6 right-6 bg-slate-900 border-l-4 border-l-blue-500 border border-slate-800 p-4 rounded-xl shadow-2xl max-w-sm w-full pointer-events-auto flex flex-col space-y-1 z-50"
          >
            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">RENDER ENGINE INTERCEPT</span>
            <p className="text-xs text-slate-200">{activeNotificationToast.text}</p>
            <span className="text-[9px] text-slate-600 font-mono">{activeNotificationToast.timestamp}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
