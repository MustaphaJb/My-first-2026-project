import React, { useState } from 'react';
import { 
  Upload, Sparkles, Video, Image as ImageIcon, Captions, Clock, 
  BarChart3, DollarSign, Eye, Users, FileText, CheckCircle2, Lock, Globe
} from 'lucide-react';
import { VideoItem, UserProfile } from '../types';
import { GeminiService } from '../services/geminiService';

interface CreatorStudioProps {
  user: UserProfile;
  onUploadVideo: (video: VideoItem) => void;
}

export const CreatorStudio: React.FC<CreatorStudioProps> = ({ user, onUploadVideo }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'analytics' | 'content' | 'monetization'>('upload');

  // Video Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Development');
  const [tagsInput, setTagsInput] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'unlisted'>('public');
  const [isShort, setIsShort] = useState(false);
  const [monetized, setMonetized] = useState(true);
  
  // Custom Thumbnail & Captions
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80');
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [captionsList, setCaptionsList] = useState<{ start: string; end: string; text: string }[]>([]);

  // AI Suggest Metadata using Gemini
  const handleAiSuggestMetadata = async () => {
    setIsAiGenerating(true);
    const result = await GeminiService.generateMetadata(title || 'Cloud Architecture & Web Development', category);
    setTitle(result.title);
    setDescription(result.description);
    setCategory(result.category || category);
    setTagsInput(result.tags?.join(', ') || 'dev, tutorial, tech');
    setIsAiGenerating(false);
  };

  // AI Auto Captions Generator
  const handleAiGenerateCaptions = async () => {
    setIsAiGenerating(true);
    const captions = await GeminiService.generateCaptions(title || 'Sununsi Dev Cloud Architecture');
    setCaptionsList(captions);
    setIsAiGenerating(false);
    alert('AI Subtitles generated successfully!');
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newVideo: VideoItem = {
      id: `vid_${Date.now()}`,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration: isShort ? 45 : 480,
      views: 0,
      likes: 0,
      dislikes: 0,
      category,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      creatorId: user.id,
      creatorHandle: user.handle,
      creatorName: user.name,
      creatorAvatar: user.avatar,
      creatorVerified: true,
      isShort,
      isPublished: true,
      visibility,
      resolutions: ['4K HD', '1080p HD', '720p', '480p'],
      currentResolution: '1080p HD',
      captions: captionsList,
      createdAt: 'Just now',
      monetized
    };

    onUploadVideo(newVideo);
    alert('Video published successfully!');
    setTitle('');
    setDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 text-slate-100">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Sununsi Creator Studio</h1>
            <p className="text-xs text-slate-400">Manage video uploads, Gemini AI metadata, analytics, and monetization</p>
          </div>
        </div>

        {/* Tab selector */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
          {[
            { id: 'upload', label: 'Upload & AI', icon: Upload },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'monetization', label: 'Monetization', icon: DollarSign },
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition-all ${
                  activeTab === t.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'upload' && (
        <form onSubmit={handlePublish} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Upload Metadata Column */}
          <div className="lg:col-span-2 space-y-5 bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-sm text-white">Video Details & AI Generator</h2>
              <button
                type="button"
                onClick={handleAiSuggestMetadata}
                disabled={isAiGenerating}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20 hover:brightness-110 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAiGenerating ? 'Gemini Generating...' : 'Auto-Generate Title & SEO'}</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300">Video Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Building Scalable Microservices with React & Cloud Run"
                  className="w-full mt-1.5 p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed video description, links, and topic breakdown..."
                  className="w-full mt-1.5 p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1.5 p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Development">Development</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Mobile Dev">Mobile Dev</option>
                    <option value="Monetization & CPA">Monetization & CPA</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="react, typescript, gemini, cpa"
                    className="w-full mt-1.5 p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* AI Auto Subtitles */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-200">
                    <Captions className="w-4 h-4 text-cyan-400" />
                    <span>Gemini AI Subtitles & Captions</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAiGenerateCaptions}
                    className="px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-500/40 rounded-xl text-[11px] font-bold"
                  >
                    Generate Captions
                  </button>
                </div>
                {captionsList.length > 0 && (
                  <p className="text-[11px] text-emerald-400 font-semibold">
                    ✓ {captionsList.length} timed subtitles generated and attached.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Video File & Settings Column */}
          <div className="space-y-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-xs">
            <h2 className="font-bold text-sm text-white pb-3 border-b border-slate-800">Media & Publishing Settings</h2>

            {/* Drag & Drop Thumbnail / Video Box */}
            <div className="p-4 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950 text-center space-y-2">
              <Upload className="w-8 h-8 text-cyan-400 mx-auto" />
              <p className="font-bold text-slate-200">Drag & Drop Video or Thumbnail</p>
              <p className="text-[10px] text-slate-500">Supports MP4, MOV, WEBM (Up to 4K 60FPS)</p>
            </div>

            {/* Short Video toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-semibold text-slate-300">Format as Sununsi Short (9:16)</span>
              <input
                type="checkbox"
                checked={isShort}
                onChange={(e) => setIsShort(e.target.checked)}
                className="w-4 h-4 accent-cyan-400"
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="font-semibold text-slate-300">Visibility</label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {[
                  { id: 'public', label: 'Public' },
                  { id: 'unlisted', label: 'Unlisted' },
                  { id: 'private', label: 'Private' },
                ].map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVisibility(v.id as any)}
                    className={`py-2 rounded-xl font-semibold border ${
                      visibility === v.id
                        ? 'bg-cyan-950 text-cyan-400 border-cyan-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Monetization Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-semibold text-slate-300">Enable Ad & CPA Monetization</span>
              <input
                type="checkbox"
                checked={monetized}
                onChange={(e) => setMonetized(e.target.checked)}
                className="w-4 h-4 accent-emerald-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-2xl text-xs shadow-lg shadow-cyan-500/20 transition-all"
            >
              Publish Video Now
            </button>
          </div>
        </form>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Views', val: '148,920', icon: Eye, color: 'text-cyan-400' },
            { label: 'Watch Time (Hours)', val: '12,450', icon: Clock, color: 'text-indigo-400' },
            { label: 'Subscribers', val: user.subscribersCount.toLocaleString(), icon: Users, color: 'text-purple-400' },
            { label: 'Estimated Revenue', val: `$${user.walletBalance.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-400' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold">{stat.label}</span>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className={`text-2xl font-black font-mono ${stat.color}`}>{stat.val}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
