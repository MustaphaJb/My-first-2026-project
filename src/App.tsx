import React, { useState, useEffect } from 'react';
import { 
  INITIAL_USER, SEED_VIDEOS, SEED_SHORTS, SEED_LIVE_STREAMS, 
  SEED_CPA_TASKS, SEED_DIGITAL_PRODUCTS, SEED_COMMUNITY_POSTS 
} from './data/mockData';
import { UserProfile, UserRole, VideoItem, ShortVideoItem, CPATask, DigitalProduct } from './types';
import { StorageService } from './services/storageService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { VideoCard } from './components/VideoCard';
import { VideoDetailView } from './components/VideoDetailView';
import { ShortsFeed } from './components/ShortsFeed';
import { LiveStreamView } from './components/LiveStreamView';
import { CPAModule } from './components/CPAModule';
import { DigitalProductsStore } from './components/DigitalProductsStore';
import { CreatorStudio } from './components/CreatorStudio';
import { AdminDashboard } from './components/AdminDashboard';
import { ReferralDashboard } from './components/ReferralDashboard';
import { CommunityTab } from './components/CommunityTab';
import { AuthModal } from './components/AuthModal';
import { WalletModal } from './components/WalletModal';
import { LandingPage } from './components/LandingPage';
import { Smartphone, Monitor, Wifi, Battery, Signal, ChevronLeft } from 'lucide-react';

