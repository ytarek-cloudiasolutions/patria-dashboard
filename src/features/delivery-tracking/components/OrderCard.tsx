import { MapPin, ShoppingBag, UtensilsCrossed, Truck, CircleCheckBig, MapPinned } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import DefaultButton from "@/shared/components/DefaultButton";
import type { DeliveryOrder, OrderStatus } from "../types";

interface OrderCardProps {
  order: DeliveryOrder;
}

/* ---- status badge colours ---- */
const statusBadgeStyles: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  "Order Placed": {
    bg: "bg-[#F5F0EA]",
    border: "border-[#8F6900]",
    text: "text-[#8F6900]",
  },
  Preparing: {
    bg: "bg-[#F5F0EA]",
    border: "border-[#8F6900]",
    text: "text-[#8F6900]",
  },
  "On The Way": {
    bg: "bg-[#F3E9FA]",
    border: "border-[#7E00D7]",
    text: "text-[#7E00D7]",
  },
  Assigned: {
    bg: "bg-[#F5F0EA]",
    border: "border-[#8F6900]",
    text: "text-[#8F6900]",
  },
  Delivered: {
    bg: "bg-[#E2F4ED]",
    border: "border-[#059B5A]",
    text: "text-[#059B5A]",
  },
};

/* ---- stepper logic ---- */
const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "Order Placed", label: "Order Placed" },
  { key: "Preparing", label: "Preparing" },
  { key: "On The Way", label: "On the Way" },
  { key: "Delivered", label: "Delivered" },
];

const stepIndex = (status: OrderStatus) => {
  const map: Record<string, number> = {
    "Order Placed": 0,
    Preparing: 1,
    "On The Way": 2,
    Assigned: 1, // assigned is visually same as "Preparing" done
    Delivered: 3,
  };
  return map[status] ?? 0;
};

const StepIcon = ({
  stepKey,
  active,
}: {
  stepKey: OrderStatus;
  active: boolean;
}) => {
  const cls = active ? "text-white" : "text-[#B0B0B0]";
  const size = 16;
  switch (stepKey) {
    case "Order Placed":
      return <ShoppingBag size={size} className={cls} />;
    case "Preparing":
      return <UtensilsCrossed size={size} className={cls} />;
    case "On The Way":
      return <Truck size={size} className={cls} />;
    case "Delivered":
      return <CircleCheckBig size={size} className={cls} />;
    default:
      return <ShoppingBag size={size} className={cls} />;
  }
};

const OrderCard = ({ order }: OrderCardProps) => {
  const { t } = useTranslation();
  const badge = statusBadgeStyles[order.status] ?? statusBadgeStyles.Preparing;
  const activeIdx = stepIndex(order.status);

  const formatCurrency = (value: number) =>
    `EGP ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col gap-3 rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-4">
      {/* Header: Order number + status badge */}
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-bold text-[#28293D]">
          {t("Order")} #{order.orderNumber}
        </span>
        <span
          className={`inline-flex h-[22px] items-center rounded-full border px-3 text-[11px] font-semibold italic ${badge.bg} ${badge.border} ${badge.text}`}
        >
          {t(order.status)}
        </span>
      </div>

      {/* Customer name */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] font-bold text-[#28293D]">
          {order.customer}
        </span>
        {/* Address with location icon */}
        <div className="flex items-start gap-1">
          <MapPin size={13} className="mt-0.5 shrink-0 text-[#8B8B8B]" />
          <span className="text-[12px] leading-[1.4] text-[#8B8B8B]">
            {order.address}
          </span>
        </div>
      </div>

      {/* Separator */}
      <div className="h-px bg-[#E5E5E5]" />

      {/* Items count · Amount */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1">
          <ShoppingBag size={13} className="text-[#595959]" />
          <span className="text-[12px] text-[#595959]">
            {order.itemCount} {order.itemCount === 1 ? t("Item") : t("Items")}
          </span>
        </div>
        <span className="text-[12px] font-semibold text-[#595959]">•</span>
        <span className="text-[14px] font-bold text-[#28293D]">
          {formatCurrency(order.amount)}
        </span>
      </div>

      {/* Progress stepper */}
      <div className="rounded-[12px] bg-[#F5F0EA] px-3 py-3">
        <div className="flex items-start justify-between">
          {STEPS.map((step, idx) => {
            const isActive = idx <= activeIdx;
            const isLast = idx === STEPS.length - 1;

            return (
              <div key={step.key} className="flex flex-1 flex-col items-center">
                {/* Icon row with connecting line */}
                <div className="flex w-full items-center">
                  {/* Left line */}
                  <div
                    className={`h-[2px] flex-1 ${
                      idx === 0
                        ? "opacity-0"
                        : idx <= activeIdx
                          ? "bg-[#8F6900]"
                          : "bg-[#D4D4D4]"
                    }`}
                  />

                  {/* Icon circle */}
                  <div
                    className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full ${
                      isActive ? "bg-[#8F6900]" : "bg-[#E5E5E5]"
                    }`}
                  >
                    <StepIcon stepKey={step.key} active={isActive} />
                  </div>

                  {/* Right line */}
                  <div
                    className={`h-[2px] flex-1 ${
                      isLast
                        ? "opacity-0"
                        : idx + 1 <= activeIdx
                          ? "bg-[#8F6900]"
                          : "bg-[#D4D4D4]"
                    }`}
                  />
                </div>

                {/* Label */}
                <span
                  className={`mt-1.5 text-center text-[9px] font-medium leading-tight ${
                    isActive ? "text-[#28293D]" : "text-[#B0B0B0]"
                  }`}
                >
                  {t(step.label)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Show on map button — the order only carries a text address (no
          lat/lng), so this opens it in Google Maps rather than faking a
          pin position on the internal map. */}
      <DefaultButton
        data={{
          buttonText: t("Show on map"),
          icon: <MapPinned size={18} />,
          className: "w-full",
          onClick: () =>
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`,
              "_blank",
              "noopener,noreferrer",
            ),
        }}
      />
    </div>
  );
};

export default OrderCard;
