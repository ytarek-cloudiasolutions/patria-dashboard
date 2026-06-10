import { DollarSign, Tag, TrendingUp } from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface PricingOverviewProps {
  activeRules: number;
  wholesaleLists: number;
  averageDiscountRate: number;
  revenueImpact: string;
}

const PricingOverview = ({
  activeRules,
  wholesaleLists,
  averageDiscountRate,
  revenueImpact,
}: PricingOverviewProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <OverviewCard
        data={{
          title: t("Active Pricing Rules"),
          value: String(activeRules),
          icon: <DollarSign size={18} />,
          iconColor: "text-primary",
          badgeColor: "bg-[#F5F0EA]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Wholesale Price Lists"),
          value: String(wholesaleLists),
          icon: <DollarSign size={18} />,
          iconColor: "text-[#9524E4]",
          badgeColor: "bg-[#F3E9FA]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Average Discount Rate"),
          value: `${averageDiscountRate.toFixed(1)}%`,
          icon: <Tag size={18} />,
          iconColor: "text-[#C7861E]",
          badgeColor: "bg-[#FFF7E6]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Impact on Revenue"),
          value: revenueImpact,
          icon: <TrendingUp size={18} />,
          iconColor: "text-[#059B5A]",
          badgeColor: "bg-[#E2F4ED]",
        }}
      />
    </div>
  );
};

export default PricingOverview;