export const App: React.FC = () => {
  // App state
  const [user, setUser] = useState<UserProfile>(() => StorageService.getUser() || INITIAL_USER);
  const [currentRole, setCurrentRole] = useState<UserRole>(user.role);
  const [videos, setVideos] = useState<VideoItem[]>(() => StorageService.getVideos() || SEED_VIDEOS);
  const [shorts, setShorts] = useState<ShortVideoItem[]>(() => StorageService.getShorts() || SEED_SHORTS);
  
  // UI Navigation
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [lang, setLang] = useState('en');

  // Subscriptions & Watch Later lists
  const [subscribedHandles, setSubscribedHandles] = useState<string[]>(['@sununsidev', '@elenarostova']);
  const [watchLaterIds, setWatchLaterIds] = useState<string[]>([]);

  // Modals & Platform
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'desktop' | 'android'>('desktop');
  const [showLanding, setShowLanding] = useState<boolean>(false);

  // Sync storage
  useEffect(() => {
    StorageService.saveUser(user);
  }, [user]);

  useEffect(() => {
    StorageService.saveVideos(videos);
  }, [videos]);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setUser(prev => ({ ...prev, role }));
  };

  const handleToggleSubscribe = (creatorHandle: string) => {
    setSubscribedHandles(prev => 
      prev.includes(creatorHandle)
        ? prev.filter(h => h !== creatorHandle)
        : [...prev, creatorHandle]
    );
  };

  const handleToggleWatchLater = (videoId: string) => {
    setWatchLaterIds(prev => 
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleSelectVideo = (video: VideoItem) => {
    setSelectedVideo(video);
    setActiveTab('watch');
    // Increment view count
    setVideos(prev => prev.map(v => v.id === video.id ? { ...v, views: v.views + 1 } : v));
  };

  const handleClaimCPAReward = (task: CPATask, rewardAmount: number) => {
    setUser(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + rewardAmount
    }));
  };

  const handlePurchaseProduct = (product: DigitalProduct, paymentMethod: string) => {
    if (paymentMethod === 'Internal Wallet') {
      setUser(prev => ({
        ...prev,
        walletBalance: prev.walletBalance - product.price
      }));
    }
  };

  const handleUploadVideo = (newVideo: VideoItem) => {
    if (newVideo.isShort) {
      setShorts([
        {
          id: newVideo.id,
          title: newVideo.title,
          videoUrl: newVideo.videoUrl,
          thumbnailUrl: newVideo.thumbnailUrl,
          creatorHandle: newVideo.creatorHandle,
          creatorName: newVideo.creatorName,
          creatorAvatar: newVideo.creatorAvatar,
          creatorVerified: true,
          likes: 0,
          commentsCount: 0,
          sharesCount: 0,
        },
        ...shorts
      ]);
    } else {
      setVideos([newVideo, ...videos]);
    }
    setActiveTab('home');
  };

  const categories = ['All', 'Development', 'AI & ML', 'Cloud & DevOps', 'Mobile Dev', 'CPA Earn'];

  // Filter videos
  const filteredVideos = videos.filter(v => {
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Render Landing Page if explicitly triggered or user is logged out
  if (showLanding) {
    return (
      <LandingPage
        onLoginSuccess={(updatedUser) => {
          setUser(updatedUser);
          setShowLanding(false);
          setActiveTab('home');
        }}
        onBrowseAsGuest={() => setShowLanding(false)}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
      />
    );
  }

  // App Main Shell Content
  const appContent = (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans flex flex-col antialiased selection:bg-orange-600 selection:text-white">
      {/* Top Header */}
      <Header
        user={user}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenWallet={() => setShowWalletModal(true)}
        onOpenLanding={() => setShowLanding(true)}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        lang={lang}
        onLangChange={setLang}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'watch') setSelectedVideo(null);
        }}
        onOpenUpload={() => setActiveTab('studio')}
        onOpenGoLive={() => setActiveTab('live')}
        notifications={[]}
        onNotificationClick={() => {}}
      />

      <div className="flex flex-1 pt-0 pb-16 md:pb-0">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab !== 'watch') setSelectedVideo(null);
          }}
          isOpen={!sidebarCollapsed}
          lang={lang}
          currentRole={currentRole}
          onOpenLanding={() => setShowLanding(true)}
        />

        {/* Main Content Stage */}
        <main className="flex-1 transition-all duration-300 min-w-0">
          {/* WATCH SINGLE VIDEO SCREEN */}
          {activeTab === 'watch' && selectedVideo && (
            <VideoDetailView
              video={selectedVideo}
              allVideos={videos}
              user={user}
              onSelectVideo={handleSelectVideo}
              onToggleSubscribe={handleToggleSubscribe}
              isSubscribed={subscribedHandles.includes(selectedVideo.creatorHandle)}
              onToggleWatchLater={handleToggleWatchLater}
              isWatchLater={watchLaterIds.includes(selectedVideo.id)}
              onShare={(v) => {
                navigator.clipboard.writeText(`https://sununsi.dev/v/${v.id}`);
                alert(`Video link copied: https://sununsi.dev/v/${v.id}`);
              }}
              onTipCreator={() => {
                setShowWalletModal(true);
              }}
            />
          )}

          {/* HOME VIDEO GRID FEED */}
          {activeTab === 'home' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
              {/* Featured Hero Banner */}
              {selectedCategory === 'All' && searchQuery === '' && (
                <section className="relative h-[280px] sm:h-[320px] rounded-2xl overflow-hidden group border border-white/10 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-10"></div>
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1024')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"></div>
                  <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 z-20 max-w-xl">
                    <span className="bg-orange-600 text-white text-[10px] font-bold px-2.5 py-1 rounded mb-3 inline-block tracking-widest uppercase shadow-[0_0_10px_rgba(234,88,12,0.4)]">FEATURED STREAM</span>
                    <h1 className="text-2xl sm:text-4xl font-serif text-white mb-2 leading-tight">Mastering Kubernetes: Zero to Production for Fullstack Devs</h1>
                    <p className="text-white/60 text-xs sm:text-sm mb-5 line-clamp-2">Join 4,200 other developers currently watching Sarah Jenkins break down K8s clusters and container orchestration.</p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => filteredVideos[0] && handleSelectVideo(filteredVideos[0])} 
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all hover:scale-105 shadow-[0_0_15px_rgba(234,88,12,0.3)]"
                      >
                        WATCH NOW
                      </button>
                      <button 
                        onClick={() => filteredVideos[0] && handleToggleWatchLater(filteredVideos[0].id)} 
                        className="bg-white/10 backdrop-blur-md text-white px-6 py-2.5 rounded-full text-xs font-bold border border-white/10 hover:bg-white/20 transition-all"
                      >
                        SAVE LATER
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* Category Pills Bar */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? 'bg-orange-600 text-white shadow-[0_0_12px_rgba(234,88,12,0.3)]'
                          : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <span className="hidden sm:inline-block text-xs font-serif italic text-white/40">Showing {filteredVideos.length} tutorials</span>
              </div>

              {/* Section Header */}
              <div className="flex justify-between items-end border-b border-white/5 pb-3">
                <h2 className="font-serif text-2xl text-white">Recommended for You</h2>
                <a href="#trending" onClick={() => setActiveTab('trending')} className="text-xs text-orange-500 hover:underline">See all trending</a>
              </div>

              {/* Video Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVideos.map(video => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onSelectVideo={handleSelectVideo}
                    onToggleWatchLater={handleToggleWatchLater}
                    isWatchLater={watchLaterIds.includes(video.id)}
                    onShare={(v) => {
                      navigator.clipboard.writeText(`https://sununsi.dev/v/${v.id}`);
                      alert(`Video link copied!`);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* VERTICAL SHORTS FEED */}
          {activeTab === 'shorts' && (
            <ShortsFeed
              shorts={shorts}
              user={user}
              onShare={(s) => alert('Short link copied!')}
              onToggleSubscribe={handleToggleSubscribe}
              subscribedHandles={subscribedHandles}
            />
          )}

          {/* LIVE BROADCASTING STUDIO & FEED */}
          {activeTab === 'live' && (
            <LiveStreamView
              streams={SEED_LIVE_STREAMS}
              user={user}
              currentRole={currentRole}
              onSendSuperChat={(amount, msg) => {
                setUser(prev => ({ ...prev, walletBalance: prev.walletBalance - amount }));
              }}
            />
          )}

          {/* CPA OFFERWALL MODULE */}
          {activeTab === 'cpa' && (
            <CPAModule
              tasks={SEED_CPA_TASKS}
              user={user}
              onClaimReward={handleClaimCPAReward}
            />
          )}

          {/* DIGITAL PRODUCTS STORE */}
          {activeTab === 'digital-products' && (
            <DigitalProductsStore
              products={SEED_DIGITAL_PRODUCTS}
              user={user}
              onPurchaseProduct={handlePurchaseProduct}
            />
          )}

          {/* CREATOR STUDIO */}
          {activeTab === 'studio' && (
            <CreatorStudio
              user={user}
              onUploadVideo={handleUploadVideo}
            />
          )}

          {/* SUPER ADMIN DASHBOARD */}
          {activeTab === 'admin' && (
            <AdminDashboard
              user={user}
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
            />
          )}

          {/* REFERRAL & AFFILIATE */}
          {activeTab === 'referral' && (
            <ReferralDashboard
              user={user}
              onWithdrawReferral={(amt) => {
                setUser(prev => ({ ...prev, walletBalance: prev.walletBalance + amt, referralEarnings: 0 }));
              }}
            />
          )}

          {/* COMMUNITY POSTS */}
          {activeTab === 'community' && (
            <CommunityTab
              posts={SEED_COMMUNITY_POSTS}
              user={user}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Bar Navigation */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        lang={lang}
        onOpenUpload={() => setActiveTab('studio')}
      />

      {/* Auth & Biometrics Face ID Modal */}
      <AuthModal
        user={user}
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onUpdateUser={setUser}
      />

      {/* Wallet & Withdrawal Modal */}
      <WalletModal
        user={user}
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onWithdrawFunds={(amt, dest) => {
          setUser(prev => ({ ...prev, walletBalance: prev.walletBalance - amt }));
        }}
      />
    </div>
  );

  // If Android Simulator Mode is enabled on Desktop view
  if (selectedPlatform === 'android') {
    return (
      <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-2 sm:p-6 font-sans">
        {/* Top Control Switcher Bar */}
        <div className="w-full max-w-sm mb-4 flex items-center justify-between px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-2xl text-xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-orange-400" />
            <span className="font-bold text-white">Android PWA Simulation</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPlatform('desktop')}
              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-medium flex items-center gap-1"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setShowLanding(true)}
              className="px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold"
            >
              Sign Up / In
            </button>
          </div>
        </div>

        {/* Android Device Outer Bezel Frame */}
        <div className="w-full max-w-sm h-[840px] max-h-[92vh] bg-black border-[10px] border-[#18181b] rounded-[48px] shadow-[0_0_50px_rgba(234,88,12,0.15)] flex flex-col overflow-hidden relative">
          {/* Android Status Bar */}
          <div className="bg-[#080808] px-6 py-2 flex items-center justify-between text-[11px] font-mono text-white/70 select-none z-50 shrink-0 border-b border-white/5">
            <span>10:42</span>
            {/* Camera Hole Notch */}
            <div className="w-3 h-3 bg-black rounded-full border border-white/20 mx-auto" />
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-orange-400">5G</span>
              <Signal className="w-3 h-3 text-white/80" />
              <Wifi className="w-3 h-3 text-white/80" />
              <Battery className="w-3.5 h-3.5 text-white/80" />
            </div>
          </div>

          {/* Android Viewport Screen Container */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative">
            {appContent}
          </div>

          {/* Android Gesture Navigation Bar */}
          <div className="bg-[#080808] py-2 flex items-center justify-center shrink-0 z-50 border-t border-white/5">
            <div className="w-32 h-1 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return appContent;
};

export default App;
