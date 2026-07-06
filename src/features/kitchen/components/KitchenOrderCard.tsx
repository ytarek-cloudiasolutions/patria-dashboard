import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Clock3, UserRound, Smartphone } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { KitchenOrder, OrderStatus, OrderType } from "../types";

interface KitchenOrderCardProps {
  order: KitchenOrder;
}

const orderTypeStyle: Record<
  OrderType,
  { bg: string; text: string; border: string; label: string }
> = {
  takeaway: {
    bg: "#8F6900",
    text: "#FFFFFF",
    border: "#624F1C",
    label: "Takeaway",
  },
  "dine-in": {
    bg: "#444A18",
    text: "#FFFFFF",
    border: "#624F1C",
    label: "Dine-In",
  },
};

const orderStatusStyle: Record<
  OrderStatus,
  { bg: string; text: string; border: string; label: string }
> = {
  delivered: {
    bg: "#E2F4ED",
    text: "#059B5A",
    border: "#059B5A",
    label: "Delivered",
  },
  preparing: {
    bg: "#FE9A001A",
    text: "#C7861E",
    border: "#C7861E",
    label: "Preparing",
  },
  rejected: {
    bg: "#FFF0F0",
    text: "#C90000",
    border: "#C90000",
    label: "Rejected",
  },
};

const KitchenOrderCard = ({ order }: KitchenOrderCardProps) => {
  const { t } = useTranslation();
  const typeStyle = orderTypeStyle[order.type];
  const statusStyle = orderStatusStyle[order.status];

  return (
    <Card className="rounded-2xl border border-[#E7E7EC] bg-white p-6 py-6 ring-0">
      <CardContent className="px-0 py-0">
        <div className="mb-[18px] flex items-center justify-between gap-3">
          <h3 className="text-[20px] leading-none font-bold text-[#333333]">
            {order.orderNumber}
          </h3>
          <Badge
            className="rounded-[30px] border px-3 py-1 text-[13px] font-normal"
            style={{
              backgroundColor: typeStyle.bg,
              color: typeStyle.text,
              borderColor: typeStyle.border,
            }}
          >
            {t(typeStyle.label)}
          </Badge>
        </div>

        <div className="mb-4 rounded-[10px] border border-[#E5E5E5] bg-[#FAFAF7] p-2 text-[12px] text-[#595959]">
          <div className="mb-3 flex items-center gap-1">
            <Clock3 className="size-4" />
            {t("Received")}{" "}
            {order.receivedAt
              .replace(/^Received\s*/i, "")
              .replace(/mins ago/gi, t("mins ago"))
              .replace(/^at\s/i, `${t("at")} `)}
          </div>
          <div className="mb-3 flex items-center gap-1">
            <UserRound className="size-4" />
            {order.customerType}
          </div>
          <div className="flex items-center gap-1">
            <Smartphone className="size-4" />
            <span dir="ltr">{order.customerPhone}</span>
          </div>
        </div>

        <ul
          className="mb-4 space-y-2 list-disc pl-7 pr-3 text-[14px] font-medium
         text-black"
        >
          {order.items.map((item) => (
            <li key={item} className="marker:text-black">
              {item}
            </li>
          ))}
        </ul>

        <div
          className="rounded-[30px] border px-3 py-2 text-center text-[13px] font-semibold"
          style={{
            backgroundColor: statusStyle.bg,
            color: statusStyle.text,
            borderColor: statusStyle.border,
          }}
        >
          {t(statusStyle.label)}
        </div>
      </CardContent>
    </Card>
  );
};

export default KitchenOrderCard;
