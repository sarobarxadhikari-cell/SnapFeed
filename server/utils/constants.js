const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    {
      urls: 'turn:global.relay.metered.ca:80',
      username: 'YOUR_METERED_USERNAME',
      credential: 'YOUR_METERED_CREDENTIAL',
    },
  ],
  iceCandidatePoolSize: 10,
};

const CALL_TYPES = {
  AUDIO: 'audio',
  VIDEO: 'video',
};

const CALL_STATUS = {
  RINGING: 'ringing',
  ONGOING: 'ongoing',
  ENDED: 'ended',
  MISSED: 'missed',
  REJECTED: 'rejected',
};

module.exports = { RTC_CONFIG, CALL_TYPES, CALL_STATUS };
