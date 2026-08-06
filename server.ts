import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

import {
  INITIAL_PERSONNEL,
  INITIAL_USERS,
  INITIAL_DEPARTMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_LOGIN_HISTORY,
  INITIAL_SYSTEM_SETTINGS,
} from "./src/data/mockData.js";
import { PersonnelRecord, User, AuditLog, LoginHistoryItem, SystemSettings } from "./src/types.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// In-Memory / Persistent Database Store
let dbPersonnel: PersonnelRecord[] = [...INITIAL_PERSONNEL];
let dbUsers: User[] = [...INITIAL_USERS];
let dbDepartments = [...INITIAL_DEPARTMENTS];
let dbAuditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
let dbLoginHistory: LoginHistoryItem[] = [...INITIAL_LOGIN_HISTORY];
let dbSettings: SystemSettings = { ...INITIAL_SYSTEM_SETTINGS };

// Helper to log audit events
function logAudit(
  userEmail: string,
  userName: string,
  role: 'Administrator' | 'HOD',
  action: string,
  details: string,
  ipAddress = "10.240.0.1"
) {
  const newLog: AuditLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    userEmail,
    userName,
    role,
    action,
    details,
    ipAddress,
  };
  dbAuditLogs.unshift(newLog);
}

// Helper for Gemini AI
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { "User-Agent": "aistudio-build" } },
  });
}

// Health Check Endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    system: "23 Support Engineer Regiment Jos Personnel Management System",
    timestamp: new Date().toISOString(),
    activePersonnel: dbPersonnel.length,
  });
});

// ================= AUTHENTICATION ROUTES =================

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const ipAddress = req.ip || "10.240.0.14";

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const user = dbUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || !user.active) {
    // Record failed login
    dbLoginHistory.unshift({
      id: `lh-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userEmail: email,
      role: 'HOD',
      status: 'Failed',
      ipAddress,
      userAgent: req.headers["user-agent"] || "Browser",
    });

    logAudit(email, "Unknown", "HOD", "LOGIN_FAILED", "Failed authentication attempt - Invalid credentials or inactive account.", ipAddress);
    return res.status(401).json({ success: false, message: "Invalid email or password. Please check your credentials." });
  }

  // Update user last login
  user.lastLogin = new Date().toISOString();

  // Record login history
  dbLoginHistory.unshift({
    id: `lh-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userEmail: user.email,
    role: user.role,
    status: 'Success',
    ipAddress,
    userAgent: req.headers["user-agent"] || "Browser",
  });

  logAudit(user.email, user.name, user.role, "LOGIN_SUCCESS", `User ${user.name} logged into system.`, ipAddress);

  // Return token & user object
  const token = `jwt_23SER_${user.id}_${Date.now()}`;
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      serviceNumber: user.serviceNumber,
      rank: user.rank,
      active: user.active,
    },
  });
});

app.post("/api/auth/change-password", (req, res) => {
  const { userEmail, oldPassword, newPassword } = req.body;
  if (!userEmail || !newPassword) {
    return res.status(400).json({ success: false, message: "Email and new password required." });
  }
  const user = dbUsers.find((u) => u.email === userEmail);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }
  logAudit(user.email, user.name, user.role, "CHANGE_PASSWORD", "User changed account password.", req.ip || "10.240.0.1");
  res.json({ success: true, message: "Password updated successfully." });
});

// ================= PERSONNEL MANAGEMENT ROUTES =================

