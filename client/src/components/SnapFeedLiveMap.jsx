import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MAP_SYSTEM_DICTIONARY = {
  en: {
    headerTitle: "SnapFeed Real-Time World Map",
    subtitle: "Live GPS tracking with OpenStreetMap tiles.",
    btnStartTracking: "Start GPS Tracking",
    btnStopTracking: "Stop Tracking",
    statusActive: "LIVE_TRACKING",
    statusIdle: "STANDBY",
    labelLatitude: "Latitude",
    labelLongitude: "Longitude",
    labelAltitude: "Altitude",
    labelHeading: "Bearing",
    labelAccuracy: "GPS Accuracy",
    metricsPanelTitle: "Live GPS Data",
    logConsoleHeader: "GPS LOGS",
    toastTrackingActive: "GPS tracking started.",
    toastTrackingStopped: "GPS tracking stopped."
  },
  ne: {
    headerTitle: "स्न्यापफिड वास्तविक समय विश्व नक्सा",
    subtitle: "लाइभ GPS ट्र्याकिङ OpenStreetMap टाइल्सको साथ।",
    btnStartTracking: "GPS ट्र्याकिङ सुरु गर्नुहोस्",
    btnStopTracking: "ट्र्याकिङ बन्द गर्नुहोस्",
    statusActive: "लाइभ_ट्र्याकिङ",
    statusIdle: "प्रतीक्षा",
    labelLatitude: "अक्षांश",
    labelLongitude: "देशान्तर",
    labelAltitude: "उचाइ",
    labelHeading: "दिशा",
    labelAccuracy: "GPS शुद्धता",
    metricsPanelTitle: "लाइभ GPS डाटा",
    logConsoleHeader: "GPS लगहरू",
    toastTrackingActive: "GPS ट्र्याकिङ सुरु भयो।",
    toastTrackingStopped: "GPS ट्र्याकिङ रोकियो।"
  }
};

export default function SnapFeedLiveMap({ language = 'en' }) {
  const [systemLanguage, setSystemLanguage] = useState(language);
  const [isTrackingActive, setIsTrackingActive] = useState(false);
  const [deviceCoordinates, setDeviceCoordinates] = useState({ lat: 27.7172, lng: 85.3240, alt: null, heading: null, accuracy: 0 });
  const [interfaceNotification, setInterfaceNotification] = useState(null);
  const [geospatialLogsConsoleStream, setGeospatialLogsConsoleStream] = useState([]);

  const geolocationWatchWatcherRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const dict = MAP_SYSTEM_DICTIONARY[systemLanguage] || MAP_SYSTEM_DICTIONARY['en'];

  useEffect(() => {
    setSystemLanguage(language);
  }, [language]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;
    if (typeof L === 'undefined') return;

    const map = L.map(mapContainerRef.current, {
      center: [27.7172, 85.3240],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      className: 'map-tiles'
    }).addTo(map);

    const marker = L.circleMarker([27.7172, 85.3240], {
      radius: 8,
      fillColor: '#3b82f6',
      color: '#93c5fd',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.6
    }).addTo(map);

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update marker position
  useEffect(() => {
    if (!markerRef.current || !mapInstanceRef.current) return;
    const lat = parseFloat(deviceCoordinates.lat);
    const lng = parseFloat(deviceCoordinates.lng);
    if (isNaN(lat) || isNaN(lng)) return;
    markerRef.current.setLatLng([lat, lng]);
    if (isTrackingActive) {
      mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom(), { animate: true });
    }
  }, [deviceCoordinates, isTrackingActive]);

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
          `[GPS] Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} at ${new Date().toLocaleTimeString()}`,
          ...prevLogs.slice(0, 7)
        ]);
      },
      (error) => {
        setGeospatialLogsConsoleStream(prevLogs => [
          `[GPS WARN] Error code: ${error.code} at ${new Date().toLocaleTimeString()}`,
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
        <div ref={mapContainerRef} className="h-72 rounded-2xl overflow-hidden border border-slate-800/60 relative" style={{ zIndex: 1 }}>
          {!mapInstanceRef.current && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
              <p className="text-xs text-slate-500">Loading map...</p>
            </div>
          )}
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
          <span className={`text-[9px] font-mono ${isTrackingActive ? 'text-emerald-500' : 'text-slate-700'}`}>
            {isTrackingActive ? '● LIVE' : '○ IDLE'}
          </span>
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
