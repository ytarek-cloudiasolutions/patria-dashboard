import { Shield, Smartphone } from "lucide-react";
import TabItem from "@/shared/components/TabItem";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { UsersTab } from "../types";

interface UsersTabsProps {
  active: UsersTab;
  usersCount: number;
  appUsersCount: number;
  onChange: (tab: UsersTab) => void;
}

const UsersTabs = ({
  active,
  usersCount,
  appUsersCount,
  onChange,
}: UsersTabsProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-5 grid grid-cols-2 gap-1.5 border-b border-[#E5E5E5]">
      <TabItem
        value="users"
        label={t("Users")}
        icon={Shield}
        count={usersCount}
        isActive={active === "users"}
        onClick={(v) => onChange(v as UsersTab)}
      />
      <TabItem
        value="app"
        label={t("App Users")}
        icon={Smartphone}
        count={appUsersCount}
        isActive={active === "app"}
        onClick={(v) => onChange(v as UsersTab)}
      />
    </div>
  );
};

export default UsersTabs;
