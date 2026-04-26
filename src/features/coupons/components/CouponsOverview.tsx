import { useState } from "react";
import {
  CheckCheck,
  CircleCheckBig,
  CircleX,
  TicketSlash,
} from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";
import type { OverviewCardProps } from "@/shared/types/overviewCard.types";

const CouponsOverview = () => {
  const [coupons] = useState<OverviewCardProps[]>([
    {
      id: 1,
      title: "Active Coupons",
      value: 2,
      badgeColor: "bg-[#E2F4ED]",
      icon: <CircleCheckBig />,
      iconColor: "text-[#059B5A]",
    },
    {
      id: 2,
      title: "Usage times",
      value: 7,
      badgeColor: "bg-[#DBEAFE]",
      icon: <CheckCheck />,
      iconColor: "text-[#155DFC]",
    },
    {
      id: 3,
      title: "Total No. of Coupons",
      value: 5,
      badgeColor: "bg-[#FE9A001A]",
      icon: <TicketSlash />,
      iconColor: "text-[#C7861E]",
    },
    {
      id: 4,
      title: "Inactive Coupons",
      value: 3,
      badgeColor: "bg-[#FFF0F0]",
      icon: <CircleX />,
      iconColor: "text-[#C90000]",
    },
  ]);
  return (
    <div className="grid grid-cols-4 gap-13">
      {coupons.map((coupon) => (
        <OverviewCard key={coupon.id} data={coupon} />
      ))}
    </div>
  );
};

export default CouponsOverview;
