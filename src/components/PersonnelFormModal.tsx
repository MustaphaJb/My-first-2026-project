import React, { useState } from 'react';
import { PersonnelRecord, DepartmentName, MilitaryRank, EmploymentStatus } from '../types';
import { storageService } from '../services/storageService';
import { X, Save, Shield, User, MapPin, Phone, Briefcase, FilePlus } from 'lucide-react';

interface PersonnelFormModalProps {
  personnelToEdit?: PersonnelRecord | null;
  onClose: () => void;
  onSuccess: () => void;
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

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT Abuja'
];

export const PersonnelFormModal: React.FC<PersonnelFormModalProps> = ({
  personnelToEdit,
  onClose,
  onSuccess,
}) => {
  const isEditing = !!personnelToEdit;

  const [formData, setFormData] = useState<Partial<PersonnelRecord>>({
    serviceNumber: personnelToEdit?.serviceNumber || `23SER/OR/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
    rank: personnelToEdit?.rank || 'Corporal',
    surname: personnelToEdit?.surname || '',
    firstName: personnelToEdit?.firstName || '',
    middleName: personnelToEdit?.middleName || '',
    gender: personnelToEdit?.gender || 'Male',
    dateOfBirth: personnelToEdit?.dateOfBirth || '1995-05-12',
    nationality: personnelToEdit?.nationality || 'Nigerian',
    stateOfOrigin: personnelToEdit?.stateOfOrigin || 'Plateau',
    lga: personnelToEdit?.lga || 'Jos North',
    homeAddress: personnelToEdit?.homeAddress || 'Rukuba Barracks, Jos',
    phoneNumber: personnelToEdit?.phoneNumber || '+234 803 000 0000',
    email: personnelToEdit?.email || 'worker@army.mil.ng',
    maritalStatus: personnelToEdit?.maritalStatus || 'Single',
    bloodGroup: personnelToEdit?.bloodGroup || 'O+',
    religion: personnelToEdit?.religion || 'Christianity',
    unit: personnelToEdit?.unit || '23 Support Engineer Regiment Jos',
    department: personnelToEdit?.department || 'Field Engineering',
    appointment: personnelToEdit?.appointment || 'Field Specialist',
    dateEnlisted: personnelToEdit?.dateEnlisted || '2018-09-01',
    yearsOfService: personnelToEdit?.yearsOfService || 8,
    currentPosting: personnelToEdit?.currentPosting || '23 SER HQ Jos',
    previousPosting: personnelToEdit?.previousPosting || '1 Engr Kaduna',
    tradeSpecialization: personnelToEdit?.tradeSpecialization || 'Combat Engineering Operations',
    employmentStatus: personnelToEdit?.employmentStatus || 'Active',
    nextOfKin: personnelToEdit?.nextOfKin || {
      name: '',
      relationship: 'Next of Kin',
      phone: '',
      address: '',
    },
    passportPhoto: personnelToEdit?.passportPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    documents: personnelToEdit?.documents || [],
    promotionHistory: personnelToEdit?.promotionHistory || [],
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleNextOfKinChange = (field: string, val: any) => {
    setFormData((prev) => ({
      ...prev,
      nextOfKin: { ...prev.nextOfKin!, [field]: val },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.surname || !formData.firstName || !formData.serviceNumber) {
      setError('Please fill in required fields: Surname, First Name, and Service Number.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isEditing && personnelToEdit) {
        await storageService.updatePersonnel(personnelToEdit.id, formData);
      } else {
        await storageService.createPersonnel(formData);
      }
      setSaving(false);
      onSuccess();
    } catch (err: any) {
      setSaving(false);
      setError(err.message || 'Failed to save personnel record.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-emerald-950 border-2 border-amber-500/40 rounded-2xl w-full max-w-4xl text-white shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-emerald-900/60 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                {isEditing ? 'Edit Personnel Record' : 'Register New Personnel'}
              </h2>
              <p className="text-xs text-amber-400 font-mono">
                23 Support Engineer Regiment Jos • Master Database Entry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded bg-red-950 hover:bg-red-900 text-red-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs">
          
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-500 text-red-200 rounded">
              {error}
            </div>
          )}

          {/* Section 1: Personal Information */}
          <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-emerald-800 pb-2">
              1. Personal Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">Service Number *</label>
                <input
                  type="text"
                  required
                  value={formData.serviceNumber}
                  onChange={(e) => handleChange('serviceNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Military Rank *</label>
                <select
                  value={formData.rank}
                  onChange={(e) => handleChange('rank', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white"
                >
                  {RANKS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">Surname (Upper Case) *</label>
                <input
                  type="text"
                  required
                  value={formData.surname}
                  onChange={(e) => handleChange('surname', e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Middle Name</label>
                <input
                  type="text"
                  value={formData.middleName || ''}
                  onChange={(e) => handleChange('middleName', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">State of Origin</label>
                <select
                  value={formData.stateOfOrigin}
                  onChange={(e) => handleChange('stateOfOrigin', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white"
                >
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Local Govt Area (LGA)</label>
                <input
                  type="text"
                  value={formData.lga}
                  onChange={(e) => handleChange('lga', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Marital Status</label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) => handleChange('maritalStatus', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => handleChange('bloodGroup', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white"
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white font-mono"
                />
              </div>
            </div>

          </div>

          {/* Section 2: Service & Unit Information */}
          <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-emerald-800 pb-2">
              2. Service & Departmental Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">Regiment Department *</label>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Appointment Role</label>
                <input
                  type="text"
                  value={formData.appointment}
                  onChange={(e) => handleChange('appointment', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Employment Status</label>
                <select
                  value={formData.employmentStatus}
                  onChange={(e) => handleChange('employmentStatus', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Deployed">Deployed</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Retired">Retired</option>
                  <option value="Transferred">Transferred</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">Date Enlisted</label>
                <input
                  type="date"
                  value={formData.dateEnlisted}
                  onChange={(e) => handleChange('dateEnlisted', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Years of Service</label>
                <input
                  type="number"
                  value={formData.yearsOfService}
                  onChange={(e) => handleChange('yearsOfService', parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Trade Specialization</label>
                <input
                  type="text"
                  value={formData.tradeSpecialization}
                  onChange={(e) => handleChange('tradeSpecialization', e.target.value)}
                  placeholder="e.g. Demolition & EOD Specialist"
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">Current Posting Base</label>
                <input
                  type="text"
                  value={formData.currentPosting}
                  onChange={(e) => handleChange('currentPosting', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Passport Photograph URL</label>
                <input
                  type="text"
                  value={formData.passportPhoto}
                  onChange={(e) => handleChange('passportPhoto', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white font-mono"
                />
              </div>
            </div>

          </div>

          {/* Section 3: Emergency Contact */}
          <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-emerald-800 pb-2">
              3. Next of Kin & Emergency Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-emerald-300 font-bold mb-1">Next of Kin Full Name</label>
                <input
                  type="text"
                  value={formData.nextOfKin?.name || ''}
                  onChange={(e) => handleNextOfKinChange('name', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Relationship</label>
                <input
                  type="text"
                  value={formData.nextOfKin?.relationship || ''}
                  onChange={(e) => handleNextOfKinChange('relationship', e.target.value)}
                  placeholder="Wife, Brother, Father, etc."
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-bold mb-1">Emergency Phone</label>
                <input
                  type="text"
                  value={formData.nextOfKin?.phone || ''}
                  onChange={(e) => handleNextOfKinChange('phone', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-700 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-emerald-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-emerald-900 hover:bg-emerald-800 text-emerald-300 text-xs font-bold uppercase"
            >
              Cancel
            </button>

            <button
              id="btn-save-personnel"
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold text-xs uppercase shadow flex items-center gap-1.5"
            >
              {saving ? (
                <span>Saving Record...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Register Personnel'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
