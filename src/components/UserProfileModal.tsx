import React, { useState } from 'react';
import { 
  X, ShieldCheck, Camera, CheckCircle2, AlertTriangle, Smartphone, 
  Monitor, Globe, Clock, RefreshCw, KeyRound, UserCheck, Download, 
  Trash2, Filter, Lock, Sparkles, Cpu, ChevronRight, Fingerprint
} from 'lucide-react';
import { UserProfile, SecurityLogItem } from '../types';

interface UserProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  securityLogs: SecurityLogItem[];
  onAddSecurityLog: (log: SecurityLogItem) => void;
  onClearLogs: () => void;
  onUpdateUser: (updated: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  securityLogs,
  onAddSecurityLog,
  onClearLogs,
  onUpdateUser
}) => {
  const [activeTab, setActiveTab] = useState<'security_activity' | 'profile' | 'biometrics' | 'devices'>('security_activity');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'faceid' | 'other'>('all');
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);

  if (!isOpen) return null;

  // Filter logs
  const filteredLogs = securityLogs.filter(log => {
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesType = typeFilter === 'all' 
      ? true 
      : typeFilter === 'faceid' 
        ? log.type === 'faceid' 
        : log.type !== 'faceid';
    return matchesStatus && matchesType;
  });

  // Calculate statistics
  const faceIdLogs = securityLogs.filter(l => l.type === 'faceid');
  const totalScans = faceIdLogs.length;
  const successfulScans = faceIdLogs.filter(l => l.status === 'success').length;
  const failedScans = faceIdLogs.filter(l => l.status === 'failed').length;
  const successRate = totalScans > 0 ? Math.round((successfulScans / totalScans) * 100) : 100;

  // Simulate a new scan for live demonstration
  const handleSimulateFaceIdScan = (shouldSucceed: boolean) => {
    setIsSimulatingScan(true);
    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);
      const isMobile = user.preferredDevice === 'android';
      
      const newLog: SecurityLogItem = {
        id: `log_${Date.now()}`,
        type: 'faceid',
        status: shouldSucceed ? 'success' : 'failed',
        timestamp: dateStr,
        device: isMobile ? 'Android PWA / Galaxy S24 Ultra' : 'Chrome 128 (macOS Sonoma)',
        ipAddress: '102.89.23.11',
        location: 'Lagos, Nigeria',
        confidenceScore: shouldSucceed ? Number((95 + Math.random() * 4.9).toFixed(1)) : Number((20 + Math.random() * 30).toFixed(1)),
        details: shouldSucceed 
          ? 'Live Face ID Scan Verified: 68 biometric landmark points matched against profile vault.' 
          : 'Live Face ID Scan Failed: Liveness check rejected or facial expression mismatch.'
      };

      onAddSecurityLog(newLog);
      setIsSimulatingScan(false);
    }, 1200);
  };

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(securityLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `security_activity_logs_${user.handle}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#09090b] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(234,88,12,0.15)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#0c0c0e]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-600/20 text-orange-400 border border-orange-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                User Account & Security Settings
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-600/20 text-orange-400 border border-orange-600/30 font-bold uppercase">
                  Biometrics Protected
                </span>
              </h2>
              <p className="text-xs text-white/50">
                Logged in as <span className="text-white font-semibold">{user.name}</span> ({user.handle})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 bg-[#070708] border-b border-white/5 overflow-x-auto no-scrollbar">
          {[
            { id: 'security_activity', label: 'Security Activity Log', icon: ShieldCheck, badge: `${securityLogs.length}` },
            { id: 'biometrics', label: 'Face ID & 2FA Auth', icon: Camera },
            { id: 'profile', label: 'Profile Details', icon: UserCheck },
            { id: 'devices', label: 'Device Preferences', icon: Smartphone },
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-2xl text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-orange-500 text-orange-400 bg-orange-600/10'
                    : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
                {t.badge && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-orange-600 text-white text-[10px] font-mono">
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Stage */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: SECURITY ACTIVITY LOG (PRIMARY USER REQUEST) */}
          {activeTab === 'security_activity' && (
            <div className="space-y-6">
              
              {/* Summary Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-black border border-white/10 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-white/50 text-xs">
                    <span>Face ID Scans</span>
                    <Camera className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-white">{totalScans}</div>
                  <p className="text-[10px] text-white/40">Total biometric attempts</p>
                </div>

                <div className="p-4 bg-black border border-emerald-500/20 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-emerald-400 text-xs">
                    <span>Successful Matches</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-emerald-400">{successfulScans}</div>
                  <p className="text-[10px] text-emerald-500/80">{successRate}% success rate</p>
                </div>

                <div className="p-4 bg-black border border-red-500/20 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-red-400 text-xs">
                    <span>Blocked Attempts</span>
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="text-2xl font-mono font-bold text-red-400">{failedScans}</div>
                  <p className="text-[10px] text-red-400/70">Rejected by Biometric Guard</p>
                </div>

                <div className="p-4 bg-black border border-white/10 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-white/50 text-xs">
                    <span>Primary Shield</span>
                    <Lock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xs font-bold text-amber-400 mt-1">Active 68 Keypoint Mesh</div>
                  <p className="text-[10px] text-white/40">Liveness verification ON</p>
                </div>
              </div>

              {/* Action Controls & Filters Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-black border border-white/10 rounded-2xl">
                
                {/* Filter Selector */}
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <div className="flex items-center gap-1.5 text-white/60 font-semibold mr-1">
                    <Filter className="w-3.5 h-3.5 text-orange-400" />
                    <span>Filter:</span>
                  </div>

                  {/* Status Pills */}
                  <div className="flex bg-white/5 p-0.5 rounded-xl border border-white/10">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        statusFilter === 'all' ? 'bg-orange-600 text-white' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setStatusFilter('success')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        statusFilter === 'success' ? 'bg-emerald-600 text-white' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      Passed
                    </button>
                    <button
                      onClick={() => setStatusFilter('failed')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        statusFilter === 'failed' ? 'bg-red-600 text-white' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      Failed
                    </button>
                  </div>

                  {/* Type Filter */}
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as any)}
                    className="p-1.5 bg-black border border-white/10 rounded-xl text-white font-semibold focus:outline-none focus:border-orange-500"
                  >
                    <option value="all">All Security Events</option>
                    <option value="faceid">Face ID Scans Only</option>
                    <option value="other">2FA & OTP Logs</option>
                  </select>
                </div>

                {/* Simulation & Export Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleSimulateFaceIdScan(true)}
                    disabled={isSimulatingScan}
                    className="px-3 py-1.5 rounded-xl bg-orange-600/20 border border-orange-500/40 hover:bg-orange-600/30 text-orange-400 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    <span>{isSimulatingScan ? 'Scanning...' : '+ Test Scan (Pass)'}</span>
                  </button>

                  <button
                    onClick={() => handleSimulateFaceIdScan(false)}
                    disabled={isSimulatingScan}
                    className="px-3 py-1.5 rounded-xl bg-red-600/10 border border-red-500/30 hover:bg-red-600/20 text-red-400 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <span>+ Test Scan (Fail)</span>
                  </button>

                  <button
                    onClick={handleExportLogs}
                    className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-white/60" />
                    <span>Export JSON</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all security activity logs?')) {
                        onClearLogs();
                      }
                    }}
                    className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-red-600/20 hover:border-red-500/40 text-white/40 hover:text-red-400 transition-colors"
                    title="Clear Security Log History"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Log Activity Items Feed */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-white/50 px-1 font-semibold">
                  <span>Showing {filteredLogs.length} Security Verification Log Entries</span>
                  <span>Real-time Biometric Audit Trail</span>
                </div>

                {filteredLogs.length === 0 ? (
                  <div className="p-8 text-center bg-black border border-white/10 rounded-2xl space-y-3">
                    <ShieldCheck className="w-10 h-10 text-white/20 mx-auto" />
                    <p className="text-sm font-bold text-white/60">No Security Activity Logs Match Filter</p>
                    <p className="text-xs text-white/40">Try resetting the status filter or simulate a test Face ID scan.</p>
                  </div>
                ) : (
                  filteredLogs.map(log => {
                    const isSuccess = log.status === 'success';
                    const isFaceId = log.type === 'faceid';

                    return (
                      <div
                        key={log.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isSuccess 
                            ? 'bg-black border-white/10 hover:border-emerald-500/40' 
                            : 'bg-red-950/20 border-red-500/30 hover:border-red-500/60'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          
                          {/* Left Details */}
                          <div className="flex items-start gap-3">
                            <div className={`p-2.5 rounded-xl shrink-0 ${
                              isSuccess 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {isFaceId ? <Camera className="w-5 h-5" /> : <KeyRound className="w-5 h-5" />}
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm text-white">
                                  {isFaceId ? 'Face ID Biometric Scan' : log.type === '2fa' ? '2FA Authenticator Token' : 'Mobile OTP Code'}
                                </span>

                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                                  isSuccess 
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                                }`}>
                                  {isSuccess ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                  <span>{isSuccess ? 'PASSED & AUTHORIZED' : 'VERIFICATION FAILED'}</span>
                                </span>

                                {log.confidenceScore !== undefined && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-600/20 text-orange-400 border border-orange-600/30 font-bold">
                                    Match: {log.confidenceScore}%
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-white/70">{log.details}</p>

                              {/* Device & Location metadata line */}
                              <div className="flex items-center gap-4 text-[11px] text-white/40 pt-1 flex-wrap font-mono">
                                <span className="flex items-center gap-1">
                                  <Smartphone className="w-3 h-3 text-orange-400" />
                                  <span>{log.device}</span>
                                </span>

                                <span className="flex items-center gap-1">
                                  <Globe className="w-3 h-3 text-cyan-400" />
                                  <span>{log.ipAddress} ({log.location})</span>
                                </span>

                                <span className="flex items-center gap-1 text-white/60">
                                  <Clock className="w-3 h-3 text-amber-400" />
                                  <span>{log.timestamp}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: BIOMETRICS & 2FA MANAGEMENT */}
          {activeTab === 'biometrics' && (
            <div className="space-y-6 text-xs">
              <div className="p-4 bg-black border border-white/10 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-orange-400" />
                    <div>
                      <h3 className="font-bold text-white text-sm">Face ID Biometric Profile Vault</h3>
                      <p className="text-white/50 text-[11px]">Enrolled 68-point 3D facial mesh template</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-[10px]">
                    ACTIVE
                  </span>
                </div>

                <p className="text-white/70">
                  Your facial keypoints are securely hashed using client-side WebCam AI scanner models and checked against Sununsi Security Guard.
                </p>

                <button
                  onClick={() => {
                    alert('Face ID re-enrollment mode initiated. Launching biometric scanner...');
                  }}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-[0_0_12px_rgba(234,88,12,0.3)] flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-scan & Update Face Mesh</span>
                </button>
              </div>

              <div className="p-4 bg-black border border-white/10 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="font-bold text-white text-sm">Two-Factor Authenticator (2FA)</h3>
                      <p className="text-white/50 text-[11px]">Google Authenticator / Authy TOTP App</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-[10px]">
                    ENABLED
                  </span>
                </div>

                <p className="text-white/70">
                  TOTP codes are required when initiating creator wallet payouts exceeding $100.00.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: USER PROFILE DETAILS */}
          {activeTab === 'profile' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-4 p-4 bg-black border border-white/10 rounded-2xl">
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-orange-500/50" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{user.name}</h3>
                    <UserCheck className="w-4 h-4 text-orange-400" />
                  </div>
                  <p className="text-white/50">{user.handle} • {user.role}</p>
                  <p className="text-orange-400 font-mono font-bold">Wallet: ${user.walletBalance.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-white/80">Display Name</label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => onUpdateUser({ ...user, name: e.target.value })}
                    className="w-full mt-1.5 p-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-white/80">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => onUpdateUser({ ...user, email: e.target.value })}
                    className="w-full mt-1.5 p-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DEVICE PREFERENCES */}
          {activeTab === 'devices' && (
            <div className="space-y-4 text-xs">
              <p className="text-white/70">Select your default simulated viewport environment for Sununsi Dev Application:</p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => onUpdateUser({ ...user, preferredDevice: 'desktop' })}
                  className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
                    user.preferredDevice === 'desktop'
                      ? 'bg-orange-600/10 border-orange-500 text-white'
                      : 'bg-black border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <Monitor className="w-6 h-6 text-orange-400" />
                  <div className="font-bold text-sm">Desktop Web Shell</div>
                  <p className="text-[11px] text-white/50">Full-width studio interface for desktop & laptops.</p>
                </button>

                <button
                  onClick={() => onUpdateUser({ ...user, preferredDevice: 'android' })}
                  className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
                    user.preferredDevice === 'android'
                      ? 'bg-orange-600/10 border-orange-500 text-white'
                      : 'bg-black border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-6 h-6 text-orange-400" />
                  <div className="font-bold text-sm">Android PWA Simulation</div>
                  <p className="text-[11px] text-white/50">Mobile responsive frame with Android status bar.</p>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="p-4 bg-[#070708] border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-white/40 font-mono">Sununsi Security Guard v2.4 Active</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-[0_0_12px_rgba(234,88,12,0.3)] transition-all"
          >
            Close Settings
          </button>
        </div>

      </div>
    </div>
  );
};
