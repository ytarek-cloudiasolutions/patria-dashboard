import type { OrderStatus } from "../types";

const statusConfig: Record<OrderStatus, { className: string; label: string }> =
  {
    Pending: {
      className: "bg-[#FFF8E6] text-[#B07D00] border border-[#F0D080]",
      label: "Pending",
    },
    Confirmed: {
      className: "bg-[#E8F5FF] text-[#0072C6] border border-[#A8D8FF]",
      label: "Confirmed",
    },
    Delivered: {
      className: "bg-[#E2F4ED] text-[#059B5A] border border-[#A8DFC4]",
      label: "Delivered",
    },
    "On the Way": {
      className: "bg-[#F3EEFF] text-[#6B3FD4] border border-[#C9B0F5]",
      label: "On the Way",
    },
    Cancelled: {
      className: "bg-[#FFF0F0] text-[#C90000] border border-[#F5AAAA]",
      label: "Cancelled",
    },
  };

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[30px] px-3 py-0.5 text-[11px] font-semibold whitespace-nowrap ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
