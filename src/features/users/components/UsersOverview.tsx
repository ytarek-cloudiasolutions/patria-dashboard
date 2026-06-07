import {
  User,
  UserCheck,
  UserCog,
  UserRound,
  UserRoundCheck,
  UserStar,
} from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";
import type { UserOverviewCounts } from "../types";

const UsersOverview = ({
  totalUsers,
  administrators,
  managers,
}: UserOverviewCounts) => (
  <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
    <OverviewCard
      data={{
        title: "Total Users",
        value: String(totalUsers),
        icon: <User size={18} />,
        iconColor: "text-[#000000]",
        badgeColor: "bg-[#F5F0EA]",
      }}
    />
    <OverviewCard
      data={{
        title: "Administrators",
        value: String(administrators),
        icon: <UserRoundCheck size={18} />,
        iconColor: "text-[#059B5A]",
        badgeColor: "bg-[#E2F4ED]",
      }}
    />
    <OverviewCard
      data={{
        title: "Managers",
        value: String(managers),
        icon: <UserStar size={18} />,
        iconColor: "text-[#C7861E]",
        badgeColor: "bg-[#FFF7E6]",
      }}
    />
  </div>
);

export default UsersOverview;
