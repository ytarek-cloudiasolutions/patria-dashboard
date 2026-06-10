import { Clock, MapPin, Truck } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import OverviewCard from "@/shared/components/OverviewCard";

interface LogisticsOverviewProps {
  activeZones: number;
  officialDrivers: number;
  pendingOrders: number;
}

const LogisticsOverview = ({
  activeZones,
  officialDrivers,
  pendingOrders,
}: LogisticsOverviewProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      <OverviewCard
        data={{
          title: t("Active Zones"),
          value: activeZones,
          icon: <MapPin size={18} />,
          iconColor: "text-[#B56C00]",
          badgeColor: "bg-[#FFF5DC]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Official Drivers"),
          value: officialDrivers,
          icon: <Truck size={18} />,
          iconColor: "text-[#1A7A45]",
          badgeColor: "bg-[#E2F4ED]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Pending Orders"),
          value: pendingOrders,
          icon: <Clock size={18} />,
          iconColor: "text-[#C7861E]",
          badgeColor: "bg-[#FFF7E6]",
        }}
      />
    </div>
  );
};

export default LogisticsOverview;
