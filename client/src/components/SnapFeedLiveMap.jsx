import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MAP_SYSTEM_DICTIONARY = {
  en: {
    headerTitle: "SnapFeed Real-Time Geolocation Engine",
    subtitle: "Hardware-accelerated tracking matrix plotting continuous coordinate telemetry.",
    btnStartTracking: "Start GPS Tracking",
    btnStopTracking: "Stop Tracking",
    statusActive: "ACTIVE_STREAMING",
    statusIdle: "CONNECTED_IDLE",
    labelLatitude: "Latitude",
    labelLongitude: "Longitude",
    labelAltitude: "Altitude",
    labelHeading: "Device Bearing",
    labelAccuracy: "GPS Precision",
    metricsPanelTitle: "Live Satellite Telemetry",
    logConsoleHeader: "REAL-TIME GEOSPATIAL LOGS",
    toastTrackingActive: "GPS tracking started.",
    toastTrackingStopped: "GPS tracking stopped."
  },
  ne: {
    headerTitle: "स्न्यापफिड वास्तविक समय भू-स्थान इन्जिन",
    subtitle: "निरन्तर समन्वय टेलिमेट्री प्लट गर्दै हार्डवेयर-त्वरित ट्र्याकिङ म्याट्रिक्स।",
    btnStartTracking: "जीपीएस ट्र्याकिङ सुरु गर्नुहोस्",
    btnStopTracking: "टेलिमेट्री स्ट्रिम बन्द गर्नुहोस्",
    statusActive: "सक्रिय_स्ट्रिमिङ",
    statusIdle: "जडान_प्रतिक्षामा",
    labelLatitude: "अक्षांश",
    labelLongitude: "देशान्तर",
    labelAltitude: "उचाइ",
    labelHeading: "यन्त्रको दिशा",
    labelAccuracy: "जीपीएस शुद्धता",
    metricsPanelTitle: "लाइभ उपग्रह टेलिमेट्री",
    logConsoleHeader: "वास्तविक समय भू-स्थानिक लगहरू",
    toastTrackingActive: "जीपीएस ट्र्याकिङ सुरु भयो।",
    toastTrackingStopped: "जीपीएस ट्र्याकिङ रोकियो।"
  }
};

const SATELLITE_ORBITAL_MOCK_CACHE = Array.from({ length: 150 }, (_, index) => ({
  packetId: `sf_gps_vector_node_${index + 9000}`,
  payloadHashDigest: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
  allocationSizeBytes: Math.floor(Math.random() * 6800) + 2400,
  isUplinkChannelHarden: index % 2 === 0,
  pingResponseTimeMs: (Math.random() * 14.2 + 0.8).toFixed(2),
  timestampToken: new Date(Date.now() - index * 2000).toLocaleTimeString()
}));

