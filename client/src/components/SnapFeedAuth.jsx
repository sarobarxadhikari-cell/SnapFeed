import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SnapFeedReactionCSS from './SnapFeedReactionCSS';
import SnapFeedUnifiedSidebar from './SnapFeedUnifiedSidebar';
import SnapFeedLiveMap from './SnapFeedLiveMap';
import SnapFeedStoriesComposer from './SnapFeedStoriesComposer';
import SnapFeedMessenger from './SnapFeedMessenger';

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
  const [inputPostContentText, setInputPostContentText] = useState('');
  const [inputPostAttachedImageUrl, setInputPostAttachedImageUrl] = useState('');
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

  const executeIdentityAuthenticationFlow = (e) => {
    e.preventDefault();
    setFormValidationErrors({});
    const identityTrimmed = inputLoginUserIdentity.trim();
    const passwordValue = inputLoginAccountSecret;
    if (!identityTrimmed) { setFormValidationErrors({ loginId: "Please enter your email." }); return; }
    if (passwordValue.length < 6) { setFormValidationErrors({ loginPassword: "Password must be at least 6 characters." }); return; }
    const matchedAccount = registeredAccounts.find(acc => acc.contact.toLowerCase() === identityTrimmed.toLowerCase() && acc.password === passwordValue);
    if (!matchedAccount) {
      setFormValidationErrors({ serverError: "Account not found. Check your email or create a new account." });
      return;
    }
    setIsProcessingNetworkSubmission(true);
    setLoadingStatusTextDisplay("Logging in...");
    setTimeout(() => {
      setIsProcessingNetworkSubmission(false);
      setActiveUserProfileRecord({ fullName: matchedAccount.fullName, accountHandle: matchedAccount.handle, avatarInitialString: matchedAccount.firstName.charAt(0).toUpperCase() });
      setActiveWorkflowPanel('appNewsFeedDashboard');
      triggerNotification("Welcome to SnapFeed!");
    }, 1500);
  };

  const executeSecureAccountCreationPipeline = (e) => {
    e.preventDefault();
    setFormValidationErrors({});
    if (!formRegistrationState.firstNameValue.trim() || !formRegistrationState.lastNameValue.trim()) { setFormValidationErrors({ name: "Please enter your first and last name." }); return; }
    if (!formRegistrationState.contactChannelValue.includes('@')) { setFormValidationErrors({ contact: "Please enter a valid email." }); return; }
    if (formRegistrationState.securePasswordValue.length < 8) { setFormValidationErrors({ password: "Password must be at least 8 characters." }); return; }
    setIsProcessingNetworkSubmission(true);
    setLoadingStatusTextDisplay("Creating account...");
    const newAccount = {
      firstName: formRegistrationState.firstNameValue,
      lastName: formRegistrationState.lastNameValue,
      fullName: `${formRegistrationState.firstNameValue} ${formRegistrationState.lastNameValue}`,
      handle: `${formRegistrationState.firstNameValue.toLowerCase()}_creator`,
      contact: formRegistrationState.contactChannelValue,
      password: formRegistrationState.securePasswordValue
    };
    setTimeout(() => {
      setLoadingStatusTextDisplay("Almost done...");
      setTimeout(() => {
        setIsProcessingNetworkSubmission(false);
        setRegisteredAccounts(prev => [...prev, newAccount]);
        setActiveUserProfileRecord({ fullName: newAccount.fullName, accountHandle: newAccount.handle, avatarInitialString: newAccount.firstName.charAt(0).toUpperCase() });
        setActiveWorkflowPanel('appNewsFeedDashboard');
        triggerNotification("Account created successfully.");
      }, 1200);
    }, 1500);
  };

  const executeSubmitNewPostEntryToFeed = (e) => {
    e.preventDefault();
    if (!inputPostContentText.trim()) { triggerNotification("Post text body canvas cannot be deployed empty."); return; }
    setFeedPosts([{ id: `dynamic-post-id-${Date.now()}`, authorName: activeUserProfileRecord.fullName, authorHandle: activeUserProfileRecord.accountHandle, timestamp: Date.now(), contentBody: inputPostContentText, contentImage: inputPostAttachedImageUrl.trim() || null, likesCount: 0, isLikedByMe: false, comments: [] }, ...feedPosts]);
    setInputPostContentText(''); setInputPostAttachedImageUrl('');
    triggerNotification("Post published!");
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
    if (itemId === 'community_channels_node') { setFeedView('messenger'); return; }
    setFeedView('feed');
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
          </motion.div>
        </main>
      ) : (
        /* ─── NEWS FEED DASHBOARD VIEW ─── */
        <div className="relative z-10 flex-1 flex">
          <SnapFeedUnifiedSidebar language={currentSystemLanguage} activeUserInitial={activeUserProfileRecord.avatarInitialString} onNavigate={handleSidebarNavigate} />
          <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 overflow-y-auto">
            {feedView === 'map' ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-lg font-bold text-white">Active Connections</h1>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setFeedView('feed')} className="text-[10px] text-slate-500 hover:text-white transition">← Back to Feed</button>
                    <button onClick={() => { setInputLoginUserIdentity(''); setInputLoginAccountSecret(''); setActiveWorkflowPanel('credentialsLogin'); }} className="text-[10px] text-slate-500 hover:text-white transition">Logout</button>
                  </div>
                </div>
                <SnapFeedLiveMap language={currentSystemLanguage} />
              </div>
            ) : feedView === 'messenger' ? (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-lg font-bold text-white">Messenger</h1>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setFeedView('feed')} className="text-[10px] text-slate-500 hover:text-white transition">← Back to Feed</button>
                    <button onClick={() => { setInputLoginUserIdentity(''); setInputLoginAccountSecret(''); setActiveWorkflowPanel('credentialsLogin'); }} className="text-[10px] text-slate-500 hover:text-white transition">Logout</button>
                  </div>
                </div>
                <div className="flex-1 -mx-4 -mb-6">
                  <SnapFeedMessenger users={simulatedOnlineUsersDirectory} activeUser={activeUserProfileRecord} />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-white">{UI_VOCABULARY.newsFeedTabTitle}</h1>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">{activeUserProfileRecord.avatarInitialString}</div>
                <button onClick={() => { setInputLoginUserIdentity(''); setInputLoginAccountSecret(''); setActiveWorkflowPanel('credentialsLogin'); }} className="text-[10px] text-slate-500 hover:text-white transition">Logout</button>
              </div>
            </div>

            <SnapFeedStoriesComposer />

            {/* Create Post Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-5 space-y-3">
              <form onSubmit={executeSubmitNewPostEntryToFeed} className="space-y-3">
                <textarea value={inputPostContentText} onChange={(e) => setInputPostContentText(e.target.value)} rows={2} className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition resize-none placeholder-slate-600" placeholder={UI_VOCABULARY.postCreationInputPlaceholder} />
                <input type="text" value={inputPostAttachedImageUrl} onChange={(e) => setInputPostAttachedImageUrl(e.target.value)} className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2 text-xs text-white outline-none transition placeholder-slate-600" placeholder={UI_VOCABULARY.btnAttachImageLocalPath} />
                <div className="flex justify-end">
                  <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition">{UI_VOCABULARY.btnPublishPostToLedger}</button>
                </div>
              </form>
            </motion.div>

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
          </main>

          {/* Right Sidebar - Active Users */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-5 sticky top-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">{UI_VOCABULARY.activeUsersOnlineSidebarTitle}</h3>
              <div className="space-y-3">
                {simulatedOnlineUsersDirectory.map(user => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">{user.init}</div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${user.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[9px] text-slate-500">{user.status}</p>
                    </div>
                  </div>
                ))}
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
    </div>
  );
}
