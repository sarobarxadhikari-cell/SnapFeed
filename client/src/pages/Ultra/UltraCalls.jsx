import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, Mic, MicOff, VideoOff, PhoneOff, Maximize, Minimize } from 'lucide-react';
import useCallStore from '../../store/callStore';

export default function UltraCalls() {
  const navigate = useNavigate();
  const { callStatus, startCall } = useCallStore();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval;
    if (callStatus === 'connected') {
      interval = setInterval(() => setDuration((d) => d + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Remote video */}
      <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#ffd84d]/20 to-[#ff6b35]/20 flex items-center justify-center">
          <Video size={48} className="text-white/30" />
        </div>

        {/* Call timer */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-1.5">
          <p className="text-white text-sm font-medium">
            {callStatus === 'connected' ? formatDuration(duration) : callStatus === 'ringing' ? 'Ringing...' : 'Call ended'}
          </p>
        </div>

        {/* Remote info */}
        <div className="absolute bottom-4 left-4">
          <p className="text-white font-semibold">Sam Wilson</p>
        </div>
      </div>

      {/* Local video (PiP) */}
      <div className="absolute top-4 right-4 w-28 h-44 rounded-2xl bg-gray-800 border-2 border-white/20 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <Video size={24} className="text-white/30" />
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 bg-gradient-to-t from-black to-transparent">
        <div className="flex items-center justify-center gap-6">
          <button onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isMuted ? 'bg-[#ff3b30]' : 'bg-white/10'
            }`}>
            {isMuted ? <MicOff size={22} className="text-white" /> : <Mic size={22} className="text-white" />}
          </button>
          <button onClick={() => navigate('/ultra')}
            className="w-16 h-16 rounded-full bg-[#ff3b30] flex items-center justify-center">
            <PhoneOff size={24} className="text-white" />
          </button>
          <button onClick={() => setIsCameraOff(!isCameraOff)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isCameraOff ? 'bg-[#ff3b30]' : 'bg-white/10'
            }`}>
            {isCameraOff ? <VideoOff size={22} className="text-white" /> : <Video size={22} className="text-white" />}
          </button>
          <button onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
            {isFullscreen ? <Minimize size={22} className="text-white" /> : <Maximize size={22} className="text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}
