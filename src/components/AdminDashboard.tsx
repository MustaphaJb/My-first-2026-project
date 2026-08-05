import React, { useState } from 'react';
import { 
  ShieldAlert, Users, Video, DollarSign, ShieldCheck, Key, 
  Settings, Check, X, AlertTriangle, Lock, Eye, Trash2, Award, FileText
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';

interface AdminDashboardProps {
  user: UserProfile;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  currentRole,
  onRoleChange,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'users' | 'moderation' | 'cpa' | 'payouts' | 'security' | 'settings'>('users');

  // Simulated User List
  const [usersList, setUsersList] = useState([
    { id: 'u_1', name: 'Sununsi Master Dev', email: 'creator@sununsi.dev', role: 'Super Admin', verified: true, status: 'active', faceId: true },
    { id: 'u_2', name: 'Elena Rostova', email: 'elena@ai.io', role: 'Creator', verified: true, status: 'active', faceId: true },
    { id: 'u_3', name: 'Marcus Vance', email: 'marcus@devops.org', role: 'Creator', verified: true, status: 'active', faceId: true },
    { id: 'u_4', name: 'SpamUser99', email: 'spam@bot.net', role: 'Viewer', verified: false, status: 'suspended', faceId: false }
  ]);

  // Security logs
  const [securityLogs] = useState([
    { id: 'sec_1', event: 'Face ID Verification Scan Passed', user: 'Sununsi Master Dev', timestamp: '10 mins ago', status: 'SUCCESS' },
    { id: 'sec_2', event: '2FA TOTP Code Validated', user: 'Elena Rostova', timestamp: '25 mins ago', status: 'SUCCESS' },
    { id: 'sec_3', event: 'Rate-Limit IP Throttle Warning', user: '192.168.1.102', timestamp: '1 hour ago', status: 'FLAGGED' },
  ]);

  const handleToggleVerifyUser = (userId: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, verified: !u.verified } : u));
  };

  const handleToggleSuspendUser = (userId: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 text-slate-100">
      {/* Super Admin Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <span>Super Admin Command Tower</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500 text-slate-950 font-bold">
                FULL ACCESS
              </span>
            </h1>
            <p className="text-xs text-slate-400">Complete control over users, videos, CPA tasks, payments, security logs, and site settings</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
          {[
            { id: 'users', label: 'Users & Roles', icon: Users },
            { id: 'moderation', label: 'Content Moderation', icon: Video },
            { id: 'cpa', label: 'CPA Tasks', icon: DollarSign },
            { id: 'security', label: 'Security Logs', icon: ShieldCheck },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveAdminTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeAdminTab === t.id
                    ? 'bg-indigo-500 text-slate-950 shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin Tab Contents */}
      {activeAdminTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="font-bold text-sm text-white">User Accounts & Role Permissions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Face ID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-semibold text-white">
                      <div>{u.name}</div>
                      <div className="text-[10px] text-slate-500">{u.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 font-bold">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {u.faceId ? (
                        <span className="text-emerald-400 font-bold">✓ Verified</span>
                      ) : (
                        <span className="text-slate-500">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'active' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                      }`}>
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleVerifyUser(u.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold"
                      >
                        {u.verified ? 'Unverify' : 'Verify'}
                      </button>
                      <button
                        onClick={() => handleToggleSuspendUser(u.id)}
                        className="px-2.5 py-1 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 font-semibold"
                      >
                        {u.status === 'active' ? 'Ban' : 'Unban'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeAdminTab === 'security' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="font-bold text-sm text-white">Security & Biometrics Audit Log</h2>
          <div className="space-y-3">
            {securityLogs.map(log => (
              <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-200">{log.event}</div>
                  <div className="text-[10px] text-slate-400">User: {log.user} • {log.timestamp}</div>
                </div>
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                  log.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
