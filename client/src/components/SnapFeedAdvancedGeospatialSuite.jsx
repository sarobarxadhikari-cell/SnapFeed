import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GEOSPATIAL_SUITE_DICTIONARY = {
  en: {
    suiteTitleHeader: "SnapFeed High-Fidelity Cartographic Visualization Suite",
    suiteSubtitleDesc: "Enterprise hardware-accelerated vector mapping framework running localized tracking buffers.",
    btnInitializeHardwareLink: "Connect Global Orbital Satellites",
    btnDisconnectHardwareLink: "Isolate Telemetry Vector Stream",
    statusSynchronized: "STREAMING_DATA_SYNCHRONIZED",
    statusStandbyReady: "ORBITAL_SOCKET_STANDBY_IDLE",
    fieldLatitudeLabel: "Geospatial Latitude Coordinate Plane",
    fieldLongitudeLabel: "Geospatial Longitude Coordinate Plane",
    fieldPrecisionLabel: "Satellite Precision Boundary Delta",
    fieldBearingLabel: "Hardware Gyro Compass Heading Angle",
    fieldAltitudeLabel: "Calculated Mean Sea Level Elevation",
    fieldVelocityLabel: "Kinematic Terminal Node Velocity Speed",
    panelMetricsHeader: "Dynamic Relational Telemetry Analytics Dashboard",
    panelConsoleHeader: "REAL-TIME RENDERING FRAME BROKER STREAM LOGS",
    toastUplinkActive: "Secure satellite positioning context linked.",
    toastUplinkInactive: "Orbital stream pipeline disconnected cleanly.",
    controlZoomIn: "Zoom In",
    controlZoomOut: "Zoom Out",
    layerVectorRoads: "Vector Cartography Map",
    layerSatelliteVisual: "Photographic Satellite Raster",
    layerTerrainTopography: "Topographic Relief Terrain",
    emptyDiagnosticsMessage: "Waiting for sensor data pipeline validation strings...",
    activeLayersIndicator: "Active Render Pipelines"
  },
  ne: {
    suiteTitleHeader: "स्न्यापफिड हाइ-फिडेलिटी कार्टोग्राफिक भिजुअलाइजेसन सुइट",
    suiteSubtitleDesc: "स्थानीयकृत ट्र्याकिङ बफरहरू चलाउँदै इन्टरप्राइज हार्डवेयर-त्वरित भेक्टर म्यापिङ ढाँचा।",
    btnInitializeHardwareLink: "ग्लोबल अर्बिटल स्याटेलाइट जडान गर्नुहोस्",
    btnDisconnectHardwareLink: "टेलिमेट्री भेक्टर स्ट्रिम विच्छेद गर्नुहोस्",
    statusSynchronized: "डाटा_सिन्क्रोनाइज्ड_स्ट्रिम_सक्रिय",
    statusStandbyReady: "अर्बिटल_सकेट_प्रतीक्षा_स्थिति",
    fieldLatitudeLabel: "भू-स्थानिक अक्षांश निर्देशांक विमान",
    fieldLongitudeLabel: "भू-स्थानिक देशान्तर निर्देशांक विमान",
    fieldPrecisionLabel: "उपग्रह शुद्धता सीमा बफर डेल्टा",
    fieldBearingLabel: "यन्त्र जाइरो कम्पास दिशा कोण",
    fieldAltitudeLabel: "गणना गरिएको समुद्र सतह उचाइ स्थिति",
    fieldVelocityLabel: "यन्त्र गतिशील गति रफ्तार",
    panelMetricsHeader: "गतिशील सापेक्ष टेलिमेट्री ड्यासबोर्ड विश्लेषण",
    panelConsoleHeader: "वास्तविक समय रेन्डरिङ फ्रेम ब्रोकर स्ट्रिम लगहरू",
    toastUplinkActive: "क्रिप्टोग्राफिक सुरक्षित उपग्रह पोजिसनिङ सिस्टम जडान भयो।",
    toastUplinkInactive: "लोकेसन स्ट्रिम अफलाइन अनुक्रम पूरा भयो।",
    controlZoomIn: "नक्सा आकार बढाउनुहोस्",
    controlZoomOut: "नक्सा आकार घटाउनुहोस्",
    layerVectorRoads: "मानक भेक्टर सडक नक्सा",
    layerSatelliteVisual: "इमर्सिभ उपग्रह फोटोग्राफिक नक्सा",
    layerTerrainTopography: "टोपोग्राफिक भू-बनोट उचाइ नक्सा",
    emptyDiagnosticsMessage: "सेन्सर डाटा पाइपलाइन प्रमाणीकरण स्ट्रिमहरूको प्रतीक्षा गर्दै...",
    activeLayersIndicator: "सक्रिय भेक्टर रेन्डर पाइपलाइनहरू"
  }
};

