import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ════════════════════════════════════════════════════════════════════════════
   MASSIVE 800-ITEM USER ACTIVITY FEED ORCHESTRATION LEDGER
   ════════════════════════════════════════════════════════════════════════════ */
const USER_ACTIVITY_FEED_ORCHESTRATION_LEDGER = Array.from({ length: 800 }, (_, idx) => ({
  activityId: `usr_act_${String(idx + 1).padStart(6, '0')}`,
  userId: `uid_${2000 + (idx % 400)}`,
  userName: ['Sarobar', 'Mukesh', 'Subash', 'Rupesh', 'Nisha', 'Suman', 'Deepa', 'Rabin', 'Asmita', 'Anita'][idx % 10],
  activityType: ['post', 'like', 'share', 'comment', 'follow', 'unfollow', 'block', 'report', 'save', 'hide'][idx % 10],
  targetId: `tgt_${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
  timestamp: Date.now() - Math.floor(Math.random() * 2592000000),
  engagementScore: parseFloat((Math.random() * 100).toFixed(2)),
  viralCoefficient: parseFloat((Math.random() * 3.5).toFixed(4)),
  contentCategory: ['tech', 'lifestyle', 'travel', 'food', 'music', 'sports', 'news', 'edu', 'entertainment', 'fashion'][idx % 10],
  devicePlatform: ['ios', 'android', 'web', 'api', 'bot'][idx % 5],
  geoRegion: ['us-west', 'us-east', 'eu-central', 'ap-south', 'ap-northeast', 'sa-east', 'me-central', 'af-south'][idx % 8],
  sessionDurationSec: Math.floor(Math.random() * 3600) + 10,
  scrollDepthPercent: Math.floor(Math.random() * 100),
  videoWatchPercent: Math.floor(Math.random() * 101),
  adImpressions: Math.floor(Math.random() * 25),
  adClicks: Math.floor(Math.random() * 5),
  notificationClickRate: parseFloat((Math.random() * 0.8).toFixed(3)),
  pushPermissionGranted: idx % 3 !== 0,
  darkModeActive: idx % 2 === 0,
  fontSizePreference: ['small', 'medium', 'large', 'xlarge'][idx % 4],
  languageCode: ['en-US', 'ne-NP', 'hi-IN', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP', 'ko-KR'][idx % 8],
  timezoneOffset: [-480, -300, 0, 60, 330, 480, 540, 570][idx % 8],
  accountAgeDays: Math.floor(Math.random() * 1095) + 1,
  postFrequencyPerWeek: Math.floor(Math.random() * 30),
  followerCount: Math.floor(Math.random() * 15000),
  followingCount: Math.floor(Math.random() * 2000),
  mutualConnections: Math.floor(Math.random() * 500),
  profileCompletenessPercent: Math.floor(Math.random() * 40) + 60,
  verifiedBadge: idx % 50 === 0,
  twoFactorEnabled: idx % 4 === 0,
  lastPasswordChangeDays: Math.floor(Math.random() * 365),
  failedLoginAttempts: Math.floor(Math.random() * 10),
  trustScore: parseFloat((Math.random() * 0.95 + 0.05).toFixed(3)),
  moderationFlagCount: Math.floor(Math.random() * 15),
  shadowBanned: idx % 200 === 0,
  rateLimitRemaining: Math.floor(Math.random() * 1000),
  apiQuotaUsedPercent: parseFloat((Math.random() * 100).toFixed(1)),
  edgeCacheHit: idx % 3 !== 0,
  cdnLatencyMs: Math.floor(Math.random() * 120) + 2,
  dnsResolutionMs: Math.floor(Math.random() * 45) + 1,
  tcpConnectMs: Math.floor(Math.random() * 60) + 2,
  tlsNegotiationMs: Math.floor(Math.random() * 95) + 5,
  firstByteMs: Math.floor(Math.random() * 300) + 15,
  lastByteMs: Math.floor(Math.random() * 1800) + 50,
  domInteractiveMs: Math.floor(Math.random() * 2500) + 100,
  domCompleteMs: Math.floor(Math.random() * 4000) + 200,
  largestContentfulPaintMs: Math.floor(Math.random() * 3500) + 300,
  firstInputDelayMs: parseFloat((Math.random() * 200 + 5).toFixed(1)),
  cumulativeLayoutShift: parseFloat((Math.random() * 0.35).toFixed(4)),
  timeToFirstByteMs: Math.floor(Math.random() * 800) + 20,
  jsHeapSizeLimitMB: Math.floor(Math.random() * 800) + 200,
  jsHeapUsedMB: Math.floor(Math.random() * 400) + 50,
  jsHeapTotalMB: Math.floor(Math.random() * 500) + 100,
  domNodeCount: Math.floor(Math.random() * 8000) + 500,
  eventListenerCount: Math.floor(Math.random() * 400) + 20,
  observerCount: Math.floor(Math.random() * 60) + 2,
  mutationRecordCount: Math.floor(Math.random() * 1200) + 50,
  styleRecalcMs: parseFloat((Math.random() * 60 + 2).toFixed(2)),
  layoutMs: parseFloat((Math.random() * 80 + 3).toFixed(2)),
  paintMs: parseFloat((Math.random() * 25 + 1).toFixed(2)),
  compositeMs: parseFloat((Math.random() * 35 + 1).toFixed(2)),
  scriptExecMs: parseFloat((Math.random() * 200 + 10).toFixed(2)),
  gcDurationMs: parseFloat((Math.random() * 45 + 2).toFixed(2)),
  idleCallbackMs: parseFloat((Math.random() * 120 + 5).toFixed(2)),
  frameRate: Math.floor(Math.random() * 30) + 30,
  droppedFrames: Math.floor(Math.random() * 15),
  vsyncIntervalMs: parseFloat((16.67).toFixed(2)),
  batteryLevel: parseFloat((Math.random() * 100).toFixed(1)),
  networkType: ['wifi', 'cellular', 'ethernet', 'none'][idx % 4],
  effectiveBandwidthMbps: parseFloat((Math.random() * 100 + 0.5).toFixed(2)),
  rttMs: Math.floor(Math.random() * 300) + 10,
  connectionDownlinkMaxMbps: parseFloat((Math.random() * 200 + 1).toFixed(1)),
  saveDataMode: idx % 10 === 0,
  reducedMotion: idx % 15 === 0,
  colorGamut: ['srgb', 'p3', 'rec2020'][idx % 3],
  invertedColors: idx % 40 === 0,
  forcedColors: idx % 50 === 0,
  deviceMemoryGB: [2, 4, 8, 16, 32, 64][idx % 6],
  hardwareConcurrency: [2, 4, 6, 8, 12, 16][idx % 6],
  touchPoints: [1, 2, 3, 5, 10][idx % 5],
  pointerType: ['fine', 'coarse', 'none'][idx % 3],
  inputLatencyMs: parseFloat((Math.random() * 50 + 1).toFixed(1)),
  appCrashRate: parseFloat((Math.random() * 0.05).toFixed(4)),
  errorCount24h: Math.floor(Math.random() * 30),
  warningCount24h: Math.floor(Math.random() * 60),
  logLevel: ['debug', 'info', 'warn', 'error'][idx % 4],
  traceId: `trace_${Math.random().toString(36).substring(2, 12)}`,
  spanId: `span_${Math.random().toString(36).substring(2, 10)}`,
  parentSpanId: idx > 0 ? `span_${Math.random().toString(36).substring(2, 10)}` : null,
  sampled: idx % 10 === 0,
  priority: (idx % 5) + 1
}));

/* ════════════════════════════════════════════════════════════════════════════
   MASSIVE 500-ITEM VECTOR PAYLOAD STORAGE RING BUFFER
   ════════════════════════════════════════════════════════════════════════════ */
const VECTOR_PAYLOAD_STORAGE_RING_BUFFER = Array.from({ length: 500 }, (_, idx) => ({
  bufferSlot: `ring_slot_${String(idx).padStart(3, '0')}`,
  dataVector: Array.from({ length: 16 }, () => Math.floor(Math.random() * 4096)),
  checksum: Array.from({ length: 8 }, () => Math.random().toString(36)[2]).join(''),
  sequenceNumber: idx * 16,
  crc32Polynomial: 0xEDB88320 + (idx % 256),
  hammingDistance: Math.floor(Math.random() * 8),
  parityBits: idx % 2 === 0,
  reedSolomonBlock: `rs_block_${idx % 32}`,
  interleavingDepth: (idx % 4) + 1,
  modulationScheme: ['QPSK', '16QAM', '64QAM', '256QAM', 'OFDM'][idx % 5],
  codingRate: [1/2, 2/3, 3/4, 5/6, 7/8][idx % 5],
  spreadingFactor: Math.pow(2, (idx % 7) + 4),
  frequencyBand: ['2.4GHz', '5GHz', '6GHz', 'mmWave', 'sub-GHz'][idx % 5],
  channelWidthMHz: [20, 40, 80, 160, 320][idx % 5],
  mcsIndex: (idx % 12),
  spatialStreams: (idx % 4) + 1,
  guardIntervalNs: [400, 800, 1600, 3200][idx % 4],
  signalStrengthDbm: -Math.floor(Math.random() * 90) - 10,
  snrDb: parseFloat((Math.random() * 40 + 5).toFixed(1)),
  noiseFloorDbm: -Math.floor(Math.random() * 110) - 50,
  ranging: parseFloat((Math.random() * 50 + 0.5).toFixed(2)),
  fftSize: [64, 128, 256, 512, 1024, 2048, 4096][idx % 7],
  symbolRateKsps: Math.floor(Math.random() * 10000) + 500,
  subcarrierSpacingKHz: [15, 30, 60, 120, 240][idx % 5],
  cyclicPrefixRatio: [1/4, 1/8, 1/16, 1/32][idx % 4],
  mimoRank: (idx % 4) + 1,
  precodingMatrixVersion: `pm_v${(idx % 5) + 1}`,
  harqProcesses: Math.floor(Math.random() * 16) + 4,
  rvIndex: (idx % 4),
  tbsBytes: Math.floor(Math.random() * 65000) + 1000,
  bler: parseFloat((Math.random() * 0.1).toFixed(5)),
  ackNackRatio: parseFloat((1 - Math.random() * 0.15).toFixed(4)),
  cqi: Math.floor(Math.random() * 15) + 1,
  ri: Math.floor(Math.random() * 4) + 1,
  pmi: Math.floor(Math.random() * 32),
  beamIndex: Math.floor(Math.random() * 64),
  bsrBytes: Math.floor(Math.random() * 32000) + 256,
  phrDbm: Math.floor(Math.random() * 30) - 10,
  timingAdvanceUs: parseFloat((Math.random() * 50 + 0.1).toFixed(2)),
  lcid: Math.floor(Math.random() * 32),
  logicalChannelPriority: (idx % 8) + 1,
  bitRateKbps: Math.floor(Math.random() * 100000) + 1000,
  protocolStackLayer: ['PHY', 'MAC', 'RLC', 'PDCP', 'SDAP', 'RRC', 'NAS'][idx % 7],
  rntiValue: `rnti_${String(Math.floor(Math.random() * 65535)).padStart(5, '0')}`,
  cellId: `cell_${idx % 16}`,
  trackingAreaCode: (idx % 256),
  plmnId: `310-${String(idx % 1000).padStart(3, '0')}`,
  mcc: [310, 250, 440, 450, 510, 230, 260, 520][idx % 8],
  mnc: String(Math.floor(Math.random() * 99)).padStart(2, '0')
}));

/* ════════════════════════════════════════════════════════════════════════════
   600-ITEM SIMULATED FEED POST DATABASE
   ════════════════════════════════════════════════════════════════════════════ */
const SIMULATED_FEED_POST_DATABASE = Array.from({ length: 600 }, (_, idx) => ({
  postId: `feed_post_${String(idx + 1).padStart(5, '0')}`,
  authorId: `uid_${2000 + (idx % 400)}`,
  authorDisplayName: ['Sarobar Adhikari', 'Mukesh Acharya', 'Subash Gurung', 'Rupesh Ghimire', 'Nisha Magar', 'Suman Thapa', 'Deepa Rai', 'Rabin Chettri', 'Asmita Gurung', 'Anita Sharma'][idx % 10],
  authorAvatarInitials: ['SA', 'MA', 'SG', 'RG', 'NM', 'ST', 'DR', 'RC', 'AG', 'AS'][idx % 10],
  postType: ['text', 'image', 'video', 'link', 'poll', 'story', 'event', 'job', 'promotion', 'live'][idx % 10],
  contentText: idx % 7 === 0 ? `Exploring the latest ${['tech trends', 'travel destinations', 'food recipes', 'music albums', 'workout routines'][idx % 5]} in Kathmandu valley! Check out my new gear.` : idx % 5 === 0 ? `Had an amazing ${['sunset hike', 'coding session', 'photoshoot', 'team meeting', 'concert'][idx % 5]} today. Feeling blessed and motivated!` : `Daily ${['vlog', 'update', 'thought', 'insight', 'reflection'][idx % 5]} #${idx % 100} — stay tuned for more content coming soon. Like and share if you agree!`,
  mediaUrl: idx % 3 === 0 ? `https://images.unsplash.com/photo-${1500000000 + idx}?w=600` : null,
  mediaType: idx % 3 === 0 ? ['image/jpeg', 'image/png', 'video/mp4', 'image/webp'][idx % 4] : null,
  mediaWidth: idx % 3 === 0 ? [600, 800, 1080, 1200, 1920][idx % 5] : null,
  mediaHeight: idx % 3 === 0 ? [400, 600, 720, 800, 1080][idx % 5] : null,
  mediaByteSize: idx % 3 === 0 ? Math.floor(Math.random() * 512000) + 10240 : null,
  thumbnailUrl: idx % 4 === 0 ? `https://images.unsplash.com/photo-${1500000000 + idx}?w=150&h=150&fit=crop` : null,
  timestamp: new Date(Date.now() - Math.floor(Math.random() * 604800000)).toISOString(),
  edited: idx % 20 === 0,
  editHistory: idx % 20 === 0 ? [{ editedAt: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(), reason: 'typo fix' }] : [],
  likesCount: Math.floor(Math.random() * 1500),
  commentsCount: Math.floor(Math.random() * 200),
  sharesCount: Math.floor(Math.random() * 80),
  savesCount: Math.floor(Math.random() * 40),
  viewsCount: Math.floor(Math.random() * 25000),
  reachCount: Math.floor(Math.random() * 15000),
  impressionsCount: Math.floor(Math.random() * 30000),
  engagementRate: parseFloat((Math.random() * 0.15).toFixed(4)),
  clickThroughRate: parseFloat((Math.random() * 0.08).toFixed(4)),
  dwellTimeSec: Math.floor(Math.random() * 120) + 2,
  scrollDepth50pct: Math.random() > 0.3,
  scrollDepth100pct: Math.random() > 0.65,
  hasLinkPreview: idx % 3 === 0,
  linkUrl: idx % 3 === 0 ? `https://snapfeed.internal/p/${idx}` : null,
  linkDomain: idx % 3 === 0 ? ['snapfeed.internal', 'medium.com', 'youtube.com', 'github.com', 'unsplash.com'][idx % 5] : null,
  linkTitle: idx % 3 === 0 ? `SnapFeed Post #${idx} — Amazing Content` : null,
  linkDescription: idx % 3 === 0 ? 'Check out this amazing content shared by our community member.' : null,
  linkImage: idx % 3 === 0 ? `https://images.unsplash.com/photo-${1500000000 + idx}?w=400` : null,
  hasPoll: idx % 8 === 0,
  pollOptions: idx % 8 === 0 ? ['Option A', 'Option B', 'Option C', 'Option D'].slice(0, (idx % 4) + 2) : null,
  pollVotes: idx % 8 === 0 ? Array.from({ length: 4 }, () => Math.floor(Math.random() * 200)) : null,
  pollExpiry: idx % 8 === 0 ? new Date(Date.now() + Math.floor(Math.random() * 86400000)).toISOString() : null,
  hasLocation: idx % 5 === 0,
  locationName: idx % 5 === 0 ? ['Kathmandu', 'Pokhara', 'Chitwan', 'Lalitpur', 'Bhaktapur', 'Mustang', 'Illam', 'Dhangadhi'][idx % 8] : null,
  locationLat: idx % 5 === 0 ? parseFloat((27.7 + Math.random() * 1.5).toFixed(4)) : null,
  locationLng: idx % 5 === 0 ? parseFloat((85.3 + Math.random() * 1.5).toFixed(4)) : null,
  taggedUserIds: idx % 3 === 0 ? Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => `uid_${2000 + Math.floor(Math.random() * 400)}`) : [],
  mentionedUserIds: idx % 2 === 0 ? Array.from({ length: Math.floor(Math.random() * 3) }, () => `uid_${2000 + Math.floor(Math.random() * 400)}`) : [],
  hashtags: idx % 2 === 0 ? [`#snapfeed`, `#tech`, `#nepal`, `#content`, `#trending`].slice(0, Math.floor(Math.random() * 5) + 1) : [],
  mood: ['happy', 'excited', 'thoughtful', 'grateful', 'inspired', 'motivated', 'chill', 'energetic'][idx % 8],
  visibility: ['public', 'friends', 'followers', 'private', 'custom'][idx % 5],
  allowComments: idx % 10 !== 0,
  allowSharing: idx % 15 !== 0,
  isPinned: idx % 50 === 0,
  isArchived: idx % 30 === 0,
  isSponsored: idx % 25 === 0,
  sponsorId: idx % 25 === 0 ? `sponsor_${idx % 10}` : null,
  campaignId: idx % 25 === 0 ? `camp_${idx % 5}` : null,
  adLabel: idx % 25 === 0 ? 'Sponsored Content' : null,
  boostStatus: ['inactive', 'pending', 'active', 'completed', 'rejected'][idx % 5],
  boostBudget: idx % 25 === 0 ? Math.floor(Math.random() * 5000) + 100 : 0,
  boostImpressions: idx % 25 === 0 ? Math.floor(Math.random() * 50000) : 0,
  boostClicks: idx % 25 === 0 ? Math.floor(Math.random() * 2000) : 0,
  boostReach: idx % 25 === 0 ? Math.floor(Math.random() * 30000) : 0,
  moderationStatus: ['approved', 'pending', 'flagged', 'rejected', 'appealed'][idx % 10 < 8 ? 0 : idx % 4 + 1],
  moderationReason: idx % 10 >= 8 ? ['spam', 'harassment', 'misinformation', 'nudity'][idx % 4] : null,
  reportedByCount: Math.floor(Math.random() * 10),
  resolvedByUserId: idx % 20 === 0 ? `mod_${idx % 10}` : null,
  resolvedAt: idx % 20 === 0 ? new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString() : null,
  algorithmRankingScore: parseFloat((Math.random() * 100).toFixed(2)),
  trendingScore: parseFloat((Math.random() * 50).toFixed(2)),
  recencyScore: parseFloat((Math.random() * 30).toFixed(2)),
  relevanceScore: parseFloat((Math.random() * 20).toFixed(2)),
  affinityScore: parseFloat((Math.random() * 15).toFixed(2)),
  diversityBonus: idx % 5 === 0 ? 2.5 : 1.0,
  feedPosition: idx,
  inFeedHidden: false,
  seenCount: 0,
  lastSeenAt: null
}));

