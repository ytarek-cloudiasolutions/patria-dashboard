import { Fragment, useState } from "react";
import { Info, Package } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import OrderStatusPill from "./OrderStatusPill";
import type { Zone } from "../types";

const PREVIEW_COUNT = 4;

interface ZoneCardProps {
  zone: Zone;
  onDispatch: (zone: Zone) => void;
}

const ZoneCard = ({ zone, onDispatch }: ZoneCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const visibleOrders = expanded
    ? zone.orders
    : zone.orders.slice(0, PREVIEW_COUNT);
  const remaining = zone.orders.length - PREVIEW_COUNT;
  const hasPending = zone.orders.some((order) => order.status === "Pending");

  return (
    <Card className="rounded-[16px] border border-[#E5E5E5] bg-white py-0 ring-0 shadow-sm">
      <CardContent className="flex h-full flex-col gap-3 px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[18px] font-bold text-[#28293D] sm:text-[20px]">
            {zone.name}
          </h3>
          <Badge className="h-6 gap-1 rounded-full bg-primary px-2 py-0 text-[11px] font-semibold text-primary-foreground">
            <Info size={12} />
            {zone.orders.length} Orders
          </Badge>
        </div>

        <div className="flex flex-col gap-2.5">
          {visibleOrders.map((order, index) => (
            <Fragment key={order.id}>
              {index > 0 && <Separator className="bg-[#E5E5E5]" />}
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[#28293D]">
                    {order.reference}
                  </p>
                  <p className="text-[12px] text-[#8B8B8B]">{order.customer}</p>
                </div>
                <OrderStatusPill order={order} />
              </div>
            </Fragment>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-2">
          {remaining > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mx-auto inline-flex h-7 cursor-pointer items-center rounded-full border border-[#624F1C] bg-[#F5F0EA] px-3 text-[12px] font-semibold text-primary"
            >
              {expanded ? "Show less" : `View ${remaining} more orders`}
            </button>
          )}

          {hasPending && (
            <DefaultButton
              data={{
                buttonText: "Dispatch Driver",
                variant: "outline",
                type: "button",
                onClick: () => onDispatch(zone),
                className:
                  "w-full sm:w-auto border-primary text-primary hover:bg-white hover:text-primary",
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ZoneCard;
