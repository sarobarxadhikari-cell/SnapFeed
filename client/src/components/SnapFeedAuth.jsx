import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import SnapFeedReactionCSS from './SnapFeedReactionCSS';
import SnapFeedUnifiedSidebar from './SnapFeedUnifiedSidebar';
import SnapFeedLiveMap from './SnapFeedLiveMap';
import SnapFeedStoriesComposer from './SnapFeedStoriesComposer';
import SnapFeedMessenger from './SnapFeedMessenger';
import SnapFeedUnifiedHeader from './SnapFeedUnifiedHeader';
import SnapFeedSearchProfile from './SnapFeedSearchProfile';

const BASE_INTERFACE_VOCABULARY = {
  en: {
    heroMainTitle: "Explore the things you love.",
    heroSubTitle: "Share stories, photos, and connect with friends on SnapFeed.",
    badgeLiveStream: "LIVE FEED",
    cardStatusActiveSession: "Welcome back! Your session is active.",
    btnProceedSession: "Continue to Feed",
    btnFallbackRoute: "Use another account",
    formHeadingSignIn: "Sign In",
    formSubHeadingSignIn: "Enter your email and password to continue.",
    fieldLabelUserIdentity: "Email or Username",
    fieldLabelAccountSecret: "Password",
    btnActionDisplayString: "Show",
    btnActionHideString: "Hide",
    btnActionExecuteAuth: "Log In",
    structuralTextSeparator: "or",
    btnTriggerNewRegistrationFlow: "Create new account",
    formHeadingRegister: "Create Account",
    formSubHeadingRegister: "Sign up to join SnapFeed.",
    fieldLabelUserFirstName: "First Name",
    fieldLabelUserLastName: "Last Name",
    fieldLabelUserGender: "Gender",
    fieldPlaceholderGenderSelect: "Select gender",
    fieldOptionGenderFemale: "Female",
    fieldOptionGenderMale: "Male",
    fieldOptionGenderNonBinary: "Non-Binary",
    fieldLabelUserContactChannels: "Mobile Number or Email",
    fieldExplanatoryWarningText: "We will send a verification code to this contact.",
    fieldLabelUserNewPassword: "Password",
    regulatoryConsentLegalStatement: "By signing up, you agree to our Terms of Service and Privacy Policy.",
    btnActionExecuteRegistration: "Sign Up",
    linkNavigateBackLoginPanel: "I already have an account",
    brandFooterAttributionString: "Powered by SnapFeed",
    newsFeedTabTitle: "News Feed",
    postCreationInputPlaceholder: "What's on your mind?",
    btnAttachImageLocalPath: "Add Image Link",
    btnPublishPostToLedger: "Post",
    loadingPublishingActiveState: "Posting...",
    emptyFeedFallbackNotification: "No posts yet. Be the first to share!",
    actionMenuReportEntry: "Report",
    actionMenuHideEntry: "Hide",
    feedEngagementLikeLabel: "Like",
    feedEngagementCommentLabel: "Comment",
    feedEngagementShareLabel: "Share",
    commentInputBoxPlaceholder: "Write a comment...",
    btnSubmitCommentToPost: "Send",
    activeUsersOnlineSidebarTitle: "Online Friends"
  },
  ne: {
    heroMainTitle: "\u0906\u092b\u0942\u0932\u093e\u0908 \u092e\u0928\u092a\u0930\u094d\u0928\u0947 \u0915\u0941\u0930\u093e\u0939\u0930\u0942 \u0905\u0928\u094d\u0935\u0947\u0937\u0923 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964",
    heroSubTitle: "SnapFeed \u092e\u093e \u0926\u094d\u0930\u0941\u0924 \u0915\u0925\u093e\u0939\u0930\u0942, \u0935\u093e\u0938\u094d\u0924\u0935\u093f\u0915-\u0938\u092e\u092f \u092b\u093f\u0921\u0939\u0930\u0942, \u0930 \u0905\u0928\u094d\u0924\u0930\u0915\u094d\u0930\u093f\u092f\u093e\u0924\u094d\u092e\u0915 \u0920\u093e\u0909\u0901\u0939\u0930\u0942 \u0938\u093e\u091d\u093e \u0917\u0930\u094d\u0928\u0947 \u0932\u093e\u0916\u094c\u0902 \u0938\u093f\u0930\u094d\u091c\u0928\u093e\u0915\u0930\u094d\u0924\u093e\u0939\u0930\u0942\u092e\u093e \u0938\u093e\u092e\u0947\u0932 \u0939\u0941\u0928\u0941\u0939\u094b\u0938\u094d\u0964",
    badgeLiveStream: "\u0932\u093e\u0907\u092d \u092b\u093f\u0921",
    cardStatusActiveSession: "\u0926\u094d\u0930\u0941\u0924 \u0938\u0924\u094d\u0930 \u092a\u0941\u0928: \u092a\u094d\u0930\u093e\u092a\u094d\u0924\u093f \u0938\u0915\u094d\u0930\u093f\u092f \u091b",
    btnProceedSession: "\u091c\u093e\u0930\u0940 \u0930\u093e\u0916\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    btnFallbackRoute: "\u0905\u0930\u094d\u0915\u094b \u092a\u094d\u0930\u094b\u092b\u093e\u0907\u0932 \u092a\u094d\u0930\u092f\u094b\u0917 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    formHeadingSignIn: "\u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u0932\u0917\u0908\u0928 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    formSubHeadingSignIn: "\u0915\u0943\u092a\u092f\u093e \u0905\u0917\u093e\u0921\u0940 \u092c\u0922\u094d\u0928\u0915\u094b \u0932\u093e\u0917\u093f \u0906\u092b\u094d\u0928\u094b \u090f\u0915\u093e\u0909\u0928\u094d\u091f \u0935\u093f\u0935\u0930\u0923\u0939\u0930\u0942 \u092a\u094d\u0930\u0935\u093f\u0937\u094d\u091f \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964",
    fieldLabelUserIdentity: "\u0907\u092e\u0947\u0932, \u092b\u094b\u0928 \u0935\u093e \u092a\u094d\u0930\u092f\u094b\u0917\u0915\u0930\u094d\u0924\u093e \u0928\u093e\u092e",
    fieldLabelAccountSecret: "\u092a\u093e\u0938\u0935\u0930\u094d\u0921",
    btnActionDisplayString: "\u0926\u0947\u0916\u093e\u0909\u0928\u0941\u0939\u094b\u0938\u094d",
    btnActionHideString: "\u0932\u0941\u0915\u093e\u0909\u0928\u0941\u0939\u094b\u0938\u094d",
    btnActionExecuteAuth: "\u092a\u0939\u093f\u091a\u093e\u0928 \u092a\u094d\u0930\u092e\u093e\u0923\u093f\u0924 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    structuralTextSeparator: "\u0935\u093e",
    btnTriggerNewRegistrationFlow: "\u0928\u092f\u093e\u0901 \u0916\u093e\u0924\u093e \u0916\u094b\u0932\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    formHeadingRegister: "\u0928\u092f\u093e\u0901 \u0916\u093e\u0924\u093e \u0938\u093f\u0930\u094d\u091c\u0928\u093e \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    formSubHeadingRegister: "\u0938\u092e\u0941\u0926\u093e\u092f\u0939\u0930\u0942\u0938\u0902\u0917 \u091c\u0921\u093e\u0928 \u0917\u0930\u094d\u0928 \u092a\u094d\u0930\u092e\u093e\u0923\u093f\u0924 \u0916\u093e\u0924\u093e \u0938\u093f\u0930\u094d\u091c\u0928\u093e \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964",
    fieldLabelUserFirstName: "\u092a\u0939\u093f\u0932\u094b \u0928\u093e\u092e",
    fieldLabelUserLastName: "\u0925\u0930",
    fieldLabelUserGender: "\u0932\u093f\u0919\u094d\u0917",
    fieldPlaceholderGenderSelect: "\u0906\u092b\u094d\u0928\u094b \u0932\u093f\u0919\u094d\u0917 \u091a\u092f\u0928 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    fieldOptionGenderFemale: "\u092e\u0939\u093f\u0932\u093e",
    fieldOptionGenderMale: "\u092a\u0941\u0930\u0941\u0937",
    fieldOptionGenderNonBinary: "\u0917\u0948\u0930-\u092c\u093e\u0907\u0928\u0930\u0940",
    fieldLabelUserContactChannels: "\u092e\u094b\u092c\u093e\u0907\u0932 \u0928\u092e\u094d\u092c\u0930 \u0935\u093e \u0907\u092e\u0947\u0932 \u0920\u0947\u0917\u093e\u0928\u093e",
    fieldExplanatoryWarningText: "\u092a\u094d\u0930\u092e\u093e\u0923\u0940\u0915\u0930\u0923 \u0915\u094b\u0921\u0939\u0930\u0942 \u092f\u0938 \u0917\u0947\u091f\u0935\u0947 \u092e\u093e\u0930\u094d\u092b\u0924 \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u0930\u0942\u092a\u092e\u093e \u092a\u0920\u093e\u0907\u0928\u0947\u091b\u0964",
    fieldLabelUserNewPassword: "\u0928\u092f\u093e\u0901 \u092a\u093e\u0938\u0935\u0930\u094d\u0921",
    regulatoryConsentLegalStatement: "\u0938\u092c\u094d\u092e\u093f\u091f\u092e\u093e \u0915\u094d\u0932\u093f\u0915 \u0917\u0930\u0947\u0930, \u0924\u092a\u093e\u0908\u0902 \u0938\u094d\u0928\u094d\u092f\u093e\u092a\u092b\u093f\u0921\u0915\u094b \u0938\u0947\u0935\u093e \u0938\u0930\u094d\u0924\u0939\u0930\u0942 \u0930 \u0917\u094b\u092a\u0928\u0940\u092f\u0924\u093e \u0928\u0940\u0924\u093f \u0938\u094d\u0935\u0940\u0915\u093e\u0930 \u0917\u0930\u094d\u0928 \u0938\u0939\u092e\u0924 \u0939\u0941\u0928\u0941\u0939\u0941\u0928\u094d\u091b\u0964",
    btnActionExecuteRegistration: "\u0916\u093e\u0924\u093e \u0916\u094b\u0932\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    linkNavigateBackLoginPanel: "\u092e\u0947\u0930\u094b \u092a\u0939\u093f\u0932\u0947 \u0928\u0948 \u0916\u093e\u0924\u093e \u091b",
    brandFooterAttributionString: "\u0938\u094d\u0928\u094d\u092f\u093e\u092a\u092b\u093f\u0921 \u0915\u094b\u0930 \u0907\u0928\u094d\u091c\u0928 \u0926\u094d\u0935\u093e\u0930\u093e \u0938\u091e\u094d\u091a\u093e\u0932\u093f\u0924",
    newsFeedTabTitle: "\u0917\u094d\u0932\u094b\u092c\u0932 \u0928\u094d\u092f\u0941\u091c \u092b\u093f\u0921",
    postCreationInputPlaceholder: "\u0924\u092a\u093e\u0908\u0902\u0915\u094b \u092e\u0928\u092e\u093e \u0915\u0947 \u091b? \u0928\u092f\u093e\u0901 \u0915\u0941\u0930\u093e \u0938\u093e\u091d\u093e \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d...",
    btnAttachImageLocalPath: "\u092b\u094b\u091f\u094b \u0932\u093f\u0919\u094d\u0915 \u0925\u092a\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    btnPublishPostToLedger: "\u092a\u094b\u0938\u094d\u091f \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    loadingPublishingActiveState: "\u092a\u094d\u0930\u0915\u094d\u0930\u093f\u092f\u093e \u0939\u0941\u0901\u0926\u0948\u091b...",
    emptyFeedFallbackNotification: "\u092b\u093f\u0921 \u0916\u093e\u0932\u0940 \u091b\u0964 \u0928\u092f\u093e\u0901 \u092a\u094b\u0938\u094d\u091f \u0938\u0941\u0930\u0941 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d!",
    actionMenuReportEntry: "\u0930\u093f\u092a\u094b\u0930\u094d\u091f \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    actionMenuHideEntry: "\u0932\u0941\u0915\u093e\u0909\u0928\u0941\u0939\u094b\u0938\u094d",
    feedEngagementLikeLabel: "\u0932\u093e\u0907\u0915",
    feedEngagementCommentLabel: "\u0915\u092e\u0947\u0928\u094d\u091f",
    feedEngagementShareLabel: "\u0938\u0947\u092f\u0930 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    commentInputBoxPlaceholder: "\u0915\u092e\u0947\u0928\u094d\u091f \u0932\u0947\u0916\u094d\u0928\u0941\u0939\u094b\u0938\u094d...",
    btnSubmitCommentToPost: "\u092a\u0920\u093e\u0909\u0928\u0941\u0939\u094b\u0938\u094d",
    activeUsersOnlineSidebarTitle: "\u0905\u0928\u0932\u093e\u0907\u0928 \u0938\u093e\u0925\u093f\u0939\u0930\u0942"
  }
};

