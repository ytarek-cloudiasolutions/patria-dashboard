import { useState } from "react";
import HeaderLayout from "@/layouts/HeaderLayout";
import { useTranslation } from "@/shared/i18n/useTranslation";

import SettingsTabs from "./components/SettingsTabs";
import SettingsSidebar from "./components/SettingsSidebar";
import ProfileSection from "./components/ProfileSection";
import SecuritySection from "./components/SecuritySection";
import NotificationsSection from "./components/NotificationsSection";
import TeamSection from "./components/TeamSection";
import AttendanceSection from "./components/AttendanceSection";
import SystemSection from "./components/SystemSection";
import AuditLogsSection from "./components/AuditLogsSection";
import InviteMemberDialog from "./components/InviteMemberDialog";

import { INITIAL_TEAM } from "./data";
import type { InviteFormData, SettingsTab, TeamMember, TeamRole } from "./types";

const SettingsPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<SettingsTab>("profile");
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleRoleChange = (id: number, role: TeamRole) =>
    setTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role } : m)),
    );

  const handleInvite = (data: InviteFormData) => {
    const newMember: TeamMember = {
      id: Date.now(),
      name: data.name.trim(),
      roleLabel: data.role,
      email: data.email.trim(),
      phone: data.phone.trim() || "—",
      role: data.role,
      performance: "0 Deals",
      permission: data.role === "Admin" ? "Edit Only" : "View Only",
    };
    setTeam((prev) => [newMember, ...prev]);
  };

  const renderSection = () => {
    switch (tab) {
      case "profile":
        return <ProfileSection />;
      case "security":
        return <SecuritySection />;
      case "notifications":
        return <NotificationsSection />;
      case "team":
        return (
          <TeamSection
            members={team}
            onRoleChange={handleRoleChange}
            onInvite={() => setIsInviteOpen(true)}
            onDropdownOpenChange={setIsDropdownOpen}
          />
        );
      case "attendance":
        return <AttendanceSection />;
      case "system":
        return <SystemSection />;
      case "audit":
        return <AuditLogsSection />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Scrim/backdrop when a row dropdown is open */}
      {isDropdownOpen && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-black/40" />
      )}

      <div className="mb-6">
        <HeaderLayout
          title={t("Settings")}
          description={t("Manage your account and platform preferences")}
        />
      </div>

      <SettingsTabs active={tab} onChange={setTab} />

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[320px_1fr]">
        <SettingsSidebar />
        <div className="h-full">{renderSection()}</div>
      </div>

      <InviteMemberDialog
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        onSave={handleInvite}
      />
    </>
  );
};

export default SettingsPage;
