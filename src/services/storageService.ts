import {
  User,
  PersonnelRecord,
  DepartmentName,
  AuditLog,
  LoginHistoryItem,
  SystemSettings,
  DatabaseStats,
  ImageBanner,
} from '../types';
import {
  INITIAL_PERSONNEL,
  INITIAL_USERS,
  INITIAL_DEPARTMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_LOGIN_HISTORY,
  INITIAL_SYSTEM_SETTINGS,
} from '../data/mockData';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AUTH_KEY = '23SER_AUTH_USER';
const TOKEN_KEY = '23SER_AUTH_TOKEN';
const LOCAL_PERSONNEL_KEY = '23SER_PERSONNEL_DATA';
const LOCAL_USERS_KEY = '23SER_USERS_DATA';
const LOCAL_SETTINGS_KEY = '23SER_SETTINGS_DATA';
const LOCAL_BANNERS_KEY = '23SER_BANNERS_DATA';

const INITIAL_BANNERS: ImageBanner[] = [
  {
    id: 'banner_slot_1',
    slotName: 'Center Banner Spot 1 (Command Headquarters)',
    title: '23 SUPPORT ENGINEER REGIMENT HEADQUARTERS',
    subtitle: 'Official Nigerian Army Engineers Command & Personnel Management Center — Jos, Plateau State',
    badgeText: 'COMMAND HEADQUARTERS',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=80',
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Command',
  },
  {
    id: 'banner_slot_2',
    slotName: 'Center Banner Spot 2 (Tactical Field Ops)',
    title: 'COMBAT & FIELD ENGINEERING OPERATIONS',
    subtitle: 'Tactical Engineering Support, Rapid Infrastructure Deployment, EOD & CBRN Response Unit',
    badgeText: 'FIELD OPERATIONS',
    imageUrl: 'https://images.unsplash.com/photo-1579912437766-7892db633929?auto=format&fit=crop&w=1600&q=80',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Operations Officer',
  },
];

class StorageService {
  private currentUser: User | null = null;
  private token: string | null = null;

  constructor() {
    this.loadSession();
  }

