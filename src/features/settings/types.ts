export type SettingsTab =
  | "profile"
  | "security"
  | "notifications"
  | "team"
  | "attendance"
  | "system"
  | "auditLogs";

// Profile
export interface ProfileForm {
  displayName: string;
  email: string;
  phone: string;
}

// Security
export interface SecurityForm {
  currentPassword: string;
  newPassword: string;
}

// Notifications
export interface NotificationSettings {
  orderNotifications: boolean;
  systemUpdates: boolean;
  teamCollaboration: boolean;
}

// Team
export type TeamRole = "Staff" | "Admin" | "Manager";
export type TeamPermission = "View Only" | "Edit Only" | "Full Access";

export interface TeamMember {
  id: string;
  name: string;
  subRole: string;
  email: string;
  phone: string;
  role: TeamRole;
  performance: string;
  permission: TeamPermission;
}

export interface InviteMemberForm {
  entityName: string;
  authEmail: string;
  contactPhone: string;
  securityCode: string;
  privilegeRole: string;
}

// Attendance
export type AttendanceStatus = "Ongoing" | "Completed";

export interface AttendanceLog {
  id: string;
  staffMember: string;
  inDateTime: string;
  outDateTime: string;
  loggedHours: string;
  status: AttendanceStatus;
}

// System
export interface SystemStatus {
  storageCore: string;
  socketSync: number;
  databaseLayer: string;
  environment: string;
  systemUptime: string;
  backupsIntegrity: string;
  latencyIndex: string;
}

// Audit Logs
export type MutationType = "Update" | "Create" | "Delete";

export interface AuditLog {
  id: string;
  eventTimestamp: string;
  adminEntity: string;
  mutationType: MutationType;
  targetResource: string;
  originIP: string;
}