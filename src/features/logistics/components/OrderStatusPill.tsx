import { Truck } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { ZoneOrder } from "../types";

interface OrderStatusPillProps {
  order: ZoneOrder;
}

const OrderStatusPill = ({ order }: OrderStatusPillProps) => {
  const { t } = useTranslation();
  if (order.status === "Assigned" && order.assignedDriverName) {
    return (
      <Badge
        className={cn(
          "h-6 gap-1 rounded-full border border-[#059B5A]/40 bg-[#E2F4ED] px-2 py-0 text-[11px] font-semibold text-[#059B5A]",
        )}
      >
        <Truck size={12} />
        {order.assignedDriverName}
      </Badge>
    );
  }
  return (
    <Badge
      className={cn(
        "h-6 gap-1 rounded-full border border-[#B56C00]/40 bg-[#FFF5DC] px-2 py-0 text-[11px] font-semibold text-[#B56C00]",
      )}
    >
      {t("Pending")}
    </Badge>
  );
};

export default OrderStatusPill;
