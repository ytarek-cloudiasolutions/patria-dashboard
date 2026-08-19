import { Truck, Zap, Users, CheckCircle2 } from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface SuppliersOverviewProps {
  totalSuppliers: number;
  onTimeRate: number | null;
  averageSupplyCycleHours: number | null;
  fulfillmentRate: number | null;
}

const formatHours = (hours: number) =>
  hours >= 24 ? `${(hours / 24).toFixed(1)} ${"days"}` : `${hours.toFixed(1)} Hrs`;

const SuppliersOverview = ({
  totalSuppliers,
  onTimeRate,
  averageSupplyCycleHours,
  fulfillmentRate,
}: SuppliersOverviewProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <OverviewCard
        data={{
          title: t("Total suppliers"),
          value: totalSuppliers,
          icon: <Truck size={18} />,
          iconColor: "text-primary",
          badgeColor: "bg-[#F5F0EA]",
        }}
      />
      <OverviewCard
        data={{
          title: t("On-time delivery rate"),
          value: onTimeRate != null ? `${onTimeRate}%` : "—",
          icon: <Zap size={18} />,
          iconColor: "text-[#059B5A]",
          badgeColor: "bg-[#E2F4ED]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Average supply cycle"),
          value: averageSupplyCycleHours != null ? formatHours(averageSupplyCycleHours) : "—",
          icon: <Users size={18} />,
          iconColor: "text-[#2563EB]",
          badgeColor: "bg-[#DBEAFE]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Fulfillment rate"),
          value: fulfillmentRate != null ? `${fulfillmentRate}%` : "—",
          icon: <CheckCircle2 size={18} />,
          iconColor: "text-[#8B16FF]",
          badgeColor: "bg-[#F3E9FA]",
        }}
      />
    </div>
  );
};

export default SuppliersOverview;