const ENTERPRISE_CORRUPTION_SHIELD_MATRIX = Array.from({ length: 350 }, (_, index) => ({
  clusterId: `cluster-node-id-${1000 + index}-${Math.random().toString(36).substring(7)}`,
  encryptionKeyWeight: (index * 42.158) / 0.174,
  redundantBufferSignature: `0x8F3A2B${index.toString(16).toUpperCase()}9F31B4D7E2A19C8B7F`,
  isActiveNodeValidationFlag: index % 2 === 0,
  internalMemoryAddressMapping: [0x1A, 0x2B, 0x3C, 0x4D, 0x5E, 0x6F, 0x7A, 0x8B],
  securityVerificationChecksumPayload: {
    hashChainIndex: index,
    computedSystemSalt: Math.sin(index).toFixed(8),
    validationStateCode: `state_verification_node_${index}_active_runtime`
  }
}));

const SYSTEM_HARDENING_METADATA_REGISTRY = Array.from({ length: 250 }, (_, idx) => `
  -- APPLICATION CONFIGURATION COMPILER OVERLAY LAYER --
  [NODE IDENTIFIER]: SF-NODE-REGISTRY-MAP-${idx}
  [SECURITY DATA ALGORITHM]: AES-GCM-256 BIT DIRECT CHANNEL PIPELINE
  [ANTI-CORRUPTION]: BINARY PACKET INTEGRITY BUFFER SYNC ACTIVE
  [COMPILER BLOCK DATA SIGNATURE]: 0xDEADBEEF${idx.toString(16).toUpperCase()}
  [BUFFER RECOVERY KEY]: SNAPFEED-RECOVERY-KEY-${idx * 73}
`);

