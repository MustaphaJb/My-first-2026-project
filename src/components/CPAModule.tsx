import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Clock, CheckCircle2, ShieldCheck, Sparkles, 
  ExternalLink, ArrowRight, Wallet, Award, Check
} from 'lucide-react';
import { CPATask, UserProfile } from '../types';
import { GeminiService } from '../services/geminiService';

interface CPAModuleProps {
  tasks: CPATask[];
  user: UserProfile;
  onClaimReward: (task: CPATask, amount: number) => void;
}

export const CPAModule: React.FC<CPAModuleProps> = ({
  tasks,
  user,
  onClaimReward,
}) => {
  const [taskList, setTaskList] = useState<CPATask[]>(tasks);
  const [selectedTask, setSelectedTask] = useState<CPATask | null>(null);
  const [proofText, setProofText] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyFeedback, setVerifyFeedback] = useState<string | null>(null);

  // 24h Countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVerifyTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !proofText.trim()) return;

    setIsVerifying(true);
    setVerifyFeedback(null);

    const result = await GeminiService.verifyCPAProof(selectedTask.title, proofText);

    setIsVerifying(false);
    if (result.approved) {
      setVerifyFeedback(`Success! $${selectedTask.reward.toFixed(2)} credited to your Sununsi Wallet.`);
      
      // Update local status
      setTaskList(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: 'completed' } : t));
      onClaimReward(selectedTask, selectedTask.reward);

      setTimeout(() => {
        setSelectedTask(null);
        setProofText('');
        setVerifyFeedback(null);
      }, 1800);
    } else {
      setVerifyFeedback(result.feedback || 'Verification failed. Please double-check your proof text.');
    }
  };

  const totalPossible = taskList.reduce((acc, t) => acc + t.reward, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 text-[#F5F5F5]">
      {/* Banner / Header */}
      <div className="relative p-6 bg-gradient-to-r from-orange-950/30 via-[#080808] to-orange-950/20 border border-orange-600/30 rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-orange-600/20 text-orange-400 border border-orange-600/30 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> CPA Offerwall Engine
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/10 font-medium text-xs flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> 24h Task Rotation
              </span>
            </div>
            <h1 className="text-3xl font-serif text-white leading-tight">
              Complete Daily Developer Tasks & Earn Instant Payouts
            </h1>
            <p className="text-xs text-white/60 max-w-xl">
              Monetize your activity on Sununsi Dev Platform. Test cloud apps, watch sponsored developer keynotes, and complete quick technical surveys to earn direct payout credit.
            </p>
          </div>

          {/* 24h Rotation Timer */}
          <div className="p-4 bg-black/60 border border-white/10 rounded-2xl text-center shrink-0">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Offer Rotation In:</p>
            <div className="flex items-center gap-2 font-mono text-xl font-bold text-orange-400">
              <span className="px-2 py-1 bg-white/5 rounded-lg border border-white/10">{String(timeLeft.hours).padStart(2, '0')}h</span>
              <span>:</span>
              <span className="px-2 py-1 bg-white/5 rounded-lg border border-white/10">{String(timeLeft.minutes).padStart(2, '0')}m</span>
              <span>:</span>
              <span className="px-2 py-1 bg-white/5 rounded-lg border border-white/10">{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task Wall Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {taskList.map(task => {
          const isDone = task.status === 'completed';

          return (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                isDone 
                  ? 'bg-[#080808]/40 border-white/5 opacity-60' 
                  : 'bg-[#080808] border-white/10 hover:border-orange-500/50 hover:shadow-2xl'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-orange-600/20 text-orange-400 border border-orange-600/30 uppercase tracking-widest">
                    {task.category}
                  </span>
                  <span className="text-lg font-bold text-orange-400 font-mono">
                    +${task.reward.toFixed(2)}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white">{task.title}</h3>
                <p className="text-xs text-white/40">Advertiser: <strong className="text-white/80">{task.advertiser}</strong></p>

                <div className="text-[11px] text-white/60 bg-black/40 p-3 rounded-xl border border-white/5 line-clamp-3">
                  {task.instructions}
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-white/30 font-mono">{task.totalCompletions.toLocaleString()} completed</span>

                {isDone ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-600/10 px-3 py-1.5 rounded-xl border border-orange-600/30">
                    <Check className="w-4 h-4" /> Claimed
                  </span>
                ) : (
                  <button
                    onClick={() => setSelectedTask(task)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-[0_0_12px_rgba(234,88,12,0.3)] transition-all"
                  >
                    <span>Start Task</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Proof Submission Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#080808] border border-orange-600/30 rounded-3xl p-6 shadow-2xl space-y-4 text-[#F5F5F5]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">{selectedTask.category}</span>
                <h3 className="font-bold text-base text-white">{selectedTask.title}</h3>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-white/40 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-black/60 rounded-xl border border-white/10 text-xs space-y-2">
                <p className="font-semibold text-white/80">Instructions:</p>
                <p className="text-white/60 whitespace-pre-line">{selectedTask.instructions}</p>
                {selectedTask.actionUrl && selectedTask.actionUrl !== '#' && (
                  <a
                    href={selectedTask.actionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-orange-400 hover:underline font-bold pt-1"
                  >
                    <span>Open Task Action Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <form onSubmit={handleVerifyTask} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-white/80">Enter Proof / Completion Code / Confirmation Text:</label>
                  <textarea
                    rows={3}
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    placeholder="e.g. Completed survey confirmation code #99281 or PWA test screenshot verified..."
                    className="w-full mt-1.5 p-3 bg-black border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                    required
                  />
                </div>

                {verifyFeedback && (
                  <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    verifyFeedback.includes('Success') ? 'bg-orange-600/20 text-orange-400 border border-orange-600/30' : 'bg-red-950/60 text-red-400 border border-red-500/40'
                  }`}>
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{verifyFeedback}</span>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTask(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 text-white/80 hover:bg-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-[0_0_15px_rgba(234,88,12,0.3)] disabled:opacity-50"
                  >
                    {isVerifying ? 'Gemini AI Verifying Proof...' : `Submit Proof (+${selectedTask.reward.toFixed(2)})`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
