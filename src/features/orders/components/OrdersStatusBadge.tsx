import { Badge } from "@/shared/components/ui/badge";
import type { OrderStatus } from "../types";

type StatusStyle = {
  bg: string;
  text: string;
  borderColor: string;
};

export const STATUS_STYLES: Record<OrderStatus, StatusStyle> = {
  Pending: {
    bg: "bg-[#FE9A001A]",
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
  "Out for Delivery": {
    bg: "bg-[#DCDCDC]",
    text: "text-[#23252A]",
    borderColor: "#595959",
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
  return (
    <Badge
      className={`h-6 w-31 justify-center whitespace-nowrap rounded-[999px] border border-current px-2 text-center font-semibold text-[12px] ${STATUS_STYLES[status].bg} ${STATUS_STYLES[status].text}`}
    >
      {status}
    </Badge>
  );
};

export default OrdersStatusBadge;
