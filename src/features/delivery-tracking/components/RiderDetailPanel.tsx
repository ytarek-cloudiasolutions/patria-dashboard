import { ArrowLeft, MapPin, ShoppingBag } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Rider } from "../types";
import OrderCard from "./OrderCard";

interface RiderDetailPanelProps {
  rider: Rider;
  onBack: () => void;
}

const statusStyles: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  "On-Route": {
    bg: "bg-[#EDF4FB]",
    border: "border-[#004EF9]",
    text: "text-[#004EF9]",
  },
  Active: {
    bg: "bg-[#E2F4ED]",
    border: "border-[#059B5A]",
    text: "text-[#059B5A]",
  },
  Delivered: {
    bg: "bg-[#E2F4ED]",
    border: "border-[#059B5A]",
    text: "text-[#059B5A]",
  },
};

const RiderDetailPanel = ({ rider, onBack }: RiderDetailPanelProps) => {
  const { t } = useTranslation();
  const style = statusStyles[rider.status] ?? statusStyles.Active;

  const initials = rider.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const orderCount = rider.activeOrders.length;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[16px] border border-[#CACBD4] bg-[#F5F0EA]">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex cursor-pointer items-center gap-1.5 px-3 pt-3 pb-2 text-[13px] font-semibold text-[#28293D] transition-colors hover:text-[#8F6900]"
      >
        <ArrowLeft size={16} />
        <span>{t("Back to all riders")}</span>
      </button>

      {/* Rider header */}
      <div className="flex flex-col gap-3 px-3">
        {/* Row: avatar + name/phone   status + orders */}
        <div className="flex items-center justify-between">
          {/* Left: Avatar + name/phone */}
          <div className="flex items-center gap-3">
            <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#8F6900] text-[13px] font-bold text-white">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-[#28293D]">
                {rider.name}
              </span>
              <span className="text-[11px] text-[#8B8B8B]">{rider.phone}</span>
            </div>
          </div>

          {/* Right: status badge · orders */}
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex h-[22px] items-center rounded-full border px-2 text-[11px] font-semibold ${style.bg} ${style.border} ${style.text}`}
            >
              {t(rider.status)}
            </span>
            <span className="text-[12px] font-semibold text-[#595959]">•</span>
            <div className="flex items-center gap-1">
              <ShoppingBag size={13} className="text-[#595959]" />
              <span className="text-[12px] text-[#595959]">
                {orderCount} {orderCount === 1 ? t("Order") : t("Orders")}
              </span>
            </div>
          </div>
        </div>

        {/* Location info card */}
        <div className="flex items-center justify-between rounded-[10px] bg-[#E5E5E5] p-2">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[#595959]" />
            <span className="text-[12px] font-medium text-[#28293D]">
              {t("Location on map")}
            </span>
          </div>
          <span className="text-[12px] text-[#28293D]">2h 30 min</span>
        </div>
      </div>

      {/* Active orders label */}
      <div className="px-3 pt-3 pb-2">
        <span className="text-[13px] font-semibold text-[#28293D]">
          {t("Active Orders")} ({rider.activeOrders.length})
        </span>
      </div>

      {/* Scrollable order cards */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 pb-5">
        {rider.activeOrders.length === 0 ? (
          <div className="py-8 text-center text-[13px] text-[#8B8B8B]">
            {t("No active orders")}
          </div>
        ) : (
          rider.activeOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
};

export default RiderDetailPanel;