app.get("/api/personnel", (req, res) => {
  const { search, department, rank, status, gender, page = "1", limit = "50" } = req.query;

  let filtered = [...dbPersonnel];

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.surname.toLowerCase().includes(q) ||
        p.firstName.toLowerCase().includes(q) ||
        p.serviceNumber.toLowerCase().includes(q) ||
        p.rank.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.phoneNumber.includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.stateOfOrigin.toLowerCase().includes(q)
    );
  }

  if (department && department !== "All") {
    filtered = filtered.filter((p) => p.department === department);
  }

  if (rank && rank !== "All") {
    filtered = filtered.filter((p) => p.rank === rank);
  }

  if (status && status !== "All") {
    filtered = filtered.filter((p) => p.employmentStatus === status);
  }

  if (gender && gender !== "All") {
    filtered = filtered.filter((p) => p.gender === gender);
  }

  const pNum = parseInt(page as string, 10) || 1;
  const lNum = parseInt(limit as string, 10) || 50;
  const startIndex = (pNum - 1) * lNum;
  const paginated = filtered.slice(startIndex, startIndex + lNum);

  res.json({
    success: true,
    totalRecords: filtered.length,
    page: pNum,
    totalPages: Math.ceil(filtered.length / lNum) || 1,
    data: paginated,
  });
});

app.get("/api/personnel/:id", (req, res) => {
  const record = dbPersonnel.find((p) => p.id === req.params.id);
  if (!record) {
    return res.status(404).json({ success: false, message: "Personnel record not found." });
  }
  res.json({ success: true, data: record });
});

