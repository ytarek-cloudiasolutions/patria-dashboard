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
        {/* Name + phone */}
        <div className="flex flex-col items-start">
          <span className="text-[14px] font-semibold text-[#28293D]">
            {rider.name}
          </span>
          <span className="text-[12px] text-[#8B8B8B]">{rider.phone}</span>
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
