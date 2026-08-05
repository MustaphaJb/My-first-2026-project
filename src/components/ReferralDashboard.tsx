import React, { useState } from 'react';
import { Share2, Copy, Check, Users, DollarSign, Award, ArrowUpRight, Wallet } from 'lucide-react';
import { UserProfile } from '../types';

interface ReferralDashboardProps {
  user: UserProfile;
  onWithdrawReferral: (amount: number) => void;
}

export const ReferralDashboard: React.FC<ReferralDashboardProps> = ({ user, onWithdrawReferral }) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://sununsi.dev/ref/${user.handle.replace('@', '')}?code=${user.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 rounded-3xl space-y-2">
        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-extrabold text-xs tracking-wider uppercase inline-flex items-center gap-1.5">
          <Share2 className="w-3.5 h-3.5" /> Affiliate & Referral Program
        </span>
        <h1 className="text-2xl font-black text-white">Invite Creators & Earn Lifetime Commissions</h1>
        <p className="text-xs text-slate-300 max-w-xl">
          Get 10% commission on every digital product sale, channel membership subscription, and CPA task completed by your referred users.
        </p>
      </div>

      {/* Referral Link Box */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Your Unique Creator Referral Link</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-cyan-400 font-semibold focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Referred Creators</span>
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">{user.referredCount} Users</div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Referral Commission Earnings</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">${user.referralEarnings.toFixed(2)}</div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Payout Tier Level</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">VIP Tier (10%)</div>
        </div>
      </div>

      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-right">
        <button
          onClick={() => {
            onWithdrawReferral(user.referralEarnings);
            alert(`$${user.referralEarnings.toFixed(2)} transferred to your main wallet balance!`);
          }}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Wallet className="w-4 h-4" />
          <span>Transfer Referral Earnings to Wallet</span>
        </button>
      </div>
    </div>
  );
};
