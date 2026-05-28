import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const localizationMatrix = {
  en: {
    heroTitle: "Explore the things you love.",
    heroSubtitle: "Join millions of creators sharing instant stories, real-time feeds, and interactive spaces on SnapFeed.",
    liveBadge: "LIVE STREAM",
    quickSession: "Quick session recovery active",
    btnContinue: "Continue as Active User",
    btnSwitch: "Use another profile",
    signInHeading: "Sign In securely",
    labelIdentifier: "Email, Phone, or Username",
    labelPassword: "Password",
    btnShow: "Show",
    btnHide: "Hide",
    btnSubmitLogin: "Verify Identity & Enter",
    dividerText: "or",
    btnCreateAccount: "Create new account",
    regHeading: "Get started on SnapFeed",
    regSubtitle: "Create a verified account to connect with communities.",
    labelFirstname: "First name",
    labelSurname: "Surname",
    labelDob: "Date of birth",
    labelGender: "Gender",
    optGenderPlaceholder: "Select your gender",
    genFemale: "Female",
    genMale: "Male",
    genNonBinary: "Non-Binary",
    genPrivate: "Prefer not to say",
    labelContact: "Mobile number or email address",
    contactDisclaimer: "Verification codes will be routed securely via this gateway.",
    labelNewPassword: "New Password",
    legalText: "By clicking Submit, you explicitly agree to accept our Terms of Service, automated Privacy Policy algorithms, and localized Cookie Matrix parameters.",
    btnSubmitReg: "Complete Registration",
    linkBackLogin: "I already have an account",
    poweredBy: "Powered by SnapFeed Core Engine"
  },
  ne: {
    heroTitle: "आफूलाई मनपर्ने कुराहरू अन्वेषण गर्नुहोस्।",
    heroSubtitle: "SnapFeed मा द्रुत कथाहरू, वास्तविक-समय फिडहरू, र अन्तरक्रियात्मक ठाउँहरू साझा गर्ने लाखौं सिर्जनाकर्ताहरूमा सामेल हुनुहोस्।",
    liveBadge: "लाइभ फिड",
    quickSession: "द्रुत सत्र पुन: प्राप्ति सक्रिय छ",
    btnContinue: "जारी राख्नुहोस्",
    btnSwitch: "अर्को प्रोफाइल प्रयोग गर्नुहोस्",
    signInHeading: "सुरक्षित लगइन गर्नुहोस्",
    labelIdentifier: "इमेल, फोन वा प्रयोगकर्ता नाम",
    labelPassword: "पासवर्ड",
    btnShow: "देखाउनुहोस्",
    btnHide: "लुकाउनुहोस्",
    btnSubmitLogin: "पहिचान प्रमाणित गर्नुहोस्",
    dividerText: "वा",
    btnCreateAccount: "नयाँ खाता खोल्नुहोस्",
    regHeading: "SnapFeed मा सुरु गर्नुहोस्",
    regSubtitle: "समुदायहरूसँग जडान गर्न प्रमाणित खाता सिर्जना गर्नुहोस्।",
    labelFirstname: "पहिलो नाम",
    labelSurname: "थर",
    labelDob: "जन्ममिति",
    labelGender: "लिङ्ग",
    optGenderPlaceholder: "आफ्नो लिङ्ग चयन गर्नुहोस्",
    genFemale: "महिला",
    genMale: "पुरुष",
    genNonBinary: "गैर-बाइनरी",
    genPrivate: "भन्न नचाहने",
    labelContact: "मोबाइल नम्बर वा इमेल ठेगाना",
    contactDisclaimer: "प्रमाणीकरण कोडहरू यस गेटवे मार्फत सुरक्षित रूपमा पठाइनेछ।",
    labelNewPassword: "नयाँ पासवर्ड",
    legalText: "सब्मिटमा क्लिक गरेर, तपाईं स्न्यापफिडको सेवा सर्तहरू, गोपनीयता नीति, र कुकी म्याट्रिक्स प्यारामिटरहरू स्वीकार गर्न सहमत हुनुहुन्छ।",
    btnSubmitReg: "खाता खोल्नुहोस्",
    linkBackLogin: "मेरो पहिले नै खाता छ",
    poweredBy: "स्न्यापफिड कोर इन्जिन द्वारा संचालित"
  }
};

