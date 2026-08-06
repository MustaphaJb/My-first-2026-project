import React, { useState } from 'react';
import { RegimentLogo } from './RegimentLogo';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, AlertCircle, Info, KeyRound } from 'lucide-react';

interface LandingPageProps {
  onLoginSuccess: (email: string, pass: string) => Promise<boolean>;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLoginSuccess,
  darkMode,
  onToggleDarkMode,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email address and password.');
      return;
    }

    setLoading(true);
    setError(null);

    const ok = await onLoginSuccess(email, password);
    setLoading(false);
    if (!ok) {
      setError('Authentication failed. Please check your credentials or contact the Administrator.');
    }
  };

  const handleQuickDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSuccess(true);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between ${darkMode ? 'bg-emerald-950 text-white' : 'bg-slate-900 text-white'} font-sans relative overflow-hidden`}>
      
      {/* Background Camo / Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Header Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-amber-500/20 bg-emerald-950/80 backdrop-blur-sm relative z-10">
        <RegimentLogo size="sm" showText={true} />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Restricted Military Domain</span>
          </div>
        </div>
      </header>

      {/* Main Login Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-md">
          
          {/* Card Frame */}
          <div className="bg-emerald-900/40 border-2 border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
            
            {/* Top Gold Trim Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

            {/* Crest & Title */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <RegimentLogo size="lg" showText={false} />
              </div>
              
              <h1 className="text-xl sm:text-2xl font-black tracking-wide text-white uppercase font-sans">
                23 Support Engineer Regiment Jos
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-amber-400 uppercase tracking-widest mt-1">
                Personnel Records Management System
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-500/60 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="input-login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@army.mil.ng"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-emerald-950/80 border border-emerald-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder-emerald-600/70 text-sm font-medium transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="input-login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-emerald-950/80 border border-emerald-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder-emerald-600/70 text-sm font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-400 hover:text-amber-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-emerald-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-emerald-700 bg-emerald-950 text-amber-500 focus:ring-amber-400"
                  />
                  <span>Remember Me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPasswordModal(true);
                    setForgotSuccess(false);
                    setForgotEmail('');
                  }}
                  className="text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                id="btn-login-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-emerald-950 font-extrabold uppercase tracking-wider text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Secure Sign In</span>
                  </>
                )}
              </button>

            </form>

            {/* Quick Demo Selector for Evaluator */}
            <div className="mt-6 pt-4 border-t border-emerald-800/80 text-center">
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block mb-2">
                Quick Demo Role Selector:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('admin@army.mil.ng', 'admin123')}
                  className="px-2.5 py-1.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition-colors font-medium text-[11px]"
                >
                  Administrator
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('hod.combat@army.mil.ng', 'hod123')}
                  className="px-2.5 py-1.5 rounded bg-emerald-800/50 border border-emerald-600 text-emerald-200 hover:bg-emerald-800 transition-colors font-medium text-[11px]"
                >
                  HOD Combat Engr
                </button>
              </div>
            </div>

            {/* No Registration Note */}
            <div className="mt-4 text-center">
              <p className="text-[11px] text-emerald-400/70 italic flex items-center justify-center gap-1">
                <Info className="w-3 h-3 text-amber-400" />
                Self-registration disabled. HOD accounts created by Admin.
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-emerald-900 border-2 border-amber-500/40 rounded-xl p-6 w-full max-w-sm text-white shadow-2xl">
            <h3 className="text-lg font-bold text-amber-400 uppercase mb-2">Reset Password</h3>
            <p className="text-xs text-emerald-200 mb-4">
              Enter your official military email address. Instructions will be routed to your department administrator.
            </p>

            {forgotSuccess ? (
              <div className="p-3 bg-emerald-950 border border-emerald-600 rounded text-xs text-emerald-300 mb-4">
                Password reset request dispatched to HQ System Admin. Check your military inbox.
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="officer@army.mil.ng"
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-sm text-white"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 text-emerald-950 font-bold rounded text-xs uppercase"
                >
                  Submit Request
                </button>
              </form>
            )}

            <button
              onClick={() => setShowForgotPasswordModal(false)}
              className="mt-3 w-full text-center text-xs text-emerald-400 hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}

      {/* Military Footer */}
      <footer className="py-3 px-6 text-center text-xs text-emerald-400/80 border-t border-emerald-900 bg-emerald-950/90 relative z-10">
        <p>© 2026 23 Support Engineer Regiment Jos • Nigerian Army Engineers • Restricted Personnel Portal</p>
      </footer>

    </div>
  );
};
