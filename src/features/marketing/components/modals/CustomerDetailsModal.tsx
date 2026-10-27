import { useEffect } from "react";
import { Trophy, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import MediaSvg from "@/assets/images/svgs/media.svg";
import ShapeSvg from "@/assets/images/svgs/shape.svg";
import TierBadge from "@/features/customers/components/TierBadge";
import type { MarketingCustomer } from "../../types";
import { useTranslation } from "@/shared/i18n/useTranslation";

const formatEgp = (value: number) =>
  value === 0
    ? "EGP 0"
    : `EGP ${value.toLocaleString("en-US", {
        minimumFractionDigits: value % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      })}`;

interface CustomerDetailsModalProps {
  isOpen: boolean;
  customer: MarketingCustomer | null;
  onClose: () => void;
}

export const CustomerDetailsModal = ({
  isOpen,
  customer,
  onClose,
}: CustomerDetailsModalProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !customer) return null;

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[696px] max-h-[92vh] overflow-y-auto rounded-2xl bg-white border border-[#CACBD4] shadow-2xl p-6 sm:p-7 space-y-6 animate-in zoom-in-95 duration-200 scrollbar-thin relative"
      >
        {/* Header with profile and close button */}
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between pr-8">
            <h2 className="text-[#1A1A1A] text-2xl font-semibold font-['Montserrat',sans-serif] tracking-wide">
              {customer.name}
            </h2>
          </div>

          {/* Demographics row - single line, no horizontal scrollbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] text-[#595959] font-['Montserrat',sans-serif] whitespace-nowrap">
            <span className="font-normal shrink-0">{customer.phone}</span>
            <span className="shrink-0 text-[#8B8B8B]">•</span>
            <span className="font-normal shrink-0">{customer.email}</span>
            <span className="shrink-0 text-[#8B8B8B]">•</span>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-[30px] border text-[11px] font-semibold tracking-tight font-['Montserrat',sans-serif] shrink-0",
                customer.gender === "woman"
                  ? "bg-rose-200 border-pink-600 text-pink-600"
                  : "bg-[#EDF4FB] border-[#004EF9] text-[#3574FF]"
              )}
            >
              {customer.gender === "woman" ? t("Woman") : t("Man")}
            </span>
            <span className="shrink-0 text-[#8B8B8B]">•</span>
            <span className="font-normal shrink-0">
              {t("Joined")} {customer.joinedDate}
            </span>
            <span className="shrink-0 text-[#8B8B8B]">•</span>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-[30px] border text-[11px] font-semibold tracking-tight font-['Montserrat',sans-serif] shrink-0",
                customer.hasApp
                  ? "bg-[#E2F4ED] border-[#059B5A] text-[#059B5A]"
                  : "bg-gray-100 border-gray-300 text-gray-600"
              )}
            >
              {customer.hasApp ? t("Hass App") : t("No App")}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 sm:top-6 sm:right-6 size-8 rounded-full hover:bg-[#F5F0EA] flex items-center justify-center text-[#8B8B8B] hover:text-black transition-colors cursor-pointer shrink-0"
            aria-label={t("Close")}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* 4 Summary Stat Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex-1 px-4 sm:px-6 py-3 bg-[#F8F8F8] rounded-2xl border-2 border-[#E5E5E5] flex flex-col justify-center items-center gap-2">
            <div className="text-[#595959] text-[10px] font-semibold font-['Montserrat',sans-serif] leading-3 tracking-tight">
              {t("Orders")}
            </div>
            <div className="text-[#1A1A1A] text-base font-semibold font-['Montserrat',sans-serif] uppercase leading-6 tracking-tight">
              {customer.ordersCount}
            </div>
          </div>

          <div className="px-4 sm:px-6 py-3 bg-[#F8F8F8] rounded-2xl border-2 border-[#E5E5E5] flex flex-col justify-center items-center gap-2">
            <div className="text-[#595959] text-[10px] font-semibold font-['Montserrat',sans-serif] leading-3 tracking-tight">
              {t("Total Spent")}
            </div>
            <div className="text-[#1A1A1A] text-base font-semibold font-['Montserrat',sans-serif] uppercase leading-6 tracking-tight">
              <span className="font-medium">{t("EGP")}</span>{" "}
              <span>{customer.totalSpent.toFixed(2)}</span>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-3 bg-[#F8F8F8] rounded-2xl border-2 border-[#E5E5E5] flex flex-col justify-center items-center gap-2">
            <div className="text-[#595959] text-[10px] font-semibold font-['Montserrat',sans-serif] leading-3 tracking-tight">
              {t("Average Order")}
            </div>
            <div className="text-[#1A1A1A] text-base font-semibold font-['Montserrat',sans-serif] uppercase leading-6 tracking-tight">
              <span className="font-medium">{t("EGP")}</span>{" "}
              <span>{customer.averageOrder.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex-1 px-4 sm:px-6 py-3 bg-[#F8F8F8] rounded-2xl border-2 border-[#E5E5E5] flex flex-col justify-center items-center gap-2">
            <div className="text-[#595959] text-[10px] font-semibold font-['Montserrat',sans-serif] leading-3 tracking-tight">
              {t("Last Order")}
            </div>
            <div className="text-[#1A1A1A] text-base font-semibold font-['Montserrat',sans-serif] uppercase leading-6 tracking-tight">
              {customer.lastOrderDate}
            </div>
          </div>
        </div>

        {/* Customer info card with stacked media + shape decorations (from Customers module) */}
        <div className="relative overflow-hidden rounded-[14px] border border-[#E5E5E5] bg-[linear-gradient(114deg,rgba(255,255,255,0.08)_7.65%,rgba(143,105,0,0.20)_28.89%)] px-6 py-5">
          <img
            src={ShapeSvg}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-1 top-0 h-full opacity-75"
          />
          <img
            src={MediaSvg}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-2 h-[96%] opacity-90"
          />

          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Avatar
                size="lg"
                className="bg-[#7A6518] text-white ring-2 ring-white"
              >
                <AvatarFallback className="bg-[#7A6518] text-[14px] font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("User Information")}
                </p>
                <p className="text-[18px] font-semibold text-[#28293D]">
                  {customer.name}
                </p>

                <div className="mt-4 flex flex-wrap items-start gap-x-8 gap-y-2">
                  <div className="flex flex-col items-start gap-1">
                    <p className="text-xs font-normal uppercase leading-3 tracking-tight text-[#595959]">
                      {t("LTV")}
                    </p>
                    <p className="text-base font-normal leading-6 tracking-tight text-[#8F6900]">
                      {formatEgp(customer.ltv)}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <p className="text-xs font-normal uppercase leading-3 tracking-tight text-[#595959]">
                      {t("Orders")}
                    </p>
                    <p className="text-base font-normal leading-6 tracking-tight text-black">
                      {customer.ordersCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <TierBadge tier={customer.tier} />
          </div>
        </div>

        {/* Customer Purchasing Habits Container */}
        <div className="rounded-2xl bg-[#F8F8F8] border border-[#CACBD4] p-4 sm:p-5 flex flex-col gap-6 overflow-hidden">
          {/* Inner card with Most Ordered & Favorite Categories */}
          <div className="w-full px-4 sm:px-6 py-4 bg-[#F8F8F8] rounded-2xl border border-[#CACBD4] flex flex-col gap-6 overflow-hidden">
            {/* Most Ordered */}
            <div className="flex flex-col gap-3">
              <div className="text-[#1A1A1A] text-xs font-semibold font-['Montserrat',sans-serif] uppercase leading-6">
                {t("MOST ORDERED")}
              </div>
              <div className="px-3 py-2.5 rounded-2xl border-2 border-dashed border-[#8F6900]/70 flex flex-col gap-2">
                {customer.mostOrderedProducts.map((p, idx) => (
                  <div key={p.id} className="flex flex-col gap-2">
                    <div
                      className={cn(
                        "px-3 py-2 rounded-xl flex justify-between items-center overflow-hidden transition-colors",
                        p.isTop
                          ? "bg-[#F8F4EA] border border-[#CACBD4]"
                          : "hover:bg-black/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {p.isTop && (
                          <div className="size-7 p-1 bg-[#F1E8D5] rounded-[8px] flex justify-center items-center text-[#8F6900] shrink-0">
                            <Trophy className="size-4" />
                          </div>
                        )}
                        <span className="text-[#1A1A1A] text-base font-medium font-['Montserrat',sans-serif] leading-4 tracking-tight">
                          {p.name}
                        </span>
                      </div>
                      <span className="text-[#1A1A1A] text-sm font-medium font-['Montserrat',sans-serif] leading-4 tracking-tight">
                        {p.pieces} {t("Pcs")} • {p.ordersCount} {t("Orders")}
                      </span>
                    </div>
                    {idx < customer.mostOrderedProducts.length - 1 && (
                      <div className="border-b border-[#E5E5E5]" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Categories */}
            <div className="flex flex-col gap-3">
              <div className="text-[#1A1A1A] text-xs font-semibold font-['Montserrat',sans-serif] uppercase leading-6">
                {t("FAVORITE CATEGORIES")}
              </div>
              <div className="px-3 py-2.5 rounded-2xl border-2 border-dashed border-[#8F6900]/70 flex flex-col gap-2">
                {customer.favoriteCategories.map((c, idx) => (
                  <div key={c.name} className="flex flex-col gap-2">
                    <div className="px-3 py-2 rounded-xl flex justify-between items-center overflow-hidden">
                      <span className="text-[#1A1A1A] text-base font-medium font-['Montserrat',sans-serif] leading-4 tracking-tight">
                        {t(c.name)}
                      </span>
                      <span className="text-[#1A1A1A] text-sm font-medium font-['Montserrat',sans-serif] leading-4 tracking-tight">
                        {c.count}
                      </span>
                    </div>
                    {idx < customer.favoriteCategories.length - 1 && (
                      <div className="border-b border-[#E5E5E5]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-b border-[#CACBD4]" />

          {/* Orders To (Destinations) */}
          <div className="flex flex-col gap-3">
            <div className="text-[#595959] text-xs font-semibold font-['Montserrat',sans-serif] uppercase leading-4 tracking-tight">
              {t("Orders To")}
            </div>
            <div className="px-3 py-2 bg-[#F8F4EA] rounded-2xl border border-[#CACBD4] flex flex-col justify-center items-center gap-2.5">
              <div className="w-full px-3 py-2.5 rounded-2xl border-2 border-dashed border-[#8F6900]/70 flex flex-col gap-2">
                {customer.ordersToZones.map((z, idx) => (
                  <div key={z.zoneName} className="flex flex-col gap-2">
                    <div className="px-3 py-2 rounded-xl flex justify-between items-center overflow-hidden">
                      <span className="text-[#1A1A1A] text-base font-medium font-['Montserrat',sans-serif] leading-4 tracking-tight">
                        {z.zoneName}
                      </span>
                      <span className="text-[#1A1A1A] text-sm font-medium font-['Montserrat',sans-serif] leading-4 tracking-tight">
                        {z.count}
                      </span>
                    </div>
                    {idx < customer.ordersToZones.length - 1 && (
                      <div className="border-b border-[#E5E5E5]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* All Orders History */}
        <div className="p-4 bg-[#F8F8F8] rounded-2xl border border-[#CACBD4] flex flex-col gap-4 overflow-hidden">
          <div className="text-[#595959] text-xs font-semibold font-['Montserrat',sans-serif] uppercase leading-4 tracking-tight">
            {t("All Orders")} ({customer.ordersHistory.length})
          </div>

          <div className="flex flex-col gap-3">
            {customer.ordersHistory.map((ord) => (
              <div
                key={ord.id}
                className="p-3 bg-white rounded-xl border border-[#CACBD4] flex flex-col gap-3 overflow-hidden shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-col gap-2">
                    <div className="text-[#1A1A1A] text-xs font-bold font-['Montserrat',sans-serif] tracking-tight">
                      {ord.orderNumber}
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-[#595959] text-xs font-semibold font-['Montserrat',sans-serif] tracking-tight">
                        {ord.date}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-[30px] border text-xs font-semibold tracking-tight font-['Montserrat',sans-serif]",
                          ord.source === "POS"
                            ? "bg-[#FEF3D6] border-[#8F6900] text-[#8F6900]"
                            : "bg-slate-100 border-blue-700 text-blue-500"
                        )}
                      >
                        {ord.source}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-[30px] border text-xs font-semibold tracking-tight font-['Montserrat',sans-serif]",
                          ord.status === "Delivered"
                            ? "bg-[#E2F4ED] border-[#059B5A] text-[#059B5A]"
                            : "bg-purple-100 border-purple-700 text-purple-600"
                        )}
                      >
                        {t(ord.status)}
                      </span>
                      <span className="px-2 py-0.5 bg-[#F9F5EC] rounded-[30px] border border-[#8F6900] text-[#8F6900] text-xs font-semibold tracking-tight font-['Montserrat',sans-serif]">
                        {ord.zone}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[#595959] text-xs font-medium font-['Montserrat',sans-serif] tracking-tight">
                      {t("EGP")}{" "}
                    </span>
                    <span className="text-[#1A1A1A] text-xs font-semibold font-['Montserrat',sans-serif] tracking-tight">
                      {ord.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="border-b border-[#E5E5E5]" />

                <div className="text-[#1A1A1A] text-xs font-medium font-['Montserrat',sans-serif] tracking-tight">
                  {ord.itemsSummary}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
