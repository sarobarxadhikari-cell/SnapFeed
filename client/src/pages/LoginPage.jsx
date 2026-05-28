import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    clearError();
  }, []);

  const validate = () => {
    const errors = {};
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Invalid email format';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 8) errors.password = 'Password must be at least 8 characters';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await login(email, password);
    if (result.success) {
      navigate('/feed');
    }
  };

  const fillDemo = () => {
    setEmail('alex@snapfeed.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0b0f17]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(24,119,242,0.15)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(255,216,77,0.1)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMjB2MjBtMC0yMEgwem0wIDBMMTAgMG0xMCAyMGwxMCAweiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')] opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-[420px] mx-4"
      >
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1877f2] to-[#ffd84d] flex items-center justify-center mx-auto mb-4"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="text-white" size={32} />
          </motion.div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#1877f2] to-[#ffd84d] bg-clip-text text-transparent">
            Snapfeed Ultra
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Connect, Share, and Communicate</p>
        </div>

        <motion.div
          className="glass-dark rounded-3xl p-8 border border-white/10 shadow-elevated"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setFormErrors({}); }}
                  placeholder="Email address"
                  className={`w-full bg-white/5 border ${formErrors.email ? 'border-red-500' : 'border-white/10'} rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2]/30 transition-all text-sm`}
                />
              </div>
              {formErrors.email && <p className="text-red-400 text-xs mt-1.5 ml-1">{formErrors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFormErrors({}); }}
                  placeholder="Password"
                  className={`w-full bg-white/5 border ${formErrors.password ? 'border-red-500' : 'border-white/10'} rounded-2xl py-3.5 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2]/30 transition-all text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formErrors.password && <p className="text-red-400 text-xs mt-1.5 ml-1">{formErrors.password}</p>}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl py-2"
              >
                {error}
              </motion.p>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#1877f2]"
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <button type="button" className="text-sm text-[#1877f2] hover:underline">
                Forgot password?
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#1877f2] to-[#4f46e5] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#1877f2]/25 transition-all disabled:opacity-60"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  Log In
                </>
              )}
            </motion.button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-xs text-gray-500 bg-[#151728]">or</span>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={fillDemo}
              className="w-full py-3 rounded-2xl border border-white/10 text-gray-300 text-sm hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.01 }}
            >
              <Sparkles size={16} className="text-yellow-400" />
              Demo Login (Quick Access)
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#1877f2] hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
