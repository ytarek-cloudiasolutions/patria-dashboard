import { useState } from "react";
import Revenue from "@/assets/icons/revenue.svg";
import Bag from "@/assets/icons/bag.svg";
import Coffee from "@/assets/icons/coffee.svg";
import Kitchen from "@/assets/icons/kitchen.svg";
import OverviewCard from "@/shared/components/OverviewCard";
import type { OverviewCardProps } from "@/shared/types/overviewCard.types";

const DashboardOverview = () => {
  const [summaries] = useState<OverviewCardProps[]>([
    {
      id: 1,
      title: "Total Revenue",
      value: 120000.0,
      badgeColor: "bg-[#F5F0EA]",
      icon: Revenue,
      iconColor: "text-[#8F6900]",
    },
    {
      id: 2,
      title: "Total Orders",
      value: 7,
      badgeColor: "bg-[#DBEAFE]",
      icon: Bag,
      iconColor: "text-[#155DFC]",
    },
    {
      id: 3,
      title: "Total Products",
      value: 11,
      badgeColor: "bg-[#FE9A001A]",
      icon: Coffee,
      iconColor: "text-[#C7861E]",
    },
    {
      id: 4,
      title: "Active Kitchens",
      value: 3,
      badgeColor: "bg-[#E2F4ED]",
      icon: Kitchen,
      iconColor: "text-[#059B5A]",
    },
  ]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-11">
      {summaries.map((summary) => (
        <OverviewCard key={summary.id} data={summary} />
      ))}
    </div>
  );
};

export default DashboardOverview;
