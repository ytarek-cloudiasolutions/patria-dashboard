import { Truck, Zap, Users, Star } from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Supplier } from "../types";

interface SuppliersOverviewProps {
  suppliers: Supplier[];
}

const SuppliersOverview = ({ suppliers }: SuppliersOverviewProps) => {
  const { t } = useTranslation();

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(
    (s) => s.status === "Documented",
  ).length;
  const pendingSuppliers = suppliers.filter(
    (s) => s.status === "Pending",
  ).length;
  const inactiveSuppliers = suppliers.filter(
    (s) => s.status === "Inactive",
  ).length;

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <OverviewCard
        data={{
          title: t("Total suppliers"),
          value: totalSuppliers,
          icon: <Truck size={18} />,
          iconColor: "text-[#B56C00]",
          badgeColor: "bg-[#FFF5DC]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Active suppliers"),
          value: activeSuppliers,
          icon: <Zap size={18} />,
          iconColor: "text-[#1A7A45]",
          badgeColor: "bg-[#E0F5EC]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Pending suppliers"),
          value: pendingSuppliers,
          icon: <Users size={18} />,
          iconColor: "text-[#5C6EAE]",
          badgeColor: "bg-[#E0E8F5]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Inactive suppliers"),
          value: inactiveSuppliers,
          icon: <Star size={18} />,
          iconColor: "text-[#7A1A7A]",
          badgeColor: "bg-[#F5E0F5]",
        }}
      />
    </div>
  );
};

export default SuppliersOverview;
