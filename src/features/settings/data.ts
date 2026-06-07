import type {
  AttendanceRecord,
  AuditLog,
  NotificationSetting,
  SystemMetric,
  SystemStat,
  TeamMember,
  TeamRole,
} from "./types";

export const ROLE_OPTIONS: { value: TeamRole; label: string }[] = [
  { value: "Staff", label: "Staff" },
  { value: "Manager", label: "Manager" },
  { value: "Admin", label: "Admin" },
];

export const PRIVILEGE_ROLE_OPTIONS = [
  { value: "Staff", label: "Staff (Observer Level)" },
  { value: "Manager", label: "Manager (Operational Level)" },
  { value: "Admin", label: "Admin (Full Access)" },
];

export const INITIAL_NOTIFICATIONS: NotificationSetting[] = [
  {
    id: "orders",
    title: "Order Notifications",
    description: "Alerts for every new mobile app order",
    enabled: true,
  },
  {
    id: "system",
    title: "System Updates",
    description: "Notifications about inventory and technical status",
    enabled: true,
  },
  {
    id: "team",
    title: "Team Collaboration",
    description: "Get notified when roles are updated or shifts start",
    enabled: true,
  },
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 1,
    name: "Staff Member",
    roleLabel: "Staff",
    email: "staff@erb.com",
    phone: "012456789",
    role: "Staff",
    performance: "14 Deals",
    permission: "View Only",
  },
  {
    id: 2,
    name: "Super Admin",
    roleLabel: "Admin",
    email: "admin@erb.com",
    phone: "012456789",
    role: "Admin",
    performance: "2 Deals",
    permission: "Edit Only",
  },
  {
    id: 3,
    name: "Manager",
    roleLabel: "Manager",
    email: "manager@erb.com",
    phone: "012456789",
    role: "Manager",
    performance: "12 Deals",
    permission: "Edit Only",
  },
  {
    id: 4,
    name: "Super Admin",
    roleLabel: "Admin",
    email: "admin@erb.com",
    phone: "012456789",
    role: "Staff",
    performance: "8 Deals",
    permission: "View Only",
  },
  {
    id: 5,
    name: "Staff Member",
    roleLabel: "Staff",
    email: "staff@erb.com",
    phone: "012456789",
    role: "Staff",
    performance: "0 Deals",
    permission: "View Only",
  },
  {
    id: 6,
    name: "Staff Member",
    roleLabel: "Staff",
    email: "staff@erb.com",
    phone: "012456789",
    role: "Staff",
    performance: "0 Deals",
    permission: "View Only",
  },
  {
    id: 7,
    name: "Staff Member",
    roleLabel: "Staff",
    email: "staff@erb.com",
    phone: "012456789",
    role: "Staff",
    performance: "0 Deals",
    permission: "View Only",
  },
];

export const ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 1,
    staff: "Omnia Maher",
    inTime: "3/31/2026, 2:37:57 PM",
    outTime: "-",
    loggedHours: "-",
    status: "Ongoing",
  },
  {
    id: 2,
    staff: "kareem Nabil",
    inTime: "3/31/2026, 2:37:57 PM",
    outTime: "3/31/2026, 2:37:57 PM",
    loggedHours: "6.22 h",
    status: "Completed",
  },
  {
    id: 3,
    staff: "Mohamed Moustafa",
    inTime: "3/31/2026, 2:37:57 PM",
    outTime: "3/31/2026, 2:37:57 PM",
    loggedHours: "5.45 h",
    status: "Completed",
  },
  {
    id: 4,
    staff: "Abdelrahman Ezz",
    inTime: "3/31/2026, 2:37:57 PM",
    outTime: "3/31/2026, 2:37:57 PM",
    loggedHours: "0.00 h",
    status: "Completed",
  },
  {
    id: 5,
    staff: "Marwan Shawky",
    inTime: "3/31/2026, 2:37:57 PM",
    outTime: "3/31/2026, 2:37:57 PM",
    loggedHours: "0.00 h",
    status: "Completed",
  },
];

export const SYSTEM_METRICS: SystemMetric[] = [
  {
    id: "storage",
    label: "STORAGE CORE",
    value: "69.1 MB",
    sublabel: "NODE ENGINE",
    tone: "primary",
  },
  {
    id: "socket",
    label: "SOCKET SYNC",
    value: "0",
    sublabel: "REAL-TIME EVENTS",
    tone: "green",
  },
  {
    id: "database",
    label: "DATABASE LAYER",
    value: "Healthy",
    sublabel: "MONGODB CLUSTER",
    tone: "amber",
  },
  {
    id: "environment",
    label: "ENVIRONMENT",
    value: "Production",
    sublabel: "RUNTIME MODE",
    tone: "blue",
  },
];

export const SYSTEM_STATS: SystemStat[] = [
  {
    id: "uptime",
    label: "SYSTEM UPTIME",
    value: "1H 45M",
    caption: "Operational",
    tone: "green",
  },
  {
    id: "backups",
    label: "BACKUPS INTEGRITY",
    value: "GUARANTEED",
    caption: "Sync every 24h at 03:00",
    tone: "neutral",
  },
  {
    id: "latency",
    label: "LATENCY INDEX",
    value: "NOMINAL",
    caption: "Average < 50ms",
    tone: "neutral",
  },
];

export const AUDIT_LOGS: AuditLog[] = [
  {
    id: 1,
    timestamp: "4/22/2026, 3:26:06 PM",
    admin: "Super Admin",
    mutation: "Update",
    resource: "/api/notifications/device",
    originIp: "::ffff:127.0.0.1",
  },
  {
    id: 2,
    timestamp: "4/22/2026, 3:26:06 PM",
    admin: "Manager",
    mutation: "Create",
    resource: "/api/cart/remove/69e8b16a7ac4af92d",
    originIp: "::ffff:127.0.0.1",
  },
  {
    id: 3,
    timestamp: "4/22/2026, 3:26:06 PM",
    admin: "Manager",
    mutation: "Delete",
    resource: "/api/cart/update/69e8b16a7ac4af92de",
    originIp: "::ffff:127.0.0.1",
  },
  {
    id: 4,
    timestamp: "4/22/2026, 3:26:06 PM",
    admin: "Kareem",
    mutation: "Update",
    resource: "/api/notifications/device",
    originIp: "::ffff:127.0.0.1",
  },
  {
    id: 5,
    timestamp: "4/22/2026, 3:26:06 PM",
    admin: "Ali",
    mutation: "Update",
    resource: "/api/notifications/device",
    originIp: "::ffff:127.0.0.1",
  },
];
