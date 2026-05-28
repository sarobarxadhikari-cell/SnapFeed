import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

export default function SnapFeedVideoCall({ socket, currentUserId, targetUser, isIncoming, offer, onEndCall }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [callState, setCallState] = useState(isIncoming ? 'ringing' : 'connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localStreamRef = useRef(null);
  const durationIntervalRef = useRef(null);
  const setupDone = useRef(false);

  useEffect(() => {
    if (isIncoming && offer) {
      setupIncomingCall();
    } else if (!isIncoming) {
      setupOutgoingCall();
    }
    return () => { cleanup(); };
  }, []);

  useEffect(() => {
    if (callState === 'connected') {
      durationIntervalRef.current = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    }
    return () => clearInterval(durationIntervalRef.current);
  }, [callState]);

  const setupOutgoingCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionRef.current = pc;

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('ice_candidate', { to: targetUser._id, candidate: event.candidate.toJSON() });
        }
      };

      pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        if (state === 'connected') setCallState('connected');
        if (state === 'failed' || state === 'disconnected') endCall();
      };

      const o = await pc.createOffer();
      await pc.setLocalDescription(o);

      socket.emit('call_offer', { to: targetUser._id, offer: { sdp: o.sdp, type: o.type }, from: currentUserId });
      setCallState('ringing');

      socket.on('call_answer', async ({ answer }) => {
        try {
          if (pc.signalingState === 'have-local-offer') {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
            setCallState('connected');
          }
        } catch (e) { console.error('Answer error:', e); }
      });

      socket.on('ice_candidate', async ({ candidate }) => {
        try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (e) { console.error('ICE error:', e); }
      });

      socket.on('call_end', () => endCall());
    } catch (err) {
      console.error('Camera/mic error:', err);
      endCall();
    }
  };

  const setupIncomingCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionRef.current = pc;

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('ice_candidate', { to: targetUser._id, candidate: event.candidate.toJSON() });
        }
      };

      pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        if (state === 'connected') setCallState('connected');
        if (state === 'failed' || state === 'disconnected') endCall();
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      socket.on('ice_candidate', async ({ candidate }) => {
        try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (e) { console.error('ICE error:', e); }
      });

      socket.on('call_end', () => endCall());

      const a = await pc.createAnswer();
      await pc.setLocalDescription(a);

      socket.emit('call_answer', { to: targetUser._id, answer: { sdp: a.sdp, type: a.type } });
      setCallState('connected');
    } catch (err) {
      console.error('Incoming call error:', err);
      endCall();
    }
  };

  const cleanup = () => {
    if (peerConnectionRef.current) { peerConnectionRef.current.close(); peerConnectionRef.current = null; }
    if (localStreamRef.current) { localStreamRef.current.getTracks().forEach(t => t.stop()); localStreamRef.current = null; }
    if (socket) { socket.off('call_answer'); socket.off('ice_candidate'); socket.off('call_end'); }
    clearInterval(durationIntervalRef.current);
  };

  const endCall = () => {
    if (socket) socket.emit('call_end', { to: targetUser._id });
    cleanup();
    onEndCall();
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(t => { t.enabled = isMuted; });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(t => { t.enabled = isVideoOff; });
      setIsVideoOff(!isVideoOff);
    }
  };

  const formatTime = (sec) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-col items-center justify-center">
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white overflow-hidden">
            {targetUser.avatar ? <img src={targetUser.avatar} className="w-full h-full object-cover" /> : targetUser.fullName?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{targetUser.fullName}</p>
            <p className="text-[10px] text-blue-400">
              {callState === 'connecting' && 'Connecting...'}
              {callState === 'ringing' && 'Ringing...'}
              {callState === 'connected' && formatTime(callDuration)}
              {callState === 'failed' && 'Call failed'}
            </p>
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-lg aspect-video">
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full rounded-2xl bg-slate-800 object-cover" />
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="absolute bottom-4 right-4 w-32 h-24 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        </motion.div>
      </div>

      <div className="flex items-center gap-6 mt-8">
        <button onClick={toggleMute} className={`w-12 h-12 rounded-full flex items-center justify-center transition ${isMuted ? 'bg-red-500' : 'bg-slate-800 hover:bg-slate-700'}`}>
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            {isMuted ? <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.55-.9l4.17 4.18L21 19.73 4.27 3z" /> : <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />}
          </svg>
        </button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={endCall} className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-lg shadow-red-600/30 transition">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" /></svg>
        </motion.button>
        <button onClick={toggleVideo} className={`w-12 h-12 rounded-full flex items-center justify-center transition ${isVideoOff ? 'bg-red-500' : 'bg-slate-800 hover:bg-slate-700'}`}>
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            {isVideoOff ? <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z" /> : <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />}
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
