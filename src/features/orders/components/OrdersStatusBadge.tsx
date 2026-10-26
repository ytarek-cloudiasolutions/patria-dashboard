import { Badge } from "@/shared/components/ui/badge";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "../types";

type StatusStyle = {
  bg: string;
  text: string;
  borderColor: string;
};

const STATUS_STYLES: Record<OrderStatus, StatusStyle> = {
  Pending: {
    bg: "bg-[#FFF4DA]",
    text: "text-[#C7861E]",
    borderColor: "#C7861E",
  },
  Confirmed: {
    bg: "bg-[#EDF4FB]",
    text: "text-[#004EF9]",
    borderColor: "#004EF9",
  },
  Preparing: {
    bg: "bg-[#F5F0EA]",
    text: "text-[#8F6900]",
    borderColor: "#725400",
  },
  "On The Way": {
    bg: "bg-[#F3E9FA]",
    text: "text-[#7E00D7]",
    borderColor: "#7E00D7",
  },
  Delivered: {
    bg: "bg-[#E2F4ED]",
    text: "text-[#059B5A]",
    borderColor: "#059B5A",
  },
  Completed: {
    bg: "bg-[#E2F4ED]",
    text: "text-[#059B5A]",
    borderColor: "#059B5A",
  },
  Cancelled: {
    bg: "bg-[#C90000]",
    text: "text-white",
    borderColor: "#C90000",
  },
};

interface OrdersStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const OrdersStatusBadge = ({ status, className }: OrdersStatusBadgeProps) => {
  const { t } = useTranslation();
  const style = STATUS_STYLES[status];

  return (
    <Badge
      className={cn(
        "h-5 w-28 justify-center whitespace-nowrap rounded-[999px] border px-3 text-center font-semibold text-[11px]",
        style.bg,
        style.text,
        className,
      )}
      style={{ borderColor: style.borderColor }}
    >
      {t(status)}
    </Badge>
  );
};

export default OrdersStatusBadge;
