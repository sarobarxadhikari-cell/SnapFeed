import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const dynamicLocalizationBundle = {
  en: {
    heroTitle: "Explore the things you love.",
    heroSubtitle: "Join millions of creators sharing instant stories, real-time feeds, high-fidelity metadata streams, and interactive canvas spaces natively on SnapFeed.",
    liveBadge: "LIVE PLATFORM FEED",
    appInfrastructureLabel: "Enterprise Application Infrastructure v2.4.0-Release",
    quickSession: "Cryptographic quick session recovery active for verified user node",
    btnContinue: "Continue as Active Authorized User",
    btnSwitch: "Deauthorize Current Node & Use Another Profile",
    signInHeading: "Sign In via Secure Identity Gateway",
    signInSubtitle: "Provide your environment authorization parameters below to ingest credentials",
    labelIdentifier: "Secure Identifier (Email, Verified Phone, or Alpha-Numeric Username)",
    labelPassword: "Cryptographic Access Password",
    btnShow: "Show Cleartext",
    btnHide: "Hide Cleartext",
    btnSubmitLogin: "Verify Distributed Identity & Ingest Session",
    dividerText: "SYSTEM INTERACTION GATEWAY RESOLUTION",
    btnCreateAccount: "Initialize New Account Registration Pipeline",
    regHeading: "Get started on SnapFeed Engine Suite",
    regSubtitle: "Deploy a verified account entry to synchronize content channels globally.",
    labelFirstname: "Legal First Name / Given Identity String",
    labelSurname: "Legal Surname / Familial Lineage String",
    labelGender: "Identity Gender Parameter Profile",
    optGenderPlaceholder: "Select verified structural gender parameters",
    genFemale: "Female Assignment Profile",
    genMale: "Male Assignment Profile",
    genNonBinary: "Non-Binary Non-Conforming Vector",
    genPrivate: "Secure Anonymity Profile / Prefer Not To Disclose",
    labelContact: "Routing Boundary (Mobile Phone Identity Vector or Ingestion Email Address)",
    contactDisclaimer: "Verification packet handshakes will be securely routed via encrypted automated SMS or SMTP gateways.",
    labelNewPassword: "Create Secure Access Passphrase (Minimum 12 High-Entropy Characters)",
    legalText: "By executing the pipeline submission trigger event, you explicitly provide consent to accept our Terms of Platform Operation Service, End-User License Agreements, Automated Algorithmic Data Ingestion Privacy Policy, and Localized Session Tracking Cookie Matrix Parameters.",
    btnSubmitReg: "Execute Pipeline & Complete Registration",
    linkBackLogin: "De-escalate Action & Return to Login Gateway Portal",
    poweredBy: "Architecture Compiled Natively \u2014 Powered by SnapFeed Decentralized Core Engine Subsystem Layer",
    valEmptyField: "Critical error: Specified interface entry field is mandatory for framework operations.",
    valShortPass: "Cryptographic vulnerability: Passphrase metric must match length constraints.",
    statusActiveProcess: "Core Processor Ingesting State Data",
    statusSyncLedger: "Cryptographic Ledger Synced Successfully! Deploying Client Shell Workspace...",
    statusNetworkTimeout: "Network handshake execution timed out inside ingestion framework socket cluster.",
    valInvalidEmail: "Routing boundary validation error: Provided email address endpoint is malformed."
  },
  ne: {
    heroTitle: "\u0906\u092b\u0942\u0932\u093e\u0908 \u092e\u0928\u092a\u0930\u094d\u0928\u0947 \u0915\u0941\u0930\u093e\u0939\u0930\u0942 \u0905\u0928\u094d\u0935\u0947\u0937\u0923 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964",
    heroSubtitle: "SnapFeed \u092e\u093e \u0926\u094d\u0930\u0941\u0924 \u0915\u0925\u093e\u0939\u0930\u0942, \u0935\u093e\u0938\u094d\u0924\u0935\u093f\u0915-\u0938\u092e\u092f \u092b\u093f\u0921\u0939\u0930\u0942, \u0909\u091a\u094d\u091a-\u0917\u0941\u0923\u0938\u094d\u0924\u0930 \u092e\u0947\u091f\u093e\u0921\u0947\u091f\u093e \u0938\u094d\u091f\u094d\u0930\u093f\u092e\u0939\u0930\u0942, \u0930 \u0905\u0928\u094d\u0924\u0930\u0915\u094d\u0930\u093f\u092f\u093e\u0924\u094d\u092e\u0915 \u0915\u094d\u092f\u093e\u0928\u092d\u093e\u0938 \u0920\u093e\u0909\u0901\u0939\u0930\u0942 \u0938\u093e\u091d\u093e \u0917\u0930\u094d\u0928\u0947 \u0932\u093e\u0916\u094c\u0902 \u0938\u093f\u0930\u094d\u091c\u0928\u093e\u0915\u0930\u094d\u0924\u093e\u0939\u0930\u0942\u092e\u093e \u0938\u093e\u092e\u0947\u0932 \u0939\u0941\u0928\u0941\u0939\u094b\u0938\u094d\u0964",
    liveBadge: "\u0932\u093e\u0907\u092d \u092a\u094d\u0932\u0947\u091f\u092b\u0930\u094d\u092e \u092b\u093f\u0921",
    appInfrastructureLabel: "\u090f\u0928\u094d\u091f\u0930\u092a\u094d\u0930\u093e\u0907\u091c \u090f\u092a\u094d\u0932\u093f\u0915\u0947\u0938\u0928 \u0907\u0928\u094d\u092b\u094d\u0930\u093e\u0938\u094d\u091f\u094d\u0930\u0915\u094d\u091a\u0930 v2.4.0-\u0930\u093f\u0932\u0940\u091c",
    quickSession: "\u092a\u094d\u0930\u092e\u093e\u0923\u093f\u0924 \u092a\u094d\u0930\u092f\u094b\u0917\u0915\u0930\u094d\u0924\u093e \u0928\u094b\u0921\u0915\u094b \u0932\u093e\u0917\u093f \u0915\u094d\u0930\u093f\u092a\u094d\u091f\u094b\u0917\u094d\u0930\u093e\u092b\u093f\u0915 \u0926\u094d\u0930\u0941\u0924 \u0938\u0924\u094d\u0930 \u092a\u0941\u0928: \u092a\u094d\u0930\u093e\u092a\u094d\u0924\u093f \u0938\u0915\u094d\u0930\u093f\u092f \u091b",
    btnContinue: "\u0938\u0915\u094d\u0930\u093f\u092f \u0905\u0927\u093f\u0915\u0943\u0924 \u092a\u094d\u0930\u092f\u094b\u0917\u0915\u0930\u094d\u0924\u093e\u0915\u094b \u0930\u0942\u092a\u092e\u093e \u091c\u093e\u0930\u0940 \u0930\u093e\u0916\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    btnSwitch: "\u0935\u0930\u094d\u0924\u092e\u093e\u0928 \u0928\u094b\u0921 \u0916\u093e\u0930\u0947\u091c \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d \u0930 \u0905\u0930\u094d\u0915\u094b \u092a\u094d\u0930\u094b\u092b\u093e\u0907\u0932 \u092a\u094d\u0930\u092f\u094b\u0917 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    signInHeading: "\u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u092a\u0939\u093f\u091a\u093e\u0928 \u0917\u0947\u091f\u0935\u0947 \u092e\u093e\u0930\u094d\u092b\u0924 \u0938\u093e\u0907\u0928 \u0907\u0928 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    signInSubtitle: "\u092a\u094d\u0930\u092e\u093e\u0923\u0939\u0930\u0942 \u0907\u0928\u094d\u091c\u0947\u0938\u094d\u091f \u0917\u0930\u094d\u0928 \u0924\u0932 \u0906\u092b\u094d\u0928\u094b \u0935\u093e\u0924\u093e\u0935\u0930\u0923 \u092a\u094d\u0930\u093e\u0927\u093f\u0915\u0930\u0923 \u092a\u094d\u092f\u093e\u0930\u093e\u092e\u093f\u091f\u0930\u0939\u0930\u0942 \u092a\u094d\u0930\u0926\u093e\u0928 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    labelIdentifier: "\u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u092a\u0939\u093f\u091a\u093e\u0928\u0915\u0930\u094d\u0924\u093e (\u0907\u092e\u0947\u0932, \u092a\u094d\u0930\u092e\u093e\u0923\u093f\u0924 \u092b\u094b\u0928, \u0935\u093e \u0905\u0932\u094d\u092b\u093e-\u0928\u094d\u092f\u0942\u092e\u0947\u0930\u093f\u0915 \u092a\u094d\u0930\u092f\u094b\u0917\u0915\u0930\u094d\u0924\u093e \u0928\u093e\u092e)",
    labelPassword: "\u0915\u094d\u0930\u093f\u092a\u094d\u091f\u094b\u0917\u094d\u0930\u093e\u092b\u093f\u0915 \u092a\u0939\u0941\u0901\u091a \u092a\u093e\u0938\u0935\u0930\u094d\u0921",
    btnShow: "\u0926\u0947\u0916\u093e\u0909\u0928\u0941\u0939\u094b\u0938\u094d",
    btnHide: "\u0932\u0941\u0915\u093e\u0909\u0928\u0941\u0939\u094b\u0938\u094d",
    btnSubmitLogin: "\u092a\u0939\u093f\u091a\u093e\u0928 \u092a\u094d\u0930\u092e\u093e\u0923\u093f\u0924 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d \u0930 \u0938\u0924\u094d\u0930 \u092a\u094d\u0930\u0935\u093f\u0937\u094d\u091f \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    dividerText: "\u092a\u094d\u0930\u0923\u093e\u0932\u0940 \u0905\u0928\u094d\u0924\u0930\u0915\u094d\u0930\u093f\u092f\u093e \u0917\u0947\u091f\u0935\u0947 \u0930\u093f\u091c\u094b\u0932\u094d\u092f\u0941\u0938\u0928",
    btnCreateAccount: "\u0928\u092f\u093e\u0901 \u0916\u093e\u0924\u093e \u0926\u0930\u094d\u0924\u093e \u092a\u093e\u0907\u092a\u0932\u093e\u0907\u0928 \u0938\u0941\u0930\u0941 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    regHeading: "SnapFeed \u0907\u0928\u094d\u091c\u0928 \u0938\u0941\u0907\u091f\u092e\u093e \u0938\u0941\u0930\u0941 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    regSubtitle: "\u0938\u093e\u092e\u0917\u094d\u0930\u0940 \u091a\u094d\u092f\u093e\u0928\u0932\u0939\u0930\u0942 \u0935\u093f\u0936\u094d\u0935\u0935\u094d\u092f\u093e\u092a\u0940 \u0930\u0942\u092a\u092e\u093e \u0938\u093f\u0919\u094d\u0915\u094d\u0930\u094b\u0928\u093e\u0907\u091c \u0917\u0930\u094d\u0928 \u092a\u094d\u0930\u092e\u093e\u0923\u093f\u0924 \u0916\u093e\u0924\u093e \u092a\u094d\u0930\u0935\u093f\u0937\u094d\u091f\u093f \u0924\u0948\u0928\u093e\u0924 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964",
    labelFirstname: "\u0915\u093e\u0928\u0942\u0928\u0940 \u092a\u0939\u093f\u0932\u094b \u0928\u093e\u092e / \u0926\u093f\u090f\u0915\u094b \u092a\u0939\u093f\u091a\u093e\u0928 \u0938\u094d\u091f\u094d\u0930\u093f\u0919",
    labelSurname: "\u0915\u093e\u0928\u0942\u0928\u0940 \u0925\u0930 / \u092a\u093e\u0930\u093f\u0935\u093e\u0930\u093f\u0915 \u0935\u0902\u0936 \u0938\u094d\u091f\u094d\u0930\u093f\u0919",
    labelGender: "\u092a\u0939\u093f\u091a\u093e\u0928 \u0932\u093f\u0919\u094d\u0917 \u092a\u094d\u092f\u093e\u0930\u093e\u092e\u093f\u091f\u0930 \u092a\u094d\u0930\u094b\u092b\u093e\u0907\u0932",
    optGenderPlaceholder: "\u092a\u094d\u0930\u092e\u093e\u0923\u093f\u0924 \u0938\u0902\u0930\u091a\u0928\u093e\u0924\u094d\u092e\u0915 \u0932\u093f\u0919\u094d\u0917 \u092a\u094d\u092f\u093e\u0930\u093e\u092e\u093f\u091f\u0930\u0939\u0930\u0942 \u091a\u092f\u0928 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    genFemale: "\u092e\u0939\u093f\u0932\u093e \u0905\u0938\u093e\u0907\u0928\u092e\u0947\u0928\u094d\u091f \u092a\u094d\u0930\u094b\u092b\u093e\u0907\u0932",
    genMale: "\u092a\u0941\u0930\u0941\u0937 \u0905\u0938\u093e\u0907\u0928\u092e\u0947\u0928\u094d\u091f \u092a\u094d\u0930\u094b\u092b\u093e\u0907\u0932",
    genNonBinary: "\u0917\u0948\u0930-\u092c\u093e\u0907\u0928\u0930\u0940 \u0917\u0948\u0930-\u0905\u0928\u0941\u0930\u0942\u092a \u092d\u0947\u0915\u094d\u091f\u0930",
    genPrivate: "\u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u0928\u093e\u092e\u0935\u093f\u0939\u0940\u0928\u0924\u093e \u092a\u094d\u0930\u094b\u092b\u093e\u0907\u0932 / \u0916\u0941\u0932\u093e\u0938\u093e \u0928\u0917\u0930\u094d\u0928\u0947 \u0930\u0941\u091a\u093e\u0909\u0928\u0941\u0939\u094b\u0938\u094d",
    labelContact: "\u0930\u093e\u0909\u091f\u093f\u0919 \u0938\u0940\u092e\u093e (\u092e\u094b\u092c\u093e\u0907\u0932 \u092b\u094b\u0928 \u092a\u0939\u093f\u091a\u093e\u0928 \u092d\u0947\u0915\u094d\u091f\u0930 \u0935\u093e \u0907\u092e\u0947\u0932 \u0920\u0947\u0917\u093e\u0928\u093e)",
    contactDisclaimer: "\u092a\u094d\u0930\u092e\u093e\u0923\u0940\u0915\u0930\u0923 \u092a\u094d\u092f\u093e\u0915\u0947\u091f \u0939\u094d\u092f\u093e\u0928\u094d\u0921\u0936\u0947\u0915\u0939\u0930\u0942 \u0907\u0928\u094d\u0915\u094d\u0930\u093f\u092a\u094d\u091f\u0947\u0921 \u0938\u094d\u0935\u091a\u093e\u0932\u093f\u0924 \u090f\u0938\u090f\u092e\u090f\u0938 \u0935\u093e \u090f\u0938\u090f\u092e\u091f\u0940\u092a\u0940 \u0917\u0947\u091f\u0935\u0947\u0939\u0930\u0942 \u092e\u093e\u0930\u094d\u092b\u0924 \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u0930\u0942\u092a\u092e\u093e \u092a\u0920\u093e\u0907\u0928\u0947\u091b\u0964",
    labelNewPassword: "\u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u092a\u0939\u0941\u0901\u091a \u092a\u093e\u0938\u092b\u094d\u0930\u0947\u091c \u0938\u093f\u0930\u094d\u091c\u0928\u093e \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d (\u0928\u094d\u092f\u0942\u0928\u0924\u092e 12 \u0909\u091a\u094d\u091a-\u090f\u0928\u094d\u091f\u094d\u0930\u094b\u092a\u0940 \u0915\u094d\u092f\u093e\u0930\u0947\u0915\u094d\u091f\u0930\u0939\u0930\u0942)",
    legalText: "\u092a\u093e\u0907\u092a\u0932\u093e\u0907\u0928 \u0938\u092c\u092e\u093f\u0938\u0928 \u091f\u094d\u0930\u093f\u0917\u0930 \u0918\u091f\u0928\u093e \u0915\u093e\u0930\u094d\u092f\u093e\u0928\u094d\u0935\u092f\u0928 \u0917\u0930\u0947\u0930, \u0924\u092a\u093e\u0908\u0902 \u0939\u093e\u092e\u094d\u0930\u094b \u092a\u094d\u0932\u0947\u091f\u092b\u0930\u094d\u092e \u0938\u091e\u094d\u091a\u093e\u0932\u0928 \u0938\u0947\u0935\u093e\u0915\u093e \u0938\u0930\u094d\u0924\u0939\u0930\u0942, \u0905\u0928\u094d\u0924\u093f\u092e-\u092a\u094d\u0930\u092f\u094b\u0917\u0915\u0930\u094d\u0924\u093e \u0907\u091c\u093e\u091c\u0924\u092a\u0924\u094d\u0930 \u0938\u092e\u091d\u094c\u0924\u093e\u0939\u0930\u0942, \u0930 \u0917\u094b\u092a\u0928\u0940\u092f\u0924\u093e \u0928\u0940\u0924\u093f \u0938\u094d\u0935\u0940\u0915\u093e\u0930 \u0917\u0930\u094d\u0928 \u0938\u0939\u092e\u0924 \u0939\u0941\u0928\u0941\u0939\u0941\u0928\u094d\u091b\u0964",
    btnSubmitReg: "\u092a\u093e\u0907\u092a\u0932\u093e\u0907\u0928 \u0915\u093e\u0930\u094d\u092f\u093e\u0928\u094d\u0935\u092f\u0928 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d \u0930 \u0926\u0930\u094d\u0924\u093e \u092a\u0942\u0930\u093e \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    linkBackLogin: "\u0915\u093e\u0930\u094d\u092f \u0915\u092e \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d \u0930 \u0932\u0917\u0908\u0928 \u0917\u0947\u091f\u0935\u0947 \u092a\u094b\u0930\u094d\u091f\u0932\u092e\u093e \u092b\u0930\u094d\u0915\u0928\u0941\u0939\u094b\u0938\u094d",
    poweredBy: "Architecture Compiled Natively \u2014 Powered by SnapFeed Decentralized Core Engine Subsystem Layer"
  }
};

const dynamicEngineViewportViewportVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 10, filter: "blur(4px)" },
  visible: { 
    opacity: 1, scale: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], when: "beforeChildren", staggerChildren: 0.08 } 
  }
};

const highFidelityStaggeredChildrenElementsVariants = {
  initial: { opacity: 0, y: 20, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -15, filter: "blur(1px)", transition: { duration: 0.3, ease: "easeIn" } }
};

const systemicModalIngestionOverlayVariants = {
  initial: { opacity: 0, backdropFilter: "blur(0px)" },
  animate: { opacity: 1, backdropFilter: "blur(12px)", transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 0.3, ease: "easeIn" } }
};

export default function SnapFeedAuth() {
  const [currentSystemLanguage, setCurrentSystemLanguage] = useState('en');
  const [activeWorkspaceFlowState, setActiveWorkspaceFlowState] = useState('registrationForm');
  const [cleartextPasswordVisibilityFlag, setCleartextPasswordVisibilityFlag] = useState(false);
  const [isProcessingMatrixOverlayActive, setIsProcessingMatrixOverlayActive] = useState(false);
  const [runtimeProcessingStatusMessage, setRuntimeProcessingStatusMessage] = useState('');
  const [hardwareIngestionLoadingRate, setHardwareIngestionLoadingRate] = useState(0);
  const [loginIdentifierStringValue, setLoginIdentifierStringValue] = useState('');
  const [loginPasswordStringValue, setLoginPasswordStringValue] = useState('');
  const [demographicRegistrationPayloadDataset, setDemographicRegistrationPayloadDataset] = useState({
    firstname: 'Sarobar', surname: 'Adhikari', gender: 'male',
    contactAddress: 'sarobaradhikari@gmail.com', accountAccessPassphraseStr: '',
    dobDayMetric: '', dobMonthMetric: '', dobYearMetric: ''
  });
  const [frameworkValidationErrorsRegisterStore, setFrameworkValidationErrorsRegisterStore] = useState({});
  const [credentialValidationErrorStore, setCredentialValidationErrorStore] = useState({});

  const dict = dynamicLocalizationBundle[currentSystemLanguage] || dynamicLocalizationBundle['en'];
  const particleCanvasElementHookRef = useRef(null);

  useEffect(() => {
    const activeCanvasElement = particleCanvasElementHookRef.current;
    if (!activeCanvasElement) return;
    const ctx = activeCanvasElement.getContext('2d');
    let frameId;
    let w = activeCanvasElement.width = activeCanvasElement.offsetWidth;
    let h = activeCanvasElement.height = activeCanvasElement.offsetHeight;
    const particles = [];
    const density = 65;
    for (let i = 0; i < density; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 2.5 + 0.5,
        vx: Math.random() * 0.4 - 0.2, vy: Math.random() * 0.4 - 0.2,
        a: Math.random() * 0.4 + 0.1,
        c: Math.random() > 0.5 ? 'rgba(59, 130, 246,' : 'rgba(99, 102, 241,'
      });
    }
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.c}${p.a})`;
        ctx.fill();
      });
      for (let i = 0; i < density; i++) {
        for (let j = i + 1; j < density; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 - (dist / 110) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      frameId = requestAnimationFrame(render);
    };
    render();
    const onResize = () => {
      if (!activeCanvasElement) return;
      w = activeCanvasElement.width = activeCanvasElement.offsetWidth;
      h = activeCanvasElement.height = activeCanvasElement.offsetHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(frameId); window.removeEventListener('resize', onResize); };
  }, []);

  const executeSecureDataIngestionPipelineEvent = async (e) => {
    e.preventDefault();
    setFrameworkValidationErrorsRegisterStore({});
    const errors = {};
    if (!demographicRegistrationPayloadDataset.firstname.trim()) errors.firstname = dict.valEmptyField;
    if (!demographicRegistrationPayloadDataset.surname.trim()) errors.surname = dict.valEmptyField;
    if (!demographicRegistrationPayloadDataset.contactAddress.trim()) errors.contactAddress = dict.valEmptyField;
    if (demographicRegistrationPayloadDataset.accountAccessPassphraseStr.length < 8) errors.accountAccessPassphraseStr = dict.valShortPass;
    if (Object.keys(errors).length > 0) { setFrameworkValidationErrorsRegisterStore(errors); return; }
    setIsProcessingMatrixOverlayActive(true);
    setRuntimeProcessingStatusMessage(dict.statusActiveProcess);
    setHardwareIngestionLoadingRate(5);
    const ticker = setInterval(() => {
      setHardwareIngestionLoadingRate(prev => {
        if (prev >= 92) { clearInterval(ticker); return 92; }
        return prev + Math.floor(Math.random() * 12 + 4);
      });
    }, 150);
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: demographicRegistrationPayloadDataset.firstname,
          surname: demographicRegistrationPayloadDataset.surname,
          gender: demographicRegistrationPayloadDataset.gender,
          contact: demographicRegistrationPayloadDataset.contactAddress,
          password: demographicRegistrationPayloadDataset.accountAccessPassphraseStr
        })
      });
      const data = await res.json();
      clearInterval(ticker);
      if (res.ok) {
        setHardwareIngestionLoadingRate(100);
        setRuntimeProcessingStatusMessage(dict.statusSyncLedger);
        setTimeout(() => {
          setIsProcessingMatrixOverlayActive(false);
          setActiveWorkspaceFlowState('profileSelect');
        }, 1800);
      } else {
        setIsProcessingMatrixOverlayActive(false);
        setFrameworkValidationErrorsRegisterStore({ pipelineGlobalError: data.message || "Endpoint assertion fail." });
      }
    } catch (err) {
      clearInterval(ticker);
      setIsProcessingMatrixOverlayActive(false);
      setFrameworkValidationErrorsRegisterStore({ pipelineGlobalError: dict.statusNetworkTimeout });
    }
  };

  const handleRegChange = (e) => {
    setDemographicRegistrationPayloadDataset({
      ...demographicRegistrationPayloadDataset,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!loginIdentifierStringValue.trim()) errs.identifier = dict.valEmptyField;
    if (loginPasswordStringValue.length < 6) errs.password = dict.valShortPass;
    if (Object.keys(errs).length > 0) { setCredentialValidationErrorStore(errs); return; }
    setCredentialValidationErrorStore({});
    setIsProcessingMatrixOverlayActive(true);
    setRuntimeProcessingStatusMessage(dict.statusActiveProcess);
    setHardwareIngestionLoadingRate(5);
    const ticker = setInterval(() => {
      setHardwareIngestionLoadingRate(prev => {
        if (prev >= 92) { clearInterval(ticker); return 92; }
        return prev + Math.floor(Math.random() * 12 + 4);
      });
    }, 150);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginIdentifierStringValue, password: loginPasswordStringValue })
      });
      const data = await res.json();
      clearInterval(ticker);
      if (res.ok) {
        setHardwareIngestionLoadingRate(100);
        setRuntimeProcessingStatusMessage(dict.statusSyncLedger);
        setTimeout(() => {
          setIsProcessingMatrixOverlayActive(false);
          setActiveWorkspaceFlowState('profileSelect');
        }, 1800);
      } else {
        setIsProcessingMatrixOverlayActive(false);
        setCredentialValidationErrorStore({ server: data.message || "Invalid credentials." });
      }
    } catch (err) {
      clearInterval(ticker);
      setIsProcessingMatrixOverlayActive(false);
      setCredentialValidationErrorStore({ server: dict.statusNetworkTimeout });
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-slate-100 overflow-x-hidden flex flex-col justify-between">
      <canvas ref={particleCanvasElementHookRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessingMatrixOverlayActive && (
          <motion.div
            variants={systemicModalIngestionOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.94, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 180 } }}
              exit={{ scale: 0.94, y: 20, opacity: 0 }}
              className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl shadow-blue-500/5 relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-0 w-full h-full rounded-full border-4 border-slate-800/50 border-t-indigo-500 border-b-blue-500"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                className="absolute inset-2 border-2 border-slate-800/40 border-r-emerald-500 border-l-teal-500 rounded-full"
              />
              <div className="relative z-10 space-y-4">
                <div className="text-5xl font-black text-white tabular-nums">{hardwareIngestionLoadingRate}%</div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">System Engine Subprocess Active</p>
                <p className="text-sm text-slate-500">{runtimeProcessingStatusMessage}</p>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    animate={{ width: `${hardwareIngestionLoadingRate}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 py-12 flex-1 flex flex-col lg:flex-row items-center justify-center gap-16">
        {/* Marketing Section */}
        <section className="flex-1 space-y-8 select-none">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-[10px] font-bold tracking-[0.2em] uppercase">
              {dict.appInfrastructureLabel}
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-none">
              Explore the things you <span className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">love</span>.
            </h1>
            <p className="text-lg text-slate-400 max-w-lg leading-relaxed">{dict.heroSubtitle}</p>
          </motion.div>
          <div className="hidden sm:grid grid-cols-3 gap-4 max-w-xl h-48 opacity-75">
            <motion.div whileHover={{ y: -5, scale: 1.02 }} className="col-span-2 bg-gradient-to-br from-blue-600/20 to-indigo-600/5 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-4 left-4 w-12 h-2 bg-blue-500/40 rounded-full" />
              <div className="absolute bottom-4 left-4 right-4 h-16 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center px-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold mr-3">SF</div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-2 w-3/4 bg-slate-700/50 rounded-full" />
                  <div className="h-2 w-1/2 bg-slate-700/30 rounded-full" />
                </div>
              </div>
            </motion.div>
            <motion.div whileHover={{ y: -5, scale: 1.02 }} className="bg-gradient-to-br from-emerald-600/20 to-teal-600/5 border border-slate-800 rounded-2xl p-4 flex items-end justify-center">
              <span className="text-[10px] font-bold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full">{dict.liveBadge}</span>
            </motion.div>
          </div>
        </section>

        {/* Auth Card */}
        <motion.div
          variants={dynamicEngineViewportViewportVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col border-t-slate-700/30 relative"
        >
          {/* Flow: Profile Select */}
          {activeWorkspaceFlowState === 'profileSelect' && (
            <motion.div key="profile" variants={highFidelityStaggeredChildrenElementsVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <motion.div whileHover={{ scale: 1.05 }} className="w-28 h-28 rounded-full border-4 border-blue-500/20 p-1 bg-slate-900 flex items-center justify-center relative">
                  <span className="text-3xl font-bold text-blue-400">SA</span>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-white">Sarobar Adhikari</h2>
                  <p className="text-xs text-slate-400 mt-1">{dict.quickSession}</p>
                </div>
              </div>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => alert("Restoring authentication tokens natively...")}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/20 text-sm tracking-wide"
                >
                  {dict.btnContinue}
                </motion.button>
                <button
                  onClick={() => setActiveWorkspaceFlowState('credentialsLogin')}
                  className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-slate-300 font-semibold rounded-xl border border-slate-800 transition text-sm"
                >
                  {dict.btnSwitch}
                </button>
              </div>
            </motion.div>
          )}

          {/* Flow: Credentials Login */}
          {activeWorkspaceFlowState === 'credentialsLogin' && (
            <motion.div key="credentials" variants={highFidelityStaggeredChildrenElementsVariants} initial="initial" animate="animate" exit="exit" className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">{dict.signInHeading}</h2>
                <p className="text-xs text-slate-500">{dict.signInSubtitle}</p>
              </div>
              {credentialValidationErrorStore.server && (
                <p className="text-red-400 text-xs bg-red-500/10 rounded-lg px-3 py-2">{credentialValidationErrorStore.server}</p>
              )}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{dict.labelIdentifier}</label>
                  <input
                    type="text"
                    value={loginIdentifierStringValue}
                    onChange={(e) => setLoginIdentifierStringValue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition font-sans"
                    placeholder="identity@domain.com"
                  />
                  {credentialValidationErrorStore.identifier && <p className="text-red-400 text-[10px]">{credentialValidationErrorStore.identifier}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{dict.labelPassword}</label>
                  <div className="relative">
                    <input
                      type={cleartextPasswordVisibilityFlag ? "text" : "password"}
                      value={loginPasswordStringValue}
                      onChange={(e) => setLoginPasswordStringValue(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition tracking-widest font-mono"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setCleartextPasswordVisibilityFlag(!cleartextPasswordVisibilityFlag)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 hover:text-white uppercase font-mono tracking-wider"
                    >
                      {cleartextPasswordVisibilityFlag ? dict.btnHide : dict.btnShow}
                    </button>
                  </div>
                  {credentialValidationErrorStore.password && <p className="text-red-400 text-[10px]">{credentialValidationErrorStore.password}</p>}
                </div>
                <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition">
                  {dict.btnSubmitLogin}
                </button>
              </form>
            </motion.div>
          )}

          {/* Flow: Registration */}
          {activeWorkspaceFlowState === 'registrationForm' && (
            <motion.div key="registration" variants={highFidelityStaggeredChildrenElementsVariants} initial="initial" animate="animate" exit="exit" className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">{dict.regHeading}</h2>
                <p className="text-xs text-slate-500">{dict.regSubtitle}</p>
              </div>
              {frameworkValidationErrorsRegisterStore.pipelineGlobalError && (
                <p className="text-red-400 text-xs bg-red-500/10 rounded-lg px-3 py-2">{frameworkValidationErrorsRegisterStore.pipelineGlobalError}</p>
              )}
              <form onSubmit={executeSecureDataIngestionPipelineEvent} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider">{dict.labelFirstname}</label>
                    <input name="firstname" value={demographicRegistrationPayloadDataset.firstname} onChange={handleRegChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500" />
                    {frameworkValidationErrorsRegisterStore.firstname && <p className="text-red-400 text-[10px]">{frameworkValidationErrorsRegisterStore.firstname}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider">{dict.labelSurname}</label>
                    <input name="surname" value={demographicRegistrationPayloadDataset.surname} onChange={handleRegChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500" />
                    {frameworkValidationErrorsRegisterStore.surname && <p className="text-red-400 text-[10px]">{frameworkValidationErrorsRegisterStore.surname}</p>}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">{dict.labelGender}</label>
                  <select name="gender" value={demographicRegistrationPayloadDataset.gender} onChange={handleRegChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500">
                    <option value="">{dict.optGenderPlaceholder}</option>
                    <option value="female">{dict.genFemale}</option>
                    <option value="male">{dict.genMale}</option>
                    <option value="nonbinary">{dict.genNonBinary}</option>
                    <option value="private">{dict.genPrivate}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">{dict.labelContact}</label>
                  <input name="contactAddress" value={demographicRegistrationPayloadDataset.contactAddress} onChange={handleRegChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500" />
                  <p className="text-[9px] text-slate-600">{dict.contactDisclaimer}</p>
                  {frameworkValidationErrorsRegisterStore.contactAddress && <p className="text-red-400 text-[10px]">{frameworkValidationErrorsRegisterStore.contactAddress}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">{dict.labelNewPassword}</label>
                  <input name="accountAccessPassphraseStr" type="password" value={demographicRegistrationPayloadDataset.accountAccessPassphraseStr} onChange={handleRegChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500" />
                  {frameworkValidationErrorsRegisterStore.accountAccessPassphraseStr && <p className="text-red-400 text-[10px]">{frameworkValidationErrorsRegisterStore.accountAccessPassphraseStr}</p>}
                </div>
                <p className="text-[9px] text-slate-600 leading-relaxed">{dict.legalText}</p>
                <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition">
                  {dict.btnSubmitReg}
                </button>
                <button type="button" onClick={() => setActiveWorkspaceFlowState('credentialsLogin')} className="w-full text-center text-[10px] font-semibold text-blue-400 hover:underline pt-1">
                  {dict.linkBackLogin}
                </button>
              </form>
            </motion.div>
          )}

          {/* Divider + Create Account (not shown in registration flow) */}
          {activeWorkspaceFlowState !== 'registrationForm' && (
            <>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-[9px] text-slate-600 uppercase font-semibold tracking-widest">{dict.dividerText}</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>
              <button
                onClick={() => setActiveWorkspaceFlowState('registrationForm')}
                className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold rounded-xl transition text-xs text-center uppercase tracking-wider"
              >
                {dict.btnCreateAccount}
              </button>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-[9px] text-slate-700">{dict.poweredBy}</p>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 border-t border-slate-800/50 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-600">
          <button onClick={() => setCurrentSystemLanguage('en')} className={`hover:text-white transition ${currentSystemLanguage === 'en' ? 'text-blue-400 font-bold' : ''}`}>English (US)</button>
          <span className="text-slate-700">|</span>
          <button onClick={() => setCurrentSystemLanguage('ne')} className={`hover:text-white transition ${currentSystemLanguage === 'ne' ? 'text-blue-400 font-bold' : ''}`}>नेपाली</button>
          <span className="text-slate-700">|</span>
          <span>© 2026 SnapFeed Global Technologies Corporation.</span>
        </div>
      </footer>
    </div>
  );
}