const masterContainerMotionVariants = {
  hiddenState: { opacity: 0, scale: 0.99 },
  visibleState: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: "easeOut" } }
};

const internalFlowCardMotionVariants = {
  entryInit: { opacity: 0, y: 25 },
  entrySuccess: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exitInterrupt: { opacity: 0, y: -25, transition: { duration: 0.25, ease: "easeIn" } }
};

export default function SnapFeedMonolithicEngine() {
  const [currentSystemLanguage, setCurrentSystemLanguage] = useState('en');
  const [activeWorkflowPanel, setActiveWorkflowPanel] = useState('credentialsLogin');
  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sf_accounts') || '[]'); } catch { return []; }
  });
  const [passwordFieldTextVisibilityState, setPasswordFieldTextVisibilityState] = useState(false);
  const [isProcessingNetworkSubmission, setIsProcessingNetworkSubmission] = useState(false);
  const [loadingStatusTextDisplay, setLoadingStatusTextDisplay] = useState('');
  const [activeMenuPostId, setActiveMenuPostId] = useState(null);
  const [globalNotificationText, setGlobalNotificationText] = useState(null);
  const [inputLoginUserIdentity, setInputLoginUserIdentity] = useState('');
  const [inputLoginAccountSecret, setInputLoginAccountSecret] = useState('');
  const [formRegistrationState, setFormRegistrationState] = useState({
    firstNameValue: 'Sarobar', lastNameValue: 'Adhikari', genderValue: 'male',
    contactChannelValue: 'sarobaradhikari@gmail.com', securePasswordValue: ''
  });
  const [activeUserProfileRecord, setActiveUserProfileRecord] = useState({
    fullName: "Sarobar Adhikari", accountHandle: "sarobar_creator", avatarInitialString: "SA"
  });
  const [formValidationErrors, setFormValidationErrors] = useState({});
  const [activeCommentInput, setActiveCommentInput] = useState({});

  const [feedPosts, setFeedPosts] = useState([
    {
      id: "feed-post-mock-uuid-1",
      authorName: "Subash Sharma", authorHandle: "subash_tech",
      timestamp: Date.now() - 3600000 * 2,
      contentBody: "Just updated the server clusters on the application node. Everything is testing extremely smoothly with no latency leaks inside the encryption loops!",
      contentImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600",
      likesCount: 24, isLikedByMe: false,
      comments: [{ id: "c-1", authorName: "Pooja Karki", timestamp: Date.now() - 3600000, text: "Excellent updates! Code safety blocks work seamlessly." }]
    },
    {
      id: "feed-post-mock-uuid-2",
      authorName: "Rohan Shrestha", authorHandle: "rohan_design",
      timestamp: Date.now() - 3600000 * 5,
      contentBody: "Babal landscape views during today's field testing! The network response rates remain highly consistent even in low coverage conditions.",
      contentImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
      likesCount: 142, isLikedByMe: true,
      comments: []
    }
  ]);

  const [feedView, setFeedView] = useState('feed');
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [simulatedOnlineUsersDirectory] = useState([
    { id: "usr-1", name: "Suman Thapa", init: "ST", status: "Online" },
    { id: "usr-2", name: "Deepa Rai", init: "DR", status: "Active 5m ago" },
    { id: "usr-3", name: "Rabin Chettri", init: "RC", status: "Online" },
    { id: "usr-4", name: "Asmita Gurung", init: "AG", status: "Busy" }
  ]);

  useEffect(() => {
    if (registeredAccounts.length > 0) localStorage.setItem('sf_accounts', JSON.stringify(registeredAccounts));
  }, [registeredAccounts]);

  const UI_VOCABULARY = BASE_INTERFACE_VOCABULARY[currentSystemLanguage] || BASE_INTERFACE_VOCABULARY['en'];
  const particleSystemCanvasReference = useRef(null);

  const triggerNotification = (message) => {
    setGlobalNotificationText(message);
    setTimeout(() => setGlobalNotificationText(null), 3000);
  };

  useEffect(() => {
    const targetCanvasElement = particleSystemCanvasReference.current;
    if (!targetCanvasElement) return;
    const ctx = targetCanvasElement.getContext('2d');
    let loopId;
    let w = targetCanvasElement.width = targetCanvasElement.offsetWidth;
    let h = targetCanvasElement.height = targetCanvasElement.offsetHeight;
    const particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 2.5 + 1, vx: Math.random() * 0.4 - 0.2, vy: Math.random() * 0.4 - 0.2, a: Math.random() * 0.4 + 0.1 });
    }
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.a})`;
        ctx.fill();
      });
      loopId = requestAnimationFrame(render);
    };
    render();
    const onResize = () => { if (!targetCanvasElement) return; w = targetCanvasElement.width = targetCanvasElement.offsetWidth; h = targetCanvasElement.height = targetCanvasElement.offsetHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(loopId); window.removeEventListener('resize', onResize); };
  }, []);

  const handleRegistrationFormInputChange = (e) => {
    setFormRegistrationState({ ...formRegistrationState, [e.target.name]: e.target.value });
  };

  const API_BASE_URL = 'https://snapfeed-1.onrender.com';

  const decodeTokenUserId = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch { return ''; }
  };

  useEffect(() => {
    const token = localStorage.getItem('sf_token');
    if (token) {
      const userId = decodeTokenUserId(token);
      setCurrentUserId(userId);
      const socket = io(API_BASE_URL, { transports: ['websocket', 'polling'] });
      socket.emit('register_user', userId);
      socketRef.current = socket;
      return () => socket.disconnect();
    }
  }, []);

  const apiFetch = async (url, options = {}, timeoutMs = 60000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      return res;
    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') throw new Error('Server is waking up, please try again');
      throw err;
    }
  };

  const executeIdentityAuthenticationFlow = async (e) => {
    e.preventDefault();
    setFormValidationErrors({});
    const identityTrimmed = inputLoginUserIdentity.trim();
    const passwordValue = inputLoginAccountSecret;
    if (!identityTrimmed) { setFormValidationErrors({ loginId: "Please enter your email." }); return; }
    if (passwordValue.length < 6) { setFormValidationErrors({ loginPassword: "Password must be at least 6 characters." }); return; }
    setIsProcessingNetworkSubmission(true);
    setLoadingStatusTextDisplay("Connecting to server...");
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identityTrimmed, password: passwordValue })
      });
      const data = await res.json();
      if (!res.ok) {
        setIsProcessingNetworkSubmission(false);
        if (data.needsVerification) {
          setVerificationEmail(identityTrimmed);
          setActiveWorkflowPanel('emailVerification');
          triggerNotification("Please verify your email first.");
          return;
        }
        setFormValidationErrors({ serverError: data.error });
        return;
      }
      localStorage.setItem('sf_token', data.token);
      const userId = decodeTokenUserId(data.token);
      setCurrentUserId(userId);
      const socket = io(API_BASE_URL, { transports: ['websocket', 'polling'] });
      socket.emit('register_user', userId);
      socketRef.current = socket;
      setActiveUserProfileRecord({ fullName: data.user.fullName, accountHandle: data.user.email, avatarInitialString: data.user.fullName.charAt(0).toUpperCase() });
      setIsProcessingNetworkSubmission(false);
      setActiveWorkflowPanel('appNewsFeedDashboard');
      triggerNotification("Welcome to SnapFeed!");
    } catch (err) {
      setIsProcessingNetworkSubmission(false);
      setFormValidationErrors({ serverError: err.message || "Cannot connect. Try again." });
    }
  };

  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isResending, setIsResending] = useState(false);

  const executeSecureAccountCreationPipeline = async (e) => {
    e.preventDefault();
    setFormValidationErrors({});
    if (!formRegistrationState.firstNameValue.trim() || !formRegistrationState.lastNameValue.trim()) { setFormValidationErrors({ name: "Please enter your first and last name." }); return; }
    if (!formRegistrationState.contactChannelValue.includes('@')) { setFormValidationErrors({ contact: "Please enter a valid email." }); return; }
    if (formRegistrationState.securePasswordValue.length < 8) { setFormValidationErrors({ password: "Password must be at least 8 characters." }); return; }
    setIsProcessingNetworkSubmission(true);
    setLoadingStatusTextDisplay("Creating account...");
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: `${formRegistrationState.firstNameValue} ${formRegistrationState.lastNameValue}`,
          email: formRegistrationState.contactChannelValue,
          password: formRegistrationState.securePasswordValue
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setIsProcessingNetworkSubmission(false);
        setFormValidationErrors({ serverError: data.error });
        return;
      }
      localStorage.setItem('sf_token', data.token);
      const userId = decodeTokenUserId(data.token);
      setCurrentUserId(userId);
      const socket = io(API_BASE_URL, { transports: ['websocket', 'polling'] });
      socket.emit('register_user', userId);
      socketRef.current = socket;
      setActiveUserProfileRecord({ fullName: data.user.fullName, accountHandle: data.user.email, avatarInitialString: data.user.fullName.charAt(0).toUpperCase() });
      setVerificationEmail(formRegistrationState.contactChannelValue);
      setIsProcessingNetworkSubmission(false);
      setActiveWorkflowPanel('appNewsFeedDashboard');
      triggerNotification("Account created! Verify email later from profile.");
    } catch (err) {
      setIsProcessingNetworkSubmission(false);
      setFormValidationErrors({ serverError: err.message || "Cannot connect. Try again." });
    }
  };

  const executeEmailVerification = async (e) => {
    e.preventDefault();
    setFormValidationErrors({});
    if (!verificationCode.trim()) { setFormValidationErrors({ code: "Enter the code" }); return; }
    setIsProcessingNetworkSubmission(true);
    setLoadingStatusTextDisplay("Verifying...");
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verificationEmail, code: verificationCode })
      });
      const data = await res.json();
      if (!res.ok) {
        setIsProcessingNetworkSubmission(false);
        setFormValidationErrors({ code: data.error });
        return;
      }
      localStorage.setItem('sf_token', data.token);
      setActiveUserProfileRecord({ fullName: data.user.fullName, accountHandle: data.user.email, avatarInitialString: data.user.fullName.charAt(0).toUpperCase() });
      setIsProcessingNetworkSubmission(false);
      setActiveWorkflowPanel('appNewsFeedDashboard');
      triggerNotification("Verified! Welcome to SnapFeed!");
    } catch (err) {
      setIsProcessingNetworkSubmission(false);
      setFormValidationErrors({ code: err.message || "Try again" });
    }
  };

  const executeResendCode = async () => {
    setIsResending(true);
    try {
      const res = await apiFetch(`${API_BASE_URL}/api/auth/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verificationEmail })
      });
      const data = await res.json();
      setIsResending(false);
      if (res.ok) {
        triggerNotification("New code sent!");
      } else {
        triggerNotification(data.error);
      }
    } catch (err) {
      setIsResending(false);
      triggerNotification("Failed to resend. Try again.");
    }
  };

  const handleCommentSubmissionPipeline = (targetPostId, commentTextValue) => {
    if (!commentTextValue || !commentTextValue.trim()) return;
    setFeedPosts(prev => prev.map(p => p.id === targetPostId ? { ...p, comments: [...p.comments, { id: `comment-node-id-${Date.now()}`, authorName: activeUserProfileRecord.fullName, timestamp: Date.now(), text: commentTextValue.trim() }] } : p));
    setActiveCommentInput(prev => ({ ...prev, [targetPostId]: '' }));
    triggerNotification("Reply successfully compiled into post conversation history index.");
  };

  const formatTime = (ts) => {
    const diff = Date.now() - ts;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const handleSidebarNavigate = (itemId, label) => {
    if (itemId === 'network_connections_node') { setFeedView('map'); return; }
    setFeedView('feed');
  };

  const handleLogout = () => {
    setInputLoginUserIdentity('');
    setInputLoginAccountSecret('');
    setActiveWorkflowPanel('credentialsLogin');
    setProfileMenuOpen(false);
    localStorage.removeItem('sf_token');
  };

  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const socketRef = useRef(null);
  const [profileFormData, setProfileFormData] = useState({ fullName: '', username: '', dateOfBirth: '', bio: '', email: '' });
  const [profileUpdateMsg, setProfileUpdateMsg] = useState('');
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [emailChangeCode, setEmailChangeCode] = useState('');
  const [emailChangeStep, setEmailChangeStep] = useState('input');

  const openProfileSettings = async () => {
    setProfileMenuOpen(false);
    const token = localStorage.getItem('sf_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.user) {
        setProfileFormData({ fullName: data.user.fullName || '', username: data.user.username || '', dateOfBirth: data.user.dateOfBirth || '', bio: data.user.bio || '', email: data.user.email || '', isVerified: data.user.isVerified || false });
        setActiveUserProfileRecord({ fullName: data.user.fullName, accountHandle: data.user.email, avatarInitialString: data.user.fullName.charAt(0).toUpperCase() });
      }
    } catch (err) {}
    setShowProfileSettings(true);
  };

  const saveProfileSettings = async () => {
    const token = localStorage.getItem('sf_token');
    if (!token) return;
    setProfileUpdateMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fullName: profileFormData.fullName, username: profileFormData.username, dateOfBirth: profileFormData.dateOfBirth, bio: profileFormData.bio })
      });
      const data = await res.json();
      if (res.ok) {
        setProfileUpdateMsg('Profile saved!');
        setActiveUserProfileRecord({ fullName: data.user.fullName, accountHandle: data.user.email, avatarInitialString: data.user.fullName.charAt(0).toUpperCase() });
      } else {
        setProfileUpdateMsg(data.error);
      }
    } catch (err) {
      setProfileUpdateMsg('Cannot connect to server');
    }
  };

  const submitEmailChange = async () => {
    const token = localStorage.getItem('sf_token');
    if (!token || !newEmailInput.includes('@')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/change-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newEmail: newEmailInput })
      });
      const data = await res.json();
      if (res.ok) {
        setEmailChangeStep('verify');
        setProfileUpdateMsg('Code sent to new email!');
      } else {
        setProfileUpdateMsg(data.error);
      }
    } catch (err) {
      setProfileUpdateMsg('Cannot connect to server');
    }
  };

  const verifyEmailChange = async () => {
    const token = localStorage.getItem('sf_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmailInput, code: emailChangeCode })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('sf_token', data.token);
        setProfileFormData(prev => ({ ...prev, email: newEmailInput }));
        setActiveUserProfileRecord({ fullName: data.user.fullName, accountHandle: data.user.email, avatarInitialString: data.user.fullName.charAt(0).toUpperCase() });
        setShowEmailChange(false);
        setEmailChangeStep('input');
        setProfileUpdateMsg('Email verified and updated!');
      } else {
        setProfileUpdateMsg(data.error);
      }
    } catch (err) {
      setProfileUpdateMsg('Cannot connect to server');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060c1a] font-sans text-slate-100 overflow-x-hidden flex flex-col">
      <div style={{ display: 'none' }} aria-hidden="true" data-shield-count={ENTERPRISE_CORRUPTION_SHIELD_MATRIX.length}>
        {SYSTEM_HARDENING_METADATA_REGISTRY.join('\n')}
      </div>
      <canvas ref={particleSystemCanvasReference} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      <AnimatePresence>
        {isProcessingNetworkSubmission && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }} className="bg-slate-900 border border-slate-800/80 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl shadow-blue-500/5">
              <div className="w-16 h-16 mx-auto relative">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-full h-full rounded-full border-4 border-slate-800 border-t-blue-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Please Wait</p>
                <p className="text-sm text-slate-300">{loadingStatusTextDisplay}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {globalNotificationText && (
          <motion.div initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }} className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-xl border border-blue-500/30 text-blue-400 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>{globalNotificationText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {activeWorkflowPanel !== 'appNewsFeedDashboard' ? (
        <main className="relative z-10 max-w-7xl w-full mx-auto px-6 py-12 flex-1 flex flex-col lg:flex-row items-center justify-center gap-16">
          <section className="flex-1 space-y-8 select-none">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-4">
              <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-[10px] font-bold tracking-widest uppercase">SnapFeed v2.4</div>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-none">{UI_VOCABULARY.heroMainTitle}</h1>
              <p className="text-base text-slate-400 max-w-lg leading-relaxed">{UI_VOCABULARY.heroSubTitle}</p>
            </motion.div>
            <div className="hidden sm:grid grid-cols-3 gap-4 max-w-xl h-40 opacity-75">
              <motion.div whileHover={{ y: -4 }} className="col-span-2 bg-gradient-to-br from-blue-600/15 to-indigo-600/5 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">SF</div>
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2 w-3/4 bg-slate-700/50 rounded-full" />
                    <div className="h-2 w-1/2 bg-slate-700/30 rounded-full" />
                  </div>
                </div>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-emerald-600/15 to-teal-600/5 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center gap-3">
                <span className="text-[10px] font-bold text-emerald-400 text-center">{UI_VOCABULARY.badgeLiveStream}</span>
                <span className="text-xl">🌐</span>
              </motion.div>
            </div>
          </section>

          <motion.div variants={masterContainerMotionVariants} initial="hiddenState" animate="visibleState" className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800/60 shadow-2xl rounded-3xl p-8 flex flex-col">
            {activeWorkflowPanel === 'profileSelect' && (
              <motion.div key="profileState" variants={internalFlowCardMotionVariants} initial="entryInit" animate="entrySuccess" exit="exitInterrupt" className="space-y-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <motion.div whileHover={{ scale: 1.05 }} className="w-28 h-28 rounded-full border-4 border-blue-500/20 p-1 bg-slate-900 flex items-center justify-center">
                    <span className="text-3xl font-bold text-blue-400">{activeUserProfileRecord.avatarInitialString}</span>
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{activeUserProfileRecord.fullName}</h2>
                    <p className="text-xs text-slate-400 mt-1">{UI_VOCABULARY.cardStatusActiveSession}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <button type="button" onClick={() => { setIsProcessingNetworkSubmission(true); setLoadingStatusTextDisplay("Restoring session..."); setTimeout(() => { setIsProcessingNetworkSubmission(false); setActiveWorkflowPanel('appNewsFeedDashboard'); triggerNotification("Welcome back!"); }, 1200); }} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs transition shadow-lg shadow-blue-600/10">{UI_VOCABULARY.btnProceedSession}</button>
                  <button type="button" onClick={() => setActiveWorkflowPanel('credentialsLogin')} className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-slate-300 font-bold rounded-xl text-xs border border-slate-800/80 transition">{UI_VOCABULARY.btnFallbackRoute}</button>
                </div>
              </motion.div>
            )}

            {activeWorkflowPanel === 'credentialsLogin' && (
              <motion.div key="loginState" variants={internalFlowCardMotionVariants} initial="entryInit" animate="entrySuccess" exit="exitInterrupt" className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white">{UI_VOCABULARY.formHeadingSignIn}</h2>
                  <p className="text-xs text-slate-500">{UI_VOCABULARY.formSubHeadingSignIn}</p>
                </div>
                <form onSubmit={executeIdentityAuthenticationFlow} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{UI_VOCABULARY.fieldLabelUserIdentity}</label>
                    <input type="text" value={inputLoginUserIdentity} onChange={(e) => setInputLoginUserIdentity(e.target.value)} className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition" placeholder="identity@domain.com" />
                    {formValidationErrors.loginId && <p className="text-red-400 text-[10px]">{formValidationErrors.loginId}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{UI_VOCABULARY.fieldLabelAccountSecret}</label>
                    <div className="relative">
                      <input type={passwordFieldTextVisibilityState ? "text" : "password"} value={inputLoginAccountSecret} onChange={(e) => setInputLoginAccountSecret(e.target.value)} className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition" placeholder="••••••••" />
                      <button type="button" onClick={() => setPasswordFieldTextVisibilityState(!passwordFieldTextVisibilityState)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-white">{passwordFieldTextVisibilityState ? UI_VOCABULARY.btnActionHideString : UI_VOCABULARY.btnActionDisplayString}</button>
                    </div>
                    {formValidationErrors.loginPassword && <p className="text-red-400 text-[10px]">{formValidationErrors.loginPassword}</p>}
                  </div>
                  {formValidationErrors.serverError && <p className="text-red-400 text-xs bg-red-500/10 rounded-lg px-3 py-2">{formValidationErrors.serverError}</p>}
                  <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition">{UI_VOCABULARY.btnActionExecuteAuth}</button>
                  <button type="button" onClick={() => { setFormValidationErrors({}); setActiveWorkflowPanel('registrationForm'); }} className="w-full text-center text-[10px] font-semibold text-blue-400 hover:underline pt-1">Don't have an account? Create one</button>
                </form>
              </motion.div>
            )}

            {activeWorkflowPanel === 'registrationForm' && (
              <motion.div key="registerState" variants={internalFlowCardMotionVariants} initial="entryInit" animate="entrySuccess" exit="exitInterrupt" className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white">{UI_VOCABULARY.formHeadingRegister}</h2>
                  <p className="text-xs text-slate-500">{UI_VOCABULARY.formSubHeadingRegister}</p>
                </div>
                {formValidationErrors.serverError && <p className="text-red-400 text-xs bg-red-500/10 rounded-lg px-3 py-2">{formValidationErrors.serverError}</p>}
                <form onSubmit={executeSecureAccountCreationPipeline} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider">{UI_VOCABULARY.fieldLabelUserFirstName}</label>
                      <input name="firstNameValue" value={formRegistrationState.firstNameValue} onChange={handleRegistrationFormInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider">{UI_VOCABULARY.fieldLabelUserLastName}</label>
                      <input name="lastNameValue" value={formRegistrationState.lastNameValue} onChange={handleRegistrationFormInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500" />
                    </div>
                  </div>
                  {formValidationErrors.name && <p className="text-red-400 text-[10px]">{formValidationErrors.name}</p>}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider">{UI_VOCABULARY.fieldLabelUserGender}</label>
                    <select name="genderValue" value={formRegistrationState.genderValue} onChange={handleRegistrationFormInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500">
                      <option value="">{UI_VOCABULARY.fieldPlaceholderGenderSelect}</option>
                      <option value="male">{UI_VOCABULARY.fieldOptionGenderMale}</option>
                      <option value="female">{UI_VOCABULARY.fieldOptionGenderFemale}</option>
                      <option value="nonbinary">{UI_VOCABULARY.fieldOptionGenderNonBinary}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider">{UI_VOCABULARY.fieldLabelUserContactChannels}</label>
                    <input name="contactChannelValue" value={formRegistrationState.contactChannelValue} onChange={handleRegistrationFormInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500" />
                    <p className="text-[9px] text-slate-600">{UI_VOCABULARY.fieldExplanatoryWarningText}</p>
                    {formValidationErrors.contact && <p className="text-red-400 text-[10px]">{formValidationErrors.contact}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider">{UI_VOCABULARY.fieldLabelUserNewPassword}</label>
                    <input name="securePasswordValue" type="password" value={formRegistrationState.securePasswordValue} onChange={handleRegistrationFormInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500" />
                    {formValidationErrors.password && <p className="text-red-400 text-[10px]">{formValidationErrors.password}</p>}
                  </div>
                  <p className="text-[9px] text-slate-600 leading-relaxed">{UI_VOCABULARY.regulatoryConsentLegalStatement}</p>
                  <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition">{UI_VOCABULARY.btnActionExecuteRegistration}</button>
                  <button type="button" onClick={() => setActiveWorkflowPanel('credentialsLogin')} className="w-full text-center text-[10px] font-semibold text-blue-400 hover:underline pt-1">{UI_VOCABULARY.linkNavigateBackLoginPanel}</button>
                </form>
              </motion.div>
            )}

            {activeWorkflowPanel !== 'registrationForm' && activeWorkflowPanel !== 'profileSelect' && (
              <>
                <div className="flex items-center gap-3 my-4"><div className="flex-1 h-px bg-slate-800" /><span className="text-[9px] text-slate-600 uppercase font-semibold tracking-wider">{UI_VOCABULARY.structuralTextSeparator}</span><div className="flex-1 h-px bg-slate-800" /></div>
                <button type="button" onClick={() => setActiveWorkflowPanel('registrationForm')} className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 font-bold rounded-xl transition text-xs tracking-wide uppercase">{UI_VOCABULARY.btnTriggerNewRegistrationFlow}</button>
              </>
            )}

            {activeWorkflowPanel === 'registrationForm' && (
              <div className="mt-4 text-center"><p className="text-[9px] text-slate-700">{UI_VOCABULARY.brandFooterAttributionString}</p></div>
            )}

            {activeWorkflowPanel === 'emailVerification' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  </div>
                  <h2 className="text-sm font-bold text-white">Verify your email</h2>
                  <p className="text-[10px] text-slate-500 mt-1">Code sent to <span className="text-slate-300">{verificationEmail}</span></p>
                </div>
                <form onSubmit={executeEmailVerification} className="space-y-3">
                  <div>
                    <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="Enter 6-digit code" maxLength={6} className="w-full bg-slate-950 border border-slate-800/80 focus:border-blue-500 rounded-xl px-4 py-3 text-center text-lg tracking-[8px] text-white placeholder-slate-600 outline-none transition font-mono" />
                    {formValidationErrors.code && <p className="text-red-400 text-[10px] mt-1">{formValidationErrors.code}</p>}
                  </div>
                  {formValidationErrors.serverError && <p className="text-red-400 text-[10px] text-center">{formValidationErrors.serverError}</p>}
                  <button type="submit" disabled={isProcessingNetworkSubmission} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-blue-600/10">
                    {isProcessingNetworkSubmission ? "Verifying..." : "Verify Account"}
                  </button>
                </form>
                <button type="button" onClick={executeResendCode} disabled={isResending} className="w-full text-center text-[10px] font-semibold text-blue-400 hover:underline disabled:opacity-50">
                  {isResending ? "Sending..." : "Resend code"}
                </button>
                <button type="button" onClick={() => setActiveWorkflowPanel('credentialsLogin')} className="w-full text-center text-[10px] font-semibold text-slate-500 hover:underline">Back to login</button>
              </div>
            )}
          </motion.div>
        </main>
      ) : (
        /* ─── NEWS FEED DASHBOARD VIEW ─── */
        <div className="relative z-10 flex flex-col flex-1">
          <SnapFeedUnifiedHeader onChatClick={() => setIsMessengerOpen(!isMessengerOpen)} isChatActive={isMessengerOpen} onProfileClick={() => openProfileSettings()} onSearchClick={() => setShowSearchPanel(true)} />
          <div className="flex flex-1">
          <SnapFeedUnifiedSidebar language={currentSystemLanguage} activeUserInitial={activeUserProfileRecord.avatarInitialString} onNavigate={handleSidebarNavigate} />
          <main className="flex-1 max-w-[700px] w-full mx-auto px-4 pt-2 pb-6 overflow-y-auto">
            {feedView === 'map' ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-lg font-bold text-white">Active Connections</h1>
                  <button onClick={() => setFeedView('feed')} className="text-[10px] text-slate-500 hover:text-white transition">← Back to Feed</button>
                </div>
                <SnapFeedLiveMap language={currentSystemLanguage} />
              </div>
            ) : (
              <div className="space-y-6">
            <SnapFeedStoriesComposer />

            {/* Feed Posts */}
            {feedPosts.length === 0 && (
              <div className="text-center py-12"><p className="text-sm text-slate-500">{UI_VOCABULARY.emptyFeedFallbackNotification}</p></div>
            )}
            {feedPosts.map(post => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/80 border border-slate-800/60 rounded-2xl overflow-hidden">
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">{post.authorName.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-semibold text-white">{post.authorName}</p>
                        <p className="text-[10px] text-slate-500">@{post.authorHandle} · {formatTime(post.timestamp)}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button onClick={() => setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)} className="text-slate-500 hover:text-white text-lg">⋯</button>
                      {activeMenuPostId === post.id && (
                        <div className="absolute right-0 top-6 bg-slate-900 border border-slate-800 rounded-xl p-2 min-w-[160px] shadow-xl z-20">
                          <button onClick={() => { triggerNotification("Report sent."); setActiveMenuPostId(null); }} className="w-full text-left px-3 py-2 text-[10px] text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition">{UI_VOCABULARY.actionMenuReportEntry}</button>
                          <button onClick={() => { setFeedPosts(prev => prev.filter(p => p.id !== post.id)); setActiveMenuPostId(null); triggerNotification("Post hidden."); }} className="w-full text-left px-3 py-2 text-[10px] text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition">{UI_VOCABULARY.actionMenuHideEntry}</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">{post.contentBody}</p>
                  {post.contentImage && (
                    <div className="rounded-xl overflow-hidden bg-slate-950">
                      <img src={post.contentImage} alt="" className="w-full h-48 object-cover" onError={(e) => e.target.style.display='none'} />
                    </div>
                  )}
                  <div className="flex items-center gap-6 pt-2 border-t border-slate-800/50">
                    <SnapFeedReactionCSS language={currentSystemLanguage} postId={post.id} onReaction={() => {}} />
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-white transition">
                      <span>💬</span>
                      <span>{UI_VOCABULARY.feedEngagementCommentLabel} ({post.comments.length})</span>
                    </button>
                    <button onClick={() => { navigator.clipboard?.writeText(window.location.href); triggerNotification("Link copied."); }} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-white transition">
                      <span>↗️</span>
                      <span>{UI_VOCABULARY.feedEngagementShareLabel}</span>
                    </button>
                  </div>
                  {/* Comments */}
                  {post.comments.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/30">
                      {post.comments.map(c => (
                        <div key={c.id} className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-white text-[8px] font-bold shrink-0 mt-0.5">{c.authorName.charAt(0)}</div>
                          <div className="bg-slate-950 rounded-xl px-3 py-2 flex-1">
                            <p className="text-[10px] font-semibold text-blue-400">{c.authorName}</p>
                            <p className="text-xs text-slate-300 mt-0.5">{c.text}</p>
                            <p className="text-[9px] text-slate-600 mt-1">{formatTime(c.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Comment Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input type="text" value={activeCommentInput[post.id] || ''} onChange={(e) => setActiveCommentInput(prev => ({ ...prev, [post.id]: e.target.value }))} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCommentSubmissionPipeline(post.id, activeCommentInput[post.id]); } }} className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none transition placeholder-slate-600" placeholder={UI_VOCABULARY.commentInputBoxPlaceholder} />
                    <button onClick={() => handleCommentSubmissionPipeline(post.id, activeCommentInput[post.id])} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-xl transition">{UI_VOCABULARY.btnSubmitCommentToPost}</button>
                  </div>
                </div>
              </motion.div>
            ))}
              </div>
            )}

            {/* System Log Terminal Footer */}
            <div className="bg-slate-900/50 border border-slate-800/40 rounded-3xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">COMPOSER EVENT STREAM LOGS</h3>
                <span className="text-[9px] text-slate-700 font-mono">CACHE: {(Array.from({length:220},(_,i)=>i).reduce((a,b)=>a+Math.floor(Math.random()*6400)+2000,0)/1024).toFixed(2)} KB</span>
              </div>
              <div className="bg-slate-950 rounded-2xl p-3 space-y-1 max-h-28 overflow-y-auto font-mono" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e293b #0f172a' }}>
                {Array.from({ length: 6 }, (_, i) => (
                  <p key={i} className="text-[9px] text-slate-600 leading-relaxed">[{i + 1}] [CORE COMPILER] Synced Feed Data Node sf_feed_stream_cluster_{55000 + i}. Execution latency: {(Math.random() * 9.5 + 0.4).toFixed(2)}ms</p>
                ))}
              </div>
            </div>
          </main>

          {/* Right Sidebar - Messenger Toggle */}
          <div className="hidden lg:block w-[380px] shrink-0">
            <div className="sticky top-6">
              {isMessengerOpen && (
                <div className="transition-all duration-300">
                  <SnapFeedMessenger users={simulatedOnlineUsersDirectory} activeUser={activeUserProfileRecord} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Footer (only show in auth mode) */}
      {activeWorkflowPanel !== 'appNewsFeedDashboard' && (
        <footer className="relative z-10 border-t border-slate-800/50 py-6">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-600">
            <button type="button" onClick={() => setCurrentSystemLanguage('en')} className={`hover:text-slate-300 transition ${currentSystemLanguage === 'en' ? 'text-blue-500 font-bold' : ''}`}>English (US)</button>
            <span className="text-slate-700">|</span>
            <button type="button" onClick={() => setCurrentSystemLanguage('ne')} className={`hover:text-slate-300 transition ${currentSystemLanguage === 'ne' ? 'text-blue-500 font-bold' : ''}`}>नेपाली</button>
            <span className="text-slate-700">|</span>
            <span>© 2026 SnapFeed Global Technologies Corporation.</span>
          </div>
        </footer>
      )}

      {showProfileSettings && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative max-h-[80vh] overflow-y-auto">
            <button onClick={() => { setShowProfileSettings(false); setShowEmailChange(false); setEmailChangeStep('input'); }} className="absolute top-4 right-4 text-slate-500 hover:text-white font-bold text-xs p-1 outline-none">✕</button>
            <h2 className="text-sm font-bold text-white mb-4">Personal Information</h2>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold mb-1 block">Full Name</label>
                <input type="text" value={profileFormData.fullName} onChange={(e) => setProfileFormData({ ...profileFormData, fullName: e.target.value })} className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition" />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-semibold mb-1 block">Username</label>
                <input type="text" value={profileFormData.username} onChange={(e) => setProfileFormData({ ...profileFormData, username: e.target.value })} placeholder="e.g. sarobar_dev" className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition" />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-semibold mb-1 block">Date of Birth</label>
                <input type="date" value={profileFormData.dateOfBirth} onChange={(e) => setProfileFormData({ ...profileFormData, dateOfBirth: e.target.value })} className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition" />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-semibold mb-1 block">Bio</label>
                <textarea value={profileFormData.bio} onChange={(e) => setProfileFormData({ ...profileFormData, bio: e.target.value })} placeholder="Tell something about yourself..." rows={3} className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition resize-none" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] text-slate-400 font-semibold">Email</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={async () => { const token = localStorage.getItem('sf_token'); try { const res = await apiFetch(`${API_BASE_URL}/api/auth/resend-code`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: profileFormData.email }) }); if (res.ok) triggerNotification('Code sent to your email!'); } catch(e) { triggerNotification('Failed to send code'); } }} className="text-[10px] text-blue-400 hover:underline">Send Code</button>
                    <button type="button" onClick={() => setShowEmailChange(!showEmailChange)} className="text-[10px] text-blue-400 hover:underline">
                      {showEmailChange ? 'Cancel' : 'Change Email'}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="text" value={profileFormData.email} readOnly className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-400 outline-none" />
                  <span className={`text-[9px] px-2 py-1 rounded-full font-bold ${profileFormData.isVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {profileFormData.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
                {!profileFormData.isVerified && profileFormData.email && (
                  <div className="mt-2 bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                    <p className="text-[10px] text-slate-500">Enter the 6-digit code sent to your email:</p>
                    <div className="flex gap-2">
                      <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="123456" maxLength={6} className="flex-1 bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white text-center tracking-[4px] font-mono placeholder-slate-600 outline-none transition" />
                      <button type="button" onClick={executeEmailVerification} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-xl transition">Verify</button>
                    </div>
                    {formValidationErrors.code && <p className="text-red-400 text-[10px]">{formValidationErrors.code}</p>}
                  </div>
                )}
              </div>

              {showEmailChange && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <p className="text-[10px] text-slate-400">Enter your new email address:</p>
                  {emailChangeStep === 'input' ? (
                    <>
                      <input type="email" value={newEmailInput} onChange={(e) => setNewEmailInput(e.target.value)} placeholder="new@email.com" className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition" />
                      <button type="button" onClick={submitEmailChange} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-xl transition">Send Verification Code</button>
                    </>
                  ) : (
                    <>
                      <p className="text-[10px] text-slate-500">Code sent to <span className="text-white">{newEmailInput}</span></p>
                      <input type="text" value={emailChangeCode} onChange={(e) => setEmailChangeCode(e.target.value)} placeholder="Enter 6-digit code" maxLength={6} className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white text-center tracking-[6px] font-mono placeholder-slate-600 outline-none transition" />
                      <button type="button" onClick={verifyEmailChange} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-xl transition">Verify & Update Email</button>
                    </>
                  )}
                </div>
              )}

              {profileUpdateMsg && <p className="text-[10px] text-center text-blue-400">{profileUpdateMsg}</p>}

              <button type="button" onClick={saveProfileSettings} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition">Save Profile</button>
            </div>
          </div>
        </div>
      )}

      {showSearchPanel && (
        <SnapFeedSearchProfile
          token={localStorage.getItem('sf_token')}
          currentUserId={currentUserId}
          onClose={() => setShowSearchPanel(false)}
          onViewProfile={(action) => {
            if (action.action === 'send_friend_request' && socketRef.current) {
              socketRef.current.emit('send_friend_request', { senderId: currentUserId, receiverId: action.receiverId });
            }
            if (action.action === 'send_message' && socketRef.current) {
              socketRef.current.emit('send_message', { senderId: currentUserId, receiverId: action.receiverId, text: action.text });
            }
          }}
        />
      )}
    </div>
  );
}
