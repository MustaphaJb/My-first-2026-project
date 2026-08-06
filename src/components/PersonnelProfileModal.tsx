import React, { useState } from 'react';
import { PersonnelRecord, User, DocumentAttachment } from '../types';
import { storageService } from '../services/storageService';
import {
  X,
  Printer,
  Download,
  Edit,
  Shield,
  FileText,
  Upload,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Heart,
  Award,
  UserCheck,
} from 'lucide-react';

interface PersonnelProfileModalProps {
  personnel: PersonnelRecord;
  user: User;
  onClose: () => void;
  onEdit: () => void;
  onReload: () => void;
}

export const PersonnelProfileModal: React.FC<PersonnelProfileModalProps> = ({
  personnel,
  user,
  onClose,
  onEdit,
  onReload,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'promotions'>('profile');
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<any>('Service ID');

  const canEdit =
    user.role === 'Administrator' ||
    (user.role === 'HOD' && user.department === personnel.department);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    storageService.exportSinglePersonnelPDF(personnel);
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) return;

    setUploadingDoc(true);
    await storageService.addPersonnelDocument(personnel.id, {
      name: docName,
      type: docType,
      fileFormat: 'PDF',
      fileSize: '1.4 MB',
    });
    setUploadingDoc(false);
    setDocName('');
    onReload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      
      <div className="bg-emerald-950 border-2 border-amber-500/40 rounded-2xl w-full max-w-4xl text-white shadow-2xl overflow-hidden my-8">
        
        {/* Top Gold Trim */}
        <div className="h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-emerald-900/60 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                Personnel Profile Record
              </h2>
              <p className="text-xs text-amber-400 font-mono">
                23 Support Engineer Regiment Jos • Restricted Clearance
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="btn-profile-print"
              onClick={handlePrint}
              className="p-2 rounded bg-emerald-900 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700 text-xs flex items-center gap-1"
              title="Print Profile Page"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              id="btn-profile-download-pdf"
              onClick={handleDownloadPDF}
              className="p-2 rounded bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs flex items-center gap-1"
              title="Download Official PDF Profile"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            {canEdit && (
              <button
                id="btn-profile-edit"
                onClick={onEdit}
                className="p-2 rounded bg-emerald-800 hover:bg-emerald-700 text-amber-300 text-xs flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}

            <button
              id="btn-profile-close"
              onClick={onClose}
              className="p-2 rounded bg-red-950 hover:bg-red-900 text-red-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-emerald-900 bg-emerald-950 px-6 pt-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-emerald-400 hover:text-white'
            }`}
          >
            Personal & Service Details
          </button>
          <button
            onClick={() => setActiveTab('promotions')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'promotions'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-emerald-400 hover:text-white'
            }`}
          >
            Promotion History
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'documents'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-emerald-400 hover:text-white'
            }`}
          >
            Uploaded Documents ({personnel.documents?.length || 0})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {activeTab === 'profile' && (
            <>
              {/* Profile Header Banner */}
              <div className="p-5 rounded-xl bg-emerald-900/50 border border-emerald-800 flex flex-col sm:flex-row items-center gap-6">
                
                <img
                  src={personnel.passportPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'}
                  alt={personnel.surname}
                  className="w-28 h-32 rounded-xl object-cover border-2 border-amber-400 shadow-md flex-shrink-0"
                />

                <div className="flex-1 text-center sm:text-left">
                  <div className="inline-block px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-xs uppercase mb-1">
                    Service No: {personnel.serviceNumber}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {personnel.rank} {personnel.surname} {personnel.firstName} {personnel.middleName || ''}
                  </h3>
                  <p className="text-sm font-semibold text-emerald-300 mt-0.5">
                    {personnel.appointment} • {personnel.department}
                  </p>
                  
                  <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                      Unit: {personnel.unit}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-amber-300 border border-amber-500/40">
                      Enlisted: {personnel.dateEnlisted} ({personnel.yearsOfService} Yrs Service)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-sky-300 border border-sky-500/40">
                      Status: {personnel.employmentStatus}
                    </span>
                  </div>
                </div>

              </div>

              {/* Data Grid Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Personal Information */}
                <div className="p-4 rounded-xl bg-emerald-900/30 border border-emerald-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-emerald-800 pb-2">
                    Personal Information
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-emerald-400 block">Gender:</span>
                      <span className="font-semibold text-white">{personnel.gender}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 block">Date of Birth:</span>
                      <span className="font-semibold text-white">{personnel.dateOfBirth}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 block">Marital Status:</span>
                      <span className="font-semibold text-white">{personnel.maritalStatus}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 block">Blood Group:</span>
                      <span className="font-semibold text-white">{personnel.bloodGroup}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 block">State of Origin:</span>
                      <span className="font-semibold text-white">{personnel.stateOfOrigin}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 block">L.G.A:</span>
                      <span className="font-semibold text-white">{personnel.lga}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 block">Religion:</span>
                      <span className="font-semibold text-white">{personnel.religion}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 block">Nationality:</span>
                      <span className="font-semibold text-white">{personnel.nationality}</span>
                    </div>
                  </div>

                  <div className="text-xs pt-1">
                    <span className="text-emerald-400 block">Home Address:</span>
                    <span className="font-semibold text-white">{personnel.homeAddress}</span>
                  </div>

                  <div className="text-xs flex gap-4 pt-1 border-t border-emerald-800/60">
                    <div>
                      <span className="text-emerald-400 block">Phone:</span>
                      <span className="font-mono text-white">{personnel.phoneNumber}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 block">Email:</span>
                      <span className="font-mono text-white">{personnel.email}</span>
                    </div>
                  </div>
                </div>

                {/* Service & Posting Information */}
                <div className="p-4 rounded-xl bg-emerald-900/30 border border-emerald-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-emerald-800 pb-2">
                    Service & Posting Information
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-emerald-400 block">Trade / Specialization:</span>
                      <span className="font-semibold text-amber-300">{personnel.tradeSpecialization}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 block">Current Posting:</span>
                      <span className="font-semibold text-white">{personnel.currentPosting}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 block">Previous Posting:</span>
                      <span className="font-semibold text-white">{personnel.previousPosting}</span>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="pt-3 border-t border-emerald-800/80 space-y-2">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Emergency Contact (Next of Kin)
                    </h5>
                    <div className="text-xs space-y-1">
                      <div>
                        <span className="text-emerald-400">Name: </span>
                        <span className="font-bold text-white">{personnel.nextOfKin?.name}</span> (
                        <span className="text-amber-300">{personnel.nextOfKin?.relationship}</span>)
                      </div>
                      <div>
                        <span className="text-emerald-400">Phone: </span>
                        <span className="font-mono text-white">{personnel.nextOfKin?.phone}</span>
                      </div>
                      <div>
                        <span className="text-emerald-400">Address: </span>
                        <span className="text-white">{personnel.nextOfKin?.address}</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </>
          )}

          {activeTab === 'promotions' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wide text-amber-400">
                Official Promotion & Career Progression History
              </h4>

              <div className="bg-emerald-900/40 border border-emerald-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs text-white">
                  <thead className="bg-emerald-900 text-amber-400 uppercase font-mono">
                    <tr>
                      <th className="p-3">Rank Achieved</th>
                      <th className="p-3">Effective Date</th>
                      <th className="p-3">Army Gazette Reference No</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-800/60">
                    {personnel.promotionHistory?.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-4 text-center text-emerald-400">
                          No promotion history recorded yet.
                        </td>
                      </tr>
                    ) : (
                      personnel.promotionHistory.map((p, idx) => (
                        <tr key={idx} className="hover:bg-emerald-900/60">
                          <td className="p-3 font-bold text-amber-300">{p.rank}</td>
                          <td className="p-3 text-emerald-200">{p.date}</td>
                          <td className="p-3 font-mono text-emerald-400">{p.referenceNo}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wide text-amber-400">
                  Uploaded Verification Attachments
                </h4>
              </div>

              {/* Upload Form */}
              <form onSubmit={handleAddDocument} className="p-3 rounded-xl bg-emerald-900/50 border border-emerald-800 flex flex-wrap gap-2 items-center">
                <input
                  type="text"
                  required
                  placeholder="Document Name (e.g. Service_ID_Card.pdf)"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="px-3 py-1.5 rounded bg-emerald-950 border border-emerald-700 text-xs text-white flex-1 min-w-[200px]"
                />
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="px-3 py-1.5 rounded bg-emerald-950 border border-emerald-700 text-xs text-white"
                >
                  <option value="Passport Photograph">Passport Photograph</option>
                  <option value="National ID">National ID</option>
                  <option value="Service ID">Service ID</option>
                  <option value="Certificates">Certificates</option>
                  <option value="Appointment Letter">Appointment Letter</option>
                  <option value="Promotion Letter">Promotion Letter</option>
                </select>
                <button
                  type="submit"
                  disabled={uploadingDoc}
                  className="px-3 py-1.5 bg-amber-500 text-emerald-950 font-bold rounded text-xs uppercase flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Doc</span>
                </button>
              </form>

              {/* Document Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {personnel.documents?.length === 0 ? (
                  <div className="col-span-2 p-6 text-center text-emerald-400">
                    No document attachments uploaded for this personnel yet.
                  </div>
                ) : (
                  personnel.documents.map((doc: DocumentAttachment) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-lg bg-emerald-900/30 border border-emerald-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-amber-400" />
                        <div>
                          <div className="font-bold text-white">{doc.name}</div>
                          <div className="text-[10px] text-emerald-400">
                            {doc.type} • {doc.fileFormat} • {doc.fileSize}
                          </div>
                        </div>
                      </div>

                      <a
                        href={doc.fileUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded bg-emerald-900 hover:bg-emerald-800 text-amber-300 text-[11px] font-mono border border-amber-500/30"
                      >
                        View / Download
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
