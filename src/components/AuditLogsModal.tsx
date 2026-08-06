import React, { useEffect, useState } from 'react';
import { AuditLog } from '../types';
import { storageService } from '../services/storageService';
import { ShieldAlert, Search, Shield, Filter, RefreshCw } from 'lucide-react';

export const AuditLogsModal: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('All');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    const data = await storageService.getAuditLogs();
    setLogs(data);
    setLoading(false);
  };

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = selectedAction === 'All' || l.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-emerald-950/80 border border-amber-500/30 text-white shadow">
        <div>
          <h2 className="text-xl font-extrabold uppercase tracking-wide text-white">
            System Security & Audit Log Explorer
          </h2>
          <p className="text-xs text-emerald-300 mt-1">
            23 Support Engineer Regiment Jos • Immutable Operational Event History
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-emerald-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search email, action, details..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-emerald-950 border border-emerald-700 text-xs text-white placeholder-emerald-600 focus:outline-none"
          />
        </div>

        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="px-3 py-2 rounded-lg bg-emerald-950 border border-emerald-700 text-xs text-white focus:outline-none"
        >
          <option value="All">All Audit Actions</option>
          <option value="LOGIN_SUCCESS">LOGIN_SUCCESS</option>
          <option value="LOGIN_FAILED">LOGIN_FAILED</option>
          <option value="CREATE_PERSONNEL">CREATE_PERSONNEL</option>
          <option value="UPDATE_PERSONNEL">UPDATE_PERSONNEL</option>
          <option value="DELETE_PERSONNEL">DELETE_PERSONNEL</option>
          <option value="BACKUP_DB">BACKUP_DB</option>
          <option value="RESTORE_DB">RESTORE_DB</option>
          <option value="CREATE_HOD">CREATE_HOD</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-emerald-950/80 border border-emerald-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-emerald-900 text-amber-400 font-mono uppercase">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">User & Role</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-emerald-400 font-mono">
                    Loading audit logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-emerald-400">
                    No audit logs match current query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-emerald-900/40">
                    <td className="p-3 font-mono text-emerald-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 font-mono font-bold">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] uppercase">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-white">{log.userName}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">{log.userEmail} ({log.role})</div>
                    </td>
                    <td className="p-3 font-mono text-emerald-400">{log.ipAddress}</td>
                    <td className="p-3 text-emerald-200">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
