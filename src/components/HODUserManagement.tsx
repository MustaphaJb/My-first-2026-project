import React, { useEffect, useState } from 'react';
import { User, DepartmentName, LoginHistoryItem } from '../types';
import { storageService } from '../services/storageService';
import { UserCheck, UserPlus, Shield, Lock, Trash2, Power, History, KeyRound } from 'lucide-react';

interface HODUserManagementProps {
  currentUser: User;
}

const DEPARTMENTS: DepartmentName[] = [
  'Combat Engineering',
  'Field Engineering',
  'Plant & Heavy Equipment',
  'Survey & Mapping',
  'EOD & CBRN',
  'Signals & Tech',
  'Workshop & Maintenance',
  'Admin & Logistics',
  'Medical Services',
];

export const HODUserManagement: React.FC<HODUserManagementProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New HOD form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [serviceNumber, setServiceNumber] = useState('');
  const [rank, setRank] = useState('Major');
  const [department, setDepartment] = useState<DepartmentName>('Combat Engineering');
  const [role, setRole] = useState<'HOD' | 'Administrator'>('HOD');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsersData();
  }, []);

  const loadUsersData = async () => {
    setLoading(true);
    const uList = await storageService.getUsers();
    const lh = await storageService.getLoginHistory();
    setUsers(uList);
    setLoginHistory(lh);
    setLoading(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setError(null);
    try {
      await storageService.createUser({
        name,
        email,
        serviceNumber,
        rank,
        department: role === 'HOD' ? department : undefined,
        role,
        active: true,
      });

      setShowCreateModal(false);
      setName('');
      setEmail('');
      loadUsersData();
    } catch (err: any) {
      setError(err.message || 'Failed to create HOD account');
    }
  };

  const handleToggleActive = async (user: User) => {
    await storageService.updateUser(user.id, { active: !user.active });
    loadUsersData();
  };

  const handleDeleteUser = async (user: User) => {
    if (confirm(`Are you sure you want to delete user account for ${user.email}?`)) {
      await storageService.deleteUser(user.id);
      loadUsersData();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-emerald-950/80 border border-amber-500/30 text-white shadow">
        <div>
          <h2 className="text-xl font-extrabold uppercase tracking-wide text-white">
            HOD & User Account Administration
          </h2>
          <p className="text-xs text-emerald-300 mt-1">
            23 Support Engineer Regiment Jos • Role-Based Access Control (RBAC) Management
          </p>
        </div>

        <button
          id="btn-create-hod-account"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs uppercase shadow transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create HOD Account</span>
        </button>
      </div>

      {/* User Accounts List */}
      <div className="bg-emerald-950/80 border border-emerald-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 bg-emerald-900/40 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <UserCheck className="w-4 h-4" />
            <span>Active System Users ({users.length})</span>
          </div>
          <span className="text-xs text-emerald-400 font-mono">Administrator Controlled</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-emerald-900 text-amber-400 font-mono uppercase">
              <tr>
                <th className="p-3">User / Officer Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Role & Dept</th>
                <th className="p-3">Service No</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-emerald-900/40">
                  <td className="p-3 font-bold text-white">
                    {u.rank ? `${u.rank} ` : ''}{u.name}
                  </td>
                  <td className="p-3 font-mono text-emerald-300">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'Administrator'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-800 text-emerald-200 border border-emerald-600'
                      }`}
                    >
                      {u.role} {u.department ? `(${u.department})` : ''}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-amber-300">{u.serviceNumber || 'N/A'}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.active
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {u.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleActive(u)}
                        className={`p-1.5 rounded text-[11px] font-bold ${
                          u.active
                            ? 'bg-red-950 text-red-300 hover:bg-red-900'
                            : 'bg-emerald-900 text-emerald-200 hover:bg-emerald-800'
                        }`}
                        title={u.active ? 'Disable Account' : 'Enable Account'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>

                      {u.email !== 'admin@army.mil.ng' && (
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="p-1.5 rounded bg-red-950 hover:bg-red-900 text-red-400"
                          title="Delete Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Login History Log */}
      <div className="bg-emerald-950/80 border border-emerald-800 rounded-xl overflow-hidden shadow-lg p-4 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-emerald-800 pb-2">
          <History className="w-4 h-4" />
          <span>User Authentication & Login History Log</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-emerald-900/60 text-emerald-300 font-mono uppercase">
              <tr>
                <th className="p-2">Timestamp</th>
                <th className="p-2">User Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Status</th>
                <th className="p-2">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/60">
              {loginHistory.map((lh) => (
                <tr key={lh.id} className="hover:bg-emerald-900/30">
                  <td className="p-2 font-mono text-emerald-400">
                    {new Date(lh.timestamp).toLocaleString()}
                  </td>
                  <td className="p-2 font-bold text-white">{lh.userEmail}</td>
                  <td className="p-2 text-emerald-300">{lh.role}</td>
                  <td className="p-2">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        lh.status === 'Success'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {lh.status}
                    </span>
                  </td>
                  <td className="p-2 font-mono text-emerald-400">{lh.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create HOD Account Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-emerald-950 border-2 border-amber-500/40 rounded-xl p-6 w-full max-w-md text-white shadow-2xl">
            <h3 className="text-lg font-bold text-amber-400 uppercase mb-4">
              Create New HOD User Account
            </h3>

            {error && <div className="p-2 bg-red-950 border border-red-500 text-red-200 text-xs rounded mb-3">{error}</div>}

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Lt. Col. A. O. Danjuma"
                  className="w-full px-3 py-2 rounded bg-emerald-900 border border-emerald-700 text-white"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Official Military Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hod.dept@army.mil.ng"
                  className="w-full px-3 py-2 rounded bg-emerald-900 border border-emerald-700 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Service No</label>
                  <input
                    type="text"
                    value={serviceNumber}
                    onChange={(e) => setServiceNumber(e.target.value)}
                    placeholder="23SER/OFF/2012/011"
                    className="w-full px-3 py-2 rounded bg-emerald-900 border border-emerald-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Rank</label>
                  <input
                    type="text"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    placeholder="Major"
                    className="w-full px-3 py-2 rounded bg-emerald-900 border border-emerald-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Assigned Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as any)}
                  className="w-full px-3 py-2 rounded bg-emerald-900 border border-emerald-700 text-white"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Role Permission</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded bg-emerald-900 border border-emerald-700 text-white"
                >
                  <option value="HOD">HOD (Department Access Only)</option>
                  <option value="Administrator">Administrator (Full Control)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-emerald-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded bg-emerald-900 text-emerald-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-amber-500 text-emerald-950 font-bold uppercase"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
