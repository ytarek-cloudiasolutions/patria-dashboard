import { Badge } from "@/shared/components/ui/badge";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { OrderStatus } from "../types";

type StatusStyle = {
  bg: string;
  text: string;
  borderColor: string;
};

const STATUS_STYLES: Record<OrderStatus, StatusStyle> = {
  Pending: {
    bg: "bg-[#FFF7E6]",
    text: "text-[#C7861E]",
    borderColor: "#C7861E",
  },
  Confirmed: {
    bg: "bg-[#EDF4FB]",
    text: "text-[#3574FF]",
    borderColor: "#004EF9",
  },
  Preparing: {
    bg: "bg-[#F5F0EA]",
    text: "text-[#8F6900]",
    borderColor: "#624F1C",
  },
  "On The Way": {
    bg: "bg-[#F4E8FF]",
    text: "text-[#8B16FF]",
    borderColor: "#8B16FF",
  },
  Delivered: {
    bg: "bg-[#E2F4ED]",
    text: "text-[#059B5A]",
    borderColor: "#059B5A",
  },
  Cancelled: {
    bg: "bg-[#FFF0F0]",
    text: "text-[#C90000]",
    borderColor: "#C90000",
  },
};

interface OrdersStatusBadgeProps {
  status: OrderStatus;
}

const OrdersStatusBadge = ({ status }: OrdersStatusBadgeProps) => {
  const { t } = useTranslation();
  const style = STATUS_STYLES[status];

  return (
    <Badge
      className={`h-5 w-28 justify-center whitespace-nowrap rounded-[999px] border px-3 text-center font-semibold text-[11px] ${style.bg} ${style.text}`}
      style={{ borderColor: style.borderColor }}
    >
      {t(status)}
    </Badge>
  );
};

export default OrdersStatusBadge;
