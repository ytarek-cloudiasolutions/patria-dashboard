import { Flame, ShieldCheck, Gauge, XCircle } from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface RoastOverviewProps {
  activeBatches: number;
  qualityIndex: string;
  productionEfficiency: string;
  averageLossRate: string;
}

const RoastOverview = ({
  activeBatches,
  qualityIndex,
  productionEfficiency,
  averageLossRate,
}: RoastOverviewProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <OverviewCard
        data={{
          title: t("Active Batches"),
          value: activeBatches,
          icon: <Flame size={18} />,
          iconColor: "text-[#B56C00]",
          badgeColor: "bg-[#FFF5DC]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Quality Index"),
          value: qualityIndex,
          icon: <ShieldCheck size={18} />,
          iconColor: "text-[#1A7A45]",
          badgeColor: "bg-[#E2F4ED]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Production Efficiency"),
          value: productionEfficiency,
          icon: <Gauge size={18} />,
          iconColor: "text-[#C7861E]",
          badgeColor: "bg-[#FFF7E6]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Average Loss Rate"),
          value: averageLossRate,
          icon: <XCircle size={18} />,
          iconColor: "text-[#C90000]",
          badgeColor: "bg-[#FFF0F0]",
        }}
      />
    </div>
  );
};

export default RoastOverview;
