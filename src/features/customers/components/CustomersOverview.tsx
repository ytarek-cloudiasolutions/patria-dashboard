import { useState } from "react";
import Users from "@/assets/icons/Users.svg";
import ActiveUsers from "@/assets/icons/active-users.svg";
import NewUsers from "@/assets/icons/new-users.svg";

import OverviewCard from "@/shared/components/OverviewCard";
import type { OverviewCardProps } from "@/shared/types/overviewCard.types";

const CustomersOverview = () => {
  const [statistics] = useState<OverviewCardProps[]>([
    {
      id: 1,
      title: "Total Customers",
      value: 7,
      badgeColor: "bg-[#DBEAFE]",
      icon: Users,
      iconColor: "text-[#155DFC]",
    },
    {
      id: 2,
      title: "Active Customers (Today)",
      value: 5,
      badgeColor: "bg-[#FE9A001A]",
      icon: ActiveUsers,
      iconColor: "text-[#C7861E]",
    },
    {
      id: 3,
      title: "Active Coupons",
      value: 11,
      badgeColor: "bg-[#E2F4ED]",
      icon: NewUsers,
      iconColor: "text-[#059B5A]",
    },
  ]);
  return (
    <div className="grid grid-cols-3 gap-8">
      {statistics.map((statistic) => (
        <OverviewCard key={statistic.id} data={statistic} />
      ))}
    </div>
  );
};

export default CustomersOverview;
