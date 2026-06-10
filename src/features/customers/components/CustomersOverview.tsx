import { Users, UserCheck, UserPlus } from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { CUSTOMER_OVERVIEW } from "../data";

const CustomersOverview = () => {
  const { t } = useTranslation();
  return (
  <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
    <OverviewCard
      data={{
        title: t("Total Customers"),
        value: CUSTOMER_OVERVIEW.totalCustomers,
        icon: <Users size={20} />,
        iconColor: "text-[#3357B5]",
        badgeColor: "bg-[#E3ECFF]",
      }}
    />
    <OverviewCard
      data={{
        title: t("Active Customers (Today)"),
        value: CUSTOMER_OVERVIEW.activeCustomersToday,
        icon: <UserCheck size={20} />,
        iconColor: "text-[#B56C00]",
        badgeColor: "bg-[#FFF0D2]",
      }}
    />
    <OverviewCard
      data={{
        title: t("Active Coupons"),
        value: CUSTOMER_OVERVIEW.activeCoupons,
        icon: <UserPlus size={20} />,
        iconColor: "text-[#059B5A]",
        badgeColor: "bg-[#E2F4ED]",
      }}
    />
  </div>
  );
};

export default CustomersOverview;
