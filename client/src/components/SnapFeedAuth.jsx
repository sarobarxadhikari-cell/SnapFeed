import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const platformSimpleDictionary = {
  en: {
    heroHeadingMain: "Explore the things you love.",
    heroSubheadingDescription: "Join millions of creators sharing instant stories, real-time feeds, and interactive spaces natively on SnapFeed.",
    badgeInfrastructureLabel: "SnapFeed App Platform v2.4",
    statusBadgeLiveStream: "LIVE STREAM",
    sessionAlertText: "Quick session recovery active",
    actionButtonContinueUser: "Continue as Active User",
    actionButtonSwitchAccount: "Use another profile",
    formHeadingSignIn: "Sign In Securely",
    labelFieldIdentifier: "Email Address, Phone Number or Username",
    labelFieldPassword: "Password",
    visibilityToggleShow: "Show",
    visibilityToggleHide: "Hide",
    formSubmitLoginButton: "Verify Identity & Enter",
    separationTextOr: "or",
    actionButtonTriggerSignup: "Create new account",
    formHeadingSignUp: "Get started on SnapFeed",
    formSubheadingSignUp: "Create a verified account to connect with communities.",
    labelInputFirstName: "First Name",
    labelInputSurname: "Surname",
    labelDropdownGender: "Gender",
    placeholderSelectGender: "Select your gender",
    genderOptionFemale: "Female",
    genderOptionMale: "Male",
    genderOptionNonBinary: "Non-Binary",
    genderOptionPrivate: "Prefer not to say",
    labelInputContact: "Mobile number or email address",
    contactExplanatoryText: "Verification codes will be routed securely via this gateway.",
    labelInputNewPassword: "New Password",
    legalConsentText: "By clicking Submit, you explicitly agree to accept our Terms of Service, automated Privacy Policy algorithms, and localized Cookie Matrix parameters.",
    formSubmitSignupButton: "Complete Registration",
    navigationLinkBackToLogin: "I already have an account",
    footerCorporateLabel: "Powered by SnapFeed Core Engine"
  },
  ne: {
    heroHeadingMain: "\u0906\u092b\u0942\u0932\u093e\u0908 \u092e\u0928\u092a\u0930\u094d\u0928\u0947 \u0915\u0941\u0930\u093e\u0939\u0930\u0942 \u0905\u0928\u094d\u0935\u0947\u0937\u0923 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964",
    heroSubheadingDescription: "SnapFeed \u092e\u093e \u0926\u094d\u0930\u0941\u0924 \u0915\u0925\u093e\u0939\u0930\u0942, \u0935\u093e\u0938\u094d\u0924\u0935\u093f\u0915-\u0938\u092e\u092f \u092b\u093f\u0921\u0939\u0930\u0942, \u0930 \u0905\u0928\u094d\u0924\u0930\u0915\u094d\u0930\u093f\u092f\u093e\u0924\u094d\u092e\u0915 \u0920\u093e\u0909\u0901\u0939\u0930\u0942 \u0938\u093e\u091d\u093e \u0917\u0930\u094d\u0928\u0947 \u0932\u093e\u0916\u094c\u0902 \u0938\u093f\u0930\u094d\u091c\u0928\u093e\u0915\u0930\u094d\u0924\u093e\u0939\u0930\u0942\u092e\u093e \u0938\u093e\u092e\u0947\u0932 \u0939\u0941\u0928\u0941\u0939\u094b\u0938\u094d\u0964",
    badgeInfrastructureLabel: "\u0938\u094d\u0928\u094d\u092f\u093e\u092a\u092b\u093f\u0921 \u090f\u092a\u094d\u0932\u093f\u0915\u0947\u0938\u0928 \u092a\u094d\u0932\u0947\u091f\u092b\u0930\u094d\u092e v2.4",
    statusBadgeLiveStream: "\u0932\u093e\u0907\u092d \u092b\u093f\u0921",
    sessionAlertText: "\u0926\u094d\u0930\u0941\u0924 \u0938\u0924\u094d\u0930 \u092a\u0941\u0928: \u092a\u094d\u0930\u093e\u092a\u094d\u0924\u093f \u0938\u0915\u094d\u0930\u093f\u092f \u091b",
    actionButtonContinueUser: "\u091c\u093e\u0930\u0940 \u0930\u093e\u0916\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    actionButtonSwitchAccount: "\u0905\u0930\u094d\u0915\u094b \u092a\u094d\u0930\u094b\u092b\u093e\u0907\u0932 \u092a\u094d\u0930\u092f\u094b\u0917 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    formHeadingSignIn: "\u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u0932\u0917\u0908\u0928 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    labelFieldIdentifier: "\u0907\u092e\u0947\u0932, \u092b\u094b\u0928 \u0935\u093e \u092a\u094d\u0930\u092f\u094b\u0917\u0915\u0930\u094d\u0924\u093e \u0928\u093e\u092e",
    labelFieldPassword: "\u092a\u093e\u0938\u0935\u0930\u094d\u0921",
    visibilityToggleShow: "\u0926\u0947\u0916\u093e\u0909\u0928\u0941\u0939\u094b\u0938\u094d",
    visibilityToggleHide: "\u0932\u0941\u0915\u093e\u0909\u0928\u0941\u0939\u094b\u0938\u094d",
    formSubmitLoginButton: "\u092a\u0939\u093f\u091a\u093e\u0928 \u092a\u094d\u0930\u092e\u093e\u0923\u093f\u0924 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    separationTextOr: "\u0935\u093e",
    actionButtonTriggerSignup: "\u0928\u092f\u093e\u0901 \u0916\u093e\u0924\u093e \u0916\u094b\u0932\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    formHeadingSignUp: "SnapFeed \u092e\u093e \u0938\u0941\u0930\u0941 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    formSubheadingSignUp: "\u0938\u092e\u0941\u0926\u093e\u092f\u0939\u0930\u0942\u0938\u0902\u0917 \u091c\u0921\u093e\u0928 \u0917\u0930\u094d\u0928 \u092a\u094d\u0930\u092e\u093e\u0923\u093f\u0924 \u0916\u093e\u0924\u093e \u0938\u093f\u0930\u094d\u091c\u0928\u093e \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d\u0964",
    labelInputFirstName: "\u092a\u0939\u093f\u0932\u094b \u0928\u093e\u092e",
    labelInputSurname: "\u0925\u0930",
    labelDropdownGender: "\u0932\u093f\u0919\u094d\u0917",
    placeholderSelectGender: "\u0906\u092b\u094d\u0928\u094b \u0932\u093f\u0919\u094d\u0917 \u091a\u092f\u0928 \u0917\u0930\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    genderOptionFemale: "\u092e\u0939\u093f\u0932\u093e",
    genderOptionMale: "\u092a\u0941\u0930\u0941\u0937",
    genderOptionNonBinary: "\u0917\u0948\u0930-\u092c\u093e\u0907\u0928\u0930\u0940",
    genderOptionPrivate: "\u092d\u0928\u094d\u0928 \u0928\u091a\u0939\u093e\u0928\u0947",
    labelInputContact: "\u092e\u094b\u092c\u093e\u0907\u0932 \u0928\u092e\u094d\u092c\u0930 \u0935\u093e \u0907\u092e\u0947\u0932 \u0920\u0947\u0917\u093e\u0928\u093e",
    contactExplanatoryText: "\u092a\u094d\u0930\u092e\u093e\u0923\u0940\u0915\u0930\u0923 \u0915\u094b\u0921\u0939\u0930\u0942 \u092f\u0938 \u0917\u0947\u091f\u0935\u0947 \u092e\u093e\u0930\u094d\u092b\u0924 \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u0930\u0942\u092a\u092e\u093e \u092a\u0920\u093e\u0907\u0928\u0947\u091b\u0964",
    labelInputNewPassword: "\u0928\u092f\u093e\u0901 \u092a\u093e\u0938\u0935\u0930\u094d\u0921",
    legalConsentText: "\u0938\u092c\u094d\u092e\u093f\u091f\u092e\u093e \u0915\u094d\u0932\u093f\u0915 \u0917\u0930\u0947\u0930, \u0924\u092a\u093e\u0908\u0902 \u0938\u094d\u0928\u094d\u092f\u093e\u092a\u092b\u093f\u0921\u0915\u094b \u0938\u0947\u0935\u093e \u0938\u0930\u094d\u0924\u0939\u0930\u0942, \u0917\u094b\u092a\u0928\u0940\u092f\u0924\u093e \u0928\u0940\u0924\u093f, \u0930 \u0915\u0941\u0915\u0940 \u092e\u094d\u092f\u093e\u091f\u094d\u0930\u093f\u0915\u094d\u0938 \u092a\u094d\u092f\u093e\u0930\u093e\u092e\u093f\u091f\u0930\u0939\u0930\u0942 \u0938\u094d\u0935\u0940\u0915\u093e\u0930 \u0917\u0930\u094d\u0928 \u0938\u0939\u092e\u0924 \u0939\u0941\u0928\u0941\u0939\u0941\u0928\u094d\u091b\u0964",
    formSubmitSignupButton: "\u0916\u093e\u0924\u093e \u0916\u094b\u0932\u094d\u0928\u0941\u0939\u094b\u0938\u094d",
    navigationLinkBackToLogin: "\u092e\u0947\u0930\u094b \u092a\u0939\u093f\u0932\u0947 \u0928\u0948 \u0916\u093e\u0924\u093e \u091b",
    footerCorporateLabel: "\u0938\u094d\u0928\u094d\u092f\u093e\u092a\u092b\u093f\u0921 \u0915\u094b\u0930 \u0907\u0928\u094d\u091c\u0928 \u0926\u094d\u0935\u093e\u0930\u093e \u0938\u091e\u094d\u091a\u093e\u0932\u093f\u0924"
  }
};