const HUGE_GEOSPATIAL_TELEMETRY_LOGS_CACHE = Array.from({ length: 320 }, (_, index) => {
  const simulatedLatOffset = (Math.random() * 0.1 - 0.05).toFixed(6);
  const simulatedLngOffset = (Math.random() * 0.1 - 0.05).toFixed(6);
  return {
    uniqueTransactionId: `sf_carto_pipeline_node_hash_${index + 25000}`,
    cryptographicValidationDigest: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    payloadAllocationSizeInBytes: Math.floor(Math.random() * 9500) + 3500,
    isUplinkRoutingNodeStable: index % 3 !== 0,
    hardwareTelemetrySensorLatencyMs: (Math.random() * 14.8 + 0.1).toFixed(2),
    computedVectorCoordinates: { lat: 27.717244 + parseFloat(simulatedLatOffset), lng: 85.324021 + parseFloat(simulatedLngOffset) },
    emissionLoggedTimestamp: new Date(Date.now() - index * 250).toLocaleTimeString()
  };
});

const coreContainerLayoutAnimationVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.99 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 350, damping: 26, staggerChildren: 0.06 } }
};

const internalComponentRevealVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 400, damping: 22 } }
};

const mapIndicatorPulseVariants = {
  pulse: { scale: [1, 1.12, 1], opacity: [0.9, 1, 0.9], transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" } }
};

export default function SnapFeedAdvancedGeospatialSuite() {
  const [suiteLanguage, setSuiteLanguage] = useState('en');
  const [isHardwareUplinkConnected, setIsHardwareUplinkConnected] = useState(false);
  const [activeMapLayerType, setActiveMapLayerType] = useState('satellite');
  const [mapZoomLevelScale, setMapZoomLevelScale] = useState(14);
  const [activeSelectedNodeId, setActiveSelectedNodeId] = useState('sf_carto_pipeline_node_hash_25000');
  const [realtimeTelemetryCoordinates, setRealtimeTelemetryCoordinates] = useState({
    lat: "27.717244", lng: "85.324021", precision: "3.2m", bearing: "142.5°", altitude: "1,340m", velocity: "0.0 km/h"
  });
  const [computedTotalStorageFootprintBytes, setComputedTotalStorageFootprintBytes] = useState(0);
  const [liveStreamLogsTerminalCollection, setLiveStreamLogsTerminalCollection] = useState([]);
  const [systemAlertOverlayToast, setSystemAlertOverlayToast] = useState(null);

  const activeSensorStreamWatcherRef = useRef(null);
  const dict = GEOSPATIAL_SUITE_DICTIONARY[suiteLanguage] || GEOSPATIAL_SUITE_DICTIONARY['en'];

  useEffect(() => {
    let massByteSumAccumulator = 0;
    const transientTraceCollector = [];
    HUGE_GEOSPATIAL_TELEMETRY_LOGS_CACHE.forEach((dataNode, index) => {
      massByteSumAccumulator += dataNode.payloadAllocationSizeInBytes;
      if (index < 10) {
        transientTraceCollector.push(`[SYSTEM ORBITAL] Mapping active ledger node ${dataNode.uniqueTransactionId}. Target processing delta: ${dataNode.hardwareTelemetrySensorLatencyMs}ms`);
      }
    });
    setComputedTotalStorageFootprintBytes(massByteSumAccumulator);
    setLiveStreamLogsTerminalCollection(transientTraceCollector);
    return () => terminateActiveGeospatialSensorPipeline();
  }, []);

  const initializeActiveGeospatialSensorPipeline = () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support GPS location.");
      return;
    }
    setIsHardwareUplinkConnected(true);
    activeSensorStreamWatcherRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, heading, altitude, speed } = position.coords;
        setRealtimeTelemetryCoordinates({
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6),
          precision: `${accuracy.toFixed(1)}m`,
          bearing: heading ? `${heading.toFixed(1)}°` : "12.4°",
          altitude: altitude ? `${altitude.toFixed(1)}m` : "1,342.8m",
          velocity: speed ? `${(speed * 3.6).toFixed(1)} km/h` : "4.2 km/h"
        });
        setLiveStreamLogsTerminalCollection(prevLogs => [
          `[GPS INTERCEPT] Committing coordinates: Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}, Vel: ${speed ? (speed * 3.6).toFixed(1) : "4.2"} km/h at ${new Date().toLocaleTimeString()}`,
          ...prevLogs.slice(0, 9)
        ]);
      },
      (hardwareSensorError) => {
        setLiveStreamLogsTerminalCollection(prevLogs => [
          `[HARDWARE WARN] Sensor degradation flag detected: ${hardwareSensorError.code} at ${new Date().toLocaleTimeString()}`,
          ...prevLogs.slice(0, 9)
        ]);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
    triggerSystemNotificationOverlayToast(dict.toastUplinkActive);
  };

  const terminateActiveGeospatialSensorPipeline = () => {
    if (activeSensorStreamWatcherRef.current !== null) {
      navigator.geolocation.clearWatch(activeSensorStreamWatcherRef.current);
      activeSensorStreamWatcherRef.current = null;
    }
    setIsHardwareUplinkConnected(false);
    triggerSystemNotificationOverlayToast(dict.toastUplinkInactive);
  };

  const triggerSystemNotificationOverlayToast = (messageContent) => {
    setSystemAlertOverlayToast({
      id: `toast_token_${Date.now()}`,
      message: messageContent,
      timestampString: new Date().toLocaleTimeString()
    });
    setTimeout(() => setSystemAlertOverlayToast(null), 3400);
  };

  const incrementMapZoomLevelScaleMetric = () => {
    if (mapZoomLevelScale < 19) setMapZoomLevelScale(prev => prev + 1);
  };

  const decrementMapZoomLevelScaleMetric = () => {
    if (mapZoomLevelScale > 3) setMapZoomLevelScale(prev => prev - 1);
  };

  const handleHistoricalLedgerNodeSelection = (nodeId, latVal, lngVal) => {
    setActiveSelectedNodeId(nodeId);
    setRealtimeTelemetryCoordinates(prev => ({
      ...prev,
      lat: latVal.toFixed(6),
      lng: lngVal.toFixed(6)
    }));
    setLiveStreamLogsTerminalCollection(prevLogs => [
      `[ROUTING TRACE] Shifted target map inspection point to [${nodeId}] at ${new Date().toLocaleTimeString()}`,
      ...prevLogs.slice(0, 9)
    ]);
  };

  return (
    <motion.main
      variants={coreContainerLayoutAnimationVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col relative z-10 space-y-6"
    >
      <div className="w-full bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between backdrop-blur-md">
        <div className="space-y-0.5">
          <h1 className="text-xs font-black text-white tracking-widest uppercase">{dict.suiteTitleHeader}</h1>
          <p className="text-[11px] text-slate-500 font-medium">{dict.suiteSubtitleDesc}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-slate-600 font-mono bg-slate-950/60 px-2.5 py-1 rounded-md border border-slate-800/40">
            {dict.activeLayersIndicator}: <span className="text-emerald-400">4_ACTIVE</span>
          </span>
          <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800/60">
            <button onClick={() => setSuiteLanguage('en')} className={`px-2.5 py-1 text-[10px] font-black rounded-md transition ${suiteLanguage === 'en' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>EN</button>
            <button onClick={() => setSuiteLanguage('ne')} className={`px-2.5 py-1 text-[10px] font-black rounded-md transition ${suiteLanguage === 'ne' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>ने</button>
          </div>
        </div>
      </div>

      <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-2 space-y-2 max-h-[600px] overflow-y-auto pr-1">
          <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest sticky top-0 bg-slate-950 py-2 z-10">Orbital Cache Nodes</h3>
          {HUGE_GEOSPATIAL_TELEMETRY_LOGS_CACHE.slice(0, 45).map((nodeItem) => {
            const isNodeItemActiveSelected = activeSelectedNodeId === nodeItem.uniqueTransactionId;
            return (
              <button
                key={nodeItem.uniqueTransactionId}
                onClick={() => handleHistoricalLedgerNodeSelection(nodeItem.uniqueTransactionId, nodeItem.computedVectorCoordinates.lat, nodeItem.computedVectorCoordinates.lng)}
                className={`w-full text-left p-2.5 rounded-xl border font-mono transition block outline-none ${isNodeItemActiveSelected ? 'bg-blue-600/10 border-blue-500/40' : 'bg-slate-950/40 border-slate-900 hover:bg-slate-950/80'}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] ${isNodeItemActiveSelected ? 'text-blue-400 font-bold' : 'text-slate-400'}`}>...{nodeItem.uniqueTransactionId.substring(24)}</span>
                  <span className="text-[8px] text-slate-600">{nodeItem.emissionLoggedTimestamp}</span>
                </div>
                <p className="text-[8px] text-slate-600 mt-0.5">
                  Lat: {nodeItem.computedVectorCoordinates.lat.toFixed(4)}°, Lng: {nodeItem.computedVectorCoordinates.lng.toFixed(4)}°
                </p>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            {['vector', 'satellite', 'terrain'].map(layer => (
              <button
                key={layer}
                onClick={() => setActiveMapLayerType(layer)}
                className={`flex-1 py-2 text-[10px] font-black tracking-wider uppercase rounded-xl transition ${
                  activeMapLayerType === layer
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-900 border border-slate-800/60 text-slate-500 hover:text-slate-300'
                }`}
              >
                {layer === 'vector' ? dict.layerVectorRoads.split(' ')[0] : layer === 'satellite' ? 'Satellite' : 'Terrain'}
              </button>
            ))}
          </div>

          <div className="relative h-[420px] rounded-2xl bg-slate-950 border border-slate-800/60 overflow-hidden">
            {activeMapLayerType === 'satellite' && (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.04)_0%,transparent_70%)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.06)_0%,transparent_50%)]" />
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="absolute rounded-full bg-emerald-500/5 border border-emerald-500/10" style={{ width: `${40 + i * 30}px`, height: `${40 + i * 30}px`, left: `${20 + i * 8}%`, top: `${30 + (i % 3) * 10}%` }} />
                ))}
              </div>
            )}
            {activeMapLayerType === 'vector' && (
              <div className="absolute inset-0">
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)', backgroundSize: '25px 25px' }} />
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="absolute h-px bg-blue-500/10" style={{ width: `${30 + Math.random() * 40}%`, left: `${5 + i * 8}%`, top: `${20 + (i % 5) * 15}%`, transform: `rotate(${i * 25}deg)` }} />
                ))}
              </div>
            )}
            {activeMapLayerType === 'terrain' && (
              <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 via-emerald-900/5 to-blue-900/10">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="absolute w-full" style={{ height: `${15 + i * 8}px`, top: `${30 + i * 10}%`, background: `rgba(180, 130, 50, ${0.03 + i * 0.01})`, borderTop: '1px solid rgba(180,130,50,0.06)', borderRadius: `${80 + i * 30}% ${40 + i * 20}% 0 0` }} />
                ))}
              </div>
            )}

            <motion.div variants={mapIndicatorPulseVariants} animate="pulse" className="absolute inset-0 m-auto w-14 h-14 z-20 flex flex-col items-center justify-center pointer-events-none">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm bg-slate-950 border shadow-2xl transition-all ${isHardwareUplinkConnected ? 'border-blue-500 text-blue-400 ring-4 ring-blue-500/10 scale-110' : 'border-slate-800 text-slate-600'}`}>
                📍
              </div>
              {isHardwareUplinkConnected && <div className="w-20 h-20 bg-blue-500/5 rounded-full absolute animate-ping" />}
            </motion.div>

            <div className="absolute right-3 bottom-3 flex flex-col gap-1.5 z-10">
              <button onClick={incrementMapZoomLevelScaleMetric} className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800/80 hover:bg-slate-800 flex items-center justify-center text-white text-sm font-bold transition">+</button>
              <button onClick={decrementMapZoomLevelScaleMetric} className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800/80 hover:bg-slate-800 flex items-center justify-center text-white text-sm font-bold transition">−</button>
            </div>

            <div className="absolute bottom-3 left-3 z-10 bg-slate-950/80 border border-slate-800/60 rounded-lg px-2.5 py-1 text-[8px] font-mono text-slate-500">
              SCALE_ZOOM: {mapZoomLevelScale}x
            </div>

            <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
              <div className={`w-1.5 h-1.5 rounded-full ${isHardwareUplinkConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
              <span className={`text-[9px] font-mono ${isHardwareUplinkConnected ? 'text-emerald-400' : 'text-slate-500'}`}>
                {isHardwareUplinkConnected ? dict.statusSynchronized : dict.statusStandbyReady}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-4">
          <motion.div variants={internalComponentRevealVariants} className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-4 space-y-3">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{dict.panelMetricsHeader}</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-950 rounded-xl px-3 py-2 border border-slate-800/60">
                <p className="text-[8px] text-slate-500 font-semibold uppercase">{dict.fieldLatitudeLabel}</p>
                <p className="text-xs font-bold text-white font-mono">{realtimeTelemetryCoordinates.lat}°N</p>
              </div>
              <div className="bg-slate-950 rounded-xl px-3 py-2 border border-slate-800/60">
                <p className="text-[8px] text-slate-500 font-semibold uppercase">{dict.fieldLongitudeLabel}</p>
                <p className="text-xs font-bold text-white font-mono">{realtimeTelemetryCoordinates.lng}°E</p>
              </div>
              <div className="bg-slate-950 rounded-xl px-3 py-2 border border-slate-800/60">
                <p className="text-[8px] text-slate-500 font-semibold uppercase">{dict.fieldAltitudeLabel}</p>
                <p className="text-xs font-bold text-white font-mono">{realtimeTelemetryCoordinates.altitude}</p>
              </div>
              <div className="bg-slate-950 rounded-xl px-3 py-2 border border-slate-800/60">
                <p className="text-[8px] text-slate-500 font-semibold uppercase">Precision</p>
                <p className="text-xs font-bold text-white font-mono">{realtimeTelemetryCoordinates.precision}</p>
              </div>
              <div className="bg-slate-950 rounded-xl px-3 py-2 border border-slate-800/60">
                <p className="text-[8px] text-slate-500 font-semibold uppercase">Bearing</p>
                <p className="text-xs font-bold text-white font-mono">{realtimeTelemetryCoordinates.bearing}</p>
              </div>
              <div className="bg-slate-950 rounded-xl px-3 py-2 border border-slate-800/60">
                <p className="text-[8px] text-slate-500 font-semibold uppercase">{dict.fieldVelocityLabel}</p>
                <p className="text-xs font-bold text-white font-mono">{realtimeTelemetryCoordinates.velocity}</p>
              </div>
            </div>
            <button
              onClick={isHardwareUplinkConnected ? terminateActiveGeospatialSensorPipeline : initializeActiveGeospatialSensorPipeline}
              className={`w-full py-3 font-bold text-[10px] uppercase tracking-wider rounded-xl border transition ${
                isHardwareUplinkConnected
                  ? 'bg-red-600/10 border-red-500/30 text-red-400 hover:bg-red-600/20'
                  : 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20'
              }`}
            >
              {isHardwareUplinkConnected ? `🛑 ${dict.btnDisconnectHardwareLink}` : `📡 ${dict.btnInitializeHardwareLink}`}
            </button>
          </motion.div>

          <div className="bg-slate-900/50 border border-slate-800/40 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[9px] font-bold text-slate-500 uppercase">{dict.panelConsoleHeader}</h3>
              <span className="text-[8px] text-slate-700 font-mono">DEPTH: {(computedTotalStorageFootprintBytes / 1024).toFixed(2)} KB</span>
            </div>
            <div className="bg-slate-950 rounded-xl p-2.5 space-y-1 max-h-28 overflow-y-auto font-mono">
              {liveStreamLogsTerminalCollection.length === 0 ? (
                <p className="text-[8px] text-slate-600">{dict.emptyDiagnosticsMessage}</p>
              ) : (
                liveStreamLogsTerminalCollection.map((logLine, logIndex) => (
                  <p key={logIndex} className="text-[8px] text-slate-600 leading-relaxed">[{logIndex + 1}] {logLine}</p>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/50 pt-4 flex items-center justify-center text-[9px] text-slate-700">
        <span>© 2026 SnapFeed Global Technologies Corp. Cartographic pipeline compiled within secure file boundaries.</span>
      </footer>

      <AnimatePresence>
        {systemAlertOverlayToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className="fixed bottom-6 right-6 bg-slate-900 border-l-4 border-l-emerald-500 border border-slate-800 p-3 rounded-xl shadow-2xl max-w-xs z-50"
          >
            <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider">GEOSPATIAL SUITE</span>
            <p className="text-[11px] text-slate-200 mt-0.5">{systemAlertOverlayToast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
