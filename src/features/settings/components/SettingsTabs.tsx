import {
  Activity,
  Bell,
  Clock,
  Shield,
  ShieldCheck,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import TabItem from "@/shared/components/TabItem";
import type { SettingsTab } from "../types";

const TABS: { value: SettingsTab; label: string; icon: LucideIcon }[] = [
  { value: "profile", label: "Profile", icon: User },
  { value: "security", label: "Security", icon: Shield },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "team", label: "Team", icon: Users },
  { value: "attendance", label: "Attendance", icon: Clock },
  { value: "system", label: "System", icon: Activity },
  { value: "audit", label: "Audit Logs", icon: ShieldCheck },
];

interface SettingsTabsProps {
  active: SettingsTab;
  onChange: (tab: SettingsTab) => void;
}

const SettingsTabs = ({ active, onChange }: SettingsTabsProps) => (
  <div className="mb-6 grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-7">
    {TABS.map((tab) => (
      <TabItem
        key={tab.value}
        value={tab.value}
        label={tab.label}
        icon={tab.icon}
        isActive={active === tab.value}
        onClick={(value) => onChange(value as SettingsTab)}
      />
    ))}
  </div>
);

export default SettingsTabs;