const layoutFrameAnimationVariants = {
  hidden: { opacity: 0, scale: 0.99 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: "easeOut" } }
};

const viewSlideAnimationVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: "easeIn" } }
};

export default function SnapFeedAuth() {
  const [appLanguageState, setAppLanguageState] = useState('en');
  const [activeWorkflowPanel, setActiveWorkflowPanel] = useState('registrationForm');
  const [passwordVisibilityState, setPasswordVisibilityState] = useState(false);
  const [isProcessingMatrix, setIsProcessingMatrix] = useState(false);
  const [processingStatusText, setProcessingStatusText] = useState('');
  const [loginFormState, setLoginFormState] = useState({ identifier: '', password: '' });
  const [registrationFormState, setRegistrationFormState] = useState({
    firstname: 'Sarobar', surname: 'Adhikari', gender: 'male', contact: 'sarobaradhikari@gmail.com', password: ''
  });
  const [validationErrorsState, setValidationErrorsState] = useState({});

  const uiTextStore = platformSimpleDictionary[appLanguageState] || platformSimpleDictionary['en'];
  const hardwareCanvasElementRef = useRef(null);

  useEffect(() => {
    const activeCanvasInstance = hardwareCanvasElementRef.current;
    if (!activeCanvasInstance) return;
    const internalCanvasContext = activeCanvasInstance.getContext('2d');
    let loopAnimationFrameTracker;
    let allocatedWidth = activeCanvasInstance.width = activeCanvasInstance.offsetWidth;
    let allocatedHeight = activeCanvasInstance.height = activeCanvasInstance.offsetHeight;
    const operationalParticleArray = [];
    const configurationMaxParticleDensityLimit = 50;
    for (let loopIndex = 0; loopIndex < configurationMaxParticleDensityLimit; loopIndex++) {
      operationalParticleArray.push({
        coordinatePositionX: Math.random() * allocatedWidth,
        coordinatePositionY: Math.random() * allocatedHeight,
        elementRadiusMetric: Math.random() * 2.5 + 1,
        velocityStepVectorX: Math.random() * 0.4 - 0.2,
        velocityStepVectorY: Math.random() * 0.4 - 0.2,
        alphaOpacityValue: Math.random() * 0.4 + 0.1
      });
    }
    const executeHardwareRenderSequence = () => {
      internalCanvasContext.clearRect(0, 0, allocatedWidth, allocatedHeight);
      operationalParticleArray.forEach(activeParticle => {
        activeParticle.coordinatePositionX += activeParticle.velocityStepVectorX;
        activeParticle.coordinatePositionY += activeParticle.velocityStepVectorY;
        if (activeParticle.coordinatePositionX < 0 || activeParticle.coordinatePositionX > allocatedWidth) activeParticle.velocityStepVectorX *= -1;
        if (activeParticle.coordinatePositionY < 0 || activeParticle.coordinatePositionY > allocatedHeight) activeParticle.velocityStepVectorY *= -1;
        internalCanvasContext.beginPath();
        internalCanvasContext.arc(activeParticle.coordinatePositionX, activeParticle.coordinatePositionY, activeParticle.elementRadiusMetric, 0, Math.PI * 2);
        internalCanvasContext.fillStyle = `rgba(59, 130, 246, ${activeParticle.alphaOpacityValue})`;
        internalCanvasContext.fill();
      });
      loopAnimationFrameTracker = requestAnimationFrame(executeHardwareRenderSequence);
    };
    executeHardwareRenderSequence();
    const processWindowResizeEvent = () => {
      if (!activeCanvasInstance) return;
      allocatedWidth = activeCanvasInstance.width = activeCanvasInstance.offsetWidth;
      allocatedHeight = activeCanvasInstance.height = activeCanvasInstance.offsetHeight;
    };
    window.addEventListener('resize', processWindowResizeEvent);
    return () => {
      cancelAnimationFrame(loopAnimationFrameTracker);
      window.removeEventListener('resize', processWindowResizeEvent);
    };
  }, []);

  const handleRegistrationFormSubmissionPipeline = async (eventObject) => {
    eventObject.preventDefault();
    setValidationErrorsState({});
    const activePipelineErrorObject = {};
    if (!registrationFormState.firstname.trim()) activePipelineErrorObject.firstname = "First name is required.";
    if (!registrationFormState.surname.trim()) activePipelineErrorObject.surname = "Surname is required.";
    if (!registrationFormState.contact.trim()) activePipelineErrorObject.contact = "Contact method is required.";
    if (registrationFormState.password.length < 8) activePipelineErrorObject.password = "Password must be at least 8 characters.";
    if (Object.keys(activePipelineErrorObject).length > 0) {
      setValidationErrorsState(activePipelineErrorObject);
      return;
    }
    setIsProcessingMatrix(true);
    setProcessingStatusText('Registering...');
    try {
      const serverNetworkResponseInstance = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: registrationFormState.firstname,
          surname: registrationFormState.surname,
          gender: registrationFormState.gender,
          contact: registrationFormState.contact,
          password: registrationFormState.password
        })
      });
      const processedJsonPayloadResponse = await serverNetworkResponseInstance.json();
      if (serverNetworkResponseInstance.ok) {
        setTimeout(() => {
          setProcessingStatusText('Account Saved! Redirecting...');
          setTimeout(() => {
            setIsProcessingMatrix(false);
            setActiveWorkflowPanel('profileSelect');
          }, 1200);
        }, 1000);
      } else {
        setIsProcessingMatrix(false);
        setValidationErrorsState({ serverError: processedJsonPayloadResponse.message || "Registration failed." });
      }
    } catch (networkInterfaceException) {
      setIsProcessingMatrix(false);
      setValidationErrorsState({ serverError: "Could not connect to server. Please try again." });
    }
  };

  const updateRegistrationStateFields = (eventObject) => {
    setRegistrationFormState({ ...registrationFormState, [eventObject.target.name]: eventObject.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    alert('Login submitted (demo mode)');
  };

  return (
    <div className="relative min-h-screen bg-[#060c1a] font-sans text-slate-100 overflow-x-hidden flex flex-col justify-between">
      <canvas ref={hardwareCanvasElementRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      <AnimatePresence>
        {isProcessingMatrix && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#060814]/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
              className="bg-[#0b0f24] border border-slate-800/80 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl shadow-blue-500/5"
            >
              <div className="w-16 h-16 mx-auto relative">
                <motion.div
                  animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-full h-full rounded-full border-4 border-slate-800 border-t-blue-500"
                />
              </div>
              <p className="text-sm text-slate-300">{processingStatusText}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 py-12 flex-1 flex flex-col lg:flex-row items-center justify-center gap-16">
        <section className="flex-1 space-y-8 select-none">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-4">
            <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-[10px] font-bold tracking-widest uppercase">
              {uiTextStore.badgeInfrastructureLabel}
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-none">
              {uiTextStore.heroHeadingMain.split(' ').map((word, i, arr) =>
                arr.length === 1 ? word : word
              ).join(' ')}
            </h1>
            <p className="text-base text-slate-400 max-w-lg leading-relaxed">{uiTextStore.heroSubheadingDescription}</p>
          </motion.div>
          <div className="hidden sm:block max-w-xs">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">SF</div>
              <span className="text-[10px] font-bold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full">{uiTextStore.statusBadgeLiveStream}</span>
            </div>
          </div>
        </section>

        <motion.div variants={layoutFrameAnimationVariants} initial="hidden" animate="visible" className="w-full max-w-md bg-[#0b0f24]/90 backdrop-blur-xl border border-slate-800/80 shadow-2xl rounded-3xl p-8 lg:p-10 flex flex-col">
          {activeWorkflowPanel === 'profileSelect' && (
            <motion.div key="profile" variants={viewSlideAnimationVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <motion.div whileHover={{ scale: 1.05 }} className="w-28 h-28 rounded-full border-4 border-blue-500/20 p-1 bg-slate-900 flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-400">SA</span>
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-white">Sarobar Adhikari</h2>
                  <p className="text-xs text-slate-400 mt-1">{uiTextStore.sessionAlertText}</p>
                </div>
              </div>
              <div className="space-y-3">
                <button type="button" onClick={() => alert("Restoring identity profile mapping...")} className="w-full py-3 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl transition text-sm">{uiTextStore.actionButtonContinueUser}</button>
                <button type="button" onClick={() => setActiveWorkflowPanel('credentialsLogin')} className="w-full py-3 bg-slate-900 hover:bg-slate-800 font-semibold rounded-xl border border-slate-800 transition text-sm text-slate-300">{uiTextStore.actionButtonSwitchAccount}</button>
              </div>
            </motion.div>
          )}

          {activeWorkflowPanel === 'credentialsLogin' && (
            <motion.div key="credentials" variants={viewSlideAnimationVariants} initial="initial" animate="animate" exit="exit" className="space-y-5">
              <h2 className="text-xl font-bold text-white">{uiTextStore.formHeadingSignIn}</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{uiTextStore.labelFieldIdentifier}</label>
                  <input type="text" onChange={(e) => setLoginFormState({ ...loginFormState, identifier: e.target.value })} className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition" placeholder="name@domain.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{uiTextStore.labelFieldPassword}</label>
                  <div className="relative">
                    <input type={passwordVisibilityState ? "text" : "password"} onChange={(e) => setLoginFormState({ ...loginFormState, password: e.target.value })} className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition" placeholder="••••••••" />
                    <button type="button" onClick={() => setPasswordVisibilityState(!passwordVisibilityState)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-white">{passwordVisibilityState ? uiTextStore.visibilityToggleHide : uiTextStore.visibilityToggleShow}</button>
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition">{uiTextStore.formSubmitLoginButton}</button>
              </form>
            </motion.div>
          )}

          {activeWorkflowPanel === 'registrationForm' && (
            <motion.div key="registration" variants={viewSlideAnimationVariants} initial="initial" animate="animate" exit="exit" className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">{uiTextStore.formHeadingSignUp}</h2>
                <p className="text-xs text-slate-500">{uiTextStore.formSubheadingSignUp}</p>
              </div>
              {validationErrorsState.serverError && (
                <p className="text-red-400 text-xs bg-red-500/10 rounded-lg px-3 py-2">{validationErrorsState.serverError}</p>
              )}
              <form onSubmit={handleRegistrationFormSubmissionPipeline} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider">{uiTextStore.labelInputFirstName}</label>
                    <input name="firstname" value={registrationFormState.firstname} onChange={updateRegistrationStateFields} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500" />
                    {validationErrorsState.firstname && <p className="text-red-400 text-[10px]">{validationErrorsState.firstname}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider">{uiTextStore.labelInputSurname}</label>
                    <input name="surname" value={registrationFormState.surname} onChange={updateRegistrationStateFields} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500" />
                    {validationErrorsState.surname && <p className="text-red-400 text-[10px]">{validationErrorsState.surname}</p>}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">{uiTextStore.labelDropdownGender}</label>
                  <select name="gender" value={registrationFormState.gender} onChange={updateRegistrationStateFields} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500">
                    <option value="">{uiTextStore.placeholderSelectGender}</option>
                    <option value="male">{uiTextStore.genderOptionMale}</option>
                    <option value="female">{uiTextStore.genderOptionFemale}</option>
                    <option value="nonbinary">{uiTextStore.genderOptionNonBinary}</option>
                    <option value="private">{uiTextStore.genderOptionPrivate}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">{uiTextStore.labelInputContact}</label>
                  <input name="contact" value={registrationFormState.contact} onChange={updateRegistrationStateFields} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500" />
                  <p className="text-[9px] text-slate-600">{uiTextStore.contactExplanatoryText}</p>
                  {validationErrorsState.contact && <p className="text-red-400 text-[10px]">{validationErrorsState.contact}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">{uiTextStore.labelInputNewPassword}</label>
                  <input name="password" type="password" value={registrationFormState.password} onChange={updateRegistrationStateFields} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-500" />
                  {validationErrorsState.password && <p className="text-red-400 text-[10px]">{validationErrorsState.password}</p>}
                </div>
                <p className="text-[9px] text-slate-600 leading-relaxed">{uiTextStore.legalConsentText}</p>
                <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition">{uiTextStore.formSubmitSignupButton}</button>
                <button type="button" onClick={() => setActiveWorkflowPanel('credentialsLogin')} className="w-full text-center text-[10px] font-semibold text-blue-400 hover:underline pt-1">{uiTextStore.navigationLinkBackToLogin}</button>
              </form>
            </motion.div>
          )}

          {activeWorkflowPanel !== 'registrationForm' && (
            <>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-[9px] text-slate-600 uppercase font-semibold tracking-wider">{uiTextStore.separationTextOr}</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>
              <button type="button" onClick={() => setActiveWorkflowPanel('registrationForm')} className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 font-bold rounded-xl transition text-xs tracking-wide uppercase">{uiTextStore.actionButtonTriggerSignup}</button>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-[9px] text-slate-700">{uiTextStore.footerCorporateLabel}</p>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 border-t border-slate-800/50 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-600">
          <button type="button" onClick={() => setAppLanguageState('en')} className={`hover:text-slate-300 transition ${appLanguageState === 'en' ? 'text-blue-500 font-bold' : ''}`}>English (US)</button>
          <span className="text-slate-700">|</span>
          <button type="button" onClick={() => setAppLanguageState('ne')} className={`hover:text-slate-300 transition ${appLanguageState === 'ne' ? 'text-blue-500 font-bold' : ''}`}>नेपाली</button>
          <span className="text-slate-700">|</span>
          <span>© 2026 SnapFeed Global Technologies Corporation.</span>
        </div>
      </footer>
    </div>
  );
}
