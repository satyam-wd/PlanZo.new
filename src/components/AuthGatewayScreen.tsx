// Planzo Premium Split-Screen Login & Authentication Interface
import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Calendar,
  Target,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  User,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playTaskCompleteSound } from '../utils/audioSynth';
import { fireConfetti } from '../utils/audioVibes';

interface AuthGatewayScreenProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const AuthGatewayScreen: React.FC<AuthGatewayScreenProps> = () => {
  const { signUp, signIn, setIsPersonalizationWizardOpen } = useApp();

  // Mode: 'login' | 'signup' | 'forgot'
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form States
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Forgot Password State
  const [resetEmail, setResetEmail] = useState('');

  // Status & Feedback States
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Handle Primary Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanId = loginIdentifier.trim();
    if (!cleanId) {
      setErrorMsg('Please enter your Email or Username.');
      return;
    }

    if (!loginPassword || loginPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);
    if (rememberMe) {
      localStorage.setItem('planzo_remembered_user', cleanId);
    }

    setTimeout(() => {
      const ok = signIn(cleanId, loginPassword);
      setIsLoading(false);
      if (ok) {
        setSuccessMsg('Welcome back! Loading your Planzo workspace...');
      }
    }, 320);
  };

  // 2. Handle Sign Up
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanName = fullName.trim() || signupEmail.split('@')[0]?.trim();
    const cleanEmail = signupEmail.trim();

    if (!cleanName) {
      setErrorMsg('Please enter your name or username.');
      return;
    }

    if (!signupPassword || signupPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    playTaskCompleteSound();
    fireConfetti(55);

    const parts = cleanName.split(' ');
    const fName = parts[0] || cleanName;
    const lName = parts.slice(1).join(' ') || '';

    setTimeout(() => {
      signUp({
        name: cleanName,
        firstName: fName,
        lastName: lName,
        email: cleanEmail || `${fName.toLowerCase()}@planzo.app`,
        password: signupPassword,
        isVerified: true,
      });

      setSuccessMsg(`Welcome to Planzo, ${fName}! Preparing your workspace...`);
      setIsLoading(false);

      setTimeout(() => {
        setIsPersonalizationWizardOpen(true);
      }, 260);
    }, 380);
  };

  // 3. Handle Social Auth (Google / GitHub)
  const handleSocialLogin = (provider: 'Google' | 'GitHub') => {
    setErrorMsg('');
    setIsLoading(true);
    playTaskCompleteSound();

    const defaultUsername = loginIdentifier.trim() || `${provider} User`;
    setTimeout(() => {
      signIn(defaultUsername, 'oauth_verified_token');
      setSuccessMsg(`Authenticated with ${provider}! Redirecting...`);
      setIsLoading(false);
      setTimeout(() => {
        setIsPersonalizationWizardOpen(true);
      }, 240);
    }, 300);
  };

  // 4. Handle Forgot Password
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!resetEmail.trim()) {
      setErrorMsg('Please enter your registered email or username.');
      return;
    }
    setSuccessMsg(`Password recovery instructions sent for ${resetEmail.trim()}. You can also sign in directly with a new session password.`);
    setTimeout(() => {
      setMode('login');
      setLoginIdentifier(resetEmail.trim());
    }, 1600);
  };

  return (
    <div className="min-h-screen w-full bg-[#07111F] text-white font-sans selection:bg-[#6C4DFF]/30 selection:text-white relative overflow-x-hidden flex flex-col justify-between">
      {/* Subtle Ambient Background Mesh (Restrained, Startup-Grade) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div
          className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full opacity-20 blur-[130px]"
          style={{ background: 'radial-gradient(circle, #6C4DFF 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-180px] right-[-120px] w-[560px] h-[560px] rounded-full opacity-15 blur-[140px]"
          style={{ background: 'radial-gradient(circle, #3B9CFF 0%, transparent 70%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Main Split-Screen Container */}
      <main className="relative z-10 flex-1 w-full max-w-[1340px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 lg:py-12 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ================================================================= */}
          {/* LEFT SECTION: BRAND, VALUE PROPOSITION & CLEAN ILLUSTRATION       */}
          {/* Compact on mobile so the Login Card takes priority                */}
          {/* ================================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6 lg:space-y-8 lg:pr-6">
            {/* Top Brand Identity + Tagline */}
            <div className="flex items-center justify-between lg:justify-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C4DFF] to-[#3B9CFF] flex items-center justify-center shadow-lg shadow-[#6C4DFF]/25 border border-white/15">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                      Planzo
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs sm:text-sm font-medium text-[#3B9CFF] tracking-wide">
                      Plan Smarter. Do Better.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Headline & Supporting Copy */}
            <div className="space-y-3 sm:space-y-4 max-w-xl">
              <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-white leading-[1.15]">
                Turn Your Plans Into{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C4DFF] via-[#5674FF] to-[#3B9CFF]">
                  Progress.
                </span>
              </h1>
              <p className="text-slate-300/90 text-sm sm:text-base leading-relaxed font-normal">
                Organize your tasks, manage your time, and achieve your goals — all in one simple place.
              </p>
            </div>

            {/* 3 Feature Highlights (Hidden on tiny screens or shown compactly on desktop/tablet) */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-xl">
              {/* Highlight 1: Plan */}
              <div className="p-3 sm:p-4 rounded-2xl bg-[#0B1324]/90 border border-slate-800/80 hover:border-[#6C4DFF]/40 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-[#6C4DFF]/15 text-[#8C75FF] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-xs sm:text-sm">Plan</div>
                <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-snug">
                  Organize your day
                </div>
              </div>

              {/* Highlight 2: Focus */}
              <div className="p-3 sm:p-4 rounded-2xl bg-[#0B1324]/90 border border-slate-800/80 hover:border-[#3B9CFF]/40 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-[#3B9CFF]/15 text-[#3B9CFF] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <Target className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-xs sm:text-sm">Focus</div>
                <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-snug">
                  Get things done
                </div>
              </div>

              {/* Highlight 3: Achieve */}
              <div className="p-3 sm:p-4 rounded-2xl bg-[#0B1324]/90 border border-slate-800/80 hover:border-[#6C4DFF]/40 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C4DFF]/20 to-[#3B9CFF]/20 text-[#68B5FF] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <Trophy className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-xs sm:text-sm">Achieve</div>
                <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-snug">
                  Reach your goals
                </div>
              </div>
            </div>

            {/* Clean, Hand-Crafted Vector Illustration of a Person Planning on Laptop with Subtle Task & Calendar Cards */}
            <div className="hidden md:block pt-1 max-w-xl">
              <div className="relative rounded-2xl bg-[#0B1324]/80 border border-slate-800/80 p-5 overflow-hidden shadow-inner">
                <div className="flex items-center justify-between gap-6">
                  {/* Left: Editorial Vector Illustration of Planner at Desk */}
                  <div className="w-48 shrink-0">
                    <svg
                      viewBox="0 0 220 165"
                      className="w-full h-auto"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Soft Desk Surface */}
                      <rect x="12" y="140" width="196" height="4" rx="2" fill="#1E293B" />

                      {/* Background Calendar Widget */}
                      <rect
                        x="18"
                        y="18"
                        width="68"
                        height="54"
                        rx="8"
                        fill="#0F1A30"
                        stroke="#263554"
                        strokeWidth="1.2"
                      />
                      <rect x="26" y="26" width="22" height="4" rx="2" fill="#3B9CFF" />
                      <circle cx="30" cy="40" r="2.5" fill="#6C4DFF" />
                      <circle cx="42" cy="40" r="2.5" fill="#475569" />
                      <circle cx="54" cy="40" r="2.5" fill="#475569" />
                      <circle cx="66" cy="40" r="2.5" fill="#3B9CFF" />
                      <circle cx="30" cy="52" r="2.5" fill="#475569" />
                      <circle cx="42" cy="52" r="2.5" fill="#6C4DFF" />
                      <circle cx="54" cy="52" r="2.5" fill="#22C55E" />
                      <circle cx="66" cy="52" r="2.5" fill="#475569" />

                      {/* Person Silhouette (Modern Flat Editorial Vector) */}
                      {/* Head & Hair */}
                      <circle cx="118" cy="54" r="15" fill="#CBD5E1" />
                      <path
                        d="M103 52C103 42 110 36 120 36C129 36 134 42 134 50C129 47 122 46 115 47C109 48 105 50 103 52Z"
                        fill="#1E293B"
                      />
                      {/* Torso / Smart Casual Jacket */}
                      <path
                        d="M90 140C92 104 102 84 118 84C134 84 144 104 146 140H90Z"
                        fill="url(#plannerJacketGrad)"
                      />
                      {/* Collar / Shirt */}
                      <path d="M111 84L118 98L125 84H111Z" fill="#E2E8F0" />

                      {/* Laptop on Desk */}
                      <path
                        d="M126 106H178L172 140H120L126 106Z"
                        fill="#1E293B"
                        stroke="#475569"
                        strokeWidth="1.4"
                      />
                      {/* Laptop Screen Glow */}
                      <rect x="145" y="119" width="14" height="6" rx="3" fill="#3B9CFF" opacity="0.7" />
                      <rect x="110" y="137" width="70" height="3.5" rx="1.75" fill="#64748B" />

                      {/* Subtle Floating Productivity Progress Ring */}
                      <rect
                        x="150"
                        y="24"
                        width="54"
                        height="48"
                        rx="8"
                        fill="#0F1A30"
                        stroke="#263554"
                        strokeWidth="1.2"
                      />
                      <circle cx="177" cy="48" r="13" stroke="#1E293B" strokeWidth="3.5" />
                      <path
                        d="M177 35A13 13 0 1 1 165.5 54"
                        stroke="url(#ringGrad)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M174 48L176.5 50.5L181.5 45.5"
                        stroke="#3B9CFF"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <defs>
                        <linearGradient id="plannerJacketGrad" x1="90" y1="84" x2="146" y2="140" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#6C4DFF" />
                          <stop offset="1" stopColor="#3B9CFF" />
                        </linearGradient>
                        <linearGradient id="ringGrad" x1="164" y1="35" x2="190" y2="61" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#6C4DFF" />
                          <stop offset="1" stopColor="#3B9CFF" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Right: Subtle Live Task & Schedule Cards Preview */}
                  <div className="flex-1 space-y-2.5 min-w-0">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800/80">
                      <span className="font-semibold text-slate-200">Today’s Focus Flow</span>
                      <span className="font-mono text-[#3B9CFF] tabular-nums">85% Complete</span>
                    </div>

                    {/* Task Card 1 */}
                    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#07111F]/90 border border-slate-800/90">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                        </span>
                        <span className="text-xs text-slate-300 truncate line-through decoration-slate-500">
                          Morning Deep Work Sprint
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0 tabular-nums">
                        08:00 AM
                      </span>
                    </div>

                    {/* Task Card 2 */}
                    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#111C33] border border-[#6C4DFF]/40">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#3B9CFF] shrink-0" />
                        <span className="text-xs font-medium text-white truncate">
                          Product Roadmap & Study Sync
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#3B9CFF] shrink-0 tabular-nums">
                        In Progress
                      </span>
                    </div>

                    {/* Task Card 3 */}
                    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#07111F]/90 border border-slate-800/90">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#6C4DFF] shrink-0" />
                        <span className="text-xs text-slate-300 truncate">
                          Evening Review & Tomorrow Plan
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0 tabular-nums">
                        08:00 PM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* RIGHT SECTION: PREMIUM GLASS / SOFT-DARK LOGIN CARD               */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 w-full max-w-[440px] mx-auto">
            <div className="rounded-3xl bg-[#0B1324]/90 backdrop-blur-xl border border-slate-800/90 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7)] p-6 sm:p-8 space-y-6">
              {/* Status Notifications */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* ============================================================= */}
              {/* VIEW 1: LOGIN CARD (DEFAULT)                                  */}
              {/* ============================================================= */}
              {mode === 'login' && (
                <div className="space-y-5 animate-fadeIn">
                  {/* Heading & Subheading */}
                  <div className="space-y-1.5">
                    <h2 className="text-2xl sm:text-[26px] font-bold tracking-tight text-white">
                      Welcome back 👋
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Let’s get your plans back on track.
                    </p>
                  </div>

                  {/* Login Form */}
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {/* Email / Username Input */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="planzo-login-id"
                        className="block text-xs font-medium text-slate-300"
                      >
                        Email / Username
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="planzo-login-id"
                          type="text"
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          placeholder="name@company.com or username"
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#07111F]/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-[#3B9CFF] focus:ring-2 focus:ring-[#6C4DFF]/30 transition-all"
                        />
                      </div>
                    </div>

                    {/* Password Input + Visibility Eye Icon */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="planzo-login-password"
                        className="block text-xs font-medium text-slate-300"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="planzo-login-password"
                          type={showPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#07111F]/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-[#3B9CFF] focus:ring-2 focus:ring-[#6C4DFF]/30 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Below Password: Remember me checkbox + Forgot password? */}
                    <div className="flex items-center justify-between pt-0.5 text-xs">
                      <label className="inline-flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-600 bg-[#07111F] text-[#6C4DFF] focus:ring-[#6C4DFF]/40 cursor-pointer accent-[#6C4DFF]"
                        />
                        <span>Remember me</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setErrorMsg('');
                          setSuccessMsg('');
                        }}
                        className="text-[#3B9CFF] hover:text-[#68B5FF] font-medium hover:underline transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Primary CTA: Login -> */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#3B9CFF] hover:from-[#5B3DF5] hover:to-[#2B8CEB] text-white font-semibold text-sm shadow-lg shadow-[#6C4DFF]/25 hover:shadow-[#6C4DFF]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <span>{isLoading ? 'Signing in...' : 'Login →'}</span>
                    </button>
                  </form>

                  {/* Divider: or continue with */}
                  <div className="relative flex items-center py-1">
                    <div className="flex-grow border-t border-slate-800" />
                    <span className="shrink-0 px-3 text-xs text-slate-400">
                      or continue with
                    </span>
                    <div className="flex-grow border-t border-slate-800" />
                  </div>

                  {/* Social Login Buttons: Continue with Google & Continue with GitHub */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('Google')}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#07111F]/90 hover:bg-[#111D35] border border-slate-700/80 hover:border-slate-600 text-xs sm:text-sm font-medium text-slate-200 transition-all flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5L1.6 16c1.9 3.9 5.8 7 10.4 7z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialLogin('GitHub')}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#07111F]/90 hover:bg-[#111D35] border border-slate-700/80 hover:border-slate-600 text-xs sm:text-sm font-medium text-slate-200 transition-all flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap"
                    >
                      <svg
                        className="w-4 h-4 shrink-0 fill-current text-white"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        />
                      </svg>
                      <span>Continue with GitHub</span>
                    </button>
                  </div>

                  {/* Bottom Sign Up Link */}
                  <div className="pt-2 text-center border-t border-slate-800/80">
                    <p className="text-xs sm:text-sm text-slate-400">
                      Don’t have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('signup');
                          setErrorMsg('');
                          setSuccessMsg('');
                        }}
                        className="text-white hover:text-[#3B9CFF] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Sign Up →</span>
                      </button>
                    </p>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* VIEW 2: SIGN UP CARD                                          */}
              {/* ============================================================= */}
              {mode === 'signup' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="space-y-1.5">
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                      Create your Planzo account
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Start organizing your tasks, schedule, and goals in seconds.
                    </p>
                  </div>

                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        Full Name / Username
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Aarav Sharma"
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#07111F]/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-[#3B9CFF] focus:ring-2 focus:ring-[#6C4DFF]/30 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#07111F]/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-[#3B9CFF] focus:ring-2 focus:ring-[#6C4DFF]/30 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="Create a password (min. 4 chars)"
                          required
                          className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#07111F]/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-[#3B9CFF] focus:ring-2 focus:ring-[#6C4DFF]/30 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
                        >
                          {showSignupPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#3B9CFF] hover:from-[#5B3DF5] hover:to-[#2B8CEB] text-white font-semibold text-sm shadow-lg shadow-[#6C4DFF]/25 hover:shadow-[#6C4DFF]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <span>{isLoading ? 'Creating Workspace...' : 'Sign Up →'}</span>
                    </button>
                  </form>

                  <div className="pt-2 text-center border-t border-slate-800/80">
                    <p className="text-xs sm:text-sm text-slate-400">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setErrorMsg('');
                          setSuccessMsg('');
                        }}
                        className="text-white hover:text-[#3B9CFF] font-semibold transition-colors cursor-pointer"
                      >
                        Login →
                      </button>
                    </p>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* VIEW 3: FORGOT PASSWORD CARD                                  */}
              {/* ============================================================= */}
              {mode === 'forgot' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="space-y-1.5">
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                      Reset your password
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Enter your email or username and we’ll get you back into your workspace.
                    </p>
                  </div>

                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        Email / Username
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="name@company.com or username"
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#07111F]/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-[#3B9CFF] focus:ring-2 focus:ring-[#6C4DFF]/30 transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#6C4DFF] to-[#3B9CFF] hover:from-[#5B3DF5] hover:to-[#2B8CEB] text-white font-semibold text-sm shadow-lg shadow-[#6C4DFF]/25 hover:shadow-[#6C4DFF]/40 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <span>Send Reset Link →</span>
                    </button>
                  </form>

                  <div className="pt-2 text-center border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-xs sm:text-sm text-slate-400 hover:text-white font-medium transition-colors cursor-pointer"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Subtle Minimal Footer */}
      <footer className="relative z-10 w-full max-w-[1340px] mx-auto px-4 sm:px-8 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 border-t border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Planzo</span>
          <span>·</span>
          <span>Plan Smarter. Do Better.</span>
        </div>
        <div className="flex items-center gap-4">
          <span>For Students, Professionals & Teams</span>
        </div>
      </footer>
    </div>
  );
};

