import React, { useState } from 'react';
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, DollarSign, CreditCard, 
  Clock, CheckCircle2, Building, ShieldCheck, X
} from 'lucide-react';
import { UserProfile, WalletTransaction } from '../types';

interface WalletModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onWithdrawFunds: (amount: number, destination: string) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  user,
  isOpen,
  onClose,
  onWithdrawFunds,
}) => {
  const [activeTab, setActiveTab] = useState<'balance' | 'withdraw' | 'deposit'>('balance');
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [withdrawDestination, setWithdrawDestination] = useState('Bank Account (GTBank / Access)');
  const [isProcessing, setIsProcessing] = useState(false);

  // Sample transactions log
  const [transactions] = useState<WalletTransaction[]>([
    { id: 'tx_1', userId: user.id, type: 'CPA_REWARD', amount: 3.50, description: 'CPA Task: AWS Cloud Test Completed', timestamp: 'Today, 2:15 PM', status: 'completed' },
    { id: 'tx_2', userId: user.id, type: 'PRODUCT_SALE', amount: 29.99, description: 'Digital Product Sale: Microservices eBook', timestamp: 'Yesterday', status: 'completed' },
    { id: 'tx_3', userId: user.id, type: 'SUPER_CHAT', amount: 10.00, description: 'Super Chat Tip from @CyberAlex', timestamp: '3 days ago', status: 'completed' }
  ]);

  if (!isOpen) return null;

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount > user.walletBalance) {
      alert('Insufficient wallet balance.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onWithdrawFunds(withdrawAmount, withdrawDestination);
      alert(`Withdrawal request for $${withdrawAmount.toFixed(2)} submitted successfully!`);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#080808] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 text-[#F5F5F5] relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 font-serif text-lg text-white">
            <Wallet className="w-5 h-5 text-orange-400" />
            <span>Sununsi Creator Wallet & Payouts</span>
          </div>
          <button onClick={onClose} className="p-1 text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="p-5 bg-gradient-to-r from-orange-950/30 via-black to-orange-950/20 border border-orange-600/30 rounded-2xl flex items-center justify-between shadow-xl">
          <div>
            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Available Wallet Balance</p>
            <p className="text-3xl font-bold text-white font-mono mt-1">${user.walletBalance.toFixed(2)}</p>
          </div>
          <button
            onClick={() => setActiveTab('withdraw')}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(234,88,12,0.3)] transition-all"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw Payout</span>
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex bg-black p-1 rounded-2xl border border-white/10 text-xs">
          {[
            { id: 'balance', label: 'Transaction History' },
            { id: 'withdraw', label: 'Withdraw Payout' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-orange-600 text-white shadow-[0_0_12px_rgba(234,88,12,0.3)]'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'balance' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest">Recent Activity</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {transactions.map(tx => (
                <div key={tx.id} className="p-3 bg-black rounded-xl border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-white/90">{tx.description}</p>
                    <p className="text-[10px] text-white/40 font-mono">{tx.timestamp}</p>
                  </div>
                  <span className="font-mono font-bold text-orange-400">+${tx.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'withdraw' && (
          <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-white/80">Withdrawal Amount ($ USD)</label>
              <input
                type="number"
                min={10}
                max={user.walletBalance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="w-full mt-1.5 p-3 bg-black border border-white/10 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-orange-500/50"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-white/80">Payout Gateway Destination</label>
              <select
                value={withdrawDestination}
                onChange={(e) => setWithdrawDestination(e.target.value)}
                className="w-full mt-1.5 p-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/50"
              >
                <option value="Bank Account (Flutterwave Direct NGN/KES/USD)">Bank Account (Flutterwave Direct NGN/KES/USD)</option>
                <option value="Paystack Bank Account">Paystack Bank Account</option>
                <option value="Crypto USDT Wallet (TRC-20)">Crypto USDT Wallet (TRC-20)</option>
                <option value="PayPal Account">PayPal Account</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-[0_0_15px_rgba(234,88,12,0.3)] disabled:opacity-50"
            >
              {isProcessing ? 'Processing Withdrawal...' : `Submit Payout Request ($${withdrawAmount.toFixed(2)})`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
