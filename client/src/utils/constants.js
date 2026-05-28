const PROD_API = 'https://snapfeed-ihhh.onrender.com';
export const API_BASE = import.meta.env.PROD ? `${PROD_API}/api` : '/api';
export const SOCKET_URL = import.meta.env.PROD ? PROD_API : '/';

export const RTC_CONFIG = {
  iceServers: [
    {
      urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'],
    },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
  iceCandidatePoolSize: 10,
};

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  FILE: 'file',
  STICKER: 'sticker',
  SNAP: 'snap',
};

export const CALL_TYPES = {
  AUDIO: 'audio',
  VIDEO: 'video',
};

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
};

export const STORY_DURATION = 24 * 60 * 60 * 1000;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const TYPING_TIMEOUT = 1000;
