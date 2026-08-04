import { Zap, TrendingUp, Users } from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Offer } from "../types";

interface PromotionsOverviewProps {
  offers: Offer[];
}

const PromotionsOverview = ({ offers }: PromotionsOverviewProps) => {
  const { t } = useTranslation();

  const activePromotionsCount = offers.filter((o) => o.offerStatus).length;
  const totalRedeemedCount = offers.reduce(
    (sum, o) => sum + (o.claimsCount ?? o.usageCount ?? 0),
    0,
  );

  return (
    <div className="mb-6 grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
      <OverviewCard
        data={{
          title: t("Active Promotions"),
          value: `${activePromotionsCount} ${t("Campaigns")}`,
          icon: <Zap size={24} />,
          iconColor: "text-[#155DFC]",
          badgeColor: "bg-[#DBEAFE]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Total Redeemed"),
          value: `${totalRedeemedCount} ${t("Claims")}`,
          icon: <TrendingUp size={24} />,
          iconColor: "text-[#059B5A]",
          badgeColor: "bg-[#E2F4ED]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Reach Potential"),
          value: t("Dynamic Audience"),
          icon: <Users size={24} />,
          iconColor: "text-[#C7861E]",
          badgeColor: "bg-[#FE9A00]/10",
        }}
      />
    </div>
  );
};

export default PromotionsOverview;
