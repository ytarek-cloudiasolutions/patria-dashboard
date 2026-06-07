import { TrendingUp, Users } from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";

interface AccountStatsProps {
  totalOrders: number;
  totalRevenue: number;
}

const formatEgp = (value: number) =>
  `EGP ${value.toLocaleString("en-US", { maximumFractionDigits: 1 })}`;

const AccountStats = ({ totalOrders, totalRevenue }: AccountStatsProps) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
    <OverviewCard
      data={{
        title: "Total Orders",
        value: String(totalOrders),
        icon: <Users size={18} />,
        iconColor: "text-[#C7861E]",
        badgeColor: "bg-[#F5F0EA]",
      }}
    />
    <OverviewCard
      data={{
        title: "Total Revenue",
        value: formatEgp(totalRevenue),
        icon: <TrendingUp size={18} />,
        iconColor: "text-[#059B5A]",
        badgeColor: "bg-[#E2F4ED]",
      }}
    />
  </div>
);

export default AccountStats;
