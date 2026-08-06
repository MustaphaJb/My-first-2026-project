import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { User, AuditLog } from '../types';
import { CentralBannerSection } from './CentralBannerSection';
import {
  Users,
  Building2,
  UserCheck,
  PlaneTakeoff,
  Award,
  Activity,
  PlusCircle,
  FileText,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface DashboardProps {
  user: User;
  onNavigate: (tab: string) => void;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const data = await storageService.getDashboardStats();
    setStatsData(data);
    setLoading(false);
  };

  if (loading || !statsData) {
    return (
      <div className="flex items-center justify-center p-12 text-emerald-400">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mr-3" />
        <span className="font-mono text-sm">Loading Regiment Dashboard Analytics...</span>
      </div>
    );
  }

  const { stats, charts, recentActivities } = statsData;

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-emerald-950/80 border border-amber-500/30 text-white shadow-md">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-white font-sans">
            Command Dashboard & Analytics
          </h2>
          <p className="text-xs text-emerald-300 mt-1">
            23 Support Engineer Regiment Jos • Current Status Overview
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-dash-add-personnel"
            onClick={() => onNavigate('add_personnel')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs uppercase shadow transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Personnel</span>
          </button>

          <button
            id="btn-dash-generate-reports"
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-amber-300 border border-amber-500/40 text-xs font-semibold uppercase shadow transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Roster Reports</span>
          </button>
        </div>
      </div>

      {/* 2 Central Banner Upload Places (Immediately visible after login) */}
      <CentralBannerSection user={user} />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/60 text-white shadow">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Total Records</span>
            <Users className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.totalPersonnel}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">Regiment Workers</div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/60 text-white shadow">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Departments</span>
            <Building2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.totalDepartments}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">Specialized Units</div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/60 text-white shadow">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Active Duty</span>
            <UserCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">{stats.activePersonnel}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">On Barracks Duty</div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/60 text-white shadow">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Deployed</span>
            <PlaneTakeoff className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-400">{stats.deployedPersonnel || 1}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">Field Operations</div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/60 text-white shadow col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Retired</span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">{stats.retiredPersonnel}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">Honourably Discharged</div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Distribution Bar Chart */}
        <div className="p-5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-white shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-amber-400">
              Personnel by Department
            </h3>
            <span className="text-[10px] font-mono bg-emerald-900 px-2 py-0.5 rounded text-emerald-300">
              Realtime Count
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.byDepartment} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="shortName" stroke="#a7f3d0" fontSize={10} interval={0} angle={-30} textAnchor="end" />
                <YAxis stroke="#a7f3d0" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#064e3b', borderColor: '#d4af37', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rank & Gender Distribution Pie Charts */}
        <div className="p-5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-white shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-amber-400">
              Gender & Rank Distribution
            </h3>
            <span className="text-[10px] font-mono bg-emerald-900 px-2 py-0.5 rounded text-emerald-300">
              Demographics
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 h-64">
            {/* Gender Pie Chart */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs font-semibold text-emerald-200 mb-1">Gender Ratio</span>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.byGender}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={55}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#ec4899" />
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#064e3b', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Employment Status Pie Chart */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs font-semibold text-emerald-200 mb-1">Employment Status</span>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.byStatus}
                      cx="50%"
                      cy="50%"
                      outerRadius={55}
                      dataKey="count"
                    >
                      {charts.byStatus.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#064e3b', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity Log & Command Feed */}
      <div className="p-5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-white shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">Recent System Activities</h3>
          </div>
          <button
            onClick={() => onNavigate('audit_logs')}
            className="text-xs text-amber-400 hover:underline font-mono"
          >
            View Full Audit Log →
          </button>
        </div>

        <div className="space-y-2.5">
          {recentActivities.map((log: AuditLog) => (
            <div
              key={log.id}
              className="p-3 rounded-lg bg-emerald-900/30 border border-emerald-800/60 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px] mt-0.5">
                  {log.action}
                </span>
                <div>
                  <div className="font-semibold text-emerald-100">{log.userName} ({log.userEmail})</div>
                  <div className="text-emerald-300/80 mt-0.5">{log.details}</div>
                </div>
              </div>

              <div className="text-right text-[10px] font-mono text-emerald-400/70 flex-shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
