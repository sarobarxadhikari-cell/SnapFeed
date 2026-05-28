import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Camera, ArrowLeft, Check, X } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { authAPI } from '../services/api';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuthStore();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    firstName: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailExists, setEmailExists] = useState(false);

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: '' }));
    if (key === 'email') checkEmail(value);
    if (key === 'password') calculateStrength(value);
  };

  const checkEmail = async (email) => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return;
    try {
      const res = await authAPI.checkEmail(email);
      setEmailExists(res.data.exists);
    } catch {
      setEmailExists(false);
    }
  };

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (pass.length >= 12) score += 15;
    if (/(?=.*[a-z])/.test(pass)) score += 15;
    if (/(?=.*[A-Z])/.test(pass)) score += 15;
    if (/(?=.*\d)/.test(pass)) score += 15;
    if (/(?=.*[!@#$%^&*])/.test(pass)) score += 15;
    setPasswordStrength(score);
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validateStep1 = () => {
    const errors = {};
    if (!form.firstName.trim()) errors.firstName = 'First name is required';
    if (!form.surname.trim()) errors.surname = 'Surname is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Invalid email format';
    else if (emailExists) errors.email = 'Email already registered';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 8) errors.password = 'Must be at least 8 characters';
    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    clearError();
    const name = `${form.firstName} ${form.surname}`.trim();
    const result = await signup(name, form.email, form.password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const passwordStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-yellow-500';
    if (passwordStrength < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const strengthLabel = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 60) return 'Fair';
    if (passwordStrength < 80) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0b0f17]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(24,119,242,0.12)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(255,216,77,0.08)_0%,_transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[440px] mx-4"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1877f2] to-[#ffd84d] bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-400 text-sm mt-1">Join Snapfeed Ultra today</p>
        </div>

        <motion.div className="glass-dark rounded-3xl p-8 border border-white/10 shadow-elevated">
          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    s <= step ? 'bg-gradient-to-r from-[#1877f2] to-[#4f46e5] text-white' : 'bg-white/10 text-gray-500'
                  }`}
                >
                  {s < step ? <Check size={14} /> : s}
                </div>
                {s < 3 && <div className={`flex-1 h-0.5 rounded ${s < step ? 'bg-[#1877f2]' : 'bg-white/10'}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1877f2] to-[#4f46e5] flex items-center justify-center text-2xl font-bold text-white cursor-pointer overflow-hidden"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={24} />
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
                  <p className="text-xs text-gray-500 text-center mt-2">Add photo (optional)</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      value={form.firstName}
                      onChange={(e) => updateForm('firstName', e.target.value)}
                      placeholder="First name"
                      className={`w-full bg-white/5 border ${formErrors.firstName ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-10 pr-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1877f2] text-sm`}
                    />
                  </div>
                  {formErrors.firstName && <p className="text-red-400 text-xs mt-1">{formErrors.firstName}</p>}
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      value={form.surname}
                      onChange={(e) => updateForm('surname', e.target.value)}
                      placeholder="Surname"
                      className={`w-full bg-white/5 border ${formErrors.surname ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-10 pr-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1877f2] text-sm`}
                    />
                  </div>
                  {formErrors.surname && <p className="text-red-400 text-xs mt-1">{formErrors.surname}</p>}
                </div>
              </div>

              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    value={form.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    placeholder="Mobile number or email"
                    className={`w-full bg-white/5 border ${formErrors.email ? 'border-red-500' : emailExists ? 'border-yellow-500' : 'border-white/10'} rounded-xl py-3 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1877f2] text-sm`}
                  />
                  {emailExists && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X size={16} className="text-yellow-400" />
                    </div>
                  )}
                </div>
                {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>}
                {emailExists && !formErrors.email && (
                  <p className="text-yellow-400 text-xs mt-1">Email already registered</p>
                )}
              </div>

              <motion.button
                onClick={nextStep}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#1877f2] to-[#4f46e5] text-white font-semibold text-sm"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Next
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => updateForm('password', e.target.value)}
                    placeholder="New password"
                    className={`w-full bg-white/5 border ${formErrors.password ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1877f2] text-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {formErrors.password && <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 h-1 rounded-full ${
                            passwordStrength >= i * 25 ? passwordStrengthColor() : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs mt-1 ${passwordStrength >= 60 ? 'text-green-400' : 'text-gray-400'}`}>
                      {strengthLabel()} password
                    </p>
                  </div>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => updateForm('confirmPassword', e.target.value)}
                    placeholder="Confirm password"
                    className={`w-full bg-white/5 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#1877f2] text-sm`}
                  />
                </div>
                {formErrors.confirmPassword && <p className="text-red-400 text-xs mt-1">{formErrors.confirmPassword}</p>}
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                    <Check size={12} /> Passwords match
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <motion.button
                  onClick={prevStep}
                  className="flex-1 py-3 rounded-2xl border border-white/10 text-gray-300 text-sm flex items-center justify-center gap-1"
                  whileHover={{ scale: 1.01 }}
                >
                  <ArrowLeft size={16} /> Back
                </motion.button>
                <motion.button
                  onClick={nextStep}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#1877f2] to-[#4f46e5] text-white font-semibold text-sm"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Next
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1877f2] to-[#4f46e5] flex items-center justify-center text-2xl font-bold text-white mx-auto">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    (form.firstName[0] || '') + (form.surname[0] || '')
                  )}
                </div>
                <h3 className="text-lg font-semibold mt-3">
                  {form.firstName} {form.surname}
                </h3>
                <p className="text-sm text-gray-400">{form.email}</p>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Name</span>
                  <span>
                    {form.firstName} {form.surname}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Email</span>
                  <span>{form.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Password</span>
                  <span className="text-green-400">●●●●●●●● <Check size={12} className="inline" /></span>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl py-2">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <motion.button
                  onClick={prevStep}
                  className="flex-1 py-3 rounded-2xl border border-white/10 text-gray-300 text-sm"
                  whileHover={{ scale: 1.01 }}
                >
                  Back
                </motion.button>
                <motion.button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#1877f2] to-[#4f46e5] text-white font-semibold text-sm disabled:opacity-60"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                  ) : (
                    'Create Account'
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          <p className="text-center text-xs text-gray-500 mt-6">
            By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1877f2] hover:underline font-medium">
              Log in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
