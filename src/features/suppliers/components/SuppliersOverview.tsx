import { Truck, Zap, Users, Star } from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";
import { SUPPLIER_OVERVIEW } from "../data";

interface SuppliersOverviewProps {
  totalSuppliers: number;
}

const SuppliersOverview = ({ totalSuppliers }: SuppliersOverviewProps) => (
  <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
    <OverviewCard
      data={{
        title: "Total suppliers",
        value: totalSuppliers,
        icon: <Truck size={18} />,
        iconColor: "text-[#B56C00]",
        badgeColor: "bg-[#FFF5DC]",
      }}
    />
    <OverviewCard
      data={{
        title: "Supply speed",
        value: SUPPLIER_OVERVIEW.supplySpeed,
        icon: <Zap size={18} />,
        iconColor: "text-[#1A7A45]",
        badgeColor: "bg-[#E0F5EC]",
      }}
    />
    <OverviewCard
      data={{
        title: "Average supply cycle",
        value: SUPPLIER_OVERVIEW.averageSupplyCycle,
        icon: <Users size={18} />,
        iconColor: "text-[#5C6EAE]",
        badgeColor: "bg-[#E0E8F5]",
      }}
    />
    <OverviewCard
      data={{
        title: "quality assurance",
        value: SUPPLIER_OVERVIEW.qualityAssurance,
        icon: <Star size={18} />,
        iconColor: "text-[#7A1A7A]",
        badgeColor: "bg-[#F5E0F5]",
      }}
    />
  </div>
);

export default SuppliersOverview;
