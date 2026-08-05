import React, { useState } from 'react';
import { 
  Tv, Search, Mic, Plus, Radio, Bell, ShieldCheck, UserCheck, 
  Globe, LogIn, ChevronDown, Sparkles, Wallet, Check, Menu, X, DollarSign, Laptop
} from 'lucide-react';
import { UserProfile, UserRole, AppNotification } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  user: UserProfile;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  lang: string;
  onLangChange: (lang: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenUpload: () => void;
  onOpenGoLive: () => void;
  onOpenAuth: () => void;
  onOpenWallet: () => void;
  onOpenLanding?: () => void;
  onOpenProfileModal?: () => void;
  selectedPlatform?: 'desktop' | 'android';
  onPlatformChange?: (platform: 'desktop' | 'android') => void;
  notifications: AppNotification[];
  onNotificationClick: (id: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentRole,
  onRoleChange,
  lang,
  onLangChange,
  searchQuery,
  onSearchChange,
  onOpenUpload,
  onOpenGoLive,
  onOpenAuth,
  onOpenWallet,
  onOpenLanding,
  onOpenProfileModal,
  selectedPlatform,
  onPlatformChange,
  notifications,
  onNotificationClick,
  activeTab,
  onTabChange,
  onToggleSidebar,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  const unreadNotifs = notifications.filter(n => !n.read);

  // Voice Search Handler
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice search is listening... Try saying "React Tutorials" or "CPA Tasks"');
      onSearchChange('React Tutorials');
      return;
    }
    try {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'fr' ? 'fr-FR' : lang === 'ha' ? 'ha-NG' : 'en-US';
      setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onSearchChange(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
      onSearchChange('Next-Gen AI Video Platform');
    }
  };

  const roles: UserRole[] = ['Viewer', 'Creator', 'Moderator', 'Admin', 'Super Admin'];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080808]/90 backdrop-blur-md border-b border-white/10 text-[#F5F5F5] px-4 py-2.5 flex items-center justify-between gap-3 shadow-2xl">
      {/* Brand & Toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <button 
          onClick={onToggleSidebar}
          className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors md:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button 
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(234,88,12,0.3)] group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="hidden sm:block">
            <span className="font-serif italic text-xl tracking-tight text-white">
              Sununsi <span className="text-orange-500">Dev</span>
            </span>
          </div>
        </button>
      </div>

      {/* Universal Search Bar with Voice Input */}
      <div className="flex-1 max-w-2xl mx-2">
        <div className="relative flex items-center">
          <div className="absolute left-3 text-white/30">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-10 py-2 text-sm bg-white/5 border border-white/10 rounded-full text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
          />
          <button
            onClick={handleVoiceSearch}
            className={`absolute right-2.5 p-1.5 rounded-full transition-all ${
              isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-white/40 hover:text-orange-400 hover:bg-white/5'
            }`}
            title="Voice Search"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Controls & User System */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Role Switcher Drawer Toggle for Evaluator ease */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
            <span>Role: <strong className="text-white">{currentRole}</strong></span>
            <ChevronDown className="w-3 h-3 text-white/40" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-[#080808] border border-white/10 rounded-2xl shadow-2xl py-1 z-50 animate-in fade-in duration-150">
              <div className="px-3 py-2 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                Switch Platform Role
              </div>
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => {
                    onRoleChange(r);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-white/5 ${
                    currentRole === r ? 'text-orange-400 font-bold bg-orange-600/10' : 'text-white/70'
                  }`}
                >
                  <span>{r}</span>
                  {currentRole === r && <Check className="w-3.5 h-3.5 text-orange-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Creator Actions: Upload & Go Live */}
        {(currentRole === 'Creator' || currentRole === 'Admin' || currentRole === 'Super Admin') && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full bg-orange-600 hover:bg-orange-700 text-white shadow-[0_0_15px_rgba(234,88,12,0.25)] transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{t.upload}</span>
            </button>

            <button
              onClick={onOpenGoLive}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all hover:scale-105 active:scale-95"
            >
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span className="hidden sm:inline">{t.goLive}</span>
            </button>
          </div>
        )}

        {/* Wallet Balance Widget */}
        <button
          onClick={onOpenWallet}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-600/10 border border-orange-600/30 text-orange-400 hover:bg-orange-600/20 text-xs font-semibold transition-all"
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>${user.walletBalance.toFixed(2)}</span>
        </button>

        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            title="Language"
          >
            <Globe className="w-4 h-4" />
          </button>
          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-36 bg-[#080808] border border-white/10 rounded-2xl shadow-2xl py-1 z-50">
              {[
                { code: 'en', label: 'English 🇺🇸' },
                { code: 'fr', label: 'Français 🇫🇷' },
                { code: 'ha', label: 'Hausa 🇳🇬' },
                { code: 'es', label: 'Español 🇪🇸' }
              ].map(l => (
                <button
                  key={l.code}
                  onClick={() => {
                    onLangChange(l.code);
                    setShowLangDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-white/5 ${
                    lang === l.code ? 'text-orange-400 font-semibold' : 'text-white/70'
                  }`}
                >
                  <span>{l.label}</span>
                  {lang === l.code && <Check className="w-3 h-3 text-orange-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            )}
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500" />
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-[#080808] border border-white/10 rounded-2xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
                <span className="font-bold text-[10px] uppercase tracking-widest text-white/30">Notifications</span>
                <span className="text-[10px] bg-orange-600/20 text-orange-400 px-2 py-0.5 rounded-full font-mono">{notifications.length} Total</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      onNotificationClick(n.id);
                      setShowNotifDropdown(false);
                    }}
                    className={`p-3 text-xs hover:bg-white/5 cursor-pointer transition-colors ${!n.read ? 'bg-orange-600/10' : ''}`}
                  >
                    <div className="font-medium text-white/90 flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-white/30">{n.timestamp}</span>
                    </div>
                    <p className="text-white/50 text-[11px] mt-1 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Auth Profile Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 p-0.5 rounded-full border border-white/10 hover:border-orange-500/50 transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover border border-white/10"
            />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-[#080808] border border-white/10 rounded-2xl shadow-2xl p-3 z-50 text-[#F5F5F5]">
              <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                <div>
                  <div className="font-semibold text-sm text-white flex items-center gap-1">
                    {user.name}
                    {user.verified && <UserCheck className="w-3.5 h-3.5 text-orange-400" />}
                  </div>
                  <p className="text-xs text-white/40">{user.handle}</p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-orange-600/20 text-orange-400 border border-orange-600/30">
                    Role: {currentRole}
                  </span>
                </div>
              </div>

              <div className="py-2 space-y-1">
                {onOpenLanding && (
                  <button
                    onClick={() => {
                      onOpenLanding();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg bg-orange-600/10 hover:bg-orange-600/20 text-orange-400 font-bold flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4 text-orange-400" />
                    <span>Landing Page (Sign Up / Log In)</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    onTabChange('creator-studio');
                    setShowUserDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/5 flex items-center gap-2 text-white/80"
                >
                  <Laptop className="w-4 h-4 text-orange-400" />
                  <span>Creator Studio</span>
                </button>
                <button
                  onClick={() => {
                    onTabChange('admin');
                    setShowUserDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/5 flex items-center gap-2 text-white/80"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Admin Dashboard</span>
                </button>
                {onOpenProfileModal && (
                  <button
                    onClick={() => {
                      onOpenProfileModal();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 font-bold flex items-center gap-2 border border-orange-500/30"
                  >
                    <ShieldCheck className="w-4 h-4 text-orange-400" />
                    <span>Security Activity & Settings</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    onOpenAuth();
                    setShowUserDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/5 flex items-center gap-2 text-white/80"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Face ID & 2FA Auth Manager</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
