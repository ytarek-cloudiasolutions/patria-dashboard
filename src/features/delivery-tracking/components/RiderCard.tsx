import { ChevronRight, Clock, ShoppingBag } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Rider } from "../types";

interface RiderCardProps {
  rider: Rider;
  onClick: (rider: Rider) => void;
}

const statusStyles: Record<string, { bg: string; border: string; text: string }> = {
  "On-Route": { bg: "bg-[#EDF4FB]", border: "border-[#004EF9]", text: "text-[#004EF9]" },
  Active: { bg: "bg-[#E2F4ED]", border: "border-[#059B5A]", text: "text-[#059B5A]" },
  Delivered: { bg: "bg-[#E2F4ED]", border: "border-[#059B5A]", text: "text-[#059B5A]" },
};

const RiderCard = ({ rider, onClick }: RiderCardProps) => {
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
    <button
      type="button"
      onClick={() => onClick(rider)}
      className="flex w-full cursor-pointer items-center gap-3 rounded-[16px] border border-[#E5E5E5] bg-white p-3 transition-colors hover:bg-[#FAFAF7]"
    >
      {/* Avatar */}
      <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#8F6900] text-[14px] font-bold text-white">
        {initials}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        {/* Name + phone + GPS indicator */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <span className="text-[14px] font-semibold text-[#28293D]">
              {rider.name}
            </span>
            <span className="text-[12px] text-[#8B8B8B]">{rider.phone}</span>
          </div>

          {/* GPS status badge */}
          {rider.location ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-[#059B5A]/30 bg-[#E2F4ED] px-2 py-0.5 text-[10px] font-semibold text-[#059B5A]"
              title={t("Live GPS active")}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#059B5A] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#059B5A]"></span>
              </span>
              GPS
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 rounded-full border border-[#CACBD4]/60 bg-[#F5F5F5] px-2 py-0.5 text-[10px] font-medium text-[#8B8B8B]"
              title={t("No GPS signal")}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#B0B0B0]"></span>
              {t("No GPS")}
            </span>
          )}
        </div>

        {/* Status · Orders · Time */}
        <div className="flex flex-wrap items-center gap-1.5">
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

          <span className="text-[12px] font-semibold text-[#595959]">•</span>

          <div className="flex items-center gap-1">
            <Clock size={13} className="text-[#595959]" />
            <span className="text-[12px] text-[#595959]">{rider.dutyTime}</span>
          </div>
        </div>
      </div>

      {/* Chevron */}
      <ChevronRight size={22} className="shrink-0 text-[#8B8B8B]" />
    </button>
  );
};

export default RiderCard;
