import type {
  ProfileForm,
  NotificationSettings,
  TeamMember,
  AttendanceLog,
  SystemStatus,
  AuditLog,
} from "./types";

export const profileData: ProfileForm = {
  displayName: "Super Admin",
  email: "admin@erb.com",
  phone: "",
};

export const notificationDefaults: NotificationSettings = {
  orderNotifications: true,
  systemUpdates: true,
  teamCollaboration: true,
};

export const teamMembersData: TeamMember[] = [
  {
    id: "tm1",
    name: "Staff Member",
    subRole: "Staff",
    email: "staff@erb.com",
    phone: "012456789",
    role: "Staff",
    performance: "14 Deals",
    permission: "View Only",
  },
  {
    id: "tm2",
    name: "Super Admin",
    subRole: "Admin",
    email: "staff@erb.com",
    phone: "012456785",
    role: "Admin",
    performance: "2 Deals",
    permission: "Edit Only",
  },
  {
    id: "tm3",
    name: "Manager",
    subRole: "Manager",
    email: "staff@erb.com",
    phone: "012456785",
    role: "Manager",
    performance: "12 Deals",
    permission: "Edit Only",
  },
  {
    id: "tm4",
    name: "Super Admin",
    subRole: "Admin",
    email: "staff@erb.com",
    phone: "012456785",
    role: "Staff",
    performance: "8 Deals",
    permission: "View Only",
  },
  {
    id: "tm5",
    name: "Staff Member",
    subRole: "Staff",
    email: "staff@erb.com",
    phone: "012456785",
    role: "Staff",
    performance: "0 Deals",
    permission: "View Only",
  },
  {
    id: "tm6",
    name: "Staff Member",
    subRole: "Staff",
    email: "staff@erb.com",
    phone: "012456785",
    role: "Staff",
    performance: "0 Deals",
    permission: "View Only",
  },
  {
    id: "tm7",
    name: "Staff Member",
    subRole: "Staff",
    email: "staff@erb.com",
    phone: "012456788",
    role: "Staff",
    performance: "0 Deals",
    permission: "View Only",
  },
];

export const attendanceLogsData: AttendanceLog[] = [
  {
    id: "al1",
    staffMember: "Omnia Maher",
    inDateTime: "3/31/2026, 2:37:57 PM",
    outDateTime: "-",
    loggedHours: "-",
    status: "Ongoing",
  },
  {
    id: "al2",
    staffMember: "kareem Nabil",
    inDateTime: "3/31/2026, 2:37:57 PM",
    outDateTime: "3/31/2026, 2:37:57 PM",
    loggedHours: "6.22 h",
    status: "Completed",
  },
  {
    id: "al3",
    staffMember: "Mohamed Moustafa",
    inDateTime: "3/31/2026, 2:37:57 PM",
    outDateTime: "3/31/2026, 2:37:57 PM",
    loggedHours: "5.45 h",
    status: "Completed",
  },
  {
    id: "al4",
    staffMember: "Abdelrahman Ezz",
    inDateTime: "3/31/2026, 2:37:57 PM",
    outDateTime: "3/31/2026, 2:37:57 PM",
    loggedHours: "0.0 h",
    status: "Completed",
  },
  {
    id: "al5",
    staffMember: "Marwan Shawky",
    inDateTime: "3/31/2026, 2:37:57 PM",
    outDateTime: "3/31/2026, 2:37:57 PM",
    loggedHours: "0.0 h",
    status: "Completed",
  },
];

export const systemStatusData: SystemStatus = {
  storageCore: "69.1 MB",
  socketSync: 0,
  databaseLayer: "Healthy",
  environment: "Production",
  systemUptime: "1H 45M",
  backupsIntegrity: "GUARANTEED",
  latencyIndex: "NOMINAL",
};

export const auditLogsData: AuditLog[] = [
  {
    id: "aul1",
    eventTimestamp: "4/22/2026, 3:26:06 PM",
    adminEntity: "Super Admin",
    mutationType: "Update",
    targetResource: "1_AppFe/ProtectedDevice",
    originIP: ".fff/210.0.1",
  },
  {
    id: "aul2",
    eventTimestamp: "4/22/2026, 3:26:06 PM",
    adminEntity: "Manager",
    mutationType: "Create",
    targetResource: "AppFeat/middleware/Security/Auth",
    originIP: ".fff/210.0.1",
  },
  {
    id: "aul3",
    eventTimestamp: "4/22/2026, 3:26:06 PM",
    adminEntity: "Manager",
    mutationType: "Delete",
    targetResource: "AppFeat/Mddle/Security/Auth/Schedule",
    originIP: ".fff/210.0.1",
  },
  {
    id: "aul4",
    eventTimestamp: "4/22/2026, 3:26:06 PM",
    adminEntity: "Kareem",
    mutationType: "Update",
    targetResource: "2_AppFe/ProtectedDevice",
    originIP: ".fff/210.0.1",
  },
  {
    id: "aul5",
    eventTimestamp: "4/22/2026, 3:26:06 PM",
    adminEntity: "All",
    mutationType: "Update",
    targetResource: "2_AppFe/ProtectedDevice",
    originIP: ".fff/210.0.1",
  },
];

export const privilegeRoleOptions = [
  { value: "staff", label: "Staff (Observer Level)" },
  { value: "manager", label: "Manager (Operations Level)" },
  { value: "admin", label: "Admin (Full Access)" },
];
