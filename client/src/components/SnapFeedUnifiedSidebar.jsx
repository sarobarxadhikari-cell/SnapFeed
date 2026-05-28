import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SIDEBAR_LOCALIZATION_DICTIONARY = {
  en: {
    searchNetworkInputPlaceholder: "Search SnapFeed workspace...",
    itemUserProfileName: "Sarobar Adhikari",
    itemEngineAssistantAI: "SnapFeed AI Assistant",
    itemNetworkConnections: "Active Connections",
    itemAnalyticsDashboard: "Performance Metrics Dashboard",
    itemHistoryArchive: "Historical Memories",
    itemSavedBookmarks: "Bookmarked Media",
    itemChannelsGroups: "Community Groups",
    itemCreativeVideoReels: "Video Stories & Reels",
    itemTradeMarketplace: "Global Commerce Hub",
    itemPersonalizedFeeds: "Dynamic Content Feeds",
    btnExpandDirectory: "See more options",
    btnCollapseDirectory: "See less options",
    footerPrivacyLink: "Privacy",
    footerTermsLink: "Terms",
    footerAdvertisingLink: "Advertising",
    footerCookiesLink: "Cookies",
    footerMoreDirectory: "More",
    systemEventToastTitle: "Router Pipeline Context Intercept"
  },
  ne: {
    searchNetworkInputPlaceholder: "स्न्यापफिड कार्यक्षेत्र खोज्नुहोस्...",
    itemUserProfileName: "सरोबर अधिकारी",
    itemEngineAssistantAI: "स्न्यापफिड एआई सहायक",
    itemNetworkConnections: "सक्रिय जडानहरू",
    itemAnalyticsDashboard: "प्रदर्शन ड्यासबोर्ड",
    itemHistoryArchive: "ऐतिहासिक सम्झनाहरू",
    itemSavedBookmarks: "सुरक्षित गरिएका मिडिया",
    itemChannelsGroups: "सामुदायिक समूहहरू",
    itemCreativeVideoReels: "भिडियो रिल्स",
    itemTradeMarketplace: "ग्लोबल वाणिज्य केन्द्र",
    itemPersonalizedFeeds: "गतिशील सामग्री फिडहरू",
    btnExpandDirectory: "थप विकल्पहरू हेर्नुहोस्",
    btnCollapseDirectory: "कम विकल्पहरू हेर्नुहोस्",
    footerPrivacyLink: "गोपनीयता",
    footerTermsLink: "सर्तहरू",
    footerAdvertisingLink: "विज्ञापन",
    footerCookiesLink: "कुकीहरू",
    footerMoreDirectory: "थप",
    systemEventToastTitle: "राउटर पाइपलाइन सूचना"
  }
};

const INTEGRATED_METRICS_STORAGE_GRID = Array.from({ length: 140 }, (_, index) => ({
  clusterNodeId: `sf_sidebar_data_node_${index + 8000}`,
  verificationDigestHash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
  packetPayloadSizeInBytes: Math.floor(Math.random() * 7400) + 1600,
  isNetworkSocketActive: index % 2 === 0,
  internalLatencyDeltaMs: (Math.random() * 9.5 + 0.4).toFixed(2),
  recordSynchronizedTimestamp: new Date(Date.now() - index * 60000).toLocaleTimeString()
}));

const sidebarListStaggerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.02 } }
};

const singleRowItemSpringVariants = {
  hidden: { opacity: 0, x: -15, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 450, damping: 24 } },
  exit: { opacity: 0, x: -10, scale: 0.95, transition: { duration: 0.15 } }
};

