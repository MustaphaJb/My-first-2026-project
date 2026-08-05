import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  Settings, Captions, PictureInPicture, Zap, Monitor
} from 'lucide-react';
import { VideoItem } from '../types';

interface VideoPlayerProps {
  video: VideoItem;
  autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, autoPlay = true }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.duration || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedResolution, setSelectedResolution] = useState(
    video.currentResolution || video.resolutions?.[0] || '1080p HD'
  );
  const [showCaptions, setShowCaptions] = useState(true);
  const [activeCaption, setActiveCaption] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Sync Video playback & captions
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const handleTimeUpdate = () => {
      setCurrentTime(el.currentTime);
      if (video.captions && video.captions.length > 0) {
        // Convert caption timestamps HH:MM:SS or MM:SS to seconds
        const match = video.captions.find(c => {
          const startSec = parseTimeToSec(c.start);
          const endSec = parseTimeToSec(c.end);
          return el.currentTime >= startSec && el.currentTime <= endSec;
        });
        setActiveCaption(match ? match.text : '');
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(el.duration || video.duration);
    };

    el.addEventListener('timeupdate', handleTimeUpdate);
    el.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      el.removeEventListener('timeupdate', handleTimeUpdate);
      el.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [video]);

  const parseTimeToSec = (str: string) => {
    const parts = str.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume || 1;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.error('PiP error:', err);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div 
      ref={containerRef}
      className="relative group w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800"
    >
      {/* Ambient Glow Effect Behind Player */}
      <div 
        className="absolute inset-0 opacity-20 filter blur-3xl transition-opacity duration-1000 pointer-events-none"
        style={{
          backgroundImage: `url(${video.thumbnailUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Video Tag */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        autoPlay={autoPlay}
        playsInline
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer relative z-10"
      />

      {/* Active Captions Overlay */}
      {showCaptions && activeCaption && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 px-4 py-1.5 rounded-lg bg-slate-950/85 text-white text-xs sm:text-sm font-medium border border-slate-800 backdrop-blur-md max-w-[85%] text-center shadow-lg">
          {activeCaption}
        </div>
      )}

      {/* Resolution & Quality Badge Top Overlay */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-cyan-500/40 text-cyan-400 font-mono text-[11px] font-bold backdrop-blur-md shadow-md">
          {selectedResolution}
        </span>
      </div>

      {/* Control Bar Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Progress Slider */}
        <div className="relative mb-3 flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-2">
          {/* Left Controls: Play, Volume, Time */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 text-slate-200 hover:text-cyan-400 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-slate-300 hover:text-white">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400 hidden sm:block"
              />
            </div>

            {/* Timestamps */}
            <div className="text-[11px] font-mono text-slate-300">
              <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Captions, Settings, PiP, Fullscreen */}
          <div className="flex items-center gap-2 relative">
            {/* Captions Toggle */}
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                showCaptions ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Captions"
            >
              <Captions className="w-4 h-4" />
            </button>

            {/* PiP Button */}
            <button
              onClick={togglePiP}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Picture-in-Picture"
            >
              <PictureInPicture className="w-4 h-4" />
            </button>

            {/* Quality & Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 text-slate-400 hover:text-white transition-colors"
                title="Playback Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              {showSettings && (
                <div className="absolute right-0 bottom-10 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-40 text-xs">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 px-2">Quality</div>
                  {video.resolutions?.map(res => (
                    <button
                      key={res}
                      onClick={() => {
                        setSelectedResolution(res);
                        setShowSettings(false);
                      }}
                      className={`w-full text-left px-2 py-1 rounded hover:bg-slate-800 ${
                        selectedResolution === res ? 'text-cyan-400 font-bold' : 'text-slate-300'
                      }`}
                    >
                      {res}
                    </button>
                  ))}

                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-2 mb-1 px-2">Speed</div>
                  {[0.5, 1, 1.25, 1.5, 2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => changeSpeed(speed)}
                      className={`w-full text-left px-2 py-1 rounded hover:bg-slate-800 ${
                        playbackSpeed === speed ? 'text-cyan-400 font-bold' : 'text-slate-300'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