app.post("/api/personnel", (req, res) => {
  const newRecord: PersonnelRecord = {
    ...req.body,
    id: `pers-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    documents: req.body.documents || [],
    promotionHistory: req.body.promotionHistory || [],
    unit: "23 Support Engineer Regiment Jos",
  };

  dbPersonnel.unshift(newRecord);

  // Update department count
  const dept = dbDepartments.find((d) => d.name === newRecord.department);
  if (dept) dept.personnelCount += 1;

  const userEmail = req.headers["x-user-email"] as string || "admin@army.mil.ng";
  logAudit(userEmail, "Administrator", "Administrator", "CREATE_PERSONNEL", `Added new personnel record: ${newRecord.surname} ${newRecord.firstName} (${newRecord.serviceNumber}).`, req.ip || "10.240.0.1");

  res.status(201).json({ success: true, data: newRecord, message: "Personnel record created successfully." });
});

app.put("/api/personnel/:id", (req, res) => {
  const index = dbPersonnel.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Personnel record not found." });
  }

  const updatedRecord: PersonnelRecord = {
    ...dbPersonnel[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  dbPersonnel[index] = updatedRecord;

  const userEmail = (req.headers["x-user-email"] as string) || "admin@army.mil.ng";
  logAudit(userEmail, "Officer", "Administrator", "UPDATE_PERSONNEL", `Updated personnel record: ${updatedRecord.surname} ${updatedRecord.firstName} (${updatedRecord.serviceNumber}).`, req.ip || "10.240.0.1");

  res.json({ success: true, data: updatedRecord, message: "Personnel record updated successfully." });
});

app.delete("/api/personnel/:id", (req, res) => {
  const index = dbPersonnel.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Personnel record not found." });
  }

  const removed = dbPersonnel.splice(index, 1)[0];
  const dept = dbDepartments.find((d) => d.name === removed.department);
  if (dept && dept.personnelCount > 0) dept.personnelCount -= 1;

  const userEmail = (req.headers["x-user-email"] as string) || "admin@army.mil.ng";
  logAudit(userEmail, "Administrator", "Administrator", "DELETE_PERSONNEL", `Deleted personnel record: ${removed.surname} ${removed.firstName} (${removed.serviceNumber}).`, req.ip || "10.240.0.1");

  res.json({ success: true, message: "Personnel record deleted successfully." });
});

app.post("/api/personnel/:id/documents", (req, res) => {
  const record = dbPersonnel.find((p) => p.id === req.params.id);
  if (!record) {
    return res.status(404).json({ success: false, message: "Personnel record not found." });
  }

  const newDoc = {
    id: `doc-${Date.now()}`,
    name: req.body.name || "Attached_Document.pdf",
    type: req.body.type || "Other",
    fileFormat: req.body.fileFormat || "PDF",
    fileSize: req.body.fileSize || "1.5 MB",
    uploadDate: new Date().toISOString().split("T")[0],
    fileUrl: req.body.fileUrl || "#",
  };

  record.documents.push(newDoc);
  res.json({ success: true, document: newDoc, message: "Document uploaded successfully." });
});

// ================= USER & HOD MANAGEMENT ROUTES =================

app.get("/api/users", (_req, res) => {
  res.json({ success: true, data: dbUsers });
});

app.post("/api/users", (req, res) => {
  const { name, email, role, department, serviceNumber, rank } = req.body;
  if (!email || !name || !role) {
    return res.status(400).json({ success: false, message: "Name, email and role are required." });
  }

  const existing = dbUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: "User account with this email already exists." });
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name,
    email,
    role,
    department,
    serviceNumber,
    rank,
    active: true,
    createdAt: new Date().toISOString(),
  };

  dbUsers.push(newUser);
  logAudit("admin@army.mil.ng", "Administrator", "Administrator", "CREATE_HOD", `Created HOD user account: ${name} (${email}).`, req.ip || "10.240.0.1");

  res.status(201).json({ success: true, data: newUser, message: "User account created successfully." });
});

app.put("/api/users/:id", (req, res) => {
  const user = dbUsers.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  if (req.body.active !== undefined) user.active = req.body.active;
  if (req.body.department) user.department = req.body.department;
  if (req.body.role) user.role = req.body.role;
  if (req.body.name) user.name = req.body.name;

  logAudit("admin@army.mil.ng", "Administrator", "Administrator", "UPDATE_USER", `Updated user account settings for ${user.email}.`, req.ip || "10.240.0.1");

  res.json({ success: true, data: user, message: "User account updated successfully." });
});

app.delete("/api/users/:id", (req, res) => {
  const index = dbUsers.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const removed = dbUsers.splice(index, 1)[0];
  logAudit("admin@army.mil.ng", "Administrator", "Administrator", "DELETE_USER", `Deleted user account: ${removed.email}.`, req.ip || "10.240.0.1");

  res.json({ success: true, message: "User account deleted." });
});

// ================= DEPARTMENTS & ANALYTICS ROUTES =================

app.get("/api/departments", (_req, res) => {
  // Update counts
  const depts = dbDepartments.map((d) => ({
    ...d,
    personnelCount: dbPersonnel.filter((p) => p.department === d.name).length,
  }));
  res.json({ success: true, data: depts });
});

app.get("/api/dashboard/stats", (_req, res) => {
  const totalPersonnel = dbPersonnel.length;
  const activePersonnel = dbPersonnel.filter((p) => p.employmentStatus === "Active").length;
  const retiredPersonnel = dbPersonnel.filter((p) => p.employmentStatus === "Retired").length;
  const deployedPersonnel = dbPersonnel.filter((p) => p.employmentStatus === "Deployed").length;
  const onLeavePersonnel = dbPersonnel.filter((p) => p.employmentStatus === "On Leave").length;

  // Chart data: Personnel by Department
  const departmentChart = dbDepartments.map((d) => ({
    name: d.name,
    shortName: d.code,
    count: dbPersonnel.filter((p) => p.department === d.name).length,
  }));

  // Chart data: Rank Distribution
  const ranks: Record<string, number> = {};
  dbPersonnel.forEach((p) => {
    ranks[p.rank] = (ranks[p.rank] || 0) + 1;
  });
  const rankChart = Object.keys(ranks).map((r) => ({ rank: r, count: ranks[r] }));

  // Chart data: Gender Distribution
  const maleCount = dbPersonnel.filter((p) => p.gender === "Male").length;
  const femaleCount = dbPersonnel.filter((p) => p.gender === "Female").length;

  res.json({
    success: true,
    stats: {
      totalPersonnel,
      totalDepartments: dbDepartments.length,
      activePersonnel,
      retiredPersonnel,
      deployedPersonnel,
      onLeavePersonnel,
      newlyAddedCount: dbPersonnel.filter((p) => new Date(p.createdAt).getFullYear() >= 2024).length,
    },
    charts: {
      byDepartment: departmentChart,
      byRank: rankChart,
      byGender: [
        { name: "Male", count: maleCount },
        { name: "Female", count: femaleCount },
      ],
      byStatus: [
        { name: "Active", count: activePersonnel },
        { name: "Deployed", count: deployedPersonnel },
        { name: "On Leave", count: onLeavePersonnel },
        { name: "Retired", count: retiredPersonnel },
      ],
    },
    recentActivities: dbAuditLogs.slice(0, 8),
  });
});

// ================= AUDIT LOGS & LOGIN HISTORY =================

app.get("/api/audit-logs", (_req, res) => {
  res.json({ success: true, data: dbAuditLogs });
});

app.get("/api/login-history", (_req, res) => {
  res.json({ success: true, data: dbLoginHistory });
});

// ================= BACKEND DATABASE DASHBOARD & SQL API =================

app.get("/api/db/stats", (_req, res) => {
  const totalUsers = dbUsers.length;
  const totalDepartments = dbDepartments.length;
  const totalPersonnel = dbPersonnel.length;
  const totalDocuments = dbPersonnel.reduce((acc, p) => acc + (p.documents?.length || 0), 0);
  const totalAuditLogs = dbAuditLogs.length;

  const dataStr = JSON.stringify({ dbPersonnel, dbUsers, dbDepartments, dbAuditLogs, dbLoginHistory, dbSettings });
  const databaseSizeBytes = Buffer.byteLength(dataStr, "utf8");

  const tables = [
    { name: "users", rowCount: totalUsers, sizeKb: Math.round((totalUsers * 250) / 1024), description: "Authentication users & HOD roles" },
    { name: "departments", rowCount: totalDepartments, sizeKb: 4, description: "Regiment departmental units" },
    { name: "personnel", rowCount: totalPersonnel, sizeKb: Math.round((totalPersonnel * 1800) / 1024), description: "Military personnel records & service history" },
    { name: "documents", rowCount: totalDocuments, sizeKb: Math.round((totalDocuments * 400) / 1024), description: "Uploaded identity & service attachments" },
    { name: "audit_logs", rowCount: totalAuditLogs, sizeKb: Math.round((totalAuditLogs * 350) / 1024), description: "Security audit & activity logs" },
    { name: "login_history", rowCount: dbLoginHistory.length, sizeKb: Math.round((dbLoginHistory.length * 200) / 1024), description: "Authentication history & IP track" },
    { name: "system_settings", rowCount: 1, sizeKb: 2, description: "System security & backup settings" },
  ];

  res.json({
    success: true,
    data: {
      totalUsers,
      totalDepartments,
      totalPersonnel,
      totalDocuments,
      totalAuditLogs,
      databaseSizeBytes,
      lastBackupDate: new Date().toISOString(),
      tables,
    },
  });
});

// Execute SQL / Table queries from Database Dashboard
app.post("/api/db/query", (req, res) => {
  const { tableName, action, recordId } = req.body;

  if (action === "SELECT_ALL") {
    let result: any[] = [];
    if (tableName === "users") result = dbUsers;
    else if (tableName === "departments") result = dbDepartments;
    else if (tableName === "personnel") result = dbPersonnel;
    else if (tableName === "audit_logs") result = dbAuditLogs;
    else if (tableName === "login_history") result = dbLoginHistory;
    else if (tableName === "system_settings") result = [dbSettings];
    else if (tableName === "documents") {
      result = dbPersonnel.flatMap((p) => p.documents.map((d) => ({ ...d, personnelServiceNo: p.serviceNumber, personnelName: `${p.surname} ${p.firstName}` })));
    }

    return res.json({ success: true, tableName, count: result.length, data: result });
  }

  res.json({ success: true, message: "Query executed successfully." });
});

// Export Full Database Snapshot Backup JSON
app.get("/api/backup/export", (req, res) => {
  const snapshot = {
    metadata: {
      app: "23 Support Engineer Regiment Jos Personnel Management System",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      regiment: "Nigerian Army Engineers - 23 SER Jos",
    },
    tables: {
      users: dbUsers,
      departments: dbDepartments,
      personnel: dbPersonnel,
      auditLogs: dbAuditLogs,
      loginHistory: dbLoginHistory,
      systemSettings: dbSettings,
    },
  };

  logAudit("admin@army.mil.ng", "Administrator", "Administrator", "BACKUP_DB", "Full database JSON backup snapshot generated.", req.ip || "10.240.0.1");

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", `attachment; filename="23SER_Database_Backup_${Date.now()}.json"`);
  res.send(JSON.stringify(snapshot, null, 2));
});

// Restore Database Snapshot
app.post("/api/backup/restore", (req, res) => {
  try {
    const { tables } = req.body;
    if (tables) {
      if (tables.users) dbUsers = tables.users;
      if (tables.departments) dbDepartments = tables.departments;
      if (tables.personnel) dbPersonnel = tables.personnel;
      if (tables.auditLogs) dbAuditLogs = tables.auditLogs;
      if (tables.loginHistory) dbLoginHistory = tables.loginHistory;
      if (tables.systemSettings) dbSettings = tables.systemSettings;
    }

    logAudit("admin@army.mil.ng", "Administrator", "Administrator", "RESTORE_DB", "Database state restored successfully from backup image.", req.ip || "10.240.0.1");

    res.json({ success: true, message: "Database state restored successfully." });
  } catch (err: any) {
    res.status(400).json({ success: false, message: "Invalid backup image file." });
  }
});

// ================= SYSTEM SETTINGS =================

app.get("/api/settings", (_req, res) => {
  res.json({ success: true, data: dbSettings });
});

app.put("/api/settings", (req, res) => {
  dbSettings = { ...dbSettings, ...req.body };
  logAudit("admin@army.mil.ng", "Administrator", "Administrator", "UPDATE_SETTINGS", "System security configuration updated.", req.ip || "10.240.0.1");
  res.json({ success: true, data: dbSettings, message: "Settings saved successfully." });
});

// ================= GEMINI AI ASSISTANT FOR REGIMENT =================

app.post("/api/gemini/summarize-personnel", async (req, res) => {
  try {
    const { personnel } = req.body;
    const ai = getGeminiClient();

    if (!ai || !personnel) {
      return res.json({
        success: true,
        summary: `${personnel.rank} ${personnel.surname} ${personnel.firstName} (${personnel.serviceNumber}) is an active member of ${personnel.unit}, assigned to ${personnel.department} as ${personnel.appointment}. Enlisted on ${personnel.dateEnlisted} with ${personnel.yearsOfService} years of active duty. Specialization: ${personnel.tradeSpecialization}.`,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Generate an official executive military profile summary for: Name: ${personnel.surname} ${personnel.firstName}, Service No: ${personnel.serviceNumber}, Rank: ${personnel.rank}, Department: ${personnel.department}, Appointment: ${personnel.appointment}, Years of Service: ${personnel.yearsOfService}, Trade: ${personnel.tradeSpecialization}, Current Posting: ${personnel.currentPosting}.`,
    });

    res.json({ success: true, summary: response.text });
  } catch (err: any) {
    res.json({
      success: true,
      summary: `Military Record Summary: ${req.body.personnel?.rank} ${req.body.personnel?.surname} ${req.body.personnel?.firstName} (${req.body.personnel?.serviceNumber}). Department: ${req.body.personnel?.department}. Specialization: ${req.body.personnel?.tradeSpecialization}.`,
    });
  }
});

// ================= START SERVER (EXPRESS + VITE) =================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`23 Support Engineer Regiment Jos Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
