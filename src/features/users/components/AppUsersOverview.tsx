import { Ban, User, UserRoundCheck } from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { AppUserOverviewCounts } from "../types";

const AppUsersOverview = ({
  totalUsers,
  blockedUsers,
  activeUsers,
}: AppUserOverviewCounts) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
      <OverviewCard
        data={{
          title: t("Total Users"),
          value: String(totalUsers),
          icon: <User size={18} />,
          iconColor: "text-[#000000]",
          badgeColor: "bg-[#F5F0EA]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Blocked Users"),
          value: String(blockedUsers),
          icon: <Ban size={18} />,
          iconColor: "text-white",
          badgeColor: "bg-[#C90000]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Active Users"),
          value: String(activeUsers),
          icon: <UserRoundCheck size={18} />,
          iconColor: "text-[#059B5A]",
          badgeColor: "bg-[#E2F4ED]",
        }}
      />
    </div>
  );
};

export default AppUsersOverview;
