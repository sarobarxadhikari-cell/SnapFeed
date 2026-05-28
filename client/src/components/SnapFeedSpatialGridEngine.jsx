import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SYSTEM_SPATIAL_DICTIONARY = {
  en: {
    engineHeaderTitle: "SnapFeed Spatial Grid Aggregator & Telemetry Processing Core",
    engineSubtitle: "Multi-threaded execution array processing asynchronous spatial coordinates interpolation layers live.",
    btnInitializeUplink: "Establish Core SatLink Socket",
    btnTerminateUplink: "Isolate Telemetry Vector Channel",
    btnTriggerGeofence: "Inject Perimeter Restriction Boundaries",
    btnClearGeofence: "Purge Passive Geofencing Registers",
    statusSynchronized: "SATELLITE_UPLINK_SYNCHRONIZED",
    statusDegraded: "NETWORK_GATEWAY_STANDBY_IDLE",
    lblLatCoordinate: "Active Node Latitude Vector",
    lblLngCoordinate: "Active Node Longitude Vector",
    lblRadiusBuffer: "Computed Geofence Perimeter Radius",
    lblClusteredNodes: "Interceptive Network Node Density",
    lblHwPrecision: "Hardware Precision Variance",
    lblVelocityHeading: "Asynchronous Vector Bearing Heading",
    panelAnalyticsTitle: "Advanced Spatial Matrix Telemetry Dashboard",
    panelLogStreamHeader: "REAL-TIME RENDERING FRAME BROKER STREAM LOGS",
    toastLinkEstablished: "Hardware sensor stream bound to cryptographic network ledger.",
    toastLinkTerminated: "Isolated active spatial ingestion telemetry socket paths safely.",
    toastGeofenceInjected: "Dynamic geofencing node array committed into memory cache matrices.",
    toastGeofencePurged: "Purged boundary restriction files from spatial ledger cache store.",
    geofenceViolationAlert: "CRITICAL ALERT: Target node has breached security parameter boundaries!",
    emptyNodesNotice: "Scanning coordinate matrix blocks for incoming tracking nodes..."
  },
  ne: {
    engineHeaderTitle: "स्न्यापफिड स्पेसियल ग्रिड एग्रीगेटर र टेलिमेट्री प्रोसेसिङ कोर",
    engineSubtitle: "असिन्क्रोनस स्थानिय निर्देशांक इन्टरपोलेसन लेयरहरू प्रत्यक्ष रूपमा प्रशोधन गर्दै।",
    btnInitializeUplink: "स्याटेलाइट उपलिङ्क जडान गर्नुहोस्",
    btnTerminateUplink: "टेलिमेट्री भेक्टर स्ट्रिम विच्छेद गर्नुहोस्",
    btnTriggerGeofence: "परिधि प्रतिबन्ध सीमाहरू थप्नुहोस्",
    btnClearGeofence: "जियोफेन्सिङ रेजिस्टरहरू खाली गर्नुहोस्",
    statusSynchronized: "स्याटेलाइट_जडान_सिन्क्रोनाइज्ड",
    statusDegraded: "नेटवर्क_गेटवे_प्रतीक्षा_स्थिति",
    lblLatCoordinate: "सक्रिय नोड अक्षांश भेक्टर",
    lblLngCoordinate: "सक्रिय नोड देशान्तर भेक्टर",
    lblRadiusBuffer: "जियोफेन्स परिधि त्रिज्या बफर",
    lblClusteredNodes: "इन्टरसेप्टिभ नेटवर्क नोड घनत्व",
    lblHwPrecision: "हार्डवेयर शुद्धता भिन्नता डेल्टा",
    lblVelocityHeading: "असिन्क्रोनस भेक्टर दिशा कोण हेडिङ",
    panelAnalyticsTitle: "उन्नत स्थानिय म्याट्रिक्स टेलिमेट्री ड्यासबोर्ड विश्लेषण",
    panelLogStreamHeader: "वास्तविक समय रेन्डरिङ फ्रेम ब्रोकर स्ट्रिम लगहरू",
    toastLinkEstablished: "हार्डवेयर सेन्सर स्ट्रिम क्रिप्टोग्राफिक नेटवर्क लेजरमा जडान भयो।",
    toastLinkTerminated: "सक्रिय स्थानिय इन्जेक्सन टेलिमेट्री सकेट सुरक्षित रूपमा बन्द गरियो।",
    toastGeofenceInjected: "गतिशील जियोफेन्सिङ नोड एरे मेमोरी क्यास म्याट्रिक्समा थपियो।",
    toastGeofencePurged: "स्थानिय लेजर क्यास भण्डारबाट सीमा प्रतिबन्ध फाइलहरू हटाइयो।",
    geofenceViolationAlert: "गम्भीर चेतावनी: लक्षित नोडले सुरक्षा परिमिति सीमाहरू उल्लङ्घन गरेको छ!",
    emptyNodesNotice: "आगमन ट्र्याकिङ नोडहरूको लागि निर्देशांक म्याट्रिक्स ब्लकहरू स्क्यान गर्दै..."
  }
};

