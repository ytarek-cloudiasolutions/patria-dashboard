import { Truck, Zap, Users, Star } from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { SUPPLIER_OVERVIEW } from "../data";

interface SuppliersOverviewProps {
  totalSuppliers: number;
}

const SuppliersOverview = ({ totalSuppliers }: SuppliersOverviewProps) => {
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
          title: t("Supply speed"),
          value: SUPPLIER_OVERVIEW.supplySpeed,
          icon: <Zap size={18} />,
          iconColor: "text-[#059B5A]",
          badgeColor: "bg-[#E2F4ED]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Average supply cycle"),
          value: SUPPLIER_OVERVIEW.averageSupplyCycle,
          icon: <Users size={18} />,
          iconColor: "text-[#2563EB]",
          badgeColor: "bg-[#DBEAFE]",
        }}
      />
      <OverviewCard
        data={{
          title: t("quality assurance"),
          value: SUPPLIER_OVERVIEW.qualityAssurance,
          icon: <Star size={18} />,
          iconColor: "text-[#8B16FF]",
          badgeColor: "bg-[#F3E9FA]",
        }}
      />
    </div>
  );
};

export default SuppliersOverview;
