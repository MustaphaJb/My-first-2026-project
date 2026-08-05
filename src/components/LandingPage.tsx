import React, { useState, useEffect } from 'react';
import { 
  Tv, Smartphone, Monitor, ShieldCheck, Mail, Phone, Lock, 
  CheckCircle2, ArrowRight, Sparkles, RefreshCw, KeyRound, User, 
  DollarSign, ShoppingBag, Radio, Play, Gift, Layers, Check, ChevronRight
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface LandingPageProps {
  onLoginSuccess: (userProfile: UserProfile) => void;
  onBrowseAsGuest: () => void;
  selectedPlatform: 'desktop' | 'android';
  onPlatformChange: (platform: 'desktop' | 'android') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLoginSuccess,
  onBrowseAsGuest,
  selectedPlatform,
  onPlatformChange
}) => {
  const [authMode, setAuthMode] = useState<'signup' | 'login' | 'email_verify' | 'otp_verify'>('signup');
  
  // Registration Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 812 345 6789');
  const [countryCode, setCountryCode] = useState('+234');
  const [password, setPassword] = useState('');
  const [preferredRole, setPreferredRole] = useState<UserRole>('Creator');
  const [preferredDevice, setPreferredDevice] = useState<'android' | 'desktop'>(selectedPlatform);

  // Email Verification State
  const [emailCode, setEmailCode] = useState('849201');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailTimer, setEmailTimer] = useState(45);

  // OTP Verification State
  const [otpCode, setOtpCode] = useState('654321');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // UI Feedback
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timers for email/otp resend
  useEffect(() => {
    let interval: any;
    if (authMode === 'email_verify' && emailTimer > 0) {
      interval = setInterval(() => setEmailTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [authMode, emailTimer]);

  useEffect(() => {
    let interval: any;
    if (authMode === 'otp_verify' && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [authMode, otpTimer]);

  // Submit Sign Up Form -> Move to Email Confirmation
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      setStatusMessage('Please fill in your name and email address.');
      return;
    }
    setIsSubmitting(true);
    setStatusMessage('Generating email verification token...');
    
    setTimeout(() => {
      setIsSubmitting(false);
      setStatusMessage(null);
      setAuthMode('email_verify');
    }, 800);
  };

  // Submit Email Verification -> Move to OTP Confirmation
  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailCode.length < 6) {
      setStatusMessage('Please enter the 6-digit email confirmation code.');
      return;
    }
    setIsSubmitting(true);
    setStatusMessage('Verifying email security code...');

    setTimeout(() => {
      setIsSubmitting(false);
      setIsEmailVerified(true);
      setStatusMessage(null);
      setAuthMode('otp_verify');
    }, 900);
  };

  // Submit OTP Verification -> Finalize Account Registration
  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setStatusMessage('Please enter the 6-digit SMS OTP code.');
      return;
    }
    setIsSubmitting(true);
    setStatusMessage('Confirming OTP & provisioning developer account...');

    setTimeout(() => {
      setIsSubmitting(false);
      setIsOtpVerified(true);
      
      const newProfile: UserProfile = {
        id: `user_${Date.now()}`,
        name: name || 'New Sununsi Creator',
        email: email || 'user@sununsi.dev',
        phone: `${countryCode} ${phone}`,
        handle: `@${(name || 'creator').toLowerCase().replace(/\s+/g, '')}`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        bio: `Software developer & creator on Sununsi Dev (${preferredDevice.toUpperCase()} platform).`,
        subscribersCount: 1,
        verified: true,
        verificationBadgeType: 'Official Dev',
        role: preferredRole,
        twoFactorEnabled: true,
        faceIdRegistered: true,
        emailVerified: true,
        phoneVerified: true,
        otpVerified: true,
        isLoggedIn: true,
        preferredDevice: preferredDevice,
        walletBalance: 25.00, // Welcome bonus credit
        referralCode: `SUNUNSI-${Math.floor(1000 + Math.random() * 9000)}`,
        referredCount: 0,
        referralEarnings: 0,
        joinedDate: 'Just Now'
      };

      onLoginSuccess(newProfile);
    }, 1200);
  };

  // Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      setStatusMessage('Please enter your registered email address.');
      return;
    }
    setIsSubmitting(true);
    setStatusMessage('Authenticating credentials & checking 2FA OTP...');

    setTimeout(() => {
      setIsSubmitting(false);
      setAuthMode('otp_verify');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans antialiased flex flex-col">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 w-full bg-[#080808]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-600 rounded-xl flex items-center justify-center font-serif text-xl font-bold text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]">
            S
          </div>
          <div>
            <span className="font-serif italic text-xl tracking-tight text-white">
              Sununsi <span className="text-orange-500">Dev</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/50">
              Desktop & Android Engine
            </span>
          </div>
        </div>

        {/* Platform View Switcher & Guest CTA */}
        <div className="flex items-center gap-3">
          {/* Device Toggle */}
          <div className="flex bg-black p-1 rounded-full border border-white/10 text-xs">
            <button
              onClick={() => onPlatformChange('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
                selectedPlatform === 'desktop'
                  ? 'bg-orange-600 text-white shadow-[0_0_10px_rgba(234,88,12,0.3)]'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button
              onClick={() => onPlatformChange('android')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
                selectedPlatform === 'android'
                  ? 'bg-orange-600 text-white shadow-[0_0_10px_rgba(234,88,12,0.3)]'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Android</span>
            </button>
          </div>

          <button
            onClick={onBrowseAsGuest}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-all"
          >
            Explore as Guest
          </button>
        </div>
      </header>

      {/* Hero Section & Auth Center */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Platform Showcase */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/10 border border-orange-600/30 text-orange-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Multi-Platform Developer Network
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-white leading-tight">
            Stream 4K Developer Videos, Earn CPA Rewards & Monetize Code on <span className="text-orange-500 italic">Desktop & Android</span>
          </h1>

          <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-2xl">
            Sununsi Dev is the high-performance media & developer monetization platform built for modern creators. Features 4K video playback, live streams with SuperChat, CPA task earnings, digital store marketplaces, and biometric Face ID & 2FA OTP security.
          </p>

          {/* Device Compatibility Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 bg-[#080808] border border-white/10 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 bg-orange-600/20 text-orange-400 rounded-xl border border-orange-600/30">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">Android Mobile App & PWA</h4>
                <p className="text-[11px] text-white/40">Touch optimized, offline sync & APK bundle ready.</p>
              </div>
            </div>

            <div className="p-4 bg-[#080808] border border-white/10 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 bg-orange-600/20 text-orange-400 rounded-xl border border-orange-600/30">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">Desktop Workstation</h4>
                <p className="text-[11px] text-white/40">Multi-monitor layouts, 4K streaming & creator studio.</p>
              </div>
            </div>
          </div>

          {/* Core Highlights */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl sm:text-2xl font-bold font-mono text-white">4K 60FPS</p>
              <p className="text-[11px] text-white/40 uppercase tracking-widest">Adaptive Video</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold font-mono text-orange-400">$850.00+</p>
              <p className="text-[11px] text-white/40 uppercase tracking-widest">Daily CPA Rewards</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold font-mono text-white">Instant OTP</p>
              <p className="text-[11px] text-white/40 uppercase tracking-widest">2FA Security</p>
            </div>
          </div>
        </div>

        {/* Right Column: User Auth Box (Sign Up, Log In, Email Confirmation, OTP Confirmation) */}
        <div className="lg:col-span-5">
          <div className="bg-[#080808] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600" />

            {/* Auth Stage Stepper / Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="font-serif text-xl text-white">
                  {authMode === 'signup' && 'Create Developer Account'}
                  {authMode === 'login' && 'Sign In to Sununsi'}
                  {authMode === 'email_verify' && 'Email Address Confirmation'}
                  {authMode === 'otp_verify' && 'Mobile 2FA OTP Confirmation'}
                </h3>
                <p className="text-xs text-white/50">
                  {authMode === 'signup' && 'Sign up to access 4K streams & CPA earnings.'}
                  {authMode === 'login' && 'Welcome back! Access your wallet & studio.'}
                  {authMode === 'email_verify' && 'Step 2 of 3: Verify your email address.'}
                  {authMode === 'otp_verify' && 'Step 3 of 3: Confirm SMS OTP security code.'}
                </p>
              </div>

              <div className="p-2.5 rounded-2xl bg-orange-600/20 text-orange-400 border border-orange-600/30 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            {/* Mode Selector Tabs (Sign Up vs Log In) */}
            {(authMode === 'signup' || authMode === 'login') && (
              <div className="flex bg-black p-1 rounded-2xl border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
                    authMode === 'signup'
                      ? 'bg-orange-600 text-white shadow-[0_0_12px_rgba(234,88,12,0.3)]'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  Sign Up (New User)
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
                    authMode === 'login'
                      ? 'bg-orange-600 text-white shadow-[0_0_12px_rgba(234,88,12,0.3)]'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  Log In
                </button>
              </div>
            )}

            {/* Status Messages */}
            {statusMessage && (
              <div className="p-3 bg-orange-600/20 border border-orange-600/40 text-orange-300 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* STEP 1: SIGN UP FORM */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-white/80 block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-white/30" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Mustapha Jibril"
                      className="w-full pl-9 pr-3 py-2.5 bg-black border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-white/80 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-white/30" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. developer@sununsi.dev"
                      className="w-full pl-9 pr-3 py-2.5 bg-black border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-white/80 block mb-1">Mobile Phone Number (SMS OTP)</label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-black border border-white/10 rounded-xl px-2.5 py-2.5 text-white font-mono focus:outline-none"
                    >
                      <option value="+234">🇳🇬 +234</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+254">🇰🇪 +254</option>
                      <option value="+27">🇿🇦 +27</option>
                    </select>
                    <div className="relative flex-1">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-white/30" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="812 345 6789"
                        className="w-full pl-9 pr-3 py-2.5 bg-black border border-white/10 rounded-xl text-white font-mono placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-white/80 block mb-1">Primary Platform</label>
                    <select
                      value={preferredDevice}
                      onChange={(e) => setPreferredDevice(e.target.value as any)}
                      className="w-full p-2.5 bg-black border border-white/10 rounded-xl text-white focus:outline-none"
                    >
                      <option value="desktop">💻 Desktop Workstation</option>
                      <option value="android">📱 Android Phone / Tablet</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-white/80 block mb-1">Developer Role</label>
                    <select
                      value={preferredRole}
                      onChange={(e) => setPreferredRole(e.target.value as any)}
                      className="w-full p-2.5 bg-black border border-white/10 rounded-xl text-white focus:outline-none"
                    >
                      <option value="Creator">Creator / Streamer</option>
                      <option value="Viewer">Viewer / Learner</option>
                      <option value="Moderator">Moderator</option>
                      <option value="Admin">Platform Admin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-white/80 block mb-1">Security Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-white/30" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-black border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(234,88,12,0.4)] flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <span>Proceed to Email Confirmation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: EMAIL CONFIRMATION */}
            {authMode === 'email_verify' && (
              <form onSubmit={handleVerifyEmail} className="space-y-4 text-xs animate-in fade-in">
                <div className="p-4 bg-black/60 border border-white/10 rounded-2xl space-y-2 text-center">
                  <div className="w-12 h-12 bg-orange-600/20 text-orange-400 rounded-full flex items-center justify-center mx-auto border border-orange-600/30">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Check Your Email Inbox</h4>
                  <p className="text-white/60">
                    We sent a 6-digit confirmation code to <strong className="text-orange-400">{email || 'your email'}</strong>.
                  </p>
                </div>

                <div>
                  <label className="font-semibold text-white/80 block mb-1 text-center">
                    Enter 6-Digit Email Confirmation Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    placeholder="849201"
                    className="w-full p-3 text-center text-xl font-mono font-bold tracking-widest bg-black border border-orange-500/50 rounded-xl text-orange-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-white/40">
                  <span>Code auto-simulated for convenience</span>
                  <button
                    type="button"
                    disabled={emailTimer > 0}
                    onClick={() => setEmailTimer(45)}
                    className="text-orange-400 hover:underline disabled:opacity-40"
                  >
                    {emailTimer > 0 ? `Resend Code in ${emailTimer}s` : 'Resend Email Code'}
                  </button>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 font-medium"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-[0_0_15px_rgba(234,88,12,0.3)] flex items-center justify-center gap-2"
                  >
                    <span>Verify Email Code</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: OTP CONFIRMATION */}
            {authMode === 'otp_verify' && (
              <form onSubmit={handleVerifyOTP} className="space-y-4 text-xs animate-in fade-in">
                <div className="p-4 bg-black/60 border border-white/10 rounded-2xl space-y-2 text-center">
                  <div className="w-12 h-12 bg-orange-600/20 text-orange-400 rounded-full flex items-center justify-center mx-auto border border-orange-600/30">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Mobile SMS OTP Security Check</h4>
                  <p className="text-white/60">
                    Enter the 6-digit SMS OTP security code sent to <strong className="text-orange-400">{countryCode} {phone}</strong>.
                  </p>
                </div>

                <div>
                  <label className="font-semibold text-white/80 block mb-1 text-center">
                    6-Digit Mobile OTP Security Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="654321"
                    className="w-full p-3 text-center text-xl font-mono font-bold tracking-widest bg-black border border-orange-500/50 rounded-xl text-orange-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-white/40">
                  <span>2FA OTP Verification Active</span>
                  <button
                    type="button"
                    disabled={otpTimer > 0}
                    onClick={() => setOtpTimer(30)}
                    className="text-orange-400 hover:underline disabled:opacity-40"
                  >
                    {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'Resend SMS OTP'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(234,88,12,0.4)] flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm OTP & Launch Platform</span>
                </button>
              </form>
            )}

            {/* LOG IN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-white/80 block mb-1">Email or Username</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-white/30" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="creator@sununsi.dev"
                      className="w-full pl-9 pr-3 py-2.5 bg-black border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-white/80 block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-white/30" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-black border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(234,88,12,0.4)] flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <span>Sign In & Verify 2FA OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-2 text-center">
                  <p className="text-white/40 text-[11px]">
                    Demo credentials pre-filled. Click Sign In to verify OTP & log in instantly.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Feature Modules Matrix */}
      <section className="bg-[#080808] border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl text-white">Full-Featured Platform Capabilities</h3>
            <p className="text-xs text-white/50">Designed specifically for developer creators, streamers, and CPA affiliate marketers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-5 bg-black/60 border border-white/10 rounded-2xl space-y-2">
              <div className="w-10 h-10 bg-orange-600/20 text-orange-400 rounded-xl flex items-center justify-center font-bold">
                <Play className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">4K Video & Live Stream</h4>
              <p className="text-white/50">Adaptive resolution switching, live chat with SuperChat tipping, and captions.</p>
            </div>

            <div className="p-5 bg-black/60 border border-white/10 rounded-2xl space-y-2">
              <div className="w-10 h-10 bg-orange-600/20 text-orange-400 rounded-xl flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">CPA Offerwall Engine</h4>
              <p className="text-white/50">Complete daily cloud app tests, surveys & watch sponsored developer keynotes for wallet cash.</p>
            </div>

            <div className="p-5 bg-black/60 border border-white/10 rounded-2xl space-y-2">
              <div className="w-10 h-10 bg-orange-600/20 text-orange-400 rounded-xl flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Digital Store Marketplace</h4>
              <p className="text-white/50">Buy and sell developer eBooks, software, and code templates via Flutterwave, Paystack & Stripe.</p>
            </div>

            <div className="p-5 bg-black/60 border border-white/10 rounded-2xl space-y-2">
              <div className="w-10 h-10 bg-orange-600/20 text-orange-400 rounded-xl flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Face ID & 2FA OTP Guard</h4>
              <p className="text-white/50">Biometric camera scan and instant 6-digit SMS/email OTP verification for wallet protection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-6 border-t border-white/10 text-center text-xs text-white/40">
        <p>© 2026 Sununsi Dev Video Platform. Engineered for Desktop & Android devices.</p>
      </footer>
    </div>
  );
};