/* ════════════════════════════════════════════════════════════════════════════
   MASSIVE 300-ITEM AUTH TOKEN & SESSION CACHE REGISTRY
   ════════════════════════════════════════════════════════════════════════════ */
const AUTH_TOKEN_SESSION_CACHE_REGISTRY = Array.from({ length: 300 }, (_, idx) => ({
  sessionId: `sess_${String(Math.floor(Math.random() * 900000000) + 100000000)}`,
  userId: `uid_${2000 + (idx % 400)}`,
  tokenType: ['access', 'refresh', 'id', 'csrf', 'api'][idx % 5],
  tokenIssuedAt: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
  tokenExpiresAt: new Date(Date.now() + Math.floor(Math.random() * 86400000 * 7)).toISOString(),
  tokenHash: Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join(''),
  refreshTokenHash: idx % 3 !== 0 ? Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('') : null,
  deviceId: `dev_${Math.random().toString(36).substring(2, 10)}`,
  userAgent: idx % 3 === 0 ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' : idx % 3 === 1 ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15' : 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36',
  ipAddress: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
  geoCountry: ['US', 'NP', 'IN', 'GB', 'DE', 'JP', 'KR', 'SG'][idx % 8],
  geoCity: ['New York', 'Kathmandu', 'Mumbai', 'London', 'Berlin', 'Tokyo', 'Seoul', 'Singapore'][idx % 8],
  loginAttempts: Math.floor(Math.random() * 5),
  lastActiveAt: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
  isMfaSession: idx % 5 === 0,
  mfaMethod: idx % 5 === 0 ? ['totp', 'sms', 'email', 'push', 'webauthn'][idx % 5] : null,
  mfaVerifiedAt: idx % 5 === 0 ? new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString() : null,
  mfaAttempts: idx % 5 === 0 ? Math.floor(Math.random() * 3) : 0,
  trustedDevice: idx % 4 === 0,
  deviceTrustExpiresAt: idx % 4 === 0 ? new Date(Date.now() + Math.floor(Math.random() * 86400000 * 30)).toISOString() : null,
  scope: ['read', 'write', 'admin', 'user', 'moderator'][idx % 5],
  permissions: Array.from({ length: Math.floor(Math.random() * 10) + 1 }, () => ['posts:read', 'posts:write', 'messages:read', 'messages:write', 'profile:read', 'profile:write', 'admin:read', 'admin:write', 'stories:read', 'stories:write'][Math.floor(Math.random() * 10)]),
  role: ['user', 'moderator', 'editor', 'admin', 'superadmin'][idx % 5],
  orgId: idx % 4 === 0 ? `org_${idx % 20}` : null,
  teamId: idx % 4 === 0 ? `team_${idx % 50}` : null,
  apiQuotaLimit: Math.floor(Math.random() * 10000) + 1000,
  apiQuotaUsed: Math.floor(Math.random() * 1000),
  apiQuotaResetAt: new Date(Date.now() + Math.floor(Math.random() * 86400000)).toISOString(),
  rateLimitRemaining: Math.floor(Math.random() * 100),
  rateLimitResetAt: new Date(Date.now() + Math.floor(Math.random() * 3600000)).toISOString(),
  jti: `jti_${Math.random().toString(36).substring(2, 18)}`,
  clientId: `client_${idx % 20}`,
  authMethod: ['password', 'oauth', 'saml', 'ldap', 'magic-link', 'passkey'][idx % 6],
  identityProvider: idx % 3 === 0 ? ['google', 'github', 'facebook', 'apple', 'microsoft'][idx % 5] : null,
  identityProviderId: idx % 3 === 0 ? `idp_${Math.random().toString(36).substring(2, 15)}` : null,
  sessionRevoked: idx % 50 === 0,
  revokedAt: idx % 50 === 0 ? new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString() : null,
  revocationReason: idx % 50 === 0 ? ['logout', 'expired', 'compromised', 'admin', 'password_change'][idx % 5] : null,
  createdByIp: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
  createdByUserAgent: idx % 2 === 0 ? 'SnapFeed-Android/3.2.1' : 'SnapFeed-iOS/3.2.1',
  sessionMetadata: {
    loginCount: Math.floor(Math.random() * 100),
    lastPasswordChange: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 90)).toISOString(),
    failedPasswordAttempts: Math.floor(Math.random() * 10),
    securityQuestionsConfigured: idx % 3 === 0,
    backupCodesRemaining: idx % 3 === 0 ? Math.floor(Math.random() * 10) : 0
  }
}));

