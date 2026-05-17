import { useState } from "react";
import {
  UserRound,
  Shield,
  Bell,
  Users,
  Clock,
  Activity,
  ShieldCheck,
  Info,
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
  { key: "profile", label: "Profile", icon: <UserRound className="size-6" /> },
  { key: "security", label: "Security", icon: <Shield className="size-6" /> },
  {
    key: "notifications",
    label: "Notifications",
    icon: <Bell className="size-6" />,
  },
  { key: "team", label: "Team", icon: <Users className="size-6" /> },
  {
    key: "attendance",
    label: "Attendance",
    icon: <Clock className="size-6" />,
  },
  { key: "system", label: "System", icon: <Activity className="size-6" /> },
  {
    key: "auditLogs",
    label: "Audit Logs",
    icon: <ShieldCheck className="size-6" />,
  },
];

const USER_INITIALS = "S";
const USER_NAME = "Super Admin";
const USER_ROLE = "ADMIN";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="min-h-screen bg-[#FCFCFB] px-5 py-8 md:px-6 lg:px-8 xl:px-[22px] xl:py-[43px]">
      <div className="mb-[38px]">
        <h1 className="text-[34px] font-bold leading-[1.1] text-[#333333]">
          Settings
        </h1>
        <p className="mt-[5px] text-[18px] font-medium text-[#696969]">
          Manage your account and platform preferences
        </p>
      </div>

      <div className="mb-[25px] grid grid-cols-7 gap-x-1.5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex h-[44px] min-w-[150px] cursor-pointer items-start justify-center gap-3 whitespace-nowrap pb-3 text-center text-[18px] font-medium transition-colors ${
              activeTab === tab.key
                ? "text-[#1F1F1F]"
                : "text-[#8F8F8F] hover:text-[#666666]"
            }`}
          >
            {tab.icon}
            {tab.label}
            <span
              className={`absolute right-0 bottom-0 left-0 h-0.5 transition-all ${
                activeTab === tab.key ? "bg-primary" : "bg-[#9A9A9A]"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="grid items-start gap-[30px] xl:grid-cols-[345px_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-[24px]">
          <section className="rounded-[16px] border border-[#E1E1E5] bg-white px-[16px] pb-[24px] pt-[14px]">
            <div className="mx-auto flex size-[115px] items-center justify-center rounded-full bg-[#F2F0EA]">
              <div className="flex size-[94px] items-center justify-center rounded-full bg-primary text-[46px] font-bold text-white shadow-inner">
                {USER_INITIALS}
              </div>
            </div>
            <div className="mt-[12px] text-center">
              <p className="text-[19px] font-bold leading-none text-[#333333]">
                {USER_NAME}
              </p>
              <p className="mt-[8px] text-[11px] font-bold uppercase tracking-wide text-[#545454]">
                {USER_ROLE}
              </p>
            </div>

            <div className="mt-[27px] flex w-full flex-col gap-[15px] px-[2px]">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#000000]">
                  Identity verified
                </span>
                <ShieldCheck className="size-4 text-[#00A85A]" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#000000]">
                  2FA Status
                </span>
                <span className="inline-flex h-[19px] items-center rounded-full border border-[#FF0000] px-[8px] text-[12px] font-semibold leading-none text-[#FF0000]">
                  Disabled
                </span>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[16px] border border-[#E1E1E5] bg-white">
            <div className="flex h-[51px] items-center justify-between bg-[#F5F0EA] px-[17px]">
              <p className="text-[18px] font-bold text-[#333333]">
                System Notice
              </p>
              <Info className="size-[22px] text-[#000000]" />
            </div>
            <p className="px-[20px] py-[27px] text-center text-[14px] font-bold leading-[1.18] text-[#000000]">
              System-wide glassmorphism modernization is active. All
              administrative modules are now responsive and highly intuitive.
            </p>
          </section>
        </div>

        <div className="min-w-0">
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
