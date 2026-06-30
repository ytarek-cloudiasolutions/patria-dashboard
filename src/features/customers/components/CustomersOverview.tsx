import { Users, UserCheck, TrendingUp } from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface CustomersOverviewProps {
  totalCustomers: number;
  activeCustomersToday: number;
  totalRevenue: number;
}

const CustomersOverview = ({
  totalCustomers,
  activeCustomersToday,
  totalRevenue,
}: CustomersOverviewProps) => {
  const { t } = useTranslation();

  const formatRevenue = (value: number) => {
    return `EGP ${value.toLocaleString("en-US", {
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      <OverviewCard
        data={{
          title: t("Total Customers"),
          value: totalCustomers,
          icon: <Users size={20} />,
          iconColor: "text-[#3357B5]",
          badgeColor: "bg-[#E3ECFF]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Active Customers (Today)"),
          value: activeCustomersToday,
          icon: <UserCheck size={20} />,
          iconColor: "text-[#B56C00]",
          badgeColor: "bg-[#FFF0D2]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Revenue"),
          value: formatRevenue(totalRevenue),
          icon: <TrendingUp size={20} />,
          iconColor: "text-[#059B5A]",
          badgeColor: "bg-[#E2F4ED]",
        }}
      />
    </div>
  );
};

export default CustomersOverview;
