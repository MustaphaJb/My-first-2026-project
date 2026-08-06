import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { PersonnelRecord, User, DepartmentName, MilitaryRank, EmploymentStatus } from '../types';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  FileSpreadsheet,
  FileText,
  ChevronLeft,
  ChevronRight,
  Shield,
  Download,
} from 'lucide-react';

interface PersonnelListProps {
  user: User;
  onSelectPersonnel: (personnel: PersonnelRecord) => void;
  onEditPersonnel: (personnel: PersonnelRecord) => void;
  onAddNew: () => void;
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

const RANKS: MilitaryRank[] = [
  'Brigadier General',
  'Colonel',
  'Lieutenant Colonel',
  'Major',
  'Captain',
  'Lieutenant',
  'Second Lieutenant',
  'Warrant Officer Class I',
  'Warrant Officer Class II',
  'Staff Sergeant',
  'Sergeant',
  'Corporal',
  'Lance Corporal',
  'Private',
];

export const PersonnelList: React.FC<PersonnelListProps> = ({
  user,
  onSelectPersonnel,
  onEditPersonnel,
  onAddNew,
}) => {
  const [personnel, setPersonnel] = useState<PersonnelRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedRank, setSelectedRank] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, [searchTerm, selectedDept, selectedRank, selectedStatus, selectedGender]);

  const loadData = async () => {
    setLoading(true);
    const res = await storageService.getPersonnel({
      search: searchTerm,
      department: selectedDept,
      rank: selectedRank,
      status: selectedStatus,
      gender: selectedGender,
    });
    setPersonnel(res.data);
    setLoading(false);
  };

  const handleDelete = async (p: PersonnelRecord) => {
    if (confirm(`Are you sure you want to delete personnel record ${p.rank} ${p.surname} (${p.serviceNumber})?`)) {
      await storageService.deletePersonnel(p.id);
      loadData();
    }
  };

  const canEditRecord = (p: PersonnelRecord) => {
    if (user.role === 'Administrator') return true;
    if (user.role === 'HOD' && user.department === p.department) return true;
    return false;
  };

  const canDeleteRecord = () => {
    return user.role === 'Administrator';
  };

  // Pagination math
  const totalPages = Math.ceil(personnel.length / itemsPerPage) || 1;
  const paginatedPersonnel = personnel.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      
      {/* Top Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-emerald-950/80 border border-amber-500/30 text-white">
        <div>
          <h2 className="text-lg font-extrabold uppercase tracking-wide text-white">
            Personnel Records Database
          </h2>
          <p className="text-xs text-emerald-300">
            Regiment Worker Directory • Total Records: {personnel.length}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-add-personnel-list"
            onClick={onAddNew}
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs uppercase shadow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Worker</span>
          </button>

          <button
            id="btn-export-pdf"
            onClick={() => storageService.exportPersonnelPDF(personnel, `Roster Filtered (${selectedDept})`)}
            className="px-3 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5"
            title="Export Roster as PDF Document"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>PDF Report</span>
          </button>

          <button
            id="btn-export-excel"
            onClick={() => storageService.exportPersonnelExcel(personnel, '23SER_Personnel_Database')}
            className="px-3 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 text-xs font-semibold flex items-center gap-1.5"
            title="Export Roster as Excel/CSV Spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Excel (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        
        {/* Search Input */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-emerald-400 pointer-events-none" />
          <input
            id="input-search-personnel"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, S/N, rank..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-emerald-950 border border-emerald-700 text-xs text-white placeholder-emerald-600 focus:border-amber-400 focus:outline-none"
          />
        </div>

        {/* Department Select */}
        <div>
          <select
            id="select-filter-dept"
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg bg-emerald-950 border border-emerald-700 text-xs text-white focus:border-amber-400 focus:outline-none"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Rank Select */}
        <div>
          <select
            id="select-filter-rank"
            value={selectedRank}
            onChange={(e) => {
              setSelectedRank(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg bg-emerald-950 border border-emerald-700 text-xs text-white focus:border-amber-400 focus:outline-none"
          >
            <option value="All">All Ranks</option>
            {RANKS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Status Select */}
        <div>
          <select
            id="select-filter-status"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg bg-emerald-950 border border-emerald-700 text-xs text-white focus:border-amber-400 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Deployed">Deployed</option>
            <option value="On Leave">On Leave</option>
            <option value="Retired">Retired</option>
          </select>
        </div>

        {/* Gender Select */}
        <div>
          <select
            id="select-filter-gender"
            value={selectedGender}
            onChange={(e) => {
              setSelectedGender(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-lg bg-emerald-950 border border-emerald-700 text-xs text-white focus:border-amber-400 focus:outline-none"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

      </div>

      {/* Personnel Records Table */}
      <div className="bg-emerald-950/80 border border-emerald-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-white">
            
            {/* Table Header */}
            <thead>
              <tr className="bg-emerald-900/80 border-b border-emerald-800 text-amber-400 uppercase font-mono tracking-wider">
                <th className="p-3">Personnel</th>
                <th className="p-3">Service Number</th>
                <th className="p-3">Department</th>
                <th className="p-3">Appointment</th>
                <th className="p-3">Origin</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-emerald-900/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-emerald-400 font-mono">
                    Loading records from database...
                  </td>
                </tr>
              ) : paginatedPersonnel.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-emerald-400">
                    No personnel records match your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedPersonnel.map((p) => (
                  <tr key={p.id} className="hover:bg-emerald-900/40 transition-colors">
                    
                    {/* Personnel Info with Avatar */}
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.passportPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                          alt={p.surname}
                          className="w-9 h-9 rounded-full object-cover border border-amber-500/50"
                        />
                        <div>
                          <div className="font-bold text-white leading-tight">
                            {p.rank} {p.surname} {p.firstName}
                          </div>
                          <div className="text-[11px] text-emerald-400/80">
                            {p.tradeSpecialization}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Service Number */}
                    <td className="p-3 font-mono font-bold text-amber-300">
                      {p.serviceNumber}
                    </td>

                    {/* Department */}
                    <td className="p-3 font-medium text-emerald-200">
                      {p.department}
                    </td>

                    {/* Appointment */}
                    <td className="p-3 text-emerald-300">
                      {p.appointment}
                    </td>

                    {/* State of Origin */}
                    <td className="p-3 text-emerald-400">
                      {p.stateOfOrigin} State ({p.lga})
                    </td>

                    {/* Status Badge */}
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.employmentStatus === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : p.employmentStatus === 'Deployed'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            : p.employmentStatus === 'Retired'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-red-500/20 text-red-300 border border-red-500/40'
                        }`}
                      >
                        {p.employmentStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* View Profile */}
                        <button
                          id={`btn-view-${p.id}`}
                          onClick={() => onSelectPersonnel(p)}
                          className="p-1.5 rounded bg-emerald-900 hover:bg-emerald-800 text-emerald-200 hover:text-white"
                          title="View Full Personnel Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Record */}
                        {canEditRecord(p) && (
                          <button
                            id={`btn-edit-${p.id}`}
                            onClick={() => onEditPersonnel(p)}
                            className="p-1.5 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300"
                            title="Edit Personnel Record"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete Record */}
                        {canDeleteRecord() && (
                          <button
                            id={`btn-delete-${p.id}`}
                            onClick={() => handleDelete(p)}
                            className="p-1.5 rounded bg-red-950 hover:bg-red-900 text-red-400"
                            title="Delete Personnel Record (Admin Only)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer & Pagination */}
        <div className="p-3 bg-emerald-900/40 border-t border-emerald-800 flex items-center justify-between text-xs text-emerald-300">
          <div>
            Showing {paginatedPersonnel.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, personnel.length)} of {personnel.length} records
          </div>

          <div className="flex items-center gap-2 font-mono">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded bg-emerald-900 border border-emerald-700 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded bg-emerald-900 border border-emerald-700 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
