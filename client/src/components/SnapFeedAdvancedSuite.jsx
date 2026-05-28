import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SYSTEM_SUITE_DICTIONARY = {
  en: {
    suiteHeaderTitle: "SnapFeed Enterprise Core System Platform Suite",
    suiteSubtitle: "Consolidated infrastructure managing cryptographic tokens, semantic AI checking, and media buffering.",
    tabAiEngine: "Semantic AI Moderator",
    tabMediaPipeline: "Media Ingestion Engine",
    tabStoriesBroker: "Ephemeral Stories Broker",
    tabCryptoSession: "Cryptographic Session Gateway",
    btnProcessPayload: "Execute Operational Pipeline",
    lblProcessingState: "Pipeline Active Frame Processing Status",
    terminalHeader: "SNAPFEED SUBSYSTEM RAW CORE REAL-TIME EMISSION LOGS",
    toastSuccess: "Operational data package successfully committed to active cache arrays."
  },
  ne: {
    suiteHeaderTitle: "स्न्यापफिड इन्टरप्राइज कोर प्रणाली प्लेटफर्म सुइट",
    suiteSubtitle: "क्रिप्टोग्राफिक टोकनहरू, सेमान्टिक एआई जाँच, र मिडिया बफरिङ व्यवस्थित गर्ने एकीकृत पूर्वाधार।",
    tabAiEngine: "सेमान्टिक एआई मोडरेटर",
    tabMediaPipeline: "मिडिया इन्जेक्सन इन्जिन",
    tabStoriesBroker: "अस्थायी कथाहरू ब्रोकर",
    tabCryptoSession: "क्रिप्टोग्राफिक सत्र गेटवे",
    btnProcessPayload: "परिचालन पाइपलाइन कार्यान्वयन गर्नुहोस्",
    lblProcessingState: "पाइपलाइन सक्रिय फ्रेम प्रशोधन स्थिति",
    terminalHeader: "स्न्यापफिड सबसिस्टम कच्चा कोर वास्तविक समय उत्सर्जन लगहरू",
    toastSuccess: "परिचालन डाटा प्याकेज सफलतापूर्वक सक्रिय क्यास एरेहरूमा सुरक्षित गरियो।"
  }
};

const CORE_SUITE_DIAGNOSTICS_DATA_CACHE = Array.from({ length: 300 }, (_, index) => ({
  transactionId: `sf_suite_matrix_node_cluster_${index + 45000}`,
  payloadVerificationHash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
  dataMemoryAllocationBytes: Math.floor(Math.random() * 8800) + 1200,
  isNetworkRoutingStable: index % 2 === 0,
  processingLatencyDeltaMs: (Math.random() * 12.4 + 0.2).toFixed(2),
  synchronizedTimestampString: new Date(Date.now() - index * 1000).toLocaleTimeString()
}));