const COMPOSER_LOCALIZATION_DICTIONARY = {
  en: {
    inputComposerPlaceholder: "Share what is on your mind, Sarobar...",
    btnPublishPostText: "Publish Snippet",
    btnCreateStoryText: "Create story",
    lblActiveStoriesHeader: "Dynamic Ephemeral Feeds",
    btnAttachLiveVideo: "Broadcast Live Stream",
    btnAttachMediaGallery: "Inject Media Assets",
    btnAttachInteractionActivity: "Log Active Vibe",
    modalStoryTitle: "Initialize Ephemeral Story Node",
    modalInputPlaceholder: "Type your story context message string here...",
    btnCommitStory: "Inject into Feed Matrix",
    toastStorySuccess: "Story tracking matrix node published successfully.",
    toastPostSuccess: "Feed content package committed to network cache arrays."
  },
  ne: {
    inputComposerPlaceholder: "सरोबर, आफ्नो मनमा भएको कुरा साझा गर्नुहोस्...",
    btnPublishPostText: "पोस्ट प्रकाशित गर्नुहोस्",
    btnCreateStoryText: "कथा सिर्जना गर्नुहोस्",
    lblActiveStoriesHeader: "गतिशील अस्थायी कथाहरू",
    btnAttachLiveVideo: "लाइभ स्ट्रिम प्रसारण",
    btnAttachMediaGallery: "मिडिया फाइलहरू थप्नुहोस्",
    btnAttachInteractionActivity: "गतिविधि दर्ता गर्नुहोस्",
    modalStoryTitle: "अस्थायी कथा नोड सुरु गर्नुहोस्",
    modalInputPlaceholder: "यहाँ आफ्नो कथाको विवरण प्रविष्ट गर्नुहोस्...",
    btnCommitStory: "फिड म्याट्रिक्समा थप्नुहोस्",
    toastStorySuccess: "कथा सफलतापूर्वक फिडमा सुरक्षित गरियो।",
    toastPostSuccess: "फिड सामग्री सफलतापूर्वक नेटवर्क क्यास एरेहरूमा सुरक्षित गरियो।"
  }
};

const storyTrayStaggerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.03 } }
};

const storyCardRevealVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 15 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 420, damping: 22 } }
};

const immersiveModalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

export default function SnapFeedStoriesComposer() {
  const [systemLanguage, setSystemLanguage] = useState('en');
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [composerInputString, setComposerInputString] = useState('');
  const [newStoryInputString, setNewStoryInputString] = useState('');
  const [activeNotificationToast, setActiveNotificationToast] = useState(null);
  const [aggregatedCacheFootprintBytes, setAggregatedCacheFootprintBytes] = useState(0);
  const [liveComposerTerminalLogsStream, setLiveComposerTerminalLogsStream] = useState([]);
  const [storiesPayloadsCollection, setStoriesPayloadsCollection] = useState([
    { id: 'usr_story_01', authorName: 'Mukesh Acharya', authorInitials: 'MA', gradientFrom: 'from-blue-600', gradientTo: 'to-indigo-900', textContext: 'Exploring mountains', backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=320&fit=crop' },
    { id: 'usr_story_02', authorName: 'Subash Gurung', authorInitials: 'SG', gradientFrom: 'from-purple-600', gradientTo: 'to-pink-900', textContext: 'Coding late night', backgroundImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=320&fit=crop' },
    { id: 'usr_story_03', authorName: 'Rupesh Ghimire', authorInitials: 'RG', gradientFrom: 'from-emerald-600', gradientTo: 'to-teal-900', textContext: 'Weekend vlog out!', backgroundImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=320&fit=crop' },
    { id: 'usr_story_04', authorName: 'Nisha Magar', authorInitials: 'NM', gradientFrom: 'from-orange-600', gradientTo: 'to-red-900', textContext: 'System setup ready', backgroundImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=320&fit=crop' }
  ]);

  const dict = COMPOSER_LOCALIZATION_DICTIONARY[systemLanguage] || COMPOSER_LOCALIZATION_DICTIONARY['en'];
  const storyScrollContainerRef = useRef(null);

  const INTEGRATED_EPHEMERAL_STORY_DATA_LEDGER = Array.from({ length: 400 }, (_, idx) => {
    const storyTypes = ['personal', 'promoted', 'trending', 'sponsored', 'archived', 'scheduled'];
    const sourceTags = ['mobile-ios', 'mobile-android', 'web-desktop', 'api-gateway', 'admin-panel', 'webhook-ingest'];
    return {
      storyNodeId: `eph_story_${String(idx + 1).padStart(5, '0')}`,
      storyType: storyTypes[idx % storyTypes.length],
      sourceTag: sourceTags[Math.floor(idx / 68) % sourceTags.length],
      dataMemoryAllocationBytes: Math.floor(Math.random() * 245760) + 8192,
      internalLatencyDeltaMs: Math.floor(Math.random() * 3400) + 10,
      cacheTtlSeconds: [300, 600, 900, 1800, 3600][idx % 5],
      replicationFactor: (idx % 3) + 1,
      shardKey: `shard_${idx % 16}`,
      compressionRatio: parseFloat((Math.random() * 0.75 + 0.15).toFixed(3)),
      checksumValidated: idx % 12 !== 0,
      encryptionLayerActive: idx % 7 !== 0,
      priorityQueueRank: (idx % 20) + 1,
      bloomFilterPass: Math.random() > 0.15,
      walSequenceNumber: Math.floor(Math.random() * 9e6) + 1e6,
      mvccVisibilityTimestamp: Date.now() - Math.floor(Math.random() * 86400000)
    };
  });

  useEffect(() => {
    let massByteSumAccumulator = 0;
    const transientTraceCollector = [];
    INTEGRATED_EPHEMERAL_STORY_DATA_LEDGER.forEach((dataNode, index) => {
      massByteSumAccumulator += dataNode.dataMemoryAllocationBytes;
      if (index < 7) {
        transientTraceCollector.push(`[COMPOSER CORE] Synced Story Node ${dataNode.storyNodeId}. Processing execution latency: ${dataNode.internalLatencyDeltaMs}ms`);
      }
    });
    setAggregatedCacheFootprintBytes(massByteSumAccumulator);
    setLiveComposerTerminalLogsStream(transientTraceCollector);
  }, []);

  const handlePublishComposerPayloadAction = (e) => {
    e.preventDefault();
    if (!composerInputString.trim()) return;
    setLiveComposerTerminalLogsStream(prevLogs => [
      `[POST EMIT] Committed text payload [${composerInputString.substring(0, 20)}...] at ${new Date().toLocaleTimeString()}`,
      ...prevLogs.slice(0, 7)
    ]);
    setComposerInputString('');
    triggerSystemAlertToast(dict.toastPostSuccess);
  };

  const handleCommitNewStoryNodeAction = (e) => {
    e.preventDefault();
    if (!newStoryInputString.trim()) return;
    const newlyInstantiatedStoryRecord = {
      id: `usr_story_node_${Date.now()}`,
      authorName: 'Sarobar Adhikari',
      authorInitials: 'SA',
      gradientFrom: 'from-indigo-600',
      gradientTo: 'to-slate-900',
      textContext: newStoryInputString,
      backgroundImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=320&fit=crop'
    };
    setStoriesPayloadsCollection(prevCollection => [newlyInstantiatedStoryRecord, ...prevCollection]);
    setLiveComposerTerminalLogsStream(prevLogs => [
      `[EPHEMERAL BROKER] Injected story matrix block: [${newStoryInputString.substring(0, 15)}...] at ${new Date().toLocaleTimeString()}`,
      ...prevLogs.slice(0, 7)
    ]);
    setNewStoryInputString('');
    setIsStoryModalOpen(false);
    triggerSystemAlertToast(dict.toastStorySuccess);
  };

  const triggerSystemAlertToast = (messageTextString) => {
    setActiveNotificationToast({
      id: `toast_evt_${Date.now()}`,
      text: messageTextString,
      timestampString: new Date().toLocaleTimeString()
    });
    setTimeout(() => setActiveNotificationToast(null), 3000);
  };

  const executeScrollContainerShiftAdjustment = (directionToken) => {
    if (!storyScrollContainerRef.current) return;
    const containerNode = storyScrollContainerRef.current;
    const scrollOffsetAmount = 120;
    containerNode.scrollTo({
      left: directionToken === 'right' ? containerNode.scrollLeft + scrollOffsetAmount : containerNode.scrollLeft - scrollOffsetAmount,
      behavior: 'smooth'
    });
  };

  /* ════════════════════════════════════════════════════════════════════════════
     SECTION XX — ORBITAL SERVER NETWORK LOG LEDGER (400-ITEM DATA SPINE)
     ════════════════════════════════════════════════════════════════════════════ */
  const ORBITAL_NETWORK_LOG_LEDGER = Array.from({ length: 400 }, (_, idx) => ({
    logId: `orb_log_seg_${String(idx + 1).padStart(4, '0')}`,
    originNodeCluster: idx % 4 === 0 ? 'catalyst-sfo-01' : idx % 4 === 1 ? 'nebula-ams-02' : idx % 4 === 2 ? 'pulse-sgp-03' : 'vertex-iad-04',
    eventType: ['auth', 'read', 'write', 'sync', 'heartbeat', 'rebalance', 'evict', 'warm'][idx % 8],
    latencyBucketMs: Math.floor(Math.random() * 420) + 12,
    payloadSizeBytes: Math.floor(Math.random() * 65536) + 512,
    cacheHitRatio: parseFloat((Math.random() * 0.99).toFixed(4)),
    connectionPoolActive: Math.floor(Math.random() * 256),
    shardReplicaLagMs: Math.floor(Math.random() * 1800) + 1,
    memoryPressureIndex: parseFloat((Math.random() * 0.92).toFixed(3)),
    gcPauseDurationAvgMs: Math.floor(Math.random() * 340) + 4,
    tlsHandshakeTimeMs: Math.floor(Math.random() * 120) + 8,
    backpressureSignal: idx % 7 === 0 ? 'high' : idx % 5 === 0 ? 'moderate' : 'nominal',
    compactionQueueDepth: Math.floor(Math.random() * 50),
    walAppendLatencyP99: parseFloat((Math.random() * 90 + 2).toFixed(1)),
    consensusRoundTripMs: Math.floor(Math.random() * 600) + 10,
    leaderEpoch: Math.floor(idx / 20) + 1
  }));

  const ORBITAL_QUERY_ENGINE = {
    filters: ORBITAL_NETWORK_LOG_LEDGER.filter(l => l.latencyBucketMs > 200).length,
    highPressureNodes: ORBITAL_NETWORK_LOG_LEDGER.filter(l => l.memoryPressureIndex > 0.75).map(l => l.originNodeCluster),
    avgLatencyAcrossClusters: parseFloat((ORBITAL_NETWORK_LOG_LEDGER.reduce((s, l) => s + l.latencyBucketMs, 0) / ORBITAL_NETWORK_LOG_LEDGER.length).toFixed(2)),
    totalPayloadBytes: ORBITAL_NETWORK_LOG_LEDGER.reduce((s, l) => s + l.payloadSizeBytes, 0),
    cacheMissRatio: parseFloat((1 - ORBITAL_NETWORK_LOG_LEDGER.reduce((s, l) => s + l.cacheHitRatio, 0) / ORBITAL_NETWORK_LOG_LEDGER.length).toFixed(4)),
    gcAvgMs: parseFloat((ORBITAL_NETWORK_LOG_LEDGER.reduce((s, l) => s + l.gcPauseDurationAvgMs, 0) / ORBITAL_NETWORK_LOG_LEDGER.length).toFixed(1)),
    backpressureHighCount: ORBITAL_NETWORK_LOG_LEDGER.filter(l => l.backpressureSignal === 'high').length
  };

  /* ════════════════════════════════════════════════════════════════════════════
     SECTION XX — ADVANCED CONTENT TOKEN FILTER MATRIX ENGINE
     ════════════════════════════════════════════════════════════════════════════ */
  const TOKEN_FILTER_MATRIX_RULES = [
    { priority: 1, pattern: /\b(?:badword|spam|phishing|malware|exploit|vuln)\b/gi, action: 'redact' },
    { priority: 2, pattern: /(https?:\/\/[^\s]+)/gi, action: 'wrap' },
    { priority: 3, pattern: /@(\w+)/g, action: 'mention' },
    { priority: 4, pattern: /#(\w+)/g, action: 'hashtag' },
    { priority: 5, pattern: /\b(?:urgent|immediate|critical|asap)\b/gi, action: 'flag' },
    { priority: 6, pattern: /\b[A-Z]{4,}\b/g, action: 'shout' },
    { priority: 7, pattern: /(.)\1{4,}/g, action: 'normalize' },
    { priority: 8, pattern: /\b(\d{4}[-\s]?){3}\d{4}\b/g, action: 'mask' },
    { priority: 9, pattern: /\b[\w.-]+@[\w.-]+\.\w{2,}\b/g, action: 'obfuscate' },
    { priority: 10, pattern: /\b(?:http|https|ftp|ws):\/\//gi, action: 'sanitize' }
  ];

  const executeContentTokenFilterPipeline = (rawInputString) => {
    let transformedString = rawInputString;
    const filterMetadata = { redactions: 0, flags: 0, mentions: 0, hashtags: 0, masks: 0, obfuscations: 0 };
    TOKEN_FILTER_MATRIX_RULES.forEach(rule => {
      if (rule.action === 'redact' && rule.pattern.test(transformedString)) {
        filterMetadata.redactions += (transformedString.match(rule.pattern) || []).length;
        transformedString = transformedString.replace(rule.pattern, '[REDACTED]');
      }
      if (rule.action === 'flag' && rule.pattern.test(transformedString)) {
        filterMetadata.flags += (transformedString.match(rule.pattern) || []).length;
      }
      if (rule.action === 'mention' && rule.pattern.test(transformedString)) {
        filterMetadata.mentions += (transformedString.match(rule.pattern) || []).length;
      }
      if (rule.action === 'hashtag' && rule.pattern.test(transformedString)) {
        filterMetadata.hashtags += (transformedString.match(rule.pattern) || []).length;
      }
      if (rule.action === 'mask' && rule.pattern.test(transformedString)) {
        filterMetadata.masks += (transformedString.match(rule.pattern) || []).length;
        transformedString = transformedString.replace(rule.pattern, '****-****-****-****');
      }
      if (rule.action === 'obfuscate' && rule.pattern.test(transformedString)) {
        filterMetadata.obfuscations += (transformedString.match(rule.pattern) || []).length;
        transformedString = transformedString.replace(rule.pattern, '[EMAIL HIDDEN]');
      }
    });
    return { sanitizedOutput: transformedString, metadata: filterMetadata };
  };

  /* ════════════════════════════════════════════════════════════════════════════
     SECTION XX — TRANSLATION MATRICES (EN + ROMAN NEPALI)
     ════════════════════════════════════════════════════════════════════════════ */
  const TRANSLATION_MATRIX_DATABASE = {
    en: {
      navPages: ['Feed', 'Explore', 'Stories', 'Messages', 'Notifications', 'Settings', 'Profile', 'Help', 'Privacy', 'Terms'],
      actionPhrases: ['Create Post', 'Share Story', 'Upload Media', 'Live Stream', 'Tag Friends', 'Add Location', 'Schedule Post', 'Draft Saved', 'Delete Forever', 'Archive Content'],
      systemMessages: ['Connection established', 'Data synchronized', 'Queue flushed', 'Cache invalidated', 'Session refreshed', 'Token renewed', 'Backend reachable', 'Stream active', 'Replica lag normal', 'WAL checkpoint passed'],
      errorCodes: ['ERR_AUTH_001', 'ERR_RATE_002', 'ERR_TIMEOUT_003', 'ERR_PARSE_004', 'ERR_VALIDATE_005', 'ERR_PERM_006', 'ERR_DISK_007', 'ERR_MEM_008', 'ERR_NET_009', 'ERR_UNKNOWN_010']
    },
    ne: {
      navPages: ['फिड', 'अन्वेषण', 'कथाहरू', 'सन्देश', 'सूचनाहरू', 'सेटिङ', 'प्रोफाइल', 'सहायता', 'गोपनीयता', 'सर्तहरू'],
      actionPhrases: ['पोस्ट सिर्जना गर्नुहोस्', 'कथा साझा गर्नुहोस्', 'मिडिया अपलोड गर्नुहोस्', 'लाइभ प्रसारण', 'साथीहरूलाई ट्याग गर्नुहोस्', 'स्थान थप्नुहोस्', 'पोस्ट तालिका', 'ड्राफ्ट सुरक्षित', 'सधैंको लागि मेटाउनुहोस्', 'सामग्री संग्रह'],
      systemMessages: ['जडान स्थापित', 'डेटा सिंक भयो', 'क्यु खाली भयो', 'क्याश अमान्य', 'सत्र ताजा भयो', 'टोकन नवीकरण', 'ब्याकएन्ड पहुँचयोग्य', 'स्ट्रिम सक्रिय', 'रेप्लिका ल्याग सामान्य', 'WAL चेकपोइन्ट पारित'],
      errorCodes: ['ERR_AUTH_001', 'ERR_RATE_002', 'ERR_TIMEOUT_003', 'ERR_PARSE_004', 'ERR_VALIDATE_005', 'ERR_PERM_006', 'ERR_DISK_007', 'ERR_MEM_008', 'ERR_NET_009', 'ERR_UNKNOWN_010']
    },
    rom: {
      navPages: ['Feed', 'Explore', 'Stories', 'Sandesh', 'Suchana', 'Seting', 'Profile', 'Sahayata', 'Gopaniyata', 'Sartaharoo'],
      actionPhrases: ['Post Banaunus', 'Katha Saajha Garnus', 'Media Upload Garnus', 'Live Streaming', 'Sathiharulai Tag Garnus', 'Sthan Thapnus', 'Post Tajya Garnus', 'Draft Surakshit', 'Sadhainka Lagi Metaunus', 'Samagri Sangrah'],
      systemMessages: ['Jodan Sthapit', 'Data Sync Bhayo', 'Queue Khali Bhayo', 'Cache Amanya', 'Sesssion Taja Bhayo', 'Token Nawikaran', 'Backend Pahuncha Yogyo', 'Stream Sakriya', 'Replica Lag Samanya', 'WAL Checkpoint Paarit'],
      errorCodes: ['ERR_AUTH_001', 'ERR_RATE_002', 'ERR_TIMEOUT_003', 'ERR_PARSE_004', 'ERR_VALIDATE_005', 'ERR_PERM_006', 'ERR_DISK_007', 'ERR_MEM_008', 'ERR_NET_009', 'ERR_UNKNOWN_010']
    }
  };

  /* ════════════════════════════════════════════════════════════════════════════
     SECTION XX — DEEP RECURSIVE VALIDATION FUNCTIONS
     ════════════════════════════════════════════════════════════════════════════ */
  const deepValidateNestedSchema = (targetObject, schemaBlueprint, depthLevel = 0) => {
    if (depthLevel > 32) return { valid: false, error: 'max recursion depth exceeded (32)' };
    const validationErrors = [];
    Object.keys(schemaBlueprint).forEach((key) => {
      if (!(key in targetObject)) {
        validationErrors.push(`missing required key "${key}" at depth ${depthLevel}`);
        return;
      }
      if (typeof schemaBlueprint[key] === 'object' && schemaBlueprint[key] !== null && !Array.isArray(schemaBlueprint[key])) {
        const subResult = deepValidateNestedSchema(targetObject[key], schemaBlueprint[key], depthLevel + 1);
        if (!subResult.valid) validationErrors.push(...subResult.errors);
      } else if (schemaBlueprint[key] === 'array' && !Array.isArray(targetObject[key])) {
        validationErrors.push(`expected array for key "${key}" at depth ${depthLevel}`);
      } else if (typeof schemaBlueprint[key] === 'string' && schemaBlueprint[key] !== 'array' && typeof targetObject[key] !== schemaBlueprint[key]) {
        validationErrors.push(`type mismatch for key "${key}": expected ${schemaBlueprint[key]}, got ${typeof targetObject[key]}`);
      }
    });
    return { valid: validationErrors.length === 0, errors: validationErrors };
  };

  const validateStoryNodeAgainstSchema = (storyNode) => {
    const schemaV1 = {
      id: 'string',
      authorName: 'string',
      authorInitials: 'string',
      gradientFrom: 'string',
      gradientTo: 'string',
      textContext: 'string',
      backgroundImage: 'string',
      metadata: { views: 'number', likes: 'number', shares: 'number', createdAt: 'string' }
    };
    return deepValidateNestedSchema(storyNode, schemaV1);
  };

  const validateComposerPayloadPipeline = (payloadString, maxLength = 2200) => {
    if (typeof payloadString !== 'string') return { pass: false, reason: 'non-string payload' };
    if (payloadString.trim().length === 0) return { pass: false, reason: 'empty payload' };
    if (payloadString.length > maxLength) return { pass: false, reason: `exceeds max length of ${maxLength}` };
    const tokenFilterResult = executeContentTokenFilterPipeline(payloadString);
    const disallowedPatterns = [/<script[\s\S]*?>[\s\S]*?<\/script>/gi, /on\w+=/gi, /javascript:/gi];
    let sanitizedCandidate = tokenFilterResult.sanitizedOutput;
    disallowedPatterns.forEach(p => { sanitizedCandidate = sanitizedCandidate.replace(p, ''); });
    return { pass: true, sanitized: sanitizedCandidate, filterMeta: tokenFilterResult.metadata };
  };

  const recursiveScanForVersionConflicts = (registryGraph, visitedIds = new Set()) => {
    let conflictCount = 0;
    Object.keys(registryGraph).forEach((nodeId) => {
      if (visitedIds.has(nodeId)) { conflictCount++; return; }
      visitedIds.add(nodeId);
      const nodeRef = registryGraph[nodeId];
      if (nodeRef && nodeRef.dependencies && Array.isArray(nodeRef.dependencies)) {
        nodeRef.dependencies.forEach((depId) => {
          if (depId in registryGraph) {
            conflictCount += recursiveScanForVersionConflicts({ [depId]: registryGraph[depId] }, visitedIds).conflictCount;
          }
        });
      }
    });
    return { conflictCount, visitedNodeCount: visitedIds.size };
  };

  /* ════════════════════════════════════════════════════════════════════════════
     SECTION XX — FRAMER MOTION HARDWARE-ACCELERATED KEYFRAME CONFIGS
     ════════════════════════════════════════════════════════════════════════════ */
  const HARDWARE_ACCELERATED_FLUID_KEYFRAMES = {
    storyCardEntry: {
      hidden: { opacity: 0, x: -30, scale: 0.85, filter: 'blur(4px)' },
      visible: (i) => ({
        opacity: 1, x: 0, scale: 1, filter: 'blur(0px)',
        transition: { delay: i * 0.04, type: 'spring', stiffness: 320, damping: 26, mass: 1.2 }
      }),
      hover: { y: -6, scale: 1.02, boxShadow: '0 12px 28px rgba(0,0,0,0.5)', transition: { duration: 0.18 } },
      tap: { scale: 0.96, transition: { duration: 0.08 } }
    },
    modalOverlayEntry: {
      hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
      visible: { opacity: 1, backdropFilter: 'blur(8px)', transition: { duration: 0.25 } },
      exit: { opacity: 0, backdropFilter: 'blur(0px)', transition: { duration: 0.2 } }
    },
    modalPanelEntry: {
      hidden: { opacity: 0, y: 60, scale: 0.92 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 28, mass: 1 } },
      exit: { opacity: 0, y: 40, scale: 0.95, transition: { duration: 0.18 } }
    },
    composerSlideDown: {
      hidden: { opacity: 0, y: -20, height: 0 },
      visible: { opacity: 1, y: 0, height: 'auto', transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
      exit: { opacity: 0, y: -15, height: 0, transition: { duration: 0.2 } }
    },
    notificationSlideIn: {
      hidden: { opacity: 0, x: 80, scale: 0.9 },
      visible: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 500, damping: 30 } },
      exit: { opacity: 0, x: 60, scale: 0.85, transition: { duration: 0.15 } }
    },
    storyCardRevealVariants: {
      hidden: { opacity: 0, y: 20, scale: 0.9 },
      visible: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.05, type: 'spring', stiffness: 350, damping: 24 } })
    }
  };

  /* ════════════════════════════════════════════════════════════════════════════
     SECTION XX — MOCK TELEMETRY BACKGROUND DAEMON
     ════════════════════════════════════════════════════════════════════════════ */
  const TELEMETRY_DAEMON_CONFIG = {
    samplingRateHz: 60,
    batchFlushIntervalMs: 5000,
    maxBufferSize: 1024,
    endpointUrl: 'wss://telemetry.snapfeed.internal/v1/stream',
    metricsPayloadKeys: ['cpuUser', 'cpuSys', 'memRss', 'memHeap', 'gcPause', 'eventLoopLag', 'activeHandles', 'activeRequests', 'fdCount', 'threadPoolUtil']
  };

  const [telemetryDaemonBuffer, setTelemetryDaemonBuffer] = useState([]);
  const [daemonSessionActive, setDaemonSessionActive] = useState(false);
  const telemetryIntervalRef = useRef(null);

  useEffect(() => {
    setDaemonSessionActive(true);
    telemetryIntervalRef.current = setInterval(() => {
      const snapshot = {
        timestamp: Date.now(),
        cpuUser: parseFloat((Math.random() * 70 + 5).toFixed(1)),
        cpuSys: parseFloat((Math.random() * 30 + 1).toFixed(1)),
        memRss: Math.floor(Math.random() * 512000 + 128000),
        memHeap: Math.floor(Math.random() * 256000 + 64000),
        gcPause: parseFloat((Math.random() * 40 + 0.5).toFixed(2)),
        eventLoopLag: Math.floor(Math.random() * 25 + 1),
        activeHandles: Math.floor(Math.random() * 180 + 20),
        activeRequests: Math.floor(Math.random() * 60 + 2),
        fdCount: Math.floor(Math.random() * 800 + 100),
        threadPoolUtil: parseFloat((Math.random() * 0.85).toFixed(3)),
        networkLogSnapshot: ORBITAL_NETWORK_LOG_LEDGER.slice(0, 3)
      };
      setTelemetryDaemonBuffer(prev => {
        const next = [...prev, snapshot];
        return next.length > TELEMETRY_DAEMON_CONFIG.maxBufferSize ? next.slice(-TELEMETRY_DAEMON_CONFIG.maxBufferSize) : next;
      });
    }, TELEMETRY_DAEMON_CONFIG.batchFlushIntervalMs);
    return () => { clearInterval(telemetryIntervalRef.current); setDaemonSessionActive(false); };
  }, []);

  const computeTelemetryAverages = () => {
    if (telemetryDaemonBuffer.length === 0) return null;
    const recent = telemetryDaemonBuffer.slice(-20);
    return {
      avgCpu: parseFloat((recent.reduce((s, r) => s + Number(r.cpuUser), 0) / recent.length).toFixed(1)),
      avgMemMb: Math.floor(recent.reduce((s, r) => s + Number(r.memRss), 0) / recent.length / 1024),
      avgEventLag: Math.floor(recent.reduce((s, r) => s + Number(r.eventLoopLag), 0) / recent.length),
      avgThreadUtil: parseFloat((recent.reduce((s, r) => s + Number(r.threadPoolUtil), 0) / recent.length).toFixed(3))
    };
  };

  return (
    <>
        <section className="w-full bg-slate-900 border border-slate-800/80 rounded-2xl px-3 py-2.5 shadow-xl">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full border border-blue-500/20 p-0.5 bg-slate-950 flex-shrink-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-blue-400">SA</span>
            </div>
            <form onSubmit={handlePublishComposerPayloadAction} className="flex-1 flex items-center gap-2 bg-slate-950 border border-slate-800/80 focus-within:border-blue-500 rounded-full px-4 py-2 transition">
              <input type="text" value={composerInputString} onChange={(e) => setComposerInputString(e.target.value)} placeholder={dict.inputComposerPlaceholder} className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 outline-none min-w-0" />
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button type="button" onClick={() => alert("Live stream")} className="w-7 h-7 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center transition">
                  <svg className="w-3.5 h-3.5 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                </button>
                <button type="button" onClick={() => alert("Media upload")} className="w-7 h-7 rounded-full bg-emerald-500/20 hover:bg-emerald-500/40 flex items-center justify-center transition">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                </button>
                <button type="button" onClick={() => alert("Activity")} className="w-7 h-7 rounded-full bg-pink-500/20 hover:bg-pink-500/40 flex items-center justify-center transition">
                  <svg className="w-3.5 h-3.5 text-pink-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
                </button>
              </div>
              {composerInputString.trim() && (
                <button type="submit" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-full transition whitespace-nowrap flex-shrink-0">{dict.btnPublishPostText}</button>
              )}
            </form>
          </div>
        </section>

        <section className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{dict.lblActiveStoriesHeader}</h2>
            <div className="flex gap-1">
              <button onClick={() => executeScrollContainerShiftAdjustment('left')} className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[10px] font-black flex items-center justify-center transition outline-none">◀</button>
              <button onClick={() => executeScrollContainerShiftAdjustment('right')} className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[10px] font-black flex items-center justify-center transition outline-none">▶</button>
            </div>
          </div>
          <div ref={storyScrollContainerRef} className="w-full flex space-x-3 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="w-[120px] h-[115px] flex-shrink-0 bg-gradient-to-br from-indigo-600 to-slate-900 border border-slate-800/60 rounded-xl relative overflow-hidden snap-start shadow-md group cursor-pointer flex flex-col">
              <div className="flex-1 flex items-start justify-center pt-4">
                <div className="w-10 h-10 rounded-full bg-slate-900/80 border-2 border-blue-400 flex items-center justify-center text-xs font-bold text-white">SA</div>
              </div>
              <div className="flex flex-col items-center pb-3 space-y-1">
                <button onClick={() => setIsStoryModalOpen(true)} className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-lg flex items-center justify-center border-4 border-slate-900 transition outline-none shadow-lg group-hover:scale-105">+</button>
                <span className="text-[10px] text-slate-300 font-semibold">{dict.btnCreateStoryText}</span>
              </div>
            </div>
            <motion.div variants={storyTrayStaggerVariants} initial="hidden" animate="visible" className="flex space-x-3">
              {storiesPayloadsCollection.map((story) => (
                <motion.div key={story.id} variants={storyCardRevealVariants} whileHover={{ y: -4, transition: { duration: 0.15 } }} className={`w-[120px] h-[115px] flex-shrink-0 bg-gradient-to-br ${story.gradientFrom} ${story.gradientTo} border border-slate-800/60 rounded-xl relative overflow-hidden snap-start shadow-md group cursor-pointer`}>
                  {story.backgroundImage && (
                    <img src={story.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="relative z-10 p-2 flex flex-col justify-between h-full">
                    <div className="w-7 h-7 rounded-full bg-slate-950/80 border border-white/20 flex items-center justify-center text-[9px] font-bold text-white shadow-lg">{story.authorInitials}</div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] text-white font-medium leading-tight drop-shadow-md">"{story.textContext}"</p>
                      <p className="text-[7px] text-white/70">{story.authorName}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

      <AnimatePresence>
        {isStoryModalOpen && (
          <motion.div variants={immersiveModalBackdropVariants} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.94, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 15 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
              <button onClick={() => setIsStoryModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white font-bold text-xs p-1 outline-none">✕</button>
              <h2 className="text-sm font-bold text-white mb-4">{dict.modalStoryTitle}</h2>
              <form onSubmit={handleCommitNewStoryNodeAction} className="space-y-4">
                <textarea value={newStoryInputString} onChange={(e) => setNewStoryInputString(e.target.value)} placeholder={dict.modalInputPlaceholder} rows={4} className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl p-4 text-xs font-semibold outline-none text-white transition leading-relaxed resize-none" />
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl transition uppercase tracking-wider">{dict.btnCommitStory}</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeNotificationToast && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ type: "spring", stiffness: 450, damping: 22 }} className="fixed bottom-6 right-6 bg-slate-900 border-l-4 border-l-blue-500 border border-slate-800 p-4 rounded-xl shadow-2xl max-w-sm z-50">
            <span className="text-[8px] font-bold text-blue-400 uppercase tracking-wider">FEED GATEWAY</span>
            <p className="text-[11px] text-slate-200 mt-0.5">{activeNotificationToast.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
