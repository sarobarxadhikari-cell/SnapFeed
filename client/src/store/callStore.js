import { create } from 'zustand';

const useCallStore = create((set, get) => ({
  callStatus: 'idle',
  callType: null,
  callerInfo: null,
  receiverInfo: null,
  isCaller: false,
  callDuration: 0,
  isMicEnabled: true,
  isCameraEnabled: true,
  isSpeakerEnabled: true,
  isFullscreen: false,
  isBlurEnabled: false,
  incomingCall: null,

  setCallStatus: (status) => set({ callStatus: status }),
  setCallType: (type) => set({ callType: type }),
  setCallerInfo: (info) => set({ callerInfo: info }),
  setReceiverInfo: (info) => set({ receiverInfo: info }),
  setIsCaller: (val) => set({ isCaller: val }),

  startCall: (receiverInfo, callType = 'video') => {
    set({
      callStatus: 'calling',
      callType,
      receiverInfo,
      isCaller: true,
      callDuration: 0,
      incomingCall: null,
    });
  },

  receiveCall: (data) => {
    set({
      callStatus: 'ringing',
      callType: data.callType || 'video',
      callerInfo: { id: data.from, name: data.fromName, avatar: data.fromAvatar },
      incomingCall: data,
      isCaller: false,
    });
  },

  acceptCall: () => {
    set({ callStatus: 'connecting', incomingCall: null });
  },

  connectCall: () => {
    set({ callStatus: 'connected' });
  },

  endCall: () => {
    set({
      callStatus: 'ended',
      callType: null,
      callerInfo: null,
      receiverInfo: null,
      isCaller: false,
      callDuration: 0,
      incomingCall: null,
    });
  },

  rejectCall: () => {
    set({
      callStatus: 'idle',
      callType: null,
      callerInfo: null,
      incomingCall: null,
    });
  },

  toggleMic: () => set((s) => ({ isMicEnabled: !s.isMicEnabled })),
  toggleCamera: () => set((s) => ({ isCameraEnabled: !s.isCameraEnabled })),
  toggleSpeaker: () => set((s) => ({ isSpeakerEnabled: !s.isSpeakerEnabled })),
  toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),
  toggleBlur: () => set((s) => ({ isBlurEnabled: !s.isBlurEnabled })),

  incrementDuration: () =>
    set((s) => ({ callDuration: s.callDuration + 1 })),
}));

export default useCallStore;
