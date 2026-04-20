import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Clock3, UserRound, Smartphone } from "lucide-react";
import type { KitchenOrder, OrderStatus, OrderType } from "../types";

interface KitchenOrderCardProps {
  order: KitchenOrder;
}

const orderTypeStyle: Record<
  OrderType,
  { bg: string; text: string; label: string }
> = {
  takeaway: {
    bg: "var(--primary)",
    text: "#FFFFFF",
    label: "Takeaway",
  },
  "dine-in": {
    bg: "#444A18",
    text: "#FFFFFF",
    label: "Dine-In",
  },
};

const orderStatusStyle: Record<
  OrderStatus,
  { bg: string; text: string; label: string }
> = {
  delivered: {
    bg: "#EDF8F0",
    text: "#059B5A",
    label: "Delivered",
  },
  preparing: {
    bg: "#FE9A001A",
    text: "#C7861E",
    label: "Preparing",
  },
  rejected: {
    bg: "#FFF0F0",
    text: "#C90000",
    label: "Rejected",
  },
};

const KitchenOrderCard = ({ order }: KitchenOrderCardProps) => {
  const typeStyle = orderTypeStyle[order.type];
  const statusStyle = orderStatusStyle[order.status];

  return (
    <Card className="rounded-2xl bg-white py-0 ring-1 ring-[#E7E7EC]">
      <CardContent className="px-4 py-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-[20px] leading-none font-bold text-[#303030]">
            {order.orderNumber}
          </h3>
          <Badge
            className="rounded-full border-none px-2.5 text-[12px] font-semibold"
            style={{ backgroundColor: typeStyle.bg, color: typeStyle.text }}
          >
            {typeStyle.label}
          </Badge>
        </div>

        <div className="mb-4 rounded-[16px] border border-[#E5E5E5] px-3 py-2 text-[10px] text-[#7A7A7A] bg-[#FAFAF7]">
          <div className="mb-3 flex items-center gap-1.5 text-[12px]">
            <Clock3 className="size-4" />
            {order.receivedAt}
          </div>
          <div className="mb-3 flex items-center gap-1.5  text-[12px]">
            <UserRound className="size-4" />
            {order.customerType}
          </div>
          <div className="flex items-center gap-1.5  text-[12px]">
            <Smartphone className="size-4" />
            {order.customerPhone}
          </div>
        </div>

        <ul className="mb-4 space-y-2 pl-8 text-[14px] font-medium text-[#28293D]">
          {order.items.map((item) => (
            <li key={item} className="list-disc marker:text-[#28293D]">
              {item}
            </li>
          ))}
        </ul>

        <div
          className="rounded-[30px] py-2 text-center text-[13px] font-semibold"
          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
        >
          {statusStyle.label}
        </div>
      </CardContent>
    </Card>
  );
};

export default KitchenOrderCard;