export default function SnapFeedAdvancedSuite() {
  const [suiteLanguage, setSuiteLanguage] = useState('en');
  const [activeTabId, setActiveTabId] = useState('ai_engine');
  const [isProcessingPipeline, setIsProcessingPipeline] = useState(false);
  const [pipelineProcessingStatus, setPipelineProcessingStatus] = useState('STANDBY_READY');
  const [suiteNotificationToast, setSuiteNotificationToast] = useState(null);
  const [aiInboundInputText, setAiInboundInputText] = useState('This platform is amazing! Check out our new project.');
  const [aiEvaluationMetricsResult, setAiEvaluationMetricsResult] = useState({ score: 100, status: "UNCHECKED", entities: [] });
  const [selectedMockMediaFile, setSelectedMockMediaFile] = useState({ name: 'snapfeed_vlog_04.mp4', type: 'video/mp4', sizeBytes: 15420000 });
  const [mediaIngestionCompressionRatio, setMediaIngestionCompressionRatio] = useState('1:1 (RAW)');
  const [activeStoryPayloadsCollection, setActiveStoryPayloadsCollection] = useState([
    { id: 'st_01', author: 'Sarobar Adhikari', hoursRemaining: 24, content: 'Live from Kathmandu' },
    { id: 'st_02', author: 'Anish Thapa', hoursRemaining: 18, content: 'Testing new filters' },
    { id: 'st_03', author: 'Niranjan Thapa', hoursRemaining: 5, content: 'System setup online' }
  ]);
  const [activeClientSessionToken, setActiveClientSessionToken] = useState('sf_token_live_sha256_77x9921_unassigned');
  const [sessionUptimeCounterSeconds, setSessionUptimeCounterSeconds] = useState(0);
  const [totalSimulatedMemoryAllocationBytes, setTotalSimulatedMemoryAllocationBytes] = useState(0);
  const [liveSuiteTerminalLogsStream, setLiveSuiteTerminalLogsStream] = useState([]);

  const dict = SYSTEM_SUITE_DICTIONARY[suiteLanguage] || SYSTEM_SUITE_DICTIONARY['en'];

  useEffect(() => {
    let massByteSumAccumulator = 0;
    const transientTraceCollector = [];
    CORE_SUITE_DIAGNOSTICS_DATA_CACHE.forEach((dataNode, index) => {
      massByteSumAccumulator += dataNode.dataMemoryAllocationBytes;
      if (index < 8) {
        transientTraceCollector.push(`[CORE SYSTEM] Initialized Subsystem Node ${dataNode.transactionId}. Operational offset latency: ${dataNode.processingLatencyDeltaMs}ms`);
      }
    });
    setTotalSimulatedMemoryAllocationBytes(massByteSumAccumulator);
    setLiveSuiteTerminalLogsStream(transientTraceCollector);
    const sessionTimerId = setInterval(() => {
      setSessionUptimeCounterSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(sessionTimerId);
  }, []);

  const executeLocalSemanticAiEvaluationPipeline = () => {
    setIsProcessingPipeline(true);
    setPipelineProcessingStatus('Analyzing Lexical Input Strings Matrix...');
    setTimeout(() => {
      const lowercasedInput = aiInboundInputText.toLowerCase();
      let structuralToxicityScore = 100;
      const detectedEntityTags = [];
      if (lowercasedInput.includes('bad') || lowercasedInput.includes('spam') || lowercasedInput.includes('corrupt')) {
        structuralToxicityScore = 42;
      }
      if (lowercasedInput.includes('project') || lowercasedInput.includes('snapfeed')) {
        detectedEntityTags.push('PLATFORM_SYSTEM_ENTITY');
      }
      setAiEvaluationMetricsResult({
        score: structuralToxicityScore,
        status: structuralToxicityScore > 50 ? "PASSED_VERIFIED" : "REJECTED_ANOMALY",
        entities: detectedEntityTags.length > 0 ? detectedEntityTags : ["GENERAL_TEXT"]
      });
      pushNewLogLineStream(`[AI MATRIX] Completed semantic evaluation scan. Safety Score: ${structuralToxicityScore}% | Status: ${structuralToxicityScore > 50 ? "PASSED" : "BLOCKED"}`);
      finalizePipelineExecutionState();
    }, 1200);
  };

  const executeMediaBinaryCompressionOptimization = () => {
    setIsProcessingPipeline(true);
    setPipelineProcessingStatus('Executing Chunked Vector Binary Asset Encoding...');
    setTimeout(() => {
      const targetOriginalSizeBytes = selectedMockMediaFile.sizeBytes;
      const computedCompressedSizeBytes = Math.floor(targetOriginalSizeBytes * 0.38);
      setMediaIngestionCompressionRatio(`62% Saved (${(computedCompressedSizeBytes / 1024 / 1024).toFixed(2)}MB Optimized Payload Buffer)`);
      pushNewLogLineStream(`[MEDIA ENG] Binary array downsampling loop finished. Raw block size optimized safely into platform asset streams.`);
      finalizePipelineExecutionState();
    }, 1500);
  };

  const executeStoryDecayVerificationSweep = () => {
    setIsProcessingPipeline(true);
    setPipelineProcessingStatus('Sweeping Chronological State Ledger Matrices...');
    setTimeout(() => {
      setActiveStoryPayloadsCollection(prevCollection =>
        prevCollection.map(story => ({
          ...story,
          hoursRemaining: story.hoursRemaining > 1 ? story.hoursRemaining - 1 : 0
        })).filter(story => story.hoursRemaining > 0)
      );
      pushNewLogLineStream(`[STORY BROKER] Completed chronological array sweep. Successfully purged decayed content nodes with zero validation lifetimes.`);
      finalizePipelineExecutionState();
    }, 1000);
  };

  const executeCryptographicTokenRegenerationRefresh = () => {
    setIsProcessingPipeline(true);
    setPipelineProcessingStatus('Regenerating Cryptographic Hash Vault Tokens...');
    setTimeout(() => {
      const uniqueHexBufferArray = new Uint32Array(4);
      window.crypto.getRandomValues(uniqueHexBufferArray);
      const generatedTokenString = `sf_secure_node_sha256_${Array.from(uniqueHexBufferArray, num => num.toString(16)).join('')}`;
      setActiveClientSessionToken(generatedTokenString);
      pushNewLogLineStream(`[CRYPTO CORE] Rotation successful. Token validation digest signed: ${generatedTokenString.substring(0, 24)}...`);
      finalizePipelineExecutionState();
    }, 1400);
  };

  const finalizePipelineExecutionState = () => {
    setIsProcessingPipeline(false);
    setPipelineProcessingStatus('STANDBY_READY');
    setSuiteNotificationToast({
      id: `toast_suite_evt_${Date.now()}`,
      message: dict.toastSuccess,
      timestamp: new Date().toLocaleTimeString()
    });
    setTimeout(() => setSuiteNotificationToast(null), 2800);
  };

  const pushNewLogLineStream = (logMessageString) => {
    setLiveSuiteTerminalLogsStream(prevLogs => [logMessageString, ...prevLogs.slice(0, 7)]);
  };

  const handleProcessPayloadClick = () => {
    if (activeTabId === 'ai_engine') executeLocalSemanticAiEvaluationPipeline();
    else if (activeTabId === 'media_pipeline') executeMediaBinaryCompressionOptimization();
    else if (activeTabId === 'stories_broker') executeStoryDecayVerificationSweep();
    else if (activeTabId === 'crypto_session') executeCryptographicTokenRegenerationRefresh();
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans antialiased overflow-hidden">
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 flex flex-col space-y-6 relative z-10">
        <div className="w-full bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between backdrop-blur-md">
          <div className="space-y-0.5">
            <h1 className="text-xs font-black text-white tracking-widest uppercase">{dict.suiteHeaderTitle}</h1>
            <p className="text-[11px] text-slate-500 font-medium">{dict.suiteSubtitle}</p>
          </div>
          <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800/60">
            <button onClick={() => setSuiteLanguage('en')} className={`px-2.5 py-1 text-[10px] font-black rounded-md transition ${suiteLanguage === 'en' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>EN</button>
            <button onClick={() => setSuiteLanguage('ne')} className={`px-2.5 py-1 text-[10px] font-black rounded-md transition ${suiteLanguage === 'ne' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>ने</button>
          </div>
        </div>

        <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-2 space-y-1">
            {[
              { id: 'ai_engine', icon: '✨', label: dict.tabAiEngine },
              { id: 'media_pipeline', icon: '🎬', label: dict.tabMediaPipeline },
              { id: 'stories_broker', icon: '🕒', label: dict.tabStoriesBroker },
              { id: 'crypto_session', icon: '🔒', label: dict.tabCryptoSession }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTabId(tab.id)} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition border ${activeTabId === tab.id ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' : 'border-transparent hover:bg-slate-800/50 text-slate-400'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
            <div className="pt-4 text-[8px] text-slate-700 font-mono space-y-1">
              <p>CACHE: {(totalSimulatedMemoryAllocationBytes / 1024).toFixed(2)} KB</p>
              <p className="text-emerald-600">PIPELINE: ISOLATED_SYNC</p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800/40 rounded-3xl p-6">
            <AnimatePresence mode="wait">
              {activeTabId === 'ai_engine' && (
                <motion.div key="ai" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  <div>
                    <h2 className="text-xs font-bold text-white uppercase tracking-wider">{dict.tabAiEngine}</h2>
                    <p className="text-[10px] text-slate-500 mt-0.5">Evaluates raw string content payloads for filtering policy rules instantly before compilation.</p>
                  </div>
                  <textarea value={aiInboundInputText} onChange={(e) => setAiInboundInputText(e.target.value)} className="w-full h-24 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl p-4 text-xs font-medium outline-none text-white transition leading-relaxed resize-none" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950 rounded-xl px-3 py-2 border border-slate-800/60">
                      <p className="text-[9px] text-slate-500">Safety Confidence Score</p>
                      <span className={`text-base font-black block mt-1 ${aiEvaluationMetricsResult.score > 50 ? 'text-emerald-400' : 'text-red-400'}`}>{aiEvaluationMetricsResult.score}% Integrity</span>
                    </div>
                    <div className="bg-slate-950 rounded-xl px-3 py-2 border border-slate-800/60">
                      <p className="text-[9px] text-slate-500">System Status</p>
                      <span className="text-sm font-bold text-white">{aiEvaluationMetricsResult.status}</span>
                    </div>
                  </div>
                  <div className="bg-slate-950 rounded-xl px-3 py-2 border border-slate-800/60">
                    <p className="text-[9px] text-slate-500">Extracted Entity Tags</p>
                    <p className="text-xs text-blue-400 font-mono mt-0.5">{aiEvaluationMetricsResult.entities.join(', ')}</p>
                  </div>
                  <button onClick={handleProcessPayloadClick} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition uppercase tracking-wider">🚀 {dict.btnProcessPayload}</button>
                </motion.div>
              )}
              {activeTabId === 'media_pipeline' && (
                <motion.div key="media" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  <div>
                    <h2 className="text-xs font-bold text-white uppercase tracking-wider">{dict.tabMediaPipeline}</h2>
                    <p className="text-[10px] text-slate-500 mt-0.5">Downsamples raw binary stream content packages into dynamic low-latency delivery frame segments.</p>
                  </div>
                  <div className="bg-slate-950 rounded-xl px-4 py-3 border border-slate-800/60 space-y-2">
                    <div className="flex justify-between text-[11px]"><span className="text-slate-400">Asset:</span><span className="text-white font-mono">{selectedMockMediaFile.name}</span></div>
                    <div className="flex justify-between text-[11px]"><span className="text-slate-400">Size:</span><span className="text-white font-mono">{(selectedMockMediaFile.sizeBytes / 1024 / 1024).toFixed(2)} MB</span></div>
                    <div className="flex justify-between text-[11px]"><span className="text-slate-400">Compression:</span><span className="text-emerald-400 font-mono">{mediaIngestionCompressionRatio}</span></div>
                  </div>
                  <button onClick={handleProcessPayloadClick} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition uppercase tracking-wider">🚀 {dict.btnProcessPayload}</button>
                </motion.div>
              )}
              {activeTabId === 'stories_broker' && (
                <motion.div key="stories" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  <div>
                    <h2 className="text-xs font-bold text-white uppercase tracking-wider">{dict.tabStoriesBroker}</h2>
                    <p className="text-[10px] text-slate-500 mt-0.5">Monitors decay curves on ephemeral stories data nodes, auto-clearing memory layers past 24 hours.</p>
                  </div>
                  <div className="space-y-2">
                    {activeStoryPayloadsCollection.map(story => (
                      <div key={story.id} className="bg-slate-950 rounded-xl px-4 py-3 border border-slate-800/60 flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-bold text-white">{story.author}</p>
                          <p className="text-[10px] text-slate-400">"{story.content}"</p>
                        </div>
                        <span className="text-[10px] font-mono text-amber-400">{story.hoursRemaining}h left</span>
                      </div>
                    ))}
                  </div>
                  {activeStoryPayloadsCollection.length === 0 && <p className="text-xs text-slate-500">No active stories remaining.</p>}
                  <button onClick={handleProcessPayloadClick} className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition uppercase tracking-wider">⏳ Decay Sweep</button>
                </motion.div>
              )}
              {activeTabId === 'crypto_session' && (
                <motion.div key="crypto" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  <div>
                    <h2 className="text-xs font-bold text-white uppercase tracking-wider">{dict.tabCryptoSession}</h2>
                    <p className="text-[10px] text-slate-500 mt-0.5">Manages high-grade client session parameters, token rotation loops, and connection heartbeats safely.</p>
                  </div>
                  <div className="bg-slate-950 rounded-xl px-4 py-3 border border-slate-800/60 space-y-2">
                    <p className="text-[9px] text-slate-500">Active Session Token:</p>
                    <p className="text-xs font-mono text-blue-400 break-all">{activeClientSessionToken}</p>
                  </div>
                  <div className="bg-slate-950 rounded-xl px-4 py-3 border border-slate-800/60">
                    <p className="text-[9px] text-slate-500">Uptime:</p>
                    <p className="text-sm font-bold text-white font-mono">{sessionUptimeCounterSeconds}s</p>
                  </div>
                  <button onClick={handleProcessPayloadClick} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition uppercase tracking-wider">🔄 Rotate Token</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="bg-slate-900/50 border border-slate-800/40 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-500 font-mono">{dict.lblProcessingState}:</span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${isProcessingPipeline ? 'bg-amber-500/5 border-amber-500/30 text-amber-400 animate-pulse' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>{pipelineProcessingStatus}</span>
              </div>
              <p className="text-[8px] text-slate-700 leading-relaxed">All core pipeline processes run completely inside local state arrays memory frames.</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/40 rounded-2xl p-3 space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{dict.terminalHeader}</h3>
                <span className="text-[8px] text-slate-700 font-mono">BUFFER: {(totalSimulatedMemoryAllocationBytes / 1024).toFixed(2)} KB</span>
              </div>
              <div className="bg-slate-950 rounded-xl p-2.5 space-y-1 max-h-40 overflow-y-auto font-mono">
                {liveSuiteTerminalLogsStream.map((logLine, index) => (
                  <p key={index} className="text-[8px] text-slate-600 leading-relaxed">[{index + 1}] {logLine}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-800/50 pt-4 flex items-center justify-center text-[9px] text-slate-700">
          <span>© 2026 SnapFeed Global Technologies Corp. Core enterprise assets managed within strict memory partition boundaries.</span>
        </footer>
      </main>

      <AnimatePresence>
        {suiteNotificationToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 22 }}
            className="fixed bottom-6 right-6 bg-slate-900 border-l-4 border-l-blue-500 border border-slate-800 p-4 rounded-xl shadow-2xl max-w-sm z-50"
          >
            <span className="text-[8px] font-bold text-blue-400 uppercase tracking-wider">SYSTEM EVENT</span>
            <p className="text-[11px] text-slate-200 mt-0.5">{suiteNotificationToast.message}</p>
            <span className="text-[8px] text-slate-600 font-mono">{suiteNotificationToast.timestamp}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
