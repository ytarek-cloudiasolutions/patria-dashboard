import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Rider } from "../types";
import orderIcon from "../assets/rider-orders.svg";
import dutyTimeIcon from "../assets/rider-duty-time.svg";
import chevronIcon from "../assets/rider-card-chevron.svg";

interface RiderCardProps {
  rider: Rider;
  onClick: (rider: Rider) => void;
}

const statusStyles: Record<string, { bg: string; border: string; text: string }> = {
  "On-Route": { bg: "bg-[#EDF4FB]", border: "border-[#004EF9]", text: "text-[#3574FF]" },
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
      className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-[16px] border border-[#E5E5E5] bg-white p-3 text-start transition-all duration-200 hover:bg-[#FAFAF7] hover:border-[#D4D4D8] hover:shadow-xs active:scale-[0.99]"
    >
      <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
        <div className="flex w-full items-center gap-[13px]">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#8F6900] text-[13px] font-bold text-white">
            {initials}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="truncate text-[14px] font-semibold leading-[1.07] tracking-[0.28px] text-[#333333]">
              {rider.name}
            </span>
            <span className="truncate text-[12px] leading-[1.4] tracking-[0.24px] text-[#8B8B8B]">
              {rider.phone}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[13px] font-semibold leading-[normal] tracking-[0.26px] ${style.bg} ${style.border} ${style.text}`}
          >
            {t(rider.status)}
          </span>

          <span className="text-[12px] font-semibold tracking-[0.24px] text-[#595959]">•</span>

          <div className="flex items-center gap-1">
            <span className="flex size-3 shrink-0 items-center justify-center">
              <img src={orderIcon} alt="" />
            </span>
            <span className="text-[12px] font-semibold tracking-[0.24px] text-[#595959]">
              {orderCount} {orderCount > 1 ? t("Orders") : t("Order")}
            </span>
          </div>

          <span className="text-[12px] font-semibold tracking-[0.24px] text-[#595959]">•</span>

          <div className="flex items-center gap-1">
            <img src={dutyTimeIcon} alt="" />
            <span className="text-[12px] font-semibold tracking-[0.24px] text-[#595959]">
              {rider.dutyTime}
            </span>
          </div>
        </div>
      </div>

      <span className="flex h-[19.2px] w-5 shrink-0 items-center justify-center transition-transform duration-200 group-hover:translate-x-1">
        <img src={chevronIcon} alt="" />
      </span>
    </button>
  );
};

export default RiderCard;
