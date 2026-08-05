import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Share2, CheckCircle2, BarChart2, Sparkles, Send } from 'lucide-react';
import { CommunityPost, UserProfile } from '../types';

interface CommunityTabProps {
  posts: CommunityPost[];
  user: UserProfile;
}

export const CommunityTab: React.FC<CommunityTabProps> = ({ posts, user }) => {
  const [postList, setPostList] = useState<CommunityPost[]>(posts);
  const [newPostText, setNewPostText] = useState('');

  const handleVotePoll = (postId: string, optionIndex: number) => {
    setPostList(prev => prev.map(p => {
      if (p.id === postId && p.pollOptions) {
        const updatedOptions = p.pollOptions.map((opt, idx) => 
          idx === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt
        );
        return { ...p, pollOptions: updatedOptions };
      }
      return p;
    }));
  };

  const handleLikePost = (postId: string) => {
    setPostList(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newP: CommunityPost = {
      id: `post_${Date.now()}`,
      creatorId: user.id,
      creatorName: user.name,
      creatorHandle: user.handle,
      creatorAvatar: user.avatar,
      creatorVerified: true,
      text: newPostText,
      likes: 0,
      commentsCount: 0,
      createdAt: 'Just now'
    };

    setPostList([newP, ...postList]);
    setNewPostText('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 text-slate-100">
      {/* Create Community Post Box */}
      <form onSubmit={handleAddPost} className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 shadow-xl">
        <div className="flex gap-3">
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
          <textarea
            rows={3}
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Post an update, announcement, or poll to your channel subscribers..."
            className="flex-1 p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Update</span>
          </button>
        </div>
      </form>

      {/* Community Feed */}
      <div className="space-y-6">
        {postList.map(post => {
          const totalPollVotes = post.pollOptions?.reduce((acc, o) => acc + o.votes, 0) || 0;

          return (
            <div key={post.id} className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <img src={post.creatorAvatar} alt={post.creatorName} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                    <span>{post.creatorName}</span>
                    {post.creatorVerified && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400">{post.creatorHandle} • {post.createdAt}</div>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{post.text}</p>

              {/* Attached Image */}
              {post.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-800">
                  <img src={post.imageUrl} alt="Community Post Attachment" className="w-full h-auto object-cover max-h-96" />
                </div>
              )}

              {/* Interactive Poll */}
              {post.pollOptions && (
                <div className="space-y-2 p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px] uppercase tracking-wider mb-2">
                    <BarChart2 className="w-4 h-4" /> Community Poll ({totalPollVotes} votes)
                  </div>
                  {post.pollOptions.map((opt, idx) => {
                    const pct = totalPollVotes > 0 ? Math.round((opt.votes / totalPollVotes) * 100) : 0;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleVotePoll(post.id, idx)}
                        className="w-full relative overflow-hidden p-3 rounded-xl border border-slate-800 hover:border-cyan-500/50 text-left transition-all"
                      >
                        <div
                          className="absolute inset-y-0 left-0 bg-cyan-500/20 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                        <div className="relative z-10 flex items-center justify-between font-semibold text-slate-200">
                          <span>{opt.text}</span>
                          <span className="font-mono text-cyan-400">{pct}%</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center gap-4 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                <button
                  onClick={() => handleLikePost(post.id)}
                  className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.likes}</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.commentsCount} Comments</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