  private loadSession() {
    const savedUser = localStorage.getItem(AUTH_KEY);
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (savedUser && savedToken) {
      try {
        this.currentUser = JSON.parse(savedUser);
        this.token = savedToken;
      } catch (e) {
        this.logout();
      }
    }
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public getToken(): string | null {
    return this.token;
  }

  public isAuthenticated(): boolean {
    return !!this.currentUser && !!this.token;
  }

  public async login(email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        this.currentUser = data.user;
        this.token = data.token;
        localStorage.setItem(AUTH_KEY, JSON.stringify(data.user));
        localStorage.setItem(TOKEN_KEY, data.token);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err) {
      // Fallback in-memory auth for resilience
      const localUsers = this.getLocalUsers();
      const user = localUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user && user.active) {
        this.currentUser = user;
        this.token = `local_token_${user.id}`;
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        localStorage.setItem(TOKEN_KEY, this.token);
        return { success: true, user };
      }
      return { success: false, message: 'Invalid credentials or connection error' };
    }
  }

  public logout(): void {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }

  // ================= PERSONNEL DATA =================

  public async getPersonnel(filters?: {
    search?: string;
    department?: string;
    rank?: string;
    status?: string;
    gender?: string;
  }): Promise<{ totalRecords: number; data: PersonnelRecord[] }> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.department) params.append('department', filters.department);
      if (filters?.rank) params.append('rank', filters.rank);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.gender) params.append('gender', filters.gender);

      const res = await fetch(`/api/personnel?${params.toString()}`);
      const result = await res.json();
      if (result.success) {
        return { totalRecords: result.totalRecords, data: result.data };
      }
    } catch (err) {
      console.warn('Using local personnel data fallback');
    }

    // Local fallback
    let list = this.getLocalPersonnel();
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.surname.toLowerCase().includes(q) ||
          p.firstName.toLowerCase().includes(q) ||
          p.serviceNumber.toLowerCase().includes(q) ||
          p.rank.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q) ||
          p.stateOfOrigin.toLowerCase().includes(q)
      );
    }
    if (filters?.department && filters.department !== 'All') {
      list = list.filter((p) => p.department === filters.department);
    }
    if (filters?.rank && filters.rank !== 'All') {
      list = list.filter((p) => p.rank === filters.rank);
    }
    if (filters?.status && filters.status !== 'All') {
      list = list.filter((p) => p.employmentStatus === filters.status);
    }
    if (filters?.gender && filters.gender !== 'All') {
      list = list.filter((p) => p.gender === filters.gender);
    }

    return { totalRecords: list.length, data: list };
  }

  public async getPersonnelById(id: string): Promise<PersonnelRecord | null> {
    try {
      const res = await fetch(`/api/personnel/${id}`);
      const data = await res.json();
      if (data.success) return data.data;
    } catch (err) {
      // fallback
    }
    return this.getLocalPersonnel().find((p) => p.id === id) || null;
  }

  public async createPersonnel(record: Partial<PersonnelRecord>): Promise<PersonnelRecord> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.currentUser) headers['x-user-email'] = this.currentUser.email;

    try {
      const res = await fetch('/api/personnel', {
        method: 'POST',
        headers,
        body: JSON.stringify(record),
      });
      const data = await res.json();
      if (data.success) {
        return data.data;
      }
    } catch (e) {
      console.warn('API error, saving locally');
    }

    const newRecord: PersonnelRecord = {
      ...(record as any),
      id: `pers-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: record.documents || [],
      promotionHistory: record.promotionHistory || [],
      unit: '23 Support Engineer Regiment Jos',
    };

    const current = this.getLocalPersonnel();
    current.unshift(newRecord);
    this.saveLocalPersonnel(current);
    return newRecord;
  }

  public async updatePersonnel(id: string, record: Partial<PersonnelRecord>): Promise<PersonnelRecord> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.currentUser) headers['x-user-email'] = this.currentUser.email;

    try {
      const res = await fetch(`/api/personnel/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(record),
      });
      const data = await res.json();
      if (data.success) return data.data;
    } catch (e) {
      console.warn('API error, updating locally');
    }

    const list = this.getLocalPersonnel();
    const idx = list.findIndex((p) => p.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...record, updatedAt: new Date().toISOString() };
      this.saveLocalPersonnel(list);
      return list[idx];
    }
    throw new Error('Record not found');
  }

  public async deletePersonnel(id: string): Promise<boolean> {
    const headers: Record<string, string> = {};
    if (this.currentUser) headers['x-user-email'] = this.currentUser.email;

    try {
      const res = await fetch(`/api/personnel/${id}`, { method: 'DELETE', headers });
      const data = await res.json();
      if (data.success) return true;
    } catch (e) {
      console.warn('API error, deleting locally');
    }

    let list = this.getLocalPersonnel();
    list = list.filter((p) => p.id !== id);
    this.saveLocalPersonnel(list);
    return true;
  }

  public async addPersonnelDocument(personnelId: string, doc: any): Promise<any> {
    try {
      const res = await fetch(`/api/personnel/${personnelId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      });
      const data = await res.json();
      if (data.success) return data.document;
    } catch (e) {
      // fallback
    }
    return {
      id: `doc-${Date.now()}`,
      name: doc.name || 'Document.pdf',
      type: doc.type || 'Other',
      fileFormat: doc.fileFormat || 'PDF',
      fileSize: doc.fileSize || '1.0 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      fileUrl: doc.fileUrl || '#',
    };
  }

  // ================= USERS & HOD MANAGEMENT =================

  public async getUsers(): Promise<User[]> {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) return data.data;
    } catch (e) {
      // fallback
    }
    return this.getLocalUsers();
  }

  public async createUser(user: Partial<User>): Promise<User> {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (data.success) return data.data;
      throw new Error(data.message);
    } catch (e: any) {
      if (e.message) throw e;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: user.name || 'New User',
      email: user.email || 'user@army.mil.ng',
      role: user.role || 'HOD',
      department: user.department,
      serviceNumber: user.serviceNumber,
      rank: user.rank,
      active: true,
      createdAt: new Date().toISOString(),
    };
    const list = this.getLocalUsers();
    list.push(newUser);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(list));
    return newUser;
  }

  public async updateUser(id: string, updates: Partial<User>): Promise<User> {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) return data.data;
    } catch (e) {
      // fallback
    }

    const list = this.getLocalUsers();
    const idx = list.findIndex((u) => u.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(list));
      return list[idx];
    }
    throw new Error('User not found');
  }

  public async deleteUser(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) return true;
    } catch (e) {
      // fallback
    }
    let list = this.getLocalUsers();
    list = list.filter((u) => u.id !== id);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(list));
    return true;
  }

  // ================= DASHBOARD & STATS =================

  public async getDashboardStats(): Promise<any> {
    try {
      const res = await fetch('/api/dashboard/stats');
      const data = await res.json();
      if (data.success) return data;
    } catch (e) {
      // fallback
    }

    const list = this.getLocalPersonnel();
    const active = list.filter((p) => p.employmentStatus === 'Active').length;
    const retired = list.filter((p) => p.employmentStatus === 'Retired').length;
    const deployed = list.filter((p) => p.employmentStatus === 'Deployed').length;

    return {
      stats: {
        totalPersonnel: list.length,
        totalDepartments: INITIAL_DEPARTMENTS.length,
        activePersonnel: active,
        retiredPersonnel: retired,
        deployedPersonnel: deployed,
        newlyAddedCount: list.filter((p) => new Date(p.createdAt).getFullYear() >= 2024).length,
      },
      charts: {
        byDepartment: INITIAL_DEPARTMENTS.map((d) => ({
          name: d.name,
          shortName: d.code,
          count: list.filter((p) => p.department === d.name).length,
        })),
        byRank: [
          { rank: 'Lieutenants & Captains', count: 6 },
          { rank: 'Majors & Lt Cols', count: 4 },
          { rank: 'Warrant Officers', count: 5 },
          { rank: 'Sergeants & Corporals', count: 12 },
        ],
        byGender: [
          { name: 'Male', count: list.filter((p) => p.gender === 'Male').length },
          { name: 'Female', count: list.filter((p) => p.gender === 'Female').length },
        ],
        byStatus: [
          { name: 'Active', count: active },
          { name: 'Deployed', count: deployed },
          { name: 'Retired', count: retired },
        ],
      },
      recentActivities: INITIAL_AUDIT_LOGS.slice(0, 5),
    };
  }

  // ================= AUDIT LOGS & LOGIN HISTORY =================

  public async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const res = await fetch('/api/audit-logs');
      const data = await res.json();
      if (data.success) return data.data;
    } catch (e) {
      // fallback
    }
    return INITIAL_AUDIT_LOGS;
  }

  public async getLoginHistory(): Promise<LoginHistoryItem[]> {
    try {
      const res = await fetch('/api/login-history');
      const data = await res.json();
      if (data.success) return data.data;
    } catch (e) {
      // fallback
    }
    return INITIAL_LOGIN_HISTORY;
  }

  // ================= DATABASE DASHBOARD STATS & BACKUP =================

  public async getDatabaseStats(): Promise<DatabaseStats> {
    try {
      const res = await fetch('/api/db/stats');
      const data = await res.json();
      if (data.success) return data.data;
    } catch (e) {
      // fallback
    }

    const list = this.getLocalPersonnel();
    const users = this.getLocalUsers();
    return {
      totalUsers: users.length,
      totalDepartments: INITIAL_DEPARTMENTS.length,
      totalPersonnel: list.length,
      totalDocuments: list.reduce((acc, p) => acc + (p.documents?.length || 0), 0),
      totalAuditLogs: INITIAL_AUDIT_LOGS.length,
      databaseSizeBytes: list.length * 2048,
      lastBackupDate: new Date().toISOString(),
      tables: [
        { name: 'users', rowCount: users.length, sizeKb: 12, description: 'Authentication accounts & HOD records' },
        { name: 'departments', rowCount: INITIAL_DEPARTMENTS.length, sizeKb: 4, description: 'Regiment organizational units' },
        { name: 'personnel', rowCount: list.length, sizeKb: 84, description: 'Service personnel master table' },
        { name: 'documents', rowCount: 18, sizeKb: 36, description: 'Personnel uploaded verification files' },
        { name: 'audit_logs', rowCount: INITIAL_AUDIT_LOGS.length, sizeKb: 14, description: 'System audit logs' },
        { name: 'login_history', rowCount: INITIAL_LOGIN_HISTORY.length, sizeKb: 8, description: 'Authentication activity records' },
      ],
    };
  }

  public async queryTable(tableName: string): Promise<any[]> {
    try {
      const res = await fetch('/api/db/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableName, action: 'SELECT_ALL' }),
      });
      const data = await res.json();
      if (data.success) return data.data;
    } catch (e) {
      // fallback
    }

    if (tableName === 'users') return this.getLocalUsers();
    if (tableName === 'departments') return INITIAL_DEPARTMENTS;
    if (tableName === 'personnel') return this.getLocalPersonnel();
    if (tableName === 'audit_logs') return INITIAL_AUDIT_LOGS;
    if (tableName === 'login_history') return INITIAL_LOGIN_HISTORY;
    return [];
  }

  public async downloadBackupJSON(): Promise<void> {
    try {
      window.open('/api/backup/export', '_blank');
    } catch (e) {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.getLocalPersonnel(), null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `23SER_LocalBackup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  }

  public async restoreBackup(jsonData: any): Promise<boolean> {
    try {
      const res = await fetch('/api/backup/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      });
      const data = await res.json();
      if (data.success) return true;
    } catch (e) {
      if (jsonData.tables?.personnel) {
        this.saveLocalPersonnel(jsonData.tables.personnel);
        return true;
      }
    }
    return false;
  }

  // ================= SYSTEM SETTINGS =================

  public async getSettings(): Promise<SystemSettings> {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) return data.data;
    } catch (e) {
      // fallback
    }
    const saved = localStorage.getItem(LOCAL_SETTINGS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_SETTINGS;
  }

  public async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) return data.data;
    } catch (e) {
      // fallback
    }
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  }

  // ================= EXPORT HELPERS (PDF & EXCEL/CSV) =================

  public exportPersonnelPDF(personnelList: PersonnelRecord[], reportTitle = 'Regiment Personnel Master Roster'): void {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Military Header Colors
    doc.setFillColor(6, 78, 59); // Emerald 900
    doc.rect(0, 0, 297, 24, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('23 SUPPORT ENGINEER REGIMENT JOS', 14, 12);

    doc.setFontSize(10);
    doc.setTextColor(251, 191, 36); // Amber
    doc.text(`NIGERIAN ARMY ENGINEERS • ${reportTitle.toUpperCase()}`, 14, 18);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(`DATE: ${new Date().toLocaleDateString()} | CLASSIFICATION: CONFIDENTIAL`, 220, 15);

    // Table Data
    const tableRows = personnelList.map((p, idx) => [
      idx + 1,
      p.serviceNumber,
      p.rank,
      `${p.surname}, ${p.firstName}`,
      p.gender,
      p.department,
      p.tradeSpecialization,
      p.currentPosting,
      p.employmentStatus,
      p.phoneNumber,
    ]);

    autoTable(doc, {
      startY: 28,
      head: [['S/N', 'Service No', 'Rank', 'Full Name', 'Gender', 'Department', 'Specialization', 'Posting', 'Status', 'Phone']],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 58, 138], // Dark Blue
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [243, 244, 246],
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
    });

    // Save
    doc.save(`23SER_Personnel_Report_${Date.now()}.pdf`);
  }

  public exportSinglePersonnelPDF(p: PersonnelRecord): void {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Header Bar
    doc.setFillColor(6, 78, 59);
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('23 SUPPORT ENGINEER REGIMENT JOS', 14, 14);

    doc.setFontSize(11);
    doc.setTextColor(251, 191, 36);
    doc.text('OFFICIAL PERSONNEL SERVICE RECORD', 14, 22);

    // Profile Details Table
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(14);
    doc.text(`${p.rank} ${p.surname} ${p.firstName} ${p.middleName || ''}`, 14, 40);

    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text(`Service No: ${p.serviceNumber} | Unit: ${p.unit}`, 14, 46);

    autoTable(doc, {
      startY: 52,
      head: [['Category', 'Details']],
      body: [
        ['Service Number', p.serviceNumber],
        ['Rank', p.rank],
        ['Full Name', `${p.surname} ${p.firstName} ${p.middleName || ''}`],
        ['Gender / Marital Status', `${p.gender} / ${p.maritalStatus}`],
        ['Date of Birth', `${p.dateOfBirth} (Blood Group: ${p.bloodGroup})`],
        ['State of Origin / LGA', `${p.stateOfOrigin} / ${p.lga}`],
        ['Department', p.department],
        ['Appointment', p.appointment],
        ['Date Enlisted / Service Yrs', `${p.dateEnlisted} (${p.yearsOfService} Years)`],
        ['Trade Specialization', p.tradeSpecialization],
        ['Current Posting', p.currentPosting],
        ['Previous Posting', p.previousPosting],
        ['Employment Status', p.employmentStatus],
        ['Contact Phone / Email', `${p.phoneNumber} | ${p.email}`],
        ['Next of Kin', `${p.nextOfKin.name} (${p.nextOfKin.relationship}) - ${p.nextOfKin.phone}`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [30, 58, 138] },
      styles: { fontSize: 9 },
    });

    doc.save(`Personnel_Record_${p.serviceNumber.replace(/\//g, '_')}.pdf`);
  }

  public exportPersonnelExcel(personnelList: PersonnelRecord[], filename = '23SER_Personnel_Database'): void {
    const headers = [
      'S/N',
      'Service Number',
      'Rank',
      'Surname',
      'First Name',
      'Middle Name',
      'Gender',
      'Date of Birth',
      'State of Origin',
      'LGA',
      'Department',
      'Appointment',
      'Date Enlisted',
      'Years of Service',
      'Current Posting',
      'Specialization',
      'Status',
      'Phone Number',
      'Email',
      'Next of Kin Name',
      'Next of Kin Phone',
    ];

    const rows = personnelList.map((p, i) => [
      i + 1,
      `"${p.serviceNumber}"`,
      `"${p.rank}"`,
      `"${p.surname}"`,
      `"${p.firstName}"`,
      `"${p.middleName || ''}"`,
      `"${p.gender}"`,
      `"${p.dateOfBirth}"`,
      `"${p.stateOfOrigin}"`,
      `"${p.lga}"`,
      `"${p.department}"`,
      `"${p.appointment}"`,
      `"${p.dateEnlisted}"`,
      p.yearsOfService,
      `"${p.currentPosting}"`,
      `"${p.tradeSpecialization}"`,
      `"${p.employmentStatus}"`,
      `"${p.phoneNumber}"`,
      `"${p.email}"`,
      `"${p.nextOfKin.name}"`,
      `"${p.nextOfKin.phone}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ================= IMAGE BANNERS (CENTER DASHBOARD) =================
  public getBanners(): ImageBanner[] {
    const data = localStorage.getItem(LOCAL_BANNERS_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_BANNERS_KEY, JSON.stringify(INITIAL_BANNERS));
      return INITIAL_BANNERS;
    }
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length >= 2) {
        return parsed;
      }
    } catch (e) {
      // Fallback
    }
    return INITIAL_BANNERS;
  }

  public saveBanner(updatedBanner: ImageBanner): ImageBanner[] {
    const banners = this.getBanners();
    const index = banners.findIndex((b) => b.id === updatedBanner.id);
    if (index >= 0) {
      banners[index] = updatedBanner;
    } else {
      banners.push(updatedBanner);
    }
    localStorage.setItem(LOCAL_BANNERS_KEY, JSON.stringify(banners));
    return banners;
  }

  public resetBanner(bannerId: string): ImageBanner[] {
    const defaultBanner = INITIAL_BANNERS.find((b) => b.id === bannerId);
    if (defaultBanner) {
      return this.saveBanner(defaultBanner);
    }
    return this.getBanners();
  }

  // Local Storage Helpers
  private getLocalPersonnel(): PersonnelRecord[] {
    const data = localStorage.getItem(LOCAL_PERSONNEL_KEY);
    return data ? JSON.parse(data) : INITIAL_PERSONNEL;
  }

  private saveLocalPersonnel(list: PersonnelRecord[]): void {
    localStorage.setItem(LOCAL_PERSONNEL_KEY, JSON.stringify(list));
  }

  private getLocalUsers(): User[] {
    const data = localStorage.getItem(LOCAL_USERS_KEY);
    return data ? JSON.parse(data) : INITIAL_USERS;
  }
}

export const storageService = new StorageService();