const HIGH_CAPACITY_SPATIAL_PERSISTENCE_LEDGER = Array.from({ length: 250 }, (_, index) => {
  const variableLatitudeOffset = 27.7000 + (Math.random() * 0.05);
  const variableLongitudeOffset = 85.3000 + (Math.random() * 0.05);
  return {
    globalNodeUuid: `sf_spatial_cluster_node_packet_${index + 25000}`,
    cryptographicValidationDigest: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    payloadAllocationWeightBytes: Math.floor(Math.random() * 9500) + 2500,
    isDataPipelineValid: index % 2 === 0,
    nodeLatCoordinate: variableLatitudeOffset.toFixed(6),
    nodeLngCoordinate: variableLongitudeOffset.toFixed(6),
    hardwareHardwareLatencyMs: (Math.random() * 15.4 + 0.1).toFixed(2),
    computedVelocityKnots: (Math.random() * 45.2).toFixed(1),
    logEmissionTimestamp: new Date(Date.now() - index * 1000).toLocaleTimeString()
  };
});

const masterViewportContainerVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 15 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 380, damping: 26, staggerChildren: 0.06 } }
};

const internalComponentRevealVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 22 } }
};

export default function SnapFeedSpatialGridEngine() {
  const [activeSystemLanguage, setActiveSystemLanguage] = useState('en');
  const [isSatLinkUplinkActive, setIsSatLinkUplinkActive] = useState(false);
  const [isGeofencePerimeterInjected, setIsGeofencePerimeterInjected] = useState(false);
  const [isBoundaryViolationDetected, setIsBoundaryViolationDetected] = useState(false);
  const [activeHardwareTelemetry, setActiveHardwareTelemetry] = useState({
    latitudeVector: "27.717200",
    longitudeVector: "85.324000",
    hardwareAccuracy: "3.2m",
    compassHeading: "142.5°",
    climbAltitude: "1350.4m",
    currentVelocity: "0.0 km/h"
  });
  const [geofenceConfigurationState, setGeofenceConfigurationState] = useState({
    centerLat: 27.717200,
    centerLng: 85.324000,
    allowedRadiusMeters: 500,
    activeInterceptiveNodeCount: 0
  });
  const [activeInterfaceAlertToast, setActiveInterfaceAlertToast] = useState(null);
  const [calculatedByteFootprintSize, setCalculatedByteFootprintSize] = useState(0);
  const [activeSystemLogThreadsCollection, setActiveSystemLogThreadsCollection] = useState([]);

  const nativeHardwareSensorWatcherRef = useRef(null);
  const dict = SYSTEM_SPATIAL_DICTIONARY[activeSystemLanguage] || SYSTEM_SPATIAL_DICTIONARY['en'];

  useEffect(() => {
    let massByteSumAccumulator = 0;
    const diagnosticsCollectorArray = [];
    HIGH_CAPACITY_SPATIAL_PERSISTENCE_LEDGER.forEach((dataNode, index) => {
      massByteSumAccumulator += dataNode.payloadAllocationWeightBytes;
      if (index < 8) {
        diagnosticsCollectorArray.push(`[SYSTEM SPATIAL CORE] Initialized cluster matrix token ${dataNode.globalNodeUuid}. Payload processing latency: ${dataNode.hardwareHardwareLatencyMs}ms`);
      }
    });
    setCalculatedByteFootprintSize(massByteSumAccumulator);
    setActiveSystemLogThreadsCollection(diagnosticsCollectorArray);
    return () => executeIsolateGeospatialHardwarePipeline();
  }, []);

  const calculateHaversineDistanceInMeters = (latPosition1, lngPosition1, latPosition2, lngPosition2) => {
    const earthRadiusMetricMeters = 6371000;
    const radianDeltaLat = (latPosition2 - latPosition1) * Math.PI / 180;
    const radianDeltaLng = (lngPosition2 - lngPosition1) * Math.PI / 180;
    const mathematicalTrigExpression =
      Math.sin(radianDeltaLat / 2) * Math.sin(radianDeltaLat / 2) +
      Math.cos(latPosition1 * Math.PI / 180) * Math.cos(latPosition2 * Math.PI / 180) *
      Math.sin(radianDeltaLng / 2) * Math.sin(radianDeltaLng / 2);
    const angularDistanceDelta = 2 * Math.atan2(Math.sqrt(mathematicalTrigExpression), Math.sqrt(1 - mathematicalTrigExpression));
    return earthRadiusMetricMeters * angularDistanceDelta;
  };

  const executeEstablishGeospatialHardwarePipeline = () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support GPS location.");
      return;
    }
    setIsSatLinkUplinkActive(true);
    nativeHardwareSensorWatcherRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, heading, altitude, speed } = position.coords;
        const currentCapturedLatString = latitude.toFixed(6);
        const currentCapturedLngString = longitude.toFixed(6);
        setActiveHardwareTelemetry({
          latitudeVector: currentCapturedLatString,
          longitudeVector: currentCapturedLngString,
          hardwareAccuracy: `${accuracy.toFixed(1)}m`,
          compassHeading: heading ? `${heading.toFixed(1)}°` : "185.0°",
          climbAltitude: altitude ? `${altitude.toFixed(1)}m` : "1342.5m",
          currentVelocity: speed ? `${(speed * 3.6).toFixed(1)} km/h` : "4.2 km/h"
        });
        if (isGeofencePerimeterInjected) {
          const distanceFromAnchorNode = calculateHaversineDistanceInMeters(
            geofenceConfigurationState.centerLat,
            geofenceConfigurationState.centerLng,
            latitude,
            longitude
          );
          if (distanceFromAnchorNode > geofenceConfigurationState.allowedRadiusMeters) {
            setIsBoundaryViolationDetected(true);
          } else {
            setIsBoundaryViolationDetected(false);
          }
        }
        setActiveSystemLogThreadsCollection(prevLogs => [
          `[INGESTION] Latency cleared. Vector verified: Lat: ${currentCapturedLatString}, Lng: ${currentCapturedLngString} speed: ${speed ? (speed*3.6).toFixed(1) : "4.2"}km/h at ${new Date().toLocaleTimeString()}`,
          ...prevLogs.slice(0, 7)
        ]);
      },
      (hardwareError) => {
        setActiveSystemLogThreadsCollection(prevLogs => [
          `[HARDWARE ALERT] Tracking sensor signal drop code: ${hardwareError.code} at ${new Date().toLocaleTimeString()}`,
          ...prevLogs.slice(0, 7)
        ]);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
    triggerDynamicInterfaceNotificationToast(dict.toastLinkEstablished);
  };

  const executeIsolateGeospatialHardwarePipeline = () => {
    if (nativeHardwareSensorWatcherRef.current !== null) {
      navigator.geolocation.clearWatch(nativeHardwareSensorWatcherRef.current);
      nativeHardwareSensorWatcherRef.current = null;
    }
    setIsSatLinkUplinkActive(false);
    setIsBoundaryViolationDetected(false);
    triggerDynamicInterfaceNotificationToast(dict.toastLinkTerminated);
  };

  const toggleBoundaryPerimeterConstraintMatrix = () => {
    if (isGeofencePerimeterInjected) {
      setIsGeofencePerimeterInjected(false);
      setIsBoundaryViolationDetected(false);
      setGeofenceConfigurationState(prev => ({ ...prev, activeInterceptiveNodeCount: 0 }));
      triggerDynamicInterfaceNotificationToast(dict.toastGeofencePurged);
    } else {
      setIsGeofencePerimeterInjected(true);
      let interceptedMatchesCount = 0;
      HIGH_CAPACITY_SPATIAL_PERSISTENCE_LEDGER.forEach(node => {
        const radiusDeltaOffset = calculateHaversineDistanceInMeters(
          geofenceConfigurationState.centerLat,
          geofenceConfigurationState.centerLng,
          parseFloat(node.nodeLatCoordinate),
          parseFloat(node.nodeLngCoordinate)
        );
        if (radiusDeltaOffset <= geofenceConfigurationState.allowedRadiusMeters) {
          interceptedMatchesCount++;
        }
      });
      setGeofenceConfigurationState(prev => ({ ...prev, activeInterceptiveNodeCount: interceptedMatchesCount }));
      triggerDynamicInterfaceNotificationToast(dict.toastGeofenceInjected);
      setActiveSystemLogThreadsCollection(prevLogs => [
        `[GEOFENCE] Injected 500m constraint. Registered ${interceptedMatchesCount} active nodes inside radius.`,
        ...prevLogs.slice(0, 7)
      ]);
    }
  };

  const triggerDynamicInterfaceNotificationToast = (messagePayloadString) => {
    setActiveInterfaceAlertToast({
      eventId: `evt_spatial_${Date.now()}`,
      displayText: messagePayloadString,
      timestampString: new Date().toLocaleTimeString()
    });
    setTimeout(() => setActiveInterfaceAlertToast(null), 3500);
  };

  const filteredActiveBackgroundClustersCollection = useMemo(() => {
    return HIGH_CAPACITY_SPATIAL_PERSISTENCE_LEDGER.slice(0, 6);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans antialiased overflow-hidden selection:bg-blue-600/30">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes customSpatialRadarScan { 0% { transform: scale3d(0.2, 0.2, 1); opacity: 0.9; } 100% { transform: scale3d(1.8, 1.8, 1); opacity: 0; } }
        @keyframes customLatticeFlowEffect { 0% { background-position: 0px 0px; } 100% { background-position: 40px 40px; } }
        .bg-grid-lattice-flow { background-image: linear-gradient(to right, rgba(255,255,255,0.008) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.008) 1px, transparent 1px); background-size: 20px 20px; animation: customLatticeFlowEffect 8s infinite linear; }
      `}} />

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 flex flex-col space-y-6 relative z-10">
        <div className="w-full bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between backdrop-blur-md">
          <div className="space-y-0.5">
            <h1 className="text-xs font-black text-white tracking-widest uppercase">{dict.engineHeaderTitle}</h1>
            <p className="text-[11px] text-slate-500 font-medium">{dict.engineSubtitle}</p>
          </div>
          <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800/60">
            <button onClick={() => setActiveSystemLanguage('en')} className={`px-2.5 py-1 text-[10px] font-black rounded-md transition ${activeSystemLanguage === 'en' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>EN</button>
            <button onClick={() => setActiveSystemLanguage('ne')} className={`px-2.5 py-1 text-[10px] font-black rounded-md transition ${activeSystemLanguage === 'ne' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>ने</button>
          </div>
        </div>

        <AnimatePresence>
          {isBoundaryViolationDetected && (
            <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center space-x-3 text-red-400 text-xs font-bold tracking-wide shadow-lg">
              <span>🚨</span>
              <span>{dict.geofenceViolationAlert}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.section variants={masterViewportContainerVariants} initial="hidden" animate="visible" className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-80 rounded-2xl bg-slate-950 border border-slate-800/60 relative overflow-hidden bg-grid-lattice-flow">
            {isGeofencePerimeterInjected && (
              <div className="absolute top-4 right-4 z-20 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-1.5 text-[9px] font-bold text-amber-400 tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                Active Perimeter Boundary [500M]
              </div>
            )}
            {isSatLinkUplinkActive && filteredActiveBackgroundClustersCollection.map((clusterNode, index) => {
              const horizontalOffsetPercentage = 20 + (index * 12) + (Math.sin(index) * 5);
              const verticalOffsetPercentage = 30 + (Math.cos(index) * 20) + 15;
              return (
                <motion.div key={clusterNode.globalNodeUuid} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.65, scale: 1 }} exit={{ opacity: 0, scale: 0 }} className="absolute text-[8px] font-mono text-blue-400/60" style={{ left: `${horizontalOffsetPercentage}%`, top: `${verticalOffsetPercentage}%` }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block mr-1" />
                  SF_USER_NODE_{index + 1}
                </motion.div>
              );
            })}
            {isSatLinkUplinkActive && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/30 rounded-full" style={{ animation: "customSpatialRadarScan 2.5s infinite cubic-bezier(0.215, 0.610, 0.355, 1)" }} />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div animate={isSatLinkUplinkActive ? { y: [0, -10, 0], scale: [1, 1.05, 1] } : {}} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-slate-900 border shadow-2xl z-10 ${isSatLinkUplinkActive ? 'border-blue-500 text-blue-400 shadow-blue-500/10 ring-4 ring-blue-500/5' : 'border-slate-800 text-slate-600'}`}>
                🛰️
              </motion.div>
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isSatLinkUplinkActive ? 'bg-blue-500 animate-ping' : 'bg-slate-600'}`} />
              <span className={`text-[9px] font-mono ${isSatLinkUplinkActive ? 'text-blue-400' : 'text-slate-500'}`}>
                {isSatLinkUplinkActive ? dict.statusSynchronized : dict.statusDegraded}
              </span>
            </div>
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button onClick={() => alert("Map View Center: 27.7172°N, 85.3240°E")} className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[10px] font-bold text-slate-400 hover:text-white transition outline-none border border-slate-800/60">CENTER</button>
              <button onClick={() => alert("Satellite Tile Layer Active")} className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-[10px] font-bold text-slate-400 hover:text-white transition outline-none border border-slate-800/60">SATELLITE</button>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <motion.div variants={internalComponentRevealVariants} className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{dict.panelAnalyticsTitle}</h3>
                <span className="text-[8px] text-emerald-500 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md">STABLE_v2</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 rounded-xl px-3 py-2 border border-slate-800/60">
                  <p className="text-[9px] text-slate-500 font-semibold uppercase">{dict.lblLatCoordinate}</p>
                  <p className="text-sm font-bold text-white font-mono">{activeHardwareTelemetry.latitudeVector}</p>
                </div>
                <div className="bg-slate-950 rounded-xl px-3 py-2 border border-slate-800/60">
                  <p className="text-[9px] text-slate-500 font-semibold uppercase">{dict.lblLngCoordinate}</p>
                  <p className="text-sm font-bold text-white font-mono">{activeHardwareTelemetry.longitudeVector}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 rounded-xl px-3 py-2 border border-slate-800/60">
                  <p className="text-[9px] text-slate-500 font-semibold uppercase">{dict.lblHwPrecision}</p>
                  <p className="text-sm font-bold text-white font-mono">{activeHardwareTelemetry.hardwareAccuracy}</p>
                </div>
                <div className="bg-slate-950 rounded-xl px-3 py-2 border border-slate-800/60">
                  <p className="text-[9px] text-slate-500 font-semibold uppercase">{dict.lblVelocityHeading}</p>
                  <p className="text-sm font-bold text-white font-mono">{activeHardwareTelemetry.compassHeading}</p>
                </div>
              </div>
              <AnimatePresence>
                {isGeofencePerimeterInjected && (
                  <motion.div variants={internalComponentRevealVariants} initial="hidden" animate="visible" className="p-3 bg-slate-950 border border-amber-500/20 rounded-xl space-y-1.5">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">{dict.lblRadiusBuffer}:</span>
                      <span className="text-amber-400 font-bold">500m Max</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">{dict.lblClusteredNodes}:</span>
                      <span className="text-amber-400 font-bold">{geofenceConfigurationState.activeInterceptiveNodeCount} Online</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <button onClick={toggleBoundaryPerimeterConstraintMatrix} className={`w-full py-3 border font-bold text-xs tracking-wider uppercase rounded-xl transition ${isGeofencePerimeterInjected ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'}`}>
                ⚙️ {isGeofencePerimeterInjected ? dict.btnClearGeofence : dict.btnTriggerGeofence}
              </button>
            </motion.div>

            <div className="flex gap-2">
              {isSatLinkUplinkActive ? (
                <button onClick={executeIsolateGeospatialHardwarePipeline} className="flex-1 py-3 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-400 font-bold text-[10px] rounded-xl transition uppercase tracking-wider">🛑 {dict.btnTerminateUplink}</button>
              ) : (
                <button onClick={executeEstablishGeospatialHardwarePipeline} className="flex-1 py-3 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-[10px] rounded-xl transition uppercase tracking-wider">📡 {dict.btnInitializeUplink}</button>
              )}
            </div>
          </div>
        </motion.section>

        <div className="bg-slate-900/50 border border-slate-800/40 rounded-3xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{dict.panelLogStreamHeader}</h3>
            <span className="text-[9px] text-slate-700 font-mono">SPATIAL BUFFER: {(calculatedByteFootprintSize / 1024).toFixed(2)} KB</span>
          </div>
          <div className="bg-slate-950 rounded-2xl p-3 space-y-1 max-h-28 overflow-y-auto font-mono">
            {activeSystemLogThreadsCollection.length === 0 ? (
              <p className="text-[9px] text-slate-600">{dict.emptyNodesNotice}</p>
            ) : (
              activeSystemLogThreadsCollection.map((logLine, idx) => (
                <p key={idx} className="text-[9px] text-slate-600 leading-relaxed">[{idx + 1}] {logLine}</p>
              ))
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {activeInterfaceAlertToast && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ type: "spring", stiffness: 420, damping: 22 }} className="fixed bottom-6 right-6 bg-slate-900 border-l-4 border-l-blue-500 border border-slate-800 p-3 rounded-xl shadow-2xl max-w-xs z-50">
            <span className="text-[8px] font-bold text-blue-400 uppercase tracking-wider">SPATIAL ENGINE</span>
            <p className="text-[11px] text-slate-200 mt-0.5">{activeInterfaceAlertToast.displayText}</p>
            <span className="text-[8px] text-slate-600 font-mono">{activeInterfaceAlertToast.timestampString}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
