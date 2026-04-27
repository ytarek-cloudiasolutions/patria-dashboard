import { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Users,
  Clock,
  Activity,
  ShieldCheck,
} from "lucide-react";
import AttendanceTab from "./components/AttendanceTab";

import NotificationsTab from "./components/NotificationsTab";
import ProfileTab from "./components/ProfileTab";
import SecurityTab from "./components/SecurityTab";
import SystemTab from "./components/SystemTab";
import TeamTab from "./components/TeamTab";
import {
  profileData,
  notificationDefaults,
  teamMembersData,
  attendanceLogsData,
  systemStatusData,
  auditLogsData,
} from "./data";
import type { SettingsTab } from "./types";
import AuditLogsTab from "./components/AuditLogsTab";

const tabs: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { key: "profile", label: "Profile", icon: <User className="size-3.5" /> },
  { key: "security", label: "Security", icon: <Lock className="size-3.5" /> },
  {
    key: "notifications",
    label: "Notifications",
    icon: <Bell className="size-3.5" />,
  },
  { key: "team", label: "Team", icon: <Users className="size-3.5" /> },
  {
    key: "attendance",
    label: "Attendance",
    icon: <Clock className="size-3.5" />,
  },
  { key: "system", label: "System", icon: <Activity className="size-3.5" /> },
  {
    key: "auditLogs",
    label: "Audit Logs",
    icon: <ShieldCheck className="size-3.5" />,
  },
];

const USER_INITIALS = "S";
const USER_NAME = "Super Admin";
const USER_ROLE = "ADMIN";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-8 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#28293D]">Settings</h1>
        <p className="text-[14px] text-[#8B8B8B] mt-1">
          Manage your account and platform preferences
        </p>
      </div>

      {/* Tabs bar */}
      <div className="flex gap-1 border-b border-[#E5E5E5] mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.key
                ? "border-b-2 border-[#5C4A1E] text-[#5C4A1E]"
                : "text-[#8B8B8B] hover:text-[#28293D]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="flex gap-5 items-start">
        {/* Left sidebar: user card */}
        <div className="w-[160px] flex-shrink-0 flex flex-col gap-4">
          {/* Avatar card */}
          <div className="bg-white rounded-[16px] border border-[#E5E5E5] p-4 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#5C4A1E] flex items-center justify-center text-white text-[20px] font-bold">
              {USER_INITIALS}
            </div>
            <div className="text-center">
              <p className="text-[13px] font-semibold text-[#28293D]">
                {USER_NAME}
              </p>
              <p className="text-[10px] text-[#8B8B8B] font-medium tracking-wider uppercase">
                {USER_ROLE}
              </p>
            </div>

            <div className="w-full flex flex-col gap-1.5 mt-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8B8B8B]">
                  Identity verified
                </span>
                <div className="w-3.5 h-3.5 rounded-full border border-[#E5E5E5] bg-white" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#8B8B8B]">2FA Status</span>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[#FFF0F0] text-[#C90000] border border-[#FECACA]">
                  Disabled
                </span>
              </div>
            </div>
          </div>

          {/* System Notice */}
          <div className="bg-white rounded-[16px] border border-[#E5E5E5] p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold text-[#28293D]">
                System Notice
              </p>
              <div className="w-4 h-4 rounded-full border border-[#E5E5E5] flex items-center justify-center">
                <span className="text-[8px] text-[#8B8B8B] font-bold">i</span>
              </div>
            </div>
            <p className="text-[10px] text-[#8B8B8B] leading-relaxed">
              System-wide glassmorphism modernization is active. All
              administrative modules are now responsive and highly intuitive.
            </p>
          </div>
        </div>

        {/* Right panel: tab content */}
        <div className="flex-1 min-w-0">
          {activeTab === "profile" && <ProfileTab initialData={profileData} />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "notifications" && (
            <NotificationsTab initialSettings={notificationDefaults} />
          )}
          {activeTab === "team" && <TeamTab initialMembers={teamMembersData} />}
          {activeTab === "attendance" && (
            <AttendanceTab logs={attendanceLogsData} />
          )}
          {activeTab === "system" && <SystemTab status={systemStatusData} />}
          {activeTab === "auditLogs" && <AuditLogsTab logs={auditLogsData} />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
