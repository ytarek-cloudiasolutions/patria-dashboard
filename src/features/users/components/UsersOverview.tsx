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
          icon: <User className="size-5" />,
          iconColor: "text-[#8F6900]",
          badgeColor: "bg-[#F5F0EA]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Administrators"),
          value: String(administrators),
          icon: <UserRoundCheck className="size-5" />,
          iconColor: "text-[#059B5A]",
          badgeColor: "bg-[#E2F4ED]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Managers"),
          value: String(managers),
          icon: <UserStar className="size-5" />,
          iconColor: "text-[#C7861E]",
          badgeColor: "bg-[rgba(254,154,0,0.1)]",
        }}
      />
    </div>
  );
};

export default UsersOverview;
