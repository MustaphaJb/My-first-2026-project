import React, { useState, useEffect } from 'react';
import { 
  Radio, Users, Send, DollarSign, ShieldAlert, Pin, Ban, 
  Video, Mic, MicOff, Camera, CheckCircle2, Heart, Sparkles
} from 'lucide-react';
import { LiveStreamItem, LiveChatMessage, UserProfile, UserRole } from '../types';

interface LiveStreamViewProps {
  streams: LiveStreamItem[];
  user: UserProfile;
  currentRole: UserRole;
  onSendSuperChat: (amount: number, message: string) => void;
}

export const LiveStreamView: React.FC<LiveStreamViewProps> = ({
  streams,
  user,
  currentRole,
  onSendSuperChat,
}) => {
  const [selectedStream, setSelectedStream] = useState<LiveStreamItem>(streams[0]);
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>(streams[0]?.chatMessages || []);
  const [inputMsg, setInputMsg] = useState('');
  const [showSuperChatModal, setShowSuperChatModal] = useState(false);
  const [superChatAmount, setSuperChatAmount] = useState(5.00);
  const [superChatMsg, setSuperChatMsg] = useState('Great stream! Keep it up 🔥');

  // Creator broadcasting controls
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);

  // Dynamic live message ticker simulation
  useEffect(() => {
    if (!selectedStream) return;

    const sampleUsers = [
      { name: 'DevGuru', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' },
      { name: 'CyberAlex', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80' },
      { name: 'CodeQueene', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
      { name: 'Sam Cloud', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' }
    ];

    const sampleTexts = [
      'This 4K live latency is impressive!',
      'Sununsi Dev Video Platform is insane 🚀',
      'Can you show the Gemini AI live speech code again?',
      'Just completed my daily CPA offer task while watching!',
      'Greeting from Nairobi 🇰🇪!'
    ];

    const interval = setInterval(() => {
      const u = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
      const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
      const newMsg: LiveChatMessage = {
        id: `live_msg_${Date.now()}`,
        userId: `u_${Math.random()}`,
        userName: u.name,
        userAvatar: u.avatar,
        message: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev.slice(-30), newMsg]);
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedStream]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const msg: LiveChatMessage = {
      id: `live_msg_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      message: inputMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, msg]);
    setInputMsg('');
  };

  const handleSuperChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sc: LiveChatMessage = {
      id: `sc_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userRole: currentRole,
      message: superChatMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      superChatAmount,
      badge: 'Super Chat'
    };
    setChatMessages(prev => [...prev, sc]);
    onSendSuperChat(superChatAmount, superChatMsg);
    setShowSuperChatModal(false);
  };

  // Moderation tools
  const handlePinMessage = (msgId: string) => {
    setChatMessages(prev => prev.map(m => ({
      ...m,
      isPinned: m.id === msgId ? !m.isPinned : false
    })));
  };

  const handleBanUser = (userName: string) => {
    alert(`User @${userName} has been muted and banned by ${currentRole}`);
    setChatMessages(prev => prev.filter(m => m.userName !== userName));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border border-red-500/30 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Sununsi Live Broadcasting Studio</span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-red-600 text-white rounded-full uppercase tracking-wider">
                LIVE NOW
              </span>
            </h1>
            <p className="text-xs text-slate-400">Adaptive WebRTC & HLS low-latency streaming platform</p>
          </div>
        </div>

        {/* Creator Broadcaster Studio Controls */}
        {(currentRole === 'Creator' || currentRole === 'Admin' || currentRole === 'Super Admin') && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBroadcasting(!isBroadcasting)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
                isBroadcasting
                  ? 'bg-red-600 text-white shadow-red-600/30 animate-pulse'
                  : 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:brightness-110'
              }`}
            >
              {isBroadcasting ? 'Stop Broadcast' : 'Start Live Broadcast'}
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Stream Player + Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Video Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            {isBroadcasting ? (
              // Creator Webcam Studio Preview
              <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                <div className="text-center space-y-2">
                  <Camera className="w-12 h-12 text-cyan-400 mx-auto animate-bounce" />
                  <p className="text-sm font-semibold text-white">Live Camera Preview Active</p>
                  <p className="text-xs text-slate-400">Stream Key: <code className="font-mono text-cyan-400">live_sk_sununsi_9938102</code></p>
                </div>
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  <Radio className="w-3.5 h-3.5" /> BROADCASTING LIVE (1080p 60fps)
                </div>
              </div>
            ) : (
              // Standard Stream Player
              <video
                src={selectedStream.streamUrl}
                poster={selectedStream.thumbnailUrl}
                autoPlay
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            )}

            {/* Viewer Count & Stream Title Overlay */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-bold text-white backdrop-blur-md">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>{selectedStream.viewerCount.toLocaleString()} Viewers</span>
              </span>
            </div>
          </div>

          {/* Stream Metadata */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
            <h2 className="font-bold text-base text-white">{selectedStream.title}</h2>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="font-semibold text-cyan-400">{selectedStream.creatorName}</span>
              <span>•</span>
              <span>Category: {selectedStream.category}</span>
              <span>•</span>
              <span>Started {selectedStream.startedAt}</span>
            </div>
          </div>
        </div>

        {/* Right Live Chat Feed */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Live Chat</span>
            </h3>

            <button
              onClick={() => setShowSuperChatModal(true)}
              className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[11px] font-bold flex items-center gap-1 hover:bg-amber-500/30 transition-all"
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>Super Chat</span>
            </button>
          </div>

          {/* Chat Stream Messages */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3">
            {chatMessages.map(msg => (
              <div 
                key={msg.id} 
                className={`p-2 rounded-xl text-xs space-y-1 transition-all ${
                  msg.superChatAmount 
                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40 text-amber-200 shadow-md' 
                    : msg.isPinned 
                    ? 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-200' 
                    : 'bg-slate-950/40 border border-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <img src={msg.userAvatar} alt={msg.userName} className="w-5 h-5 rounded-full object-cover" />
                    <span className="font-bold text-slate-200">{msg.userName}</span>
                    {msg.userRole && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {msg.userRole}
                      </span>
                    )}
                    {msg.superChatAmount && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                        ${msg.superChatAmount.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500">{msg.timestamp}</span>
                </div>

                <p className="text-slate-300 pl-6 leading-normal">{msg.message}</p>

                {/* Mod Controls */}
                {(currentRole === 'Moderator' || currentRole === 'Admin' || currentRole === 'Super Admin') && (
                  <div className="flex items-center gap-2 pt-1 pl-6 text-[10px] text-slate-400">
                    <button onClick={() => handlePinMessage(msg.id)} className="hover:text-cyan-400 flex items-center gap-0.5">
                      <Pin className="w-3 h-3" /> Pin
                    </button>
                    <button onClick={() => handleBanUser(msg.userName)} className="hover:text-red-400 flex items-center gap-0.5">
                      <Ban className="w-3 h-3" /> Timeout
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-slate-800">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Send a live message..."
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button type="submit" className="px-3.5 py-2 bg-cyan-500 text-slate-950 rounded-xl font-bold">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Super Chat Modal */}
      {showSuperChatModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-amber-300 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <span>Send Super Chat Tip</span>
              </h3>
              <button onClick={() => setShowSuperChatModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300">Select Amount ($)</label>
              <div className="grid grid-cols-4 gap-2">
                {[2, 5, 10, 50].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSuperChatAmount(amt)}
                    className={`py-2 rounded-xl font-mono text-xs font-bold border transition-all ${
                      superChatAmount === amt
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Highlighted Message</label>
                <input
                  type="text"
                  value={superChatMsg}
                  onChange={(e) => setSuperChatMsg(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSuperChatModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSuperChatSubmit}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
              >
                Send ${superChatAmount.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
