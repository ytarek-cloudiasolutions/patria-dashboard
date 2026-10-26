import { useState } from "react";
import { createPortal } from "react-dom";
import {
  Smartphone,
  Globe,
  UserPlus,
  Star,
  AlertTriangle,
  BarChart2,
  BarChart3,
  MapPin,
} from "lucide-react";
import DatePicker from "@/shared/components/DatePicker";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { Rating } from "@/shared/components/ui/rating";
import {
  DAILY_ORDERS_STATS,
  INITIAL_COMPLAINTS,
  INITIAL_MARKETING_KPIS,
  TOP_DELIVERY_ZONES,
} from "../../data";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";

export const ReportsComplaintsTab = () => {
  const { t } = useTranslation();

  const [fromDate, setFromDate] = useState("2026-06-06");
  const [toDate, setToDate] = useState("2026-06-07");
  const [preset, setPreset] = useState("today");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const kpis = INITIAL_MARKETING_KPIS;
  const dailyStats = DAILY_ORDERS_STATS;
  const topZones = TOP_DELIVERY_ZONES;
  const complaints = INITIAL_COMPLAINTS;

  const periodOptions = [
    { label: t("Today"), value: "today" },
    { label: t("Yesterday"), value: "yesterday" },
    { label: t("Last 7 Days"), value: "last_7_days" },
    { label: t("Last 30 Days"), value: "last_30_days" },
    { label: t("This Month"), value: "this_month" },
  ];

  return (
    <>
      {isDropdownOpen &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-40 bg-black/40" />,
          document.body
        )}

      <div className="flex flex-col gap-6 w-full animate-in fade-in duration-150">
        {/* 1. Date Filter Bar - Full Width */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-end">
          {/* From Date */}
          <div className="w-full flex flex-col justify-start items-start gap-2.5">
            <label className="text-black text-xs font-medium font-['Montserrat',sans-serif]">
              {t("From")}
            </label>
            <DatePicker
              value={fromDate}
              onChange={setFromDate}
              className="w-full"
              placeholder="dd/MM/YYYY"
              popoverPlacement="bottom-right"
              withBackdrop
            />
          </div>

          {/* To Date */}
          <div className="w-full flex flex-col justify-start items-start gap-2.5">
            <label className="text-black text-xs font-medium font-['Montserrat',sans-serif]">
              {t("To")}
            </label>
            <DatePicker
              value={toDate}
              onChange={setToDate}
              className="w-full"
              placeholder="dd/MM/YYYY"
              minDate={fromDate || undefined}
              popoverPlacement="bottom-right"
              withBackdrop
            />
          </div>

          {/* Period Preset Dropdown */}
          <div className="w-full flex flex-col justify-start items-start gap-2.5">
            <DropdownSelect
              options={periodOptions}
              selected={preset}
              onSelect={setPreset}
              onOpenChange={setIsDropdownOpen}
              align="end"
              className="md:w-full"
              contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
            />
          </div>
        </div>

      {/* 2. Five Metric KPI Cards */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        {/* Card 1: App Orders */}
        <div className="h-28 p-6 bg-white rounded-2xl shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)] border border-[#CACBD4] flex justify-between items-center overflow-hidden">
          <div className="flex flex-col justify-start items-start gap-1">
            <span className="text-black text-[10px] font-semibold font-['Montserrat',sans-serif] tracking-tight">
              {t("App Orders")}
            </span>
            <span className="text-black text-lg font-semibold font-['Montserrat',sans-serif] tracking-tight">
              {kpis.appOrdersCount}
            </span>
            <span className="text-[#1A1A1A] text-xs font-semibold font-['Montserrat',sans-serif] tracking-tight">
              {t("EGP")} {kpis.appOrdersRevenue.toLocaleString()}
            </span>
          </div>
          <div className="size-11 bg-[#F5F0EA] rounded-xl flex justify-center items-center overflow-hidden shrink-0">
            <Smartphone className="size-6 text-[#8F6900]" />
          </div>
        </div>

        {/* Card 2: Website Orders */}
        <div className="h-28 p-6 bg-white rounded-2xl shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)] border border-[#CACBD4] flex justify-between items-center overflow-hidden">
          <div className="flex flex-col justify-start items-start gap-1">
            <span className="text-black text-[10px] font-semibold font-['Montserrat',sans-serif] tracking-tight">
              {t("Website Orders")}
            </span>
            <span className="text-black text-lg font-semibold font-['Montserrat',sans-serif] tracking-tight">
              {kpis.websiteOrdersCount}
            </span>
            <span className="text-[#1A1A1A] text-xs font-semibold font-['Montserrat',sans-serif] tracking-tight">
              {t("EGP")} {kpis.websiteOrdersRevenue.toFixed(2)}
            </span>
          </div>
          <div className="size-11 bg-blue-100 rounded-xl flex justify-center items-center overflow-hidden shrink-0">
            <Globe className="size-6 text-blue-600" />
          </div>
        </div>

        {/* Card 3: New Sign-ups */}
        <div className="h-28 p-6 bg-white rounded-2xl shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)] border border-[#CACBD4] flex justify-between items-center overflow-hidden">
          <div className="flex flex-col justify-start items-start gap-2">
            <span className="text-black text-[10px] font-semibold font-['Montserrat',sans-serif] tracking-tight">
              {t("New Sign-ups")}
            </span>
            <span className="text-black text-xl font-semibold font-['Montserrat',sans-serif] tracking-tight">
              {kpis.newSignups}
            </span>
          </div>
          <div className="size-11 bg-[#E2F4ED] rounded-xl flex justify-center items-center overflow-hidden shrink-0">
            <UserPlus className="size-6 text-[#059B5A]" />
          </div>
        </div>

        {/* Card 4: Reviews */}
        <div className="h-28 p-6 bg-white rounded-2xl shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)] border border-[#CACBD4] flex justify-between items-center overflow-hidden">
          <div className="flex flex-col justify-start items-start gap-1">
            <span className="text-black text-[10px] font-semibold font-['Montserrat',sans-serif] tracking-tight">
              {t("Reviews")}
            </span>
            <span className="text-black text-lg font-semibold font-['Montserrat',sans-serif] tracking-tight">
              {kpis.averageRating.toFixed(1)}
            </span>
            <span className="text-[#1A1A1A] text-xs font-semibold font-['Montserrat',sans-serif] tracking-tight">
              {kpis.reviewsCount} {t("reviews")}
            </span>
          </div>
          <div className="size-11 bg-[#FEF3C7] rounded-xl flex justify-center items-center overflow-hidden shrink-0">
            <Star className="size-6 text-[#D97706]" />
          </div>
        </div>

        {/* Card 5: Complaints */}
        <div className="h-28 p-6 bg-white rounded-2xl shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)] border border-[#CACBD4] flex justify-between items-center overflow-hidden">
          <div className="flex flex-col justify-start items-start gap-1">
            <span className="text-black text-[10px] font-semibold font-['Montserrat',sans-serif] tracking-tight">
              {t("Complaints")}
            </span>
            <span className="text-black text-lg font-semibold font-['Montserrat',sans-serif] tracking-tight">
              {kpis.complaintsCount}
            </span>
            <span className="text-[#1A1A1A] text-xs font-semibold font-['Montserrat',sans-serif] tracking-tight">
              {t("1-2 star reviews")}
            </span>
          </div>
          <div className="size-11 bg-[#C90000] rounded-xl flex justify-center items-center overflow-hidden shrink-0">
            <AlertTriangle className="size-6 text-white" />
          </div>
        </div>
      </div>

      {/* 3. Orders per day Card */}
      <div className="w-full rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-xs flex flex-col">
        {/* Header */}
        <div className="self-stretch min-h-14 px-6 py-4 bg-[#F5F0EA] rounded-t-[16px] flex justify-between items-center">
          <h2 className="text-[#333333] text-[18px] font-bold font-['Montserrat',sans-serif] leading-6">
            {t("Orders per day")}
          </h2>
          <BarChart3 className="size-5 text-[#8F6900]" />
        </div>

        {/* Chart Rows */}
        <div className="self-stretch p-6 sm:p-7 flex flex-col justify-start items-start gap-6 overflow-hidden">
          {dailyStats.map((stat, idx) => {
            // Precise Figma bar proportions matching dashboard design spec
            const figmaAppWidths = [47, 100, 100, 40, 40, 13, 91.5];
            const figmaWebWidths = [0, 0, 0, 20, 20, 0, 0];
            const appWidth = figmaAppWidths[idx] ?? Math.min(100, (stat.appOrders / 6.2) * 100);
            const webWidth = figmaWebWidths[idx] ?? Math.min(100 - appWidth, (stat.webOrders / 6.2) * 100);

            return (
              <div
                key={stat.id}
                className="self-stretch flex items-center gap-2.5 sm:gap-3 w-full"
              >
                {/* Number & Date */}
                <div className="w-28 sm:w-[118px] shrink-0 flex items-center gap-2">
                  <span className="text-black text-xs font-bold font-['Montserrat',sans-serif] tracking-tight">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="text-black text-sm font-medium font-['Montserrat',sans-serif] tracking-tight">
                    {stat.date}
                  </span>
                </div>

                {/* Progress Track */}
                <div className="flex-1 h-4 bg-[#E5E5E5] rounded-full overflow-hidden flex items-center">
                  {stat.appOrders > 0 && (
                    <div
                      style={{
                        width: `${appWidth}%`,
                        borderRadius:
                          stat.webOrders > 0 ? "9999px 0 0 9999px" : "9999px",
                      }}
                      className="h-full bg-[#8F6900] transition-all duration-500"
                    />
                  )}
                  {stat.webOrders > 0 && (
                    <div
                      style={{ width: `${webWidth}%`, borderRadius: "0" }}
                      className="h-full bg-blue-500 transition-all duration-500"
                    />
                  )}
                </div>

                {/* Counter */}
                <div className="shrink-0 text-right">
                  <span className="text-black text-xs font-bold font-['Montserrat',sans-serif] tracking-tight">
                    {stat.appOrders} /{" "}
                  </span>
                  <span className="text-blue-500 text-xs font-bold font-['Montserrat',sans-serif] tracking-tight">
                    {stat.webOrders}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Top Delivery Zones Card */}
      <div className="w-full rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-xs flex flex-col">
        {/* Header */}
        <div className="self-stretch min-h-14 px-6 py-4 bg-[#F5F0EA] rounded-t-[16px] flex justify-between items-center">
          <h2 className="text-[#333333] text-[18px] font-bold font-['Montserrat',sans-serif] leading-6">
            {t("Top delivery zones")}
          </h2>
          <MapPin className="size-5 text-[#8F6900]" />
        </div>

        {/* Rows */}
        <div className="self-stretch p-6 sm:p-7 flex flex-col justify-start items-start gap-6 overflow-hidden">
          {topZones.map((z, idx) => {
            const formattedRevenue = Number.isInteger(z.revenue)
              ? z.revenue.toLocaleString()
              : z.revenue.toLocaleString(undefined, {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                });

            // Exact Figma zone bar width percentages (401px, 261px, 159px, 134px out of 874px max)
            const figmaZoneWidths = [46, 30, 18, 15];
            const barWidth = figmaZoneWidths[idx] ?? z.percentage;

            return (
              <div
                key={z.id}
                className="self-stretch flex items-center gap-2.5 sm:gap-3 w-full"
              >
                {/* Number & Name */}
                <div className="w-44 sm:w-[185px] shrink-0 flex items-center gap-2 truncate">
                  <span className="text-black text-xs font-bold font-['Montserrat',sans-serif] tracking-tight">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="text-black text-sm font-medium font-['Montserrat',sans-serif] tracking-tight truncate">
                    {z.zoneName}
                  </span>
                </div>

                {/* Progress Track */}
                <div className="flex-1 h-4 bg-[#E5E5E5] rounded-full overflow-hidden flex items-center">
                  <div
                    style={{
                      width: `${barWidth}%`,
                      borderRadius: "9999px",
                    }}
                    className="h-full bg-[#8F6900] transition-all duration-500"
                  />
                </div>

                {/* Stats text */}
                <div className="shrink-0 text-right text-black text-xs font-bold font-['Montserrat',sans-serif] tracking-tight">
                  {z.ordersCount} ({z.percentage}%) · {z.customersCount}{" "}
                  {t("customer")} · {t("EGP")} {formattedRevenue}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Complaints (1–2 star reviews) Card */}
      <div className="w-full rounded-2xl border border-[#CACBD4] bg-white overflow-hidden flex flex-col">
        {/* Header */}
        <div className="self-stretch px-4 py-3 bg-[#F5F0EA] rounded-t-2xl flex justify-between items-center">
          <div className="text-[#1A1A1A] text-lg font-semibold font-['Montserrat',sans-serif] leading-6">
            {t("Complaints (1–2 star reviews)")}
          </div>
          <AlertTriangle className="size-6 text-[#C90000]" />
        </div>

        {/* Complaints Grid */}
        <div className="self-stretch p-6 flex flex-wrap gap-6 items-stretch overflow-hidden">
          {complaints.map((c) => (
            <div
              key={c.id}
              className="w-full sm:w-[320px] min-h-[288px] p-4 bg-[#FAFAF7] rounded-2xl border-l-[3px] border-l-[#C90000] border-y border-r border-[#CACBD4] flex flex-col justify-between overflow-hidden shadow-xs"
            >
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                {/* Header: Name, Phone & Rating */}
                <div className="self-stretch flex justify-between items-start">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <div className="text-[#1A1A1A] text-sm font-semibold font-['Montserrat',sans-serif] leading-4 tracking-tight">
                      {c.customerName}
                    </div>
                    <div className="text-[#595959] text-xs font-normal font-['Montserrat',sans-serif] leading-4 tracking-tight">
                      {c.customerPhone}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <Rating
                      rating={c.rating}
                      maxRating={5}
                      size="sm"
                      className="gap-0.5 **:data-[slot=rating-star-empty]:text-[#D97706]/30 **:data-[slot=rating-star-filled]:fill-[#F59E0B] **:data-[slot=rating-star-filled]:text-[#F59E0B]"
                    />
                    <span className="text-black text-[10px] font-semibold font-['Montserrat',sans-serif] tracking-tight">
                      {c.rating.toFixed(1)} / 5.0
                    </span>
                  </div>
                </div>

                {/* Order ID & Type Badge */}
                <div className="self-stretch flex items-center gap-3">
                  <span className="text-black text-xs font-semibold font-['Montserrat',sans-serif] tracking-tight">
                    {c.orderNumber}
                  </span>
                  <span className="text-[#8B8B8B] text-xs">•</span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded-[30px] border border-blue-700 text-blue-500 text-[10px] font-semibold font-['Montserrat',sans-serif] tracking-tight">
                    {t(c.orderType)}
                  </span>
                </div>

                {/* Quoted Comment */}
                <div className="self-stretch h-12 p-3 bg-white rounded-xl border border-[#CACBD4] flex items-center overflow-hidden">
                  <span className="text-black text-base font-normal font-['Montserrat',sans-serif]">
                    {c.comment}
                  </span>
                </div>

                {/* Tags / Aspects */}
                {c.tags.length > 0 && (
                  <div className="self-stretch flex items-center gap-2 flex-wrap">
                    {c.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-2 bg-[#F5F0EA] rounded-[4px] border border-[#CACBD4] text-[#1A1A1A] text-[10px] font-semibold font-['Montserrat',sans-serif] leading-3 tracking-tight"
                      >
                        {t(tag)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Separator & Timestamp */}
              <div className="self-stretch flex flex-col justify-start items-start gap-4 mt-auto pt-4">
                <div className="self-stretch h-px bg-[#CACBD4]" />
                <div className="text-[#595959] text-sm font-medium font-['Montserrat',sans-serif] tracking-tight">
                  {c.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);
};
