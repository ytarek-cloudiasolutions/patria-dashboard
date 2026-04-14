import { useState } from "react";
import type { CouponCardProps } from "../types";
import CouponCard from "./CouponCard";
import { Gift } from "lucide-react";

const CouponsOverview = () => {
  const [coupons] = useState<CouponCardProps[]>([
    {
      id: 1,
      title: "Active Coupons",
      value: 2,
      badgeColor: "bg-[#E2F4ED]",
      icon: <Gift />,
      iconColor: "text-[#059B5A]",
    },
    {
      id: 2,
      title: "Usage times",
      value: 7,
      badgeColor: "bg-[#DBEAFE]",
      icon: <Gift />,
      iconColor: "text-[#155DFC]",
    },
    {
      id: 3,
      title: "Total No. of Coupons",
      value: 5,
      badgeColor: "bg-[#FE9A001A]",
      icon: <Gift />,
      iconColor: "text-[#C7861E]",
    },
    {
      id: 4,
      title: "Inactive Coupons",
      value: 3,
      badgeColor: "bg-[#FFF0F0]",
      icon: <Gift />,
      iconColor: "text-[#C90000]",
    },
  ]);
  return (
    <div className="grid grid-cols-4">
      {coupons.map((coupon) => (
        <CouponCard key={coupon.id} coupon={coupon} />
      ))}
    </div>
  );
};

export default CouponsOverview;
