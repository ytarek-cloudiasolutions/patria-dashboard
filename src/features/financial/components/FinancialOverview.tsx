import { Target, TrendingDown, TrendingUp, Zap } from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";

interface FinancialOverviewProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: string;
}

const formatEgp = (value: number) =>
  `EGP ${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const FinancialOverview = ({
  totalRevenue,
  totalExpenses,
  netProfit,
  profitMargin,
}: FinancialOverviewProps) => (
  <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
    <OverviewCard
      data={{
        title: "Total Revenue",
        value: formatEgp(totalRevenue),
        icon: <TrendingUp size={18} />,
        iconColor: "text-primary",
        badgeColor: "bg-[#F5F0EA]",
      }}
    />
    <OverviewCard
      data={{
        title: "Total Expenses",
        value: formatEgp(totalExpenses),
        icon: <TrendingDown size={18} />,
        iconColor: "text-[#C90000]",
        badgeColor: "bg-[#FFF0F0]",
      }}
    />
    <OverviewCard
      data={{
        title: "Net Profit",
        value: formatEgp(netProfit),
        icon: <Zap size={18} />,
        iconColor: "text-[#059B5A]",
        badgeColor: "bg-[#E2F4ED]",
      }}
    />
    <OverviewCard
      data={{
        title: "Profit Margin",
        value: profitMargin,
        icon: <Target size={18} />,
        iconColor: "text-[#C7861E]",
        badgeColor: "bg-[#FFF7E6]",
      }}
    />
  </div>
);

export default FinancialOverview;
