import { useEffect, useState } from "react";
import HeaderLayout from "@/layouts/HeaderLayout";
import { useTranslation } from "@/shared/i18n/useTranslation";

import SettingsTabs from "./components/SettingsTabs";
import SettingsSidebar from "./components/SettingsSidebar";
import ProfileSection from "./components/ProfileSection";
import SecuritySection from "./components/SecuritySection";
import NotificationsSection from "./components/NotificationsSection";
import TeamSection from "./components/TeamSection";
import SystemSection from "./components/SystemSection";
import AuditLogsSection from "./components/AuditLogsSection";
import InviteMemberDialog from "./components/InviteMemberDialog";

import type { InviteFormData, SettingsTab, TeamMember, TeamRole } from "./types";
import { api } from "@/config/api";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";

const mapRole = (raw: string): TeamRole => {
  const r = (raw || "").toLowerCase();
  if (r === "admin" || r === "super_admin" || r === "superadmin") return "Admin";
  if (r === "manager") return "Manager";
  return "Staff";
};

const mapRoleToBackend = (role: TeamRole): string => {
  if (role === "Admin") return "admin";
  if (role === "Manager") return "manager";
  return "staff";
};

const SettingsPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<SettingsTab>("profile");
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [me, setMe] = useState<{ name: string; role: string }>({ name: "", role: "" });

  const loadTeam = () => {
    api.get("/users", { params: { limit: 50 } }).then((res) => {
      const raw: any[] = res.data?.data ?? res.data?.users ?? [];
      const mapped: TeamMember[] = raw.map((u, idx) => ({
        id: u._id ?? idx,
        name: u.name ?? u.username ?? "—",
        roleLabel: mapRole(u.role),
        email: u.email ?? "—",
        phone: u.phone ?? "—",
        role: mapRole(u.role),
        performance: "—",
        permission: (u.role === "admin" || u.role === "super_admin") ? "Edit Only" : "View Only",
      }));
      setTeam(mapped);
    }).catch(() => setTeam([]));
  };

  useEffect(() => {
    loadTeam();
    api.get("/auth/me").then(({ data }) => {
      setMe({ name: data.name ?? "", role: mapRole(data.role) });
    }).catch(() => {});
  }, []);

  const handleRoleChange = async (id: string | number, role: TeamRole) => {
    // Was local Set/array state only — the role dropdown looked like it
    // worked but never reached the backend, so it reset on every refresh.
    const prevTeam = team;
    setTeam((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    try {
      await api.put(`/users/${id}`, { role: mapRoleToBackend(role) });
      showSuccessToast(t("Role updated"));
    } catch (error: any) {
      setTeam(prevTeam);
      showErrorToast(error?.response?.data?.message || t("Failed to update role"));
    }
  };

  const handleInvite = async (data: InviteFormData) => {
    try {
      await api.post("/users", {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.securityCode,
        role: mapRoleToBackend(data.role),
        phone: data.phone.trim() || undefined,
      });
      showSuccessToast(t("Team member added"));
      loadTeam();
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || t("Failed to add team member"));
    }
  };

  const renderSection = () => {
    switch (tab) {
      case "profile":
        return <ProfileSection onSaved={(data) => setMe({ name: data.name, role: mapRole(data.role) })} />;
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
        <SettingsSidebar name={me.name} role={me.role} />
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
