import { User, UserRoundCheck, UserStar } from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { UserOverviewCounts } from "../types";

const UsersOverview = ({
  totalUsers,
  administrators,
  managers,
}: UserOverviewCounts) => {
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
          title: t("Administrators"),
          value: String(administrators),
          icon: <UserRoundCheck size={18} />,
          iconColor: "text-[#059B5A]",
          badgeColor: "bg-[#E2F4ED]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Managers"),
          value: String(managers),
          icon: <UserStar size={18} />,
          iconColor: "text-[#C7861E]",
          badgeColor: "bg-[#FFF7E6]",
        }}
      />
    </div>
  );
};

export default UsersOverview;
