import { Bike, Navigation, ShoppingBag } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import OverviewCard from "@/shared/components/OverviewCard";

interface TrackingOverviewProps {
  activeRiders: number;
  onRoute: number;
  activeOrders: number;
}

const TrackingOverview = ({
  activeRiders,
  onRoute,
  activeOrders,
}: TrackingOverviewProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      <OverviewCard
        data={{
          title: t("Active Riders"),
          value: activeRiders,
          icon: <Bike size={18} />,
          iconColor: "text-[#8F6900]",
          badgeColor: "bg-[#F5F0EA]",
        }}
      />
      <OverviewCard
        data={{
          title: t("On Route"),
          value: onRoute,
          icon: <Navigation size={18} />,
          iconColor: "text-[#2563EB]",
          badgeColor: "bg-[#DBEAFE]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Active Orders"),
          value: activeOrders,
          icon: <ShoppingBag size={18} />,
          iconColor: "text-[#C7861E]",
          badgeColor: "bg-[rgba(254,154,0,0.1)]",
        }}
      />
    </div>
  );
};

export default TrackingOverview;
