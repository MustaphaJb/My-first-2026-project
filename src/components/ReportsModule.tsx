import React, { useState, useEffect } from 'react';
import { PersonnelRecord, DepartmentName, MilitaryRank } from '../types';
import { storageService } from '../services/storageService';
import { FileSpreadsheet, FileText, Download, Filter, Printer, Award, Building2, Users } from 'lucide-react';

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

export const ReportsModule: React.FC = () => {
  const [personnel, setPersonnel] = useState<PersonnelRecord[]>([]);
  const [reportType, setReportType] = useState<'master' | 'department' | 'rank' | 'retirement' | 'promotion'>('master');
  const [selectedDept, setSelectedDept] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedDept, reportType]);

  const loadData = async () => {
    setLoading(true);
    const res = await storageService.getPersonnel({
      department: selectedDept,
    });
    let list = res.data;

    if (reportType === 'retirement') {
      list = list.filter((p) => p.yearsOfService >= 25 || p.employmentStatus === 'Retired');
    }

    setPersonnel(list);
    setLoading(false);
  };

  const handleExportPDF = () => {
    const title =
      reportType === 'master'
        ? 'Regiment Personnel Master Roster'
        : reportType === 'department'
        ? `Department Roster Report (${selectedDept})`
        : reportType === 'retirement'
        ? 'Retirement & Discharge Eligibility Roster'
        : 'Regiment Specialization & Rank Roster';

    storageService.exportPersonnelPDF(personnel, title);
  };

  const handleExportExcel = () => {
    storageService.exportPersonnelExcel(personnel, `23SER_Report_${reportType}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-emerald-950/80 border border-amber-500/30 text-white shadow">
        <div>
          <h2 className="text-xl font-extrabold uppercase tracking-wide text-white">
            Official Reports & Roster Generator
          </h2>
          <p className="text-xs text-emerald-300 mt-1">
            23 Support Engineer Regiment Jos • Formatted PDF & Excel Export Suite
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-report-export-pdf"
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs uppercase shadow transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF Report</span>
          </button>

          <button
            id="btn-report-export-excel"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 text-xs font-semibold uppercase shadow transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Excel (CSV)</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setReportType('master')}
          className={`p-3 rounded-xl border text-left transition-all ${
            reportType === 'master'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
              : 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900/40'
          }`}
        >
          <Users className="w-5 h-5 mb-1 text-amber-400" />
          <div className="font-bold text-xs uppercase">Master Roster</div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5">Full Regiment Directory</div>
        </button>

        <button
          onClick={() => setReportType('department')}
          className={`p-3 rounded-xl border text-left transition-all ${
            reportType === 'department'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
              : 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900/40'
          }`}
        >
          <Building2 className="w-5 h-5 mb-1 text-emerald-400" />
          <div className="font-bold text-xs uppercase">Department Roster</div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5">By Specialized Unit</div>
        </button>

        <button
          onClick={() => setReportType('retirement')}
          className={`p-3 rounded-xl border text-left transition-all ${
            reportType === 'retirement'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
              : 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900/40'
          }`}
        >
          <Award className="w-5 h-5 mb-1 text-amber-400" />
          <div className="font-bold text-xs uppercase">Retirement Roster</div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5">25+ Yrs / Pensioners</div>
        </button>

        <button
          onClick={() => setReportType('promotion')}
          className={`p-3 rounded-xl border text-left transition-all ${
            reportType === 'promotion'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
              : 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900/40'
          }`}
        >
          <FileText className="w-5 h-5 mb-1 text-sky-400" />
          <div className="font-bold text-xs uppercase">Promotions Roster</div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5">Rank Career Progression</div>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 flex items-center justify-between text-xs text-white">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-400" />
          <span>Filter Department Scope:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 rounded bg-emerald-950 border border-emerald-700 text-white font-bold"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="font-mono text-emerald-400">
          Generated Records Count: {personnel.length}
        </div>
      </div>

      {/* Report Preview Table */}
      <div className="bg-emerald-950/80 border border-emerald-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-3 bg-emerald-900/60 border-b border-emerald-800 font-mono text-xs text-amber-300 flex items-center justify-between">
          <span>CLASSIFIED MILITARY ROSTER PREVIEW</span>
          <span>CONFIDENTIAL</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-emerald-900 text-amber-400 font-mono uppercase">
              <tr>
                <th className="p-3">S/N</th>
                <th className="p-3">Service No</th>
                <th className="p-3">Rank & Name</th>
                <th className="p-3">Department</th>
                <th className="p-3">Specialization</th>
                <th className="p-3">Enlisted / Yrs</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-emerald-400 font-mono">
                    Generating report data...
                  </td>
                </tr>
              ) : personnel.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-emerald-400">
                    No records found for selected report criteria.
                  </td>
                </tr>
              ) : (
                personnel.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-emerald-900/40">
                    <td className="p-3 font-mono text-emerald-400">{idx + 1}</td>
                    <td className="p-3 font-mono font-bold text-amber-300">{p.serviceNumber}</td>
                    <td className="p-3 font-bold text-white">
                      {p.rank} {p.surname} {p.firstName}
                    </td>
                    <td className="p-3 text-emerald-200">{p.department}</td>
                    <td className="p-3 text-emerald-300">{p.tradeSpecialization}</td>
                    <td className="p-3 text-emerald-400">
                      {p.dateEnlisted} ({p.yearsOfService} Yrs)
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                        {p.employmentStatus}
                      </span>
                    </td>
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
