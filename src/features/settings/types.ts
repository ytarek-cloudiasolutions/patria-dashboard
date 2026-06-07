export type SettingsTab =
  | "profile"
  | "security"
  | "notifications"
  | "team"
  | "attendance"
  | "system"
  | "audit";

export type TeamRole = "Staff" | "Manager" | "Admin";

export type PermissionLevel = "View Only" | "Edit Only";

export interface TeamMember {
  id: number;
  name: string;
  roleLabel: string;
  email: string;
  phone: string;
  role: TeamRole;
  performance: string;
  permission: PermissionLevel;
}

export type AttendanceStatus = "Ongoing" | "Completed";

export interface AttendanceRecord {
  id: number;
  staff: string;
  inTime: string;
  outTime: string;
  loggedHours: string;
  status: AttendanceStatus;
}

export type MutationType = "Update" | "Create" | "Delete";

export interface AuditLog {
  id: number;
  timestamp: string;
  admin: string;
  mutation: MutationType;
  resource: string;
  originIp: string;
}

export interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export type SystemMetricTone = "primary" | "green" | "amber" | "blue";

export interface SystemMetric {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  tone: SystemMetricTone;
}

export interface SystemStat {
  id: string;
  label: string;
  value: string;
  caption: string;
  tone: "green" | "neutral";
}

export interface ProfileFormData {
  displayName: string;
  email: string;
  phone: string;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
}

export interface InviteFormData {
  name: string;
  email: string;
  phone: string;
  securityCode: string;
  role: TeamRole;
}
