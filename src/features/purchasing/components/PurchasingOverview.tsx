import { Box, Clock, TrendingUp, XCircle } from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface PurchasingOverviewProps {
  totalPurchases: number;
  pendingRequests: number;
  requestsReceived: number;
  canceled: number;
}

const formatEgp = (value: number) =>
  `EGP ${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const PurchasingOverview = ({
  totalPurchases,
  pendingRequests,
  requestsReceived,
  canceled,
}: PurchasingOverviewProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <OverviewCard
        data={{
          title: t("Total purchases"),
          value: formatEgp(totalPurchases),
          icon: <TrendingUp size={18} />,
          iconColor: "text-primary",
          badgeColor: "bg-[#F5F0EA]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Pending requests"),
          value: pendingRequests,
          icon: <Clock size={18} />,
          iconColor: "text-[#C7861E]",
          badgeColor: "bg-[#FFF7E6]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Requests received"),
          value: requestsReceived,
          icon: <Box size={18} />,
          iconColor: "text-[#059B5A]",
          badgeColor: "bg-[#E2F4ED]",
        }}
      />
      <OverviewCard
        data={{
          title: t("Canceled"),
          value: canceled,
          icon: <XCircle size={18} />,
          iconColor: "text-[#C90000]",
          badgeColor: "bg-[#FFF0F0]",
        }}
      />
    </div>
  );
};

export default PurchasingOverview;
