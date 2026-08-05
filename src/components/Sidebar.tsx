import React from 'react';
import { 
  Home, Flame, Video, Users, Radio, DollarSign, ShoppingBag, 
  MessageSquare, Share2, Laptop, ShieldAlert, Wallet, History, Bookmark, Sparkles
} from 'lucide-react';
import { UserRole } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  lang: string;
  currentRole: UserRole;
  isOpen: boolean;
  onOpenLanding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  lang,
  currentRole,
  isOpen,
  onOpenLanding
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  const mainItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'shorts', label: t.shorts, icon: Video, badge: 'HOT' },
    { id: 'live', label: t.live, icon: Radio, isLive: true },
    { id: 'subscriptions', label: t.subscriptions, icon: Users },
  ];

  const monetizationItems = [
    { id: 'cpa', label: t.cpa, icon: DollarSign, badge: '$ EARN' },
    { id: 'digital-products', label: t.digitalProducts, icon: ShoppingBag },
    { id: 'referrals', label: t.referrals, icon: Share2 },
    { id: 'wallet', label: t.wallet, icon: Wallet },
  ];

  const communityItems = [
    { id: 'community', label: t.community, icon: Sparkles },
    { id: 'messages', label: t.messages, icon: MessageSquare },
    { id: 'history', label: t.history, icon: History },
  ];

  const creatorItems = [
    { id: 'creator-studio', label: t.creatorStudio, icon: Laptop },
  ];

  if (currentRole === 'Admin' || currentRole === 'Super Admin') {
    creatorItems.push({ id: 'admin', label: t.adminDashboard, icon: ShieldAlert });
  }

  return (
    <aside
      className={`fixed md:sticky top-14 left-0 z-30 h-[calc(100vh-3.5rem)] w-64 bg-[#080808] border-r border-white/10 text-[#F5F5F5] flex flex-col justify-between py-5 px-4 overflow-y-auto transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="space-y-6">
        {/* Main Feed */}
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Main Feed</p>
          {onOpenLanding && (
            <button
              onClick={onOpenLanding}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-orange-400 bg-orange-600/10 border border-orange-600/30 hover:bg-orange-600/20 transition-all mb-2"
            >
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Landing Page (Sign Up / Log In)</span>
            </button>
          )}
          {mainItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold border-l-2 border-orange-500'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-white/50'}`} />
                  <span>{item.label}</span>
                </div>
                {item.isLive && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                )}
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-600/20 text-orange-400 border border-orange-600/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Monetization & Earnings */}
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Monetization & Store</p>
          {monetizationItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold border-l-2 border-orange-500'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-white/50'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-600/20 text-orange-400 border border-orange-600/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Community & Messaging */}
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Community & Social</p>
          {communityItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold border-l-2 border-orange-500'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-white/50'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Creator & Admin Controls */}
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Management</p>
          {creatorItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold border-l-2 border-orange-500'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-white/50'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Earnings Widget Footer Card */}
      <div className="bg-gradient-to-br from-orange-600/20 to-transparent p-4 rounded-xl border border-orange-600/30 mt-6">
        <p className="text-[10px] uppercase text-orange-400 font-bold mb-1 tracking-widest">Monetization Active</p>
        <p className="text-xl font-serif text-white">$4,290.50</p>
        <div className="mt-1.5 text-[10px] text-orange-400/80 font-mono">+12% from CPA Tasks</div>
      </div>
    </aside>
  );
};