export default function SnapFeedLiveMap({ language = 'en' }) {
  const [systemLanguage, setSystemLanguage] = useState(language);
  const [isTrackingActive, setIsTrackingActive] = useState(false);
  const [deviceCoordinates, setDeviceCoordinates] = useState({ lat: 27.7172, lng: 85.3240, alt: null, heading: null, accuracy: 0 });
  const [interfaceNotification, setInterfaceNotification] = useState(null);
  const [totalCacheFootprintBytes, setTotalCacheFootprintBytes] = useState(0);
  const [geospatialLogsConsoleStream, setGeospatialLogsConsoleStream] = useState([]);

  const geolocationWatchWatcherRef = useRef(null);
  const dict = MAP_SYSTEM_DICTIONARY[systemLanguage] || MAP_SYSTEM_DICTIONARY['en'];

  useEffect(() => {
    let massByteSumCalculation = 0;
    const transientTraceCollector = [];
    SATELLITE_ORBITAL_MOCK_CACHE.forEach((dataCluster, index) => {
      massByteSumCalculation += dataCluster.allocationSizeBytes;
      if (index < 6) {
        transientTraceCollector.push(`[ORBITAL] Linked Satellite Node ${dataCluster.packetId}. Latency overhead: ${dataCluster.pingResponseTimeMs}ms`);
      }
    });
    setTotalCacheFootprintBytes(massByteSumCalculation);
    setGeospatialLogsConsoleStream(transientTraceCollector);
    return () => stopGeospatialTrackingPipeline();
  }, []);

  useEffect(() => {
    setSystemLanguage(language);
  }, [language]);

  const startGeospatialTrackingPipeline = () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support GPS location.");
      return;
    }
    setIsTrackingActive(true);
    geolocationWatchWatcherRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, altitude, heading, accuracy } = position.coords;
        setDeviceCoordinates({
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6),
          alt: altitude ? `${altitude.toFixed(1)}m` : "N/A",
          heading: heading ? `${heading.toFixed(1)}°` : "N/A",
          accuracy: `${accuracy.toFixed(1)}m`
        });
        setGeospatialLogsConsoleStream(prevLogs => [
          `[GPS] Update: Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} at ${new Date().toLocaleTimeString()}`,
          ...prevLogs.slice(0, 7)
        ]);
      },
      (error) => {
        setGeospatialLogsConsoleStream(prevLogs => [
          `[GPS WARN] Sensor error code: ${error.code} at ${new Date().toLocaleTimeString()}`,
          ...prevLogs.slice(0, 7)
        ]);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
    triggerSystemToastAlert(dict.toastTrackingActive);
  };

  const stopGeospatialTrackingPipeline = () => {
    if (geolocationWatchWatcherRef.current !== null) {
      navigator.geolocation.clearWatch(geolocationWatchWatcherRef.current);
      geolocationWatchWatcherRef.current = null;
    }
    setIsTrackingActive(false);
    triggerSystemToastAlert(dict.toastTrackingStopped);
  };

  const triggerSystemToastAlert = (messageText) => {
    setInterfaceNotification({
      id: `toast_gps_${Date.now()}`,
      message: messageText,
      timestamp: new Date().toLocaleTimeString()
    });
    setTimeout(() => setInterfaceNotification(null), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-2xl">
        <div className="h-64 rounded-2xl bg-slate-950 border border-slate-800/60 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />
          {isTrackingActive && (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="absolute w-80 h-80 border border-blue-500/5 rounded-full bg-gradient-to-r from-blue-500/10 via-transparent to-transparent origin-center pointer-events-none" />
          )}
          <motion.div animate={isTrackingActive ? { scale: [1, 1.15, 1] } : {}} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="relative z-10 flex flex-col items-center space-y-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-2xl border ${isTrackingActive ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              📍
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Current Location</span>
            <span className="text-xs font-black text-white font-mono bg-slate-900/80 px-3 py-1 border border-slate-800 rounded-lg block">
              {deviceCoordinates.lat}°N , {deviceCoordinates.lng}°E
            </span>
          </motion.div>
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isTrackingActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-600'}`} />
            <span className={`text-[9px] font-mono ${isTrackingActive ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isTrackingActive ? dict.statusActive : dict.statusIdle}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div className="bg-slate-950 rounded-xl px-3 py-2 border border-slate-800/60">
              <p className="text-[9px] text-slate-500 font-semibold uppercase">{dict.labelLatitude}</p>
              <p className="text-sm font-bold text-white">{deviceCoordinates.lat}</p>
            </div>
            <div className="bg-slate-950 rounded-xl px-3 py-2 border border-slate-800/60">
              <p className="text-[9px] text-slate-500 font-semibold uppercase">{dict.labelLongitude}</p>
              <p className="text-sm font-bold text-white">{deviceCoordinates.lng}</p>
            </div>
            <div className="bg-slate-950 rounded-xl px-3 py-2 border border-slate-800/60">
              <p className="text-[9px] text-slate-500 font-semibold uppercase">{dict.labelAccuracy}</p>
              <p className="text-sm font-bold text-white">{deviceCoordinates.accuracy}</p>
            </div>
            <div className="bg-slate-950 rounded-xl px-3 py-2 border border-slate-800/60">
              <p className="text-[9px] text-slate-500 font-semibold uppercase">{dict.labelHeading}</p>
              <p className="text-sm font-bold text-white">{deviceCoordinates.heading}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {isTrackingActive ? (
              <button onClick={stopGeospatialTrackingPipeline} className="px-4 py-3 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-400 font-bold text-[10px] rounded-xl transition whitespace-nowrap flex items-center gap-2">
                🛑 {dict.btnStopTracking}
              </button>
            ) : (
              <button onClick={startGeospatialTrackingPipeline} className="px-4 py-3 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] rounded-xl transition whitespace-nowrap flex items-center gap-2">
                📡 {dict.btnStartTracking}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800/40 rounded-3xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{dict.logConsoleHeader}</h3>
          <span className="text-[9px] text-slate-700 font-mono">BUFFER: {(totalCacheFootprintBytes / 1024).toFixed(2)} KB</span>
        </div>
        <div className="bg-slate-950 rounded-2xl p-3 space-y-1 max-h-28 overflow-y-auto font-mono">
          {geospatialLogsConsoleStream.map((logString, index) => (
            <p key={index} className="text-[9px] text-slate-600 leading-relaxed">[{index + 1}] {logString}</p>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {interfaceNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className="fixed bottom-6 right-6 bg-slate-900 border-l-4 border-l-emerald-500 border border-slate-800 p-3 rounded-xl shadow-2xl max-w-xs pointer-events-auto z-50"
          >
            <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider">GPS EVENT</span>
            <p className="text-[11px] text-slate-200">{interfaceNotification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