export default function SnapFeedUnifiedSidebar({ language = 'en', activeUserInitial = "SA", onNavigate }) {
  const [liveSearchQueryString, setLiveSearchQueryString] = useState('');
  const [isSidebarDirectoryExpanded, setIsSidebarDirectoryExpanded] = useState(false);
  const [activeSelectedRouterLink, setActiveSelectedRouterLink] = useState('user_profile_node');
  const [dynamicInterfaceAlertToast, setDynamicInterfaceAlertToast] = useState(null);
  const [aggregatedStorageAllocationBytes, setAggregatedStorageAllocationBytes] = useState(0);
  const [runtimeHardwareExecutionLogs, setRuntimeHardwareExecutionLogs] = useState([]);

  const dict = SIDEBAR_LOCALIZATION_DICTIONARY[language] || SIDEBAR_LOCALIZATION_DICTIONARY['en'];

  useEffect(() => {
    let massByteSumCalculation = 0;
    const diagnosticsArrayBuffer = [];
    INTEGRATED_METRICS_STORAGE_GRID.forEach((dataCluster, index) => {
      massByteSumCalculation += dataCluster.packetPayloadSizeInBytes;
      if (index < 7) {
        diagnosticsArrayBuffer.push(`[SIDEBAR ENG] Synchronized Node ${dataCluster.clusterNodeId}. Execution offset: ${dataCluster.internalLatencyDeltaMs}ms`);
      }
    });
    setAggregatedStorageAllocationBytes(massByteSumCalculation);
    setRuntimeHardwareExecutionLogs(diagnosticsArrayBuffer);
  }, []);

  const handleNavigationElementSelectionAction = (itemIdToken, localizedLabelStringValue) => {
    setActiveSelectedRouterLink(itemIdToken);
    setRuntimeHardwareExecutionLogs(prevLogs => [
      `[ROUTING DETECT] Intercepted event link mapping context to [${itemIdToken.toUpperCase()}] at ${new Date().toLocaleTimeString()}`,
      ...prevLogs.slice(0, 7)
    ]);
    setDynamicInterfaceAlertToast({
      toastTokenId: `evt_router_${Date.now()}`,
      displayMessage: `Target active node switched to: ${localizedLabelStringValue}`,
      timestampString: new Date().toLocaleTimeString()
    });
    if (onNavigate) onNavigate(itemIdToken, localizedLabelStringValue);
    setTimeout(() => setDynamicInterfaceAlertToast(null), 2500);
  };

  const completeNavigationItemsSpecificationArray = [
    { id: 'user_profile_node', localizationKey: 'itemUserProfileName', assetGraphicIndicator: '👤', isAvatarCircle: true, renderingAccentColorHex: '#3b82f6' },
    { id: 'ai_assistant_node', localizationKey: 'itemEngineAssistantAI', assetGraphicIndicator: '✨', isAvatarCircle: false, renderingAccentColorHex: '#a855f7' },
    { id: 'network_connections_node', localizationKey: 'itemNetworkConnections', assetGraphicIndicator: '👥', isAvatarCircle: false, renderingAccentColorHex: '#06b6d4' },
    { id: 'performance_dashboard_node', localizationKey: 'itemAnalyticsDashboard', assetGraphicIndicator: '📊', isAvatarCircle: false, renderingAccentColorHex: '#10b981' },
    { id: 'historical_archive_node', localizationKey: 'itemHistoryArchive', assetGraphicIndicator: '🕒', isAvatarCircle: false, renderingAccentColorHex: '#f59e0b' },
    { id: 'bookmarked_media_node', localizationKey: 'itemSavedBookmarks', assetGraphicIndicator: '🔖', isAvatarCircle: false, renderingAccentColorHex: '#ec4899' },
    { id: 'community_channels_node', localizationKey: 'itemChannelsGroups', assetGraphicIndicator: '🌐', isAvatarCircle: false, renderingAccentColorHex: '#6366f1' },
    { id: 'video_stories_node', localizationKey: 'itemCreativeVideoReels', assetGraphicIndicator: '🎬', isAvatarCircle: false, renderingAccentColorHex: '#f43f5e' },
    { id: 'global_commerce_node', localizationKey: 'itemTradeMarketplace', assetGraphicIndicator: '🛍️', isAvatarCircle: false, renderingAccentColorHex: '#14b8a6' },
    { id: 'dynamic_feeds_node', localizationKey: 'itemPersonalizedFeeds', assetGraphicIndicator: '📰', isAvatarCircle: false, renderingAccentColorHex: '#84cc16' }
  ];

  const filteredSearchSidebarItemsCollection = completeNavigationItemsSpecificationArray.filter(item =>
    dict[item.localizationKey].toLowerCase().includes(liveSearchQueryString.toLowerCase())
  );

  const finalVisibleNavigationItemsList = isSidebarDirectoryExpanded
    ? filteredSearchSidebarItemsCollection
    : filteredSearchSidebarItemsCollection.slice(0, 5);

  return (
    <aside className="w-[320px] bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between relative shadow-2xl overflow-hidden" aria-label="SnapFeed Core Vertical Navigation Menu">
      <div className="flex-1 flex flex-col pt-4 px-3 overflow-y-auto space-y-4">
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-lg tracking-tighter shadow-md shadow-blue-600/10">SF</div>
            <div className="space-y-0.5">
              <h2 className="text-xs font-black text-white tracking-widest uppercase">SnapFeed</h2>
              <span className="text-[9px] text-slate-500 font-mono tracking-wider block">SIDEBAR_NODE_v2.6</span>
            </div>
          </div>
        </div>
        <div className="relative px-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-600 pointer-events-none">🔍</span>
          <input type="text" value={liveSearchQueryString} onChange={(e) => setLiveSearchQueryString(e.target.value)} placeholder={dict.searchNetworkInputPlaceholder} className="w-full bg-slate-950 border border-slate-800/80 focus:border-blue-500 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition duration-150" />
          {liveSearchQueryString && (
            <button onClick={() => setLiveSearchQueryString('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-200 text-xs font-bold">✕</button>
          )}
        </div>
        <motion.nav variants={sidebarListStaggerVariants} initial="hidden" animate="visible" className="space-y-0.5 px-1">
          {finalVisibleNavigationItemsList.map((item) => {
            const isItemCurrentlyActive = activeSelectedRouterLink === item.id;
            return (
              <motion.button
                key={item.id}
                variants={singleRowItemSpringVariants}
                onClick={() => handleNavigationElementSelectionAction(item.id, dict[item.localizationKey])}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition group relative outline-none border ${isItemCurrentlyActive ? 'bg-blue-600/10 border-blue-500/20' : 'hover:bg-slate-800/40 border-transparent'}`}
                whileHover={{ x: 4, transition: { duration: 0.1 } }}
              >
                {item.isAvatarCircle ? (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">{activeUserInitial}</div>
                ) : (
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-transform duration-200 group-hover:scale-105 flex-shrink-0" style={{ backgroundColor: isItemCurrentlyActive ? `${item.renderingAccentColorHex}15` : '#1e293b', color: item.renderingAccentColorHex }}>
                    {item.assetGraphicIndicator}
                  </div>
                )}
                <span className={`text-xs font-semibold tracking-wide transition-colors ${isItemCurrentlyActive ? 'text-blue-400 font-bold' : 'text-slate-300 group-hover:text-white'}`}>
                  {dict[item.localizationKey]}
                </span>
                {isItemCurrentlyActive && (
                  <motion.div layoutId="sidebar_active_dot_indicator" className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-lg absolute right-3" transition={{ type: "spring", stiffness: 400, damping: 28 }} />
                )}
              </motion.button>
            );
          })}
          {filteredSearchSidebarItemsCollection.length > 5 && (
            <button onClick={() => setIsSidebarDirectoryExpanded(!isSidebarDirectoryExpanded)} className="w-full flex items-center space-x-3.5 p-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/30 transition text-left outline-none font-semibold text-[11px] mt-1">
              <span className="text-xs">{isSidebarDirectoryExpanded ? '▲' : '▼'}</span>
              <span>{isSidebarDirectoryExpanded ? dict.btnCollapseDirectory : dict.btnExpandDirectory}</span>
            </button>
          )}
        </motion.nav>
        <div className="px-4 space-y-2 mt-auto">
          <div className="flex items-center justify-between text-[9px] text-slate-700 font-mono bg-slate-950/50 rounded-lg px-3 py-2 border border-slate-800/40">
            <span>INGESTION BUFFER: {(aggregatedStorageAllocationBytes / 1024).toFixed(2)} KB</span>
            <span className="text-emerald-600">PIPELINE: HELMET_HARDENED</span>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[9px] text-slate-600">
            <span>{dict.footerPrivacyLink}</span><span className="text-slate-800">•</span>
            <span>{dict.footerTermsLink}</span><span className="text-slate-800">•</span>
            <span>{dict.footerAdvertisingLink}</span><span className="text-slate-800">•</span>
            <span>{dict.footerCookiesLink}</span><span className="text-slate-800">•</span>
            <span>{dict.footerMoreDirectory}</span>
          </div>
          <p className="text-[8px] text-slate-800 leading-tight">© 2026 SnapFeed Global Technologies Corp. Navigation nodes compiled in memory footprint bounds.</p>
        </div>
      </div>
      <AnimatePresence>
        {dynamicInterfaceAlertToast && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            className="absolute bottom-4 left-4 right-4 bg-slate-900 border-l-4 border-l-blue-500 border border-slate-800 p-3 rounded-xl shadow-2xl pointer-events-auto flex flex-col space-y-1 z-50"
          >
            <span className="text-[8px] font-bold text-blue-400 uppercase tracking-wider">{dict.systemEventToastTitle}</span>
            <p className="text-[10px] text-slate-200">{dynamicInterfaceAlertToast.displayMessage}</p>
            <span className="text-[8px] text-slate-600 font-mono">{dynamicInterfaceAlertToast.timestampString}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