const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const fadeSlideVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.3, ease: "easeIn" } }
};

export default function SnapFeedAuth() {
  const [lang, setLang] = useState('en');
  const [activeFlow, setActiveFlow] = useState('profileSelect');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regData, setRegData] = useState({
    firstname: '', surname: '', dobDay: '', dobMonth: '', dobYear: '', gender: '', contact: '', password: ''
  });
  const [errors, setErrors] = useState({});

  const dict = localizationMatrix[lang] || localizationMatrix['en'];
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    const particles = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        speedX: Math.random() * 0.6 - 0.3,
        speedY: Math.random() * 0.6 - 0.3,
        alpha: Math.random() * 0.5 + 0.1
      });
    }
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${p.alpha})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const currentErrors = {};
    if (!loginId.trim()) currentErrors.loginId = "Identifier field is mandatory.";
    if (loginPassword.length < 6) currentErrors.loginPassword = "Password must be at least 6 characters.";
    if (Object.keys(currentErrors).length > 0) { setErrors(currentErrors); return; }
    setErrors({});
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginId, password: loginPassword })
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Access Authorized! Welcome back, ${data.user.name}`);
      } else {
        setErrors({ server: data.message });
      }
    } catch (err) {
      setErrors({ server: "Network infrastructure communications failure." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegInputChange = (e) => {
    setRegData({ ...regData, [e.target.name]: e.target.value });
  };

  const handleRegSubmit = () => {
    alert('Registering metadata...');
  };

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-slate-100 overflow-x-hidden flex flex-col justify-between">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 py-12 flex-1 flex flex-col lg:flex-row items-center justify-center gap-16">
        <section className="flex-1 space-y-8 select-none">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-bold tracking-widest uppercase">
              Application Infrastructure v2.4
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-none">
              {dict.heroTitle.split(' ').map((word, i) =>
                word.includes('love') || word.includes('मनपर्ने')
                  ? <span key={i} className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">{word} </span>
                  : `${word} `
              )}
            </h1>
            <p className="text-lg text-slate-400 max-w-lg leading-relaxed">{dict.heroSubtitle}</p>
          </motion.div>
          <div className="hidden sm:grid grid-cols-3 gap-4 max-w-xl h-48 opacity-75">
            <motion.div whileHover={{ y: -5, scale: 1.02 }} className="col-span-2 bg-gradient-to-br from-blue-600/20 to-indigo-600/5 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-4 left-4 w-12 h-2 bg-blue-500/40 rounded-full" />
              <div className="absolute bottom-4 left-4 right-4 h-16 bg-slate-900/60 border border-slate-800 rounded-xl" />
            </motion.div>
            <motion.div whileHover={{ y: -5, scale: 1.02 }} className="bg-gradient-to-br from-emerald-600/20 to-teal-600/5 border border-slate-800 rounded-2xl p-4 flex items-end justify-center">
              <span className="text-xs font-bold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full">{dict.liveBadge}</span>
            </motion.div>
          </div>
        </section>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl rounded-3xl p-8 lg:p-10 flex flex-col"
        >
          {activeFlow === 'profileSelect' && (
            <motion.div key="profile" variants={fadeSlideVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <motion.div whileHover={{ scale: 1.05 }} className="w-28 h-28 rounded-full border-4 border-blue-500/20 p-1 bg-slate-900 flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-400">SA</span>
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-white">Sarobar Adhikari</h2>
                  <p className="text-sm text-slate-400">{dict.quickSession}</p>
                </div>
              </div>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => alert("Restoring authentication tokens natively...")}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/20"
                >
                  {dict.btnContinue}
                </motion.button>
                <button
                  onClick={() => setActiveFlow('credentialsLogin')}
                  className="w-full py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-700/50 transition"
                >
                  {dict.btnSwitch}
                </button>
              </div>
            </motion.div>
          )}

          {activeFlow === 'credentialsLogin' && (
            <motion.div key="credentials" variants={fadeSlideVariants} initial="initial" animate="animate" exit="exit" className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white">{dict.signInHeading}</h2>
              </div>
              {errors.server && (
                <p className="text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">{errors.server}</p>
              )}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{dict.labelIdentifier}</label>
                  <input
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                    placeholder="name@example.com"
                  />
                  {errors.loginId && <p className="text-red-400 text-xs">{errors.loginId}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{dict.labelPassword}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
                    >
                      {showPassword ? dict.btnHide : dict.btnShow}
                    </button>
                  </div>
                  {errors.loginPassword && <p className="text-red-400 text-xs">{errors.loginPassword}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition disabled:opacity-50"
                >
                  {isLoading ? "Validating Matrix..." : dict.btnSubmitLogin}
                </button>
              </form>
            </motion.div>
          )}

          {activeFlow === 'registrationForm' && (
            <motion.div key="registration" variants={fadeSlideVariants} initial="initial" animate="animate" exit="exit" className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white">{dict.regHeading}</h2>
                <p className="text-sm text-slate-400">{dict.regSubtitle}</p>
              </div>
              <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); handleRegSubmit(); }}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">{dict.labelFirstname}</label>
                    <input name="firstname" value={regData.firstname} onChange={handleRegInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">{dict.labelSurname}</label>
                    <input name="surname" value={regData.surname} onChange={handleRegInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">{dict.labelGender}</label>
                  <select name="gender" value={regData.gender} onChange={handleRegInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500">
                    <option value="">{dict.optGenderPlaceholder}</option>
                    <option value="female">{dict.genFemale}</option>
                    <option value="male">{dict.genMale}</option>
                    <option value="nonbinary">{dict.genNonBinary}</option>
                    <option value="private">{dict.genPrivate}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">{dict.labelContact}</label>
                  <input name="contact" value={regData.contact} onChange={handleRegInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" />
                  <p className="text-[10px] text-slate-500">{dict.contactDisclaimer}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">{dict.labelNewPassword}</label>
                  <input name="password" type="password" value={regData.password} onChange={handleRegInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" />
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">{dict.legalText}</p>
                <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition">
                  {dict.btnSubmitReg}
                </button>
                <button type="button" onClick={() => setActiveFlow('credentialsLogin')} className="w-full text-center text-xs font-semibold text-blue-400 hover:underline pt-1">
                  {dict.linkBackLogin}
                </button>
              </form>
            </motion.div>
          )}

          {activeFlow !== 'registrationForm' && (
            <>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-xs text-slate-500 uppercase font-semibold">{dict.dividerText}</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>
              <button
                onClick={() => setActiveFlow('registrationForm')}
                className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold rounded-xl transition text-sm text-center"
              >
                {dict.btnCreateAccount}
              </button>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-[10px] text-slate-600">{dict.poweredBy}</p>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 border-t border-slate-800/50 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          <button onClick={() => setLang('en')} className={`hover:text-white transition ${lang === 'en' ? 'text-blue-400 font-bold' : ''}`}>English (US)</button>
          <span className="text-slate-700">|</span>
          <button onClick={() => setLang('ne')} className={`hover:text-white transition ${lang === 'ne' ? 'text-blue-400 font-bold' : ''}`}>नेपाली</button>
          <span className="text-slate-700">|</span>
          <span>© 2026 SnapFeed Global Technologies Corporation.</span>
        </div>
      </footer>
    </div>
  );
}
