import React, { useState } from 'react';
import { Play, CheckCircle2, MoreVertical, Clock, Bookmark, Share2 } from 'lucide-react';
import { VideoItem } from '../types';

interface VideoCardProps {
  video: VideoItem;
  onSelectVideo: (video: VideoItem) => void;
  onToggleWatchLater: (videoId: string) => void;
  isWatchLater: boolean;
  onShare: (video: VideoItem) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onSelectVideo,
  onToggleWatchLater,
  isWatchLater,
  onShare
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Format seconds to MM:SS or HH:MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div 
      className="group relative flex flex-col bg-[#080808] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
    >
      {/* Thumbnail Container */}
      <div 
        onClick={() => onSelectVideo(video)}
        className="relative aspect-video w-full bg-black overflow-hidden cursor-pointer"
      >
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-105 filter brightness-110' : 'scale-100'
          }`}
        />

        {/* Hover Play Button Overlay */}
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.4)] transform transition-transform group-hover:scale-110">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>

        {/* Resolution Tag */}
        {video.resolutions && video.resolutions[0] && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-white/10 text-[10px] font-bold tracking-wider text-orange-400 backdrop-blur-sm">
            {video.resolutions[0]}
          </span>
        )}

        {/* Duration Tag */}
        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white/80 border border-white/10">
          {formatDuration(video.duration)}
        </span>
      </div>

      {/* Meta Content */}
      <div className="p-3.5 flex gap-3">
        {/* Creator Avatar */}
        <div className="shrink-0">
          <img
            src={video.creatorAvatar}
            alt={video.creatorName}
            className="w-9 h-9 rounded-full object-cover border border-white/10"
          />
        </div>

        {/* Video Info */}
        <div className="flex-1 min-w-0">
          <h3 
            onClick={() => onSelectVideo(video)}
            className="text-xs sm:text-sm font-semibold text-white/90 group-hover:text-orange-400 line-clamp-2 cursor-pointer leading-snug transition-colors"
          >
            {video.title}
          </h3>

          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-white/40 uppercase tracking-wider">
            <span className="font-medium hover:text-white truncate">{video.creatorName}</span>
            {video.creatorVerified && (
              <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            )}
          </div>

          <div className="mt-0.5 flex items-center gap-2 text-[10px] text-white/30">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{video.createdAt}</span>
          </div>
        </div>

        {/* More Actions Menu */}
        <div className="relative shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 text-white/30 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-6 w-44 bg-[#080808] border border-white/10 rounded-xl shadow-2xl py-1 z-30">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchLater(video.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-white/5 text-white/80"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isWatchLater ? 'text-orange-400 fill-orange-400' : ''}`} />
                <span>{isWatchLater ? 'Remove Watch Later' : 'Watch Later'}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(video);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-white/5 text-white/80"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Video</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
