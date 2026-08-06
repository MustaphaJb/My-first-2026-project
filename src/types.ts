export interface ImageBanner {
  id: string;
  slotName: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  badgeText?: string;
  updatedAt: string;
  updatedBy: string;
}

export type Role = 'Administrator' | 'HOD';

export type MilitaryRank =
  | 'Brigadier General'
  | 'Colonel'
  | 'Lieutenant Colonel'
  | 'Major'
  | 'Captain'
  | 'Lieutenant'
  | 'Second Lieutenant'
  | 'Warrant Officer Class I'
  | 'Warrant Officer Class II'
  | 'Staff Sergeant'
  | 'Sergeant'
  | 'Corporal'
  | 'Lance Corporal'
  | 'Private';

export type DepartmentName =
  | 'Combat Engineering'
  | 'Field Engineering'
  | 'Plant & Heavy Equipment'
  | 'Survey & Mapping'
  | 'EOD & CBRN'
  | 'Signals & Tech'
  | 'Workshop & Maintenance'
  | 'Admin & Logistics'
  | 'Medical Services';

export type EmploymentStatus = 'Active' | 'Deployed' | 'On Leave' | 'Retired' | 'Transferred' | 'Suspended';

export interface PromotionRecord {
  rank: MilitaryRank;
  date: string;
  referenceNo: string;
}

export interface NextOfKin {
  name: string;
  relationship: string;
  phone: string;
  address: string;
}

export interface DocumentAttachment {
  id: string;
  name: string;
  type: 'Passport Photograph' | 'National ID' | 'Service ID' | 'Certificates' | 'Appointment Letter' | 'Promotion Letter' | 'Other';
  fileFormat: 'JPG' | 'PNG' | 'PDF';
  fileSize: string;
  uploadDate: string;
  fileUrl: string;
}

export interface PersonnelRecord {
  id: string;
  serviceNumber: string;
  rank: MilitaryRank;
  surname: string;
  firstName: string;
  middleName?: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  nationality: string;
  stateOfOrigin: string;
  lga: string;
  homeAddress: string;
  phoneNumber: string;
  email: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  religion: 'Christianity' | 'Islam' | 'Others';
  unit: string;
  department: DepartmentName;
  appointment: string;
  dateEnlisted: string;
  yearsOfService: number;
  currentPosting: string;
  previousPosting: string;
  tradeSpecialization: string;
  promotionHistory: PromotionRecord[];
  employmentStatus: EmploymentStatus;
  nextOfKin: NextOfKin;
  passportPhoto: string;
  documents: DocumentAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: DepartmentName;
  serviceNumber?: string;
  rank?: string;
  active: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  role: Role;
  action: string;
  details: string;
  ipAddress: string;
}

export interface LoginHistoryItem {
  id: string;
  timestamp: string;
  userEmail: string;
  role: Role;
  status: 'Success' | 'Failed';
  ipAddress: string;
  userAgent: string;
}

export interface SystemSettings {
  regimentName: string;
  motto: string;
  sessionTimeoutMinutes: number;
  requirePasswordComplexity: boolean;
  allowHodPhotoUpload: boolean;
  autoBackupEnabled: boolean;
  backupFrequencyHours: number;
  maintenanceMode: boolean;
  auditLoggingEnabled: boolean;
}

export interface TableSummary {
  name: string;
  rowCount: number;
  sizeKb: number;
  description: string;
}

export interface DatabaseStats {
  totalUsers: number;
  totalDepartments: number;
  totalPersonnel: number;
  totalDocuments: number;
  totalAuditLogs: number;
  databaseSizeBytes: number;
  lastBackupDate: string;
  tables: TableSummary[];
}
