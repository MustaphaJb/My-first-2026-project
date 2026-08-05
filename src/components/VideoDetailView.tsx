import React, { useState } from 'react';
import { 
  ThumbsUp, ThumbsDown, Share2, Bookmark, Flag, CheckCircle2, 
  Send, Pin, MessageSquare, Sparkles, Heart, Gift
} from 'lucide-react';
import { VideoItem, CommentItem, UserProfile } from '../types';
import { VideoPlayer } from './VideoPlayer';
import { VideoCard } from './VideoCard';

interface VideoDetailViewProps {
  video: VideoItem;
  allVideos: VideoItem[];
  user: UserProfile;
  onSelectVideo: (video: VideoItem) => void;
  onToggleSubscribe: (creatorHandle: string) => void;
  isSubscribed: boolean;
  onToggleWatchLater: (videoId: string) => void;
  isWatchLater: boolean;
  onShare: (video: VideoItem) => void;
  onTipCreator: (creatorName: string) => void;
}

export const VideoDetailView: React.FC<VideoDetailViewProps> = ({
  video,
  allVideos,
  user,
  onSelectVideo,
  onToggleSubscribe,
  isSubscribed,
  onToggleWatchLater,
  isWatchLater,
  onShare,
  onTipCreator,
}) => {
  const [likesCount, setLikesCount] = useState(video.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  
  // Comments state
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: 'c_1',
      videoId: video.id,
      userId: 'u_101',
      userName: 'Sarah Dev',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      text: 'This video player and 4K quality selector work so smoothly! The server-side Gemini captions are a game changer.',
      timestamp: '1 hour ago',
      likes: 24,
      isPinned: true,
      userRole: 'Creator'
    },
    {
      id: 'c_2',
      videoId: video.id,
      userId: 'u_102',
      userName: 'David Miller',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      text: 'Awesome explanation on the Cloud Run architecture and CPA daily offerwall rotation!',
      timestamp: '3 hours ago',
      likes: 8
    }
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  const handleLike = () => {
    if (hasLiked) {
      setHasLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      setHasLiked(true);
      setLikesCount(prev => prev + 1);
      if (hasDisliked) setHasDisliked(false);
    }
  };

  const handleDislike = () => {
    if (hasDisliked) {
      setHasDisliked(false);
    } else {
      setHasDisliked(true);
      if (hasLiked) {
        setHasLiked(false);
        setLikesCount(prev => prev - 1);
      }
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const comment: CommentItem = {
      id: `c_${Date.now()}`,
      videoId: video.id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text: newCommentText,
      timestamp: 'Just now',
      likes: 0,
      userRole: user.role
    };

    setComments([comment, ...comments]);
    setNewCommentText('');
  };

  const recommended = allVideos.filter(v => v.id !== video.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8 text-[#F5F5F5]">
      {/* Main Watch Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Custom Player */}
        <VideoPlayer video={video} autoPlay={true} />

        {/* Video Title & Primary Meta */}
        <div className="space-y-3">
          <h1 className="text-xl sm:text-2xl font-serif text-white leading-snug">
            {video.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            {/* Creator Channel Card */}
            <div className="flex items-center gap-3">
              <img
                src={video.creatorAvatar}
                alt={video.creatorName}
                className="w-11 h-11 rounded-full object-cover border border-white/10"
              />
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                  <span>{video.creatorName}</span>
                  {video.creatorVerified && (
                    <CheckCircle2 className="w-4 h-4 text-orange-400" />
                  )}
                </div>
                <p className="text-xs text-white/40 font-mono">{video.creatorHandle}</p>
              </div>

              <button
                onClick={() => onToggleSubscribe(video.creatorHandle)}
                className={`ml-2 px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md ${
                  isSubscribed
                    ? 'bg-white/10 text-white/80 border border-white/10 hover:bg-white/20'
                    : 'bg-orange-600 hover:bg-orange-700 text-white shadow-[0_0_12px_rgba(234,88,12,0.3)]'
                }`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            {/* Engagement Actions */}
            <div className="flex items-center gap-2">
              {/* Like/Dislike Pill */}
              <div className="flex items-center bg-[#080808] border border-white/10 rounded-full overflow-hidden">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold hover:bg-white/5 transition-colors ${
                    hasLiked ? 'text-orange-400 bg-orange-600/20' : 'text-white/80'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{likesCount}</span>
                </button>
                <div className="w-[1px] h-4 bg-white/10" />
                <button
                  onClick={handleDislike}
                  className={`px-3.5 py-2 text-xs font-semibold hover:bg-white/5 transition-colors ${
                    hasDisliked ? 'text-red-400 bg-red-950/30' : 'text-white/80'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>

              {/* Share */}
              <button
                onClick={() => onShare(video)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#080808] border border-white/10 hover:bg-white/5 text-xs font-semibold text-white/80 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              {/* Watch Later */}
              <button
                onClick={() => onToggleWatchLater(video.id)}
                className={`p-2 rounded-full bg-[#080808] border border-white/10 hover:bg-white/5 transition-colors ${
                  isWatchLater ? 'text-orange-400 border-orange-500/40' : 'text-white/80'
                }`}
                title="Watch Later"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              {/* Super Thanks / Donation */}
              <button
                onClick={() => onTipCreator(video.creatorName)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-orange-600/20 border border-orange-600/40 text-orange-300 hover:bg-orange-600/30 text-xs font-bold transition-all"
              >
                <Gift className="w-4 h-4 text-orange-400" />
                <span>Super Thanks</span>
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Video Description Box */}
        <div className="p-4 bg-[#080808] border border-white/10 rounded-2xl space-y-2 text-xs text-white/70">
          <div className="flex items-center gap-3 font-semibold text-white/90">
            <span>{video.views.toLocaleString()} views</span>
            <span>•</span>
            <span>Published {video.createdAt}</span>
            <span className="px-2 py-0.5 rounded bg-orange-600/20 text-orange-400 border border-orange-600/30 text-[10px] uppercase font-mono">
              {video.category}
            </span>
          </div>

          <p className={`whitespace-pre-line leading-relaxed ${showFullDesc ? '' : 'line-clamp-3'}`}>
            {video.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {video.tags?.map(t => (
              <span key={t} className="text-orange-400 hover:underline cursor-pointer">
                #{t}
              </span>
            ))}
          </div>

          <button
            onClick={() => setShowFullDesc(!showFullDesc)}
            className="mt-2 font-bold text-white/40 hover:text-white"
          >
            {showFullDesc ? 'Show Less' : '...more'}
          </button>
        </div>

        {/* Comments Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-400" />
              <span>{comments.length} Comments</span>
            </h3>
          </div>

          {/* Add Comment Box */}
          <form onSubmit={handleAddComment} className="flex gap-3">
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-white/10" />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-2 bg-[#080808] border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-[0_0_12px_rgba(234,88,12,0.3)]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </div>
          </form>

          {/* Comment Feed */}
          <div className="space-y-4 pt-2">
            {comments.map(c => (
              <div key={c.id} className="p-3.5 bg-[#080808] border border-white/5 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={c.userAvatar} alt={c.userName} className="w-7 h-7 rounded-full object-cover border border-white/10" />
                    <span className="font-semibold text-xs text-white/90">{c.userName}</span>
                    {c.isPinned && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-orange-400 bg-orange-600/20 px-2 py-0.5 rounded-full border border-orange-600/30">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                    <span className="text-[10px] text-white/30">{c.timestamp}</span>
                  </div>
                  <button className="text-white/30 hover:text-red-400" title="Report">
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-white/70 pl-9">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Videos Sidebar */}
      <div className="space-y-4">
        <h2 className="font-serif text-base text-white/80">Recommended Next</h2>
        <div className="space-y-4">
          {recommended.map(v => (
            <VideoCard
              key={v.id}
              video={v}
              onSelectVideo={onSelectVideo}
              onToggleWatchLater={onToggleWatchLater}
              isWatchLater={isWatchLater}
              onShare={onShare}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
