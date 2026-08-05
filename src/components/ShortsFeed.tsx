import React, { useState } from 'react';
import { 
  Heart, MessageCircle, Share2, Bookmark, Music, 
  ChevronUp, ChevronDown, CheckCircle2, Send, X, Play, Pause
} from 'lucide-react';
import { ShortVideoItem, UserProfile } from '../types';

interface ShortsFeedProps {
  shorts: ShortVideoItem[];
  user: UserProfile;
  onShare: (item: any) => void;
  onToggleSubscribe: (handle: string) => void;
  subscribedHandles: string[];
}

export const ShortsFeed: React.FC<ShortsFeedProps> = ({
  shorts,
  user,
  onShare,
  onToggleSubscribe,
  subscribedHandles,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likesCountMap, setLikesCountMap] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    shorts.forEach(s => { map[s.id] = s.likes; });
    return map;
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [commentsList, setCommentsList] = useState([
    { id: 'sc1', user: 'Alex AI', text: 'This CSS layout trick saved me hours! 🔥', time: '10m' },
    { id: 'sc2', user: 'Nora Code', text: 'Sununsi Dev Platform is fast as light!', time: '1h' }
  ]);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  const currentShort = shorts[currentIndex];

  const handleNext = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsPlaying(true);
      setShowComments(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsPlaying(true);
      setShowComments(false);
    }
  };

  const toggleLike = () => {
    if (!currentShort) return;
    const isLiked = likedMap[currentShort.id];
    setLikedMap(prev => ({ ...prev, [currentShort.id]: !isLiked }));
    setLikesCountMap(prev => ({
      ...prev,
      [currentShort.id]: isLiked ? prev[currentShort.id] - 1 : prev[currentShort.id] + 1
    }));
    if (!isLiked) {
      triggerHeartAnimation();
    }
  };

  const triggerHeartAnimation = () => {
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 800);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setCommentsList([{ id: `sc_${Date.now()}`, user: user.name, text: commentInput, time: 'Just now' }, ...commentsList]);
    setCommentInput('');
  };

  if (!currentShort) return null;

  const isSubbed = subscribedHandles.includes(currentShort.creatorHandle);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex items-center justify-center py-4 bg-slate-950 overflow-hidden">
      {/* Background Ambient Blur */}
      <div 
        className="absolute inset-0 filter blur-3xl opacity-30 transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url(${currentShort.thumbnailUrl})`, backgroundSize: 'cover' }}
      />

      {/* Main Vertical Player Container */}
      <div 
        className="relative w-full max-w-sm h-full max-h-[720px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-between"
        onDoubleClick={toggleLike}
      >
        {/* Video Player */}
        <video
          key={currentShort.id}
          src={currentShort.videoUrl}
          poster={currentShort.thumbnailUrl}
          autoPlay={isPlaying}
          loop
          playsInline
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
        />

        {/* Play/Pause Overlay Indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-cyan-500/80 text-slate-950 flex items-center justify-center">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Double Tap Heart Burst Animation */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
            <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-lg" />
          </div>
        )}

        {/* Top Header info */}
        <div className="relative z-10 p-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent flex items-center justify-between">
          <span className="text-xs font-bold text-white tracking-widest uppercase bg-cyan-500/20 px-2.5 py-1 rounded-full border border-cyan-500/40">
            Sununsi Shorts
          </span>
          <div className="flex gap-1">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 disabled:opacity-40"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === shorts.length - 1}
              className="p-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 disabled:opacity-40"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Metadata & Side Controls */}
        <div className="relative z-10 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-end justify-between gap-3">
          {/* Bottom Left Info */}
          <div className="flex-1 space-y-2 text-white">
            <div className="flex items-center gap-2">
              <img src={currentShort.creatorAvatar} alt={currentShort.creatorName} className="w-9 h-9 rounded-full object-cover border border-cyan-400" />
              <div>
                <div className="flex items-center gap-1 font-bold text-xs">
                  <span>{currentShort.creatorName}</span>
                  {currentShort.creatorVerified && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <p className="text-[10px] text-slate-300">{currentShort.creatorHandle}</p>
              </div>
              <button
                onClick={() => onToggleSubscribe(currentShort.creatorHandle)}
                className={`ml-2 px-3 py-1 rounded-full text-[10px] font-bold ${
                  isSubbed ? 'bg-slate-800 text-slate-300' : 'bg-cyan-500 text-slate-950'
                }`}
              >
                {isSubbed ? 'Following' : 'Follow'}
              </button>
            </div>

            <p className="text-xs line-clamp-2 text-slate-200">{currentShort.title}</p>

            {currentShort.musicTrackTitle && (
              <div className="flex items-center gap-2 text-[10px] text-cyan-300">
                <Music className="w-3.5 h-3.5 animate-spin" />
                <span className="truncate">{currentShort.musicTrackTitle}</span>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex flex-col items-center gap-4 text-white">
            {/* Like */}
            <button onClick={toggleLike} className="flex flex-col items-center gap-1">
              <div className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                likedMap[currentShort.id] ? 'bg-red-500/30 text-red-500' : 'bg-slate-900/60 text-white'
              }`}>
                <Heart className={`w-5 h-5 ${likedMap[currentShort.id] ? 'fill-current' : ''}`} />
              </div>
              <span className="text-[10px] font-semibold">{likesCountMap[currentShort.id]}</span>
            </button>

            {/* Comment */}
            <button onClick={() => setShowComments(true)} className="flex flex-col items-center gap-1">
              <div className="p-2.5 rounded-full bg-slate-900/60 backdrop-blur-md text-white">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold">{currentShort.commentsCount}</span>
            </button>

            {/* Share */}
            <button onClick={() => onShare(currentShort)} className="flex flex-col items-center gap-1">
              <div className="p-2.5 rounded-full bg-slate-900/60 backdrop-blur-md text-white">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold">{currentShort.sharesCount}</span>
            </button>
          </div>
        </div>

        {/* Slide-Up Comments Drawer */}
        {showComments && (
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-slate-900/95 border-t border-slate-700 rounded-t-3xl z-30 p-4 flex flex-col justify-between text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider">Comments</span>
              <button onClick={() => setShowComments(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {commentsList.map(c => (
                <div key={c.id} className="text-xs space-y-0.5">
                  <div className="flex items-center justify-between text-slate-400 font-semibold text-[11px]">
                    <span>{c.user}</span>
                    <span>{c.time}</span>
                  </div>
                  <p className="text-slate-200">{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button type="submit" className="p-1.5 bg-cyan-500 text-slate-950 rounded-xl">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
