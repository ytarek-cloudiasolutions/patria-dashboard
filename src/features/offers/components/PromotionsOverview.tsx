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
  const totalRedeemedCount = offers.reduce((sum, o) => sum + (o.usageCount || 0), 0);

  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      <OverviewCard
        data={{
          title: t("Active Promotions"),
          value: `${activePromotionsCount} ${t("Campaigns")}`,
          icon: <Zap size={20} />,
          iconColor: "text-[#3357B5]",
          badgeColor: "bg-[#E3ECFF]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Total Redeemed"),
          value: `${totalRedeemedCount} ${t("Claims")}`,
          icon: <TrendingUp size={20} />,
          iconColor: "text-[#059B5A]",
          badgeColor: "bg-[#E2F4ED]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Reach Potential"),
          value: t("Dynamic Audience"),
          icon: <Users size={20} />,
          iconColor: "text-[#B56C00]",
          badgeColor: "bg-[#FFF0D2]",
        }}
      />
    </div>
  );
};

export default PromotionsOverview;
