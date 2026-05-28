import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, PhoneIncoming, PhoneMissed,
  Maximize2, Minimize2, Volume2, VolumeX, Sparkles, ArrowLeft
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import useCallStore from '../store/callStore';
import useAuthStore from '../store/authStore';
import { getInitials, getAvatarColor, formatDuration } from '../utils/helpers';
import { getSocket } from '../socket/socket';
import { RTC_CONFIG } from '../utils/constants';

export default function VideoCallPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const {
    callStatus, callType, receiverInfo, isCaller, callDuration,
    isMicEnabled, isCameraEnabled, isFullscreen,
    incomingCall, setCallStatus, endCall,
    toggleMic, toggleCamera, toggleFullscreen, incrementDuration
  } = useCallStore();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const pcRef = useRef(null);
  const timerRef = useRef(null);

  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    if (callStatus === 'connected' || callStatus === 'calling') {
      initMedia();
    }
    return () => {
      cleanupMedia();
    };
  }, [callStatus]);

  useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = setInterval(() => incrementDuration(), 1000);
      setWaiting(false);
    }
    if (callStatus === 'ended' || callStatus === 'idle') {
      clearInterval(timerRef.current);
      setWaiting(true);
    }
    return () => clearInterval(timerRef.current);
  }, [callStatus]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleSignal = async ({ signal }) => {
      if (!pcRef.current) return;
      try {
        if (signal.offer) {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(signal.offer));
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);
          socket.emit('call:signal', { receiverId: receiverInfo?.id, signal: { answer: pcRef.current.localDescription } });
        } else if (signal.answer) {
          if (pcRef.current.remoteDescription === null) {
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(signal.answer));
          }
        } else if (signal.candidate) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(signal.candidate));
        }
      } catch (err) { console.error('Signal error:', err); }
    };

    const handleAccepted = () => {
      setCallStatus('connected');
      createAndSendOffer();
    };

    const handleEnded = () => { endCall(); };

    socket.on('call:signal', handleSignal);
    socket.on('call:accepted', handleAccepted);
    socket.on('call:ended', handleEnded);

    return () => {
      socket.off('call:signal', handleSignal);
      socket.off('call:accepted', handleAccepted);
      socket.off('call:ended', handleEnded);
    };
  }, [receiverInfo]);

  const initMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, frameRate: 24 },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      initPeerConnection();
      if (isCaller) createAndSendOffer();
    } catch (err) {
      console.error('Media error:', err);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        initPeerConnection();
        if (isCaller) createAndSendOffer();
      } catch (e) {
        setCallStatus('ended');
      }
    }
  };

  const initPeerConnection = () => {
    pcRef.current = new RTCPeerConnection(RTC_CONFIG);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pcRef.current.addTrack(track, localStreamRef.current);
      });
    }
    pcRef.current.ontrack = (event) => {
      remoteStreamRef.current = event.streams[0];
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };
    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        const socket = getSocket();
        if (socket) socket.emit('call:signal', { receiverId: receiverInfo?.id, signal: { candidate: event.candidate } });
      }
    };
    pcRef.current.onconnectionstatechange = () => {
      if (pcRef.current.connectionState === 'disconnected' || pcRef.current.connectionState === 'failed') {
        endCall();
      }
    };
  };

  const createAndSendOffer = async () => {
    if (!pcRef.current) return;
    try {
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      const socket = getSocket();
      if (socket) socket.emit('call:signal', { receiverId: receiverInfo?.id, signal: { offer: pcRef.current.localDescription } });
    } catch (err) { console.error('Offer error:', err); }
  };

  const cleanupMedia = () => {
    if (pcRef.current) { pcRef.current.close(); pcRef.current = null; }
    if (localStreamRef.current) { localStreamRef.current.getTracks().forEach((t) => t.stop()); localStreamRef.current = null; }
    remoteStreamRef.current = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  const handleEndCall = () => {
    const socket = getSocket();
    if (socket && receiverInfo?.id) {
      socket.emit('call:end', { receiverId: receiverInfo.id, duration: callDuration });
    }
    cleanupMedia();
    endCall();
    navigate('/chat');
  };

  if (callStatus === 'idle' && !incomingCall) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <PhoneIncoming size={60} className="mx-auto mb-4 opacity-20" />
            <h2 className="text-xl font-bold mb-2">No Active Call</h2>
            <p className="text-gray-500 mb-4">Start a call from your conversations</p>
            <button onClick={() => navigate('/chat')} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1877f2] to-[#4f46e5] text-sm font-semibold">
              Go to Messages
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <div className={'h-screen bg-[#0b0f17] flex flex-col ' + (isFullscreen ? 'fixed inset-0 z-[9999]' : '')}>
      <div className="flex items-center justify-between px-4 py-3 glass-dark z-10">
        <button onClick={() => navigate('/chat')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          <ArrowLeft size={18} />
          Back
        </button>
        <div className="text-center">
          <p className="font-semibold text-sm">{receiverInfo?.name || 'Connecting...'}</p>
          <p className="text-xs text-gray-500">{callStatus === 'connected' ? formatDuration(callDuration) : callStatus}</p>
        </div>
        <button onClick={toggleFullscreen} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10">
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-center bg-black/40">
        <video
          ref={remoteVideoRef}
          autoPlay playsInline
          className="w-full h-full object-cover absolute inset-0"
        />
        {waiting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1877f2] to-[#4f46e5] flex items-center justify-center text-3xl font-bold text-white mb-4 animate-pulse">
              {receiverInfo?.name ? getInitials(receiverInfo.name) : '?'}
            </div>
            <p className="text-lg font-semibold">{receiverInfo?.name || 'User'}</p>
            <p className="text-sm text-gray-400">{callStatus === 'calling' ? 'Calling...' : 'Waiting for connection...'}</p>
            <div className="flex gap-1 mt-3">
              {[0,1,2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#1877f2] animate-bounce" style={{ animationDelay: i * 150 + 'ms' }} />
              ))}
            </div>
          </div>
        )}

        <div className="absolute bottom-24 right-4 w-32 h-44 md:w-40 md:h-56 rounded-2xl overflow-hidden border-2 border-white/20 shadow-elevated z-20">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 px-4 py-5 glass-dark z-10">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={toggleMic}
          className={'w-12 h-12 rounded-full flex items-center justify-center transition-all ' + (isMicEnabled ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500/20 text-red-400')}
        >
          {isMicEnabled ? <Mic size={20} /> : <MicOff size={20} />}
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={toggleCamera}
          className={'w-12 h-12 rounded-full flex items-center justify-center transition-all ' + (isCameraEnabled ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500/20 text-red-400')}
        >
          {isCameraEnabled ? <Video size={20} /> : <VideoOff size={20} />}
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={handleEndCall}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30"
        >
          <PhoneOff size={24} />
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20"
        >
          <Sparkles size={20} />
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/10"
        >
          <Volume2 size={20} />
        </motion.button>
      </div>
    </div>
  );
}
