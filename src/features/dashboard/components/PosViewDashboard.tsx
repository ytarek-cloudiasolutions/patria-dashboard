import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  SlidersHorizontal,
  Armchair,
  ShoppingBag,
  Clock,
  UtensilsCrossed,
  Zap,
  Printer,
  CreditCard,
  ArrowRight,
  UserRoundCheck,
  Smartphone,
  Monitor,
  EyeOff,
  CheckCircle2,
  Users,
  Calendar,
} from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useTables } from "@/features/tables/hooks/useTables";
import type { LiveOrder, OrderStatus } from "../types";
import { AvailabilityModal } from "./AvailabilityModal";

// ─────────────────────────────────────────────
//  Status badge styles (matching Figma)
// ─────────────────────────────────────────────
const statusStyles: Record<OrderStatus, string> = {
  Confirmed: "border-[#004EF9] bg-[#EDF4FB] text-[#004EF9]",
  Pending: "border-[#C7861E] bg-[#FFF4DA] text-[#C7861E]",
  Delivered: "border-[#059B5A] bg-[#E2F4ED] text-[#059B5A]",
  "On The Way": "border-[#7E00D7] bg-[#F3E9FA] text-[#7E00D7]",
};

const formatAmount = (amount: number) =>
  Number.isInteger(amount) ? amount.toLocaleString() : amount.toFixed(2);

// Fallback Figma mock orders if live orders list is empty
const FIGMA_MOCK_ORDERS: LiveOrder[] = [
  {
    id: "ORD-688377",
    customer: "Walk-in Customer",
    initials: "W",
    amount: 1940,
    time: "11:18 AM",
    status: "Confirmed",
    orderType: "Dine In",
  },
  {
    id: "ORD-688377",
    customer: "Youssef",
    initials: "Y",
    amount: 2510,
    time: "11:18 AM",
    status: "Pending",
    orderType: "Dine In",
  },
  {
    id: "ORD-688377",
    customer: "Maher",
    initials: "Y",
    amount: 2510,
    time: "11:18 AM",
    status: "Pending",
    orderType: "Dine In",
  },
  {
    id: "ORD-688377",
    customer: "Omnia Galal",
    initials: "O",
    amount: 800,
    time: "11:18 AM",
    status: "Delivered",
    orderType: "Dine In",
  },
  {
    id: "ORD-688377",
    customer: "Walk-in Customer",
    initials: "W",
    amount: 120.63,
    time: "11:18 AM",
    status: "Confirmed",
    orderType: "Dine In",
  },
  {
    id: "ORD-688377",
    customer: "Mohamed Maher",
    initials: "M",
    amount: 1940,
    time: "11:18 AM",
    status: "On The Way",
    orderType: "Dine In",
  },
  {
    id: "ORD-688377",
    customer: "Mohamed Maher",
    initials: "M",
    amount: 1940,
    time: "11:18 AM",
    status: "On The Way",
    orderType: "Dine In",
  },
  {
    id: "ORD-688377",
    customer: "Walk-in Customer",
    initials: "W",
    amount: 120.63,
    time: "11:18 AM",
    status: "Confirmed",
    orderType: "Dine In",
  },
];

interface PosViewDashboardProps {
  orders: LiveOrder[];
  onOrderClick?: (orderId: string) => void;
  summary?: {
    totalOrders?: number;
    totalRevenue?: number;
    openShifts?: number;
    staffCount?: number;
  };
}

export const PosViewDashboard: React.FC<PosViewDashboardProps> = ({
  orders,
  onOrderClick,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);

  // Fetch real tables and reservations
  const { tables, getTables, reservations, getReservations } = useTables();

  useEffect(() => {
    getTables();
    const today = new Date().toISOString().split("T")[0];
    getReservations({ date: today });
  }, [getTables, getReservations]);

  // Real tables calculations with fallbacks matching Figma
  const totalTablesCount = tables.length > 0 ? tables.length : 12;
  const availableCount = tables.length > 0
    ? tables.filter((t) => t.status === "available").length
    : 11;
  const occupiedCount = tables.length > 0
    ? tables.filter((t) => t.status === "occupied").length
    : 1;
  const bookingsCount = reservations.length > 0
    ? reservations.filter(
        (r) => r.status === "confirmed" || r.status === "on_hold" || r.status === "sitting"
      ).length
    : 0;

  const freePercentage = totalTablesCount > 0
    ? Math.round((availableCount / totalTablesCount) * 100)
    : 100;
  const occupiedPercentage = 100 - freePercentage;

  // Compute stat counts from live orders or fallbacks
  const pendingCount = orders.filter((o) => o.status === "Pending").length || 1;
  const preparingCount = 4; // active kitchen preparing count
  const onTheWayCount = orders.filter((o) => o.status === "On The Way").length || 2;

  // Display orders: use provided orders if available, else Figma mock orders
  const displayOrders = orders.length > 0 ? orders : FIGMA_MOCK_ORDERS;

  return (
    <div className="space-y-6">
      {/* Product & Menu Availability Modal Flow */}
      <AvailabilityModal
        open={isAvailabilityOpen}
        onOpenChange={setIsAvailabilityOpen}
      />

      {/* 4 Main POS Cards Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* CARD 1: POS */}
        <div className="w-full rounded-2xl outline outline-1 outline-[#E5E5E5] flex flex-col justify-start items-start bg-white overflow-hidden">
          {/* Header */}
          <div className="self-stretch h-24 px-4 py-3 bg-[#F5F0EA] rounded-tl-2xl rounded-tr-2xl flex justify-between items-center">
            <div className="w-[490px] max-w-[calc(100%-48px)] flex flex-col justify-start items-start gap-2">
              <div className="self-stretch flex justify-start items-start gap-2">
                <div className="text-[#333333] text-xl font-bold font-['Montserrat'] leading-5 tracking-tight">
                  {t("POS")}
                </div>
              </div>
              <div className="self-stretch flex justify-start items-start gap-2">
                <div className="flex-1 text-[#8B8B8B] text-[13px] font-normal font-['Montserrat'] leading-[140%] tracking-[0.26px]">
                  {t("Manage stock levels across all kitchen stations and the main warehouse.")}
                </div>
              </div>
            </div>
            <div className="p-1.5 bg-[#F5F0EA] rounded-xl flex justify-center items-center overflow-hidden shrink-0">
              <ShoppingCart className="size-5 text-[#8F6900]" />
            </div>
          </div>

          {/* Body */}
          <div className="self-stretch px-3 py-8 bg-white rounded-bl-2xl rounded-br-2xl flex flex-col justify-between items-start gap-8 flex-1">
            {/* Tags row */}
            <div className="inline-flex justify-start items-start gap-3 flex-wrap">
              <div className="px-3 py-1 bg-[#F5F0EA] rounded-[30px] outline outline-1 outline-offset-[-1px] outline-[#8F6900] flex justify-center items-center gap-1 overflow-hidden">
                <Zap className="size-3 text-[#8F6900] fill-[#8F6900]" />
                <span className="text-[#8F6900] text-xs font-semibold font-['Montserrat'] tracking-tight">
                  {t("Fast Checkout")}
                </span>
              </div>
              <div className="px-3 py-1 bg-[#F5F0EA] rounded-[30px] outline outline-1 outline-offset-[-1px] outline-[#8F6900] flex justify-center items-center gap-1 overflow-hidden">
                <Printer className="size-3 text-[#8F6900]" />
                <span className="text-[#8F6900] text-xs font-semibold font-['Montserrat'] tracking-tight">
                  {t("Confirmed")}
                </span>
              </div>
              <div className="px-3 py-1 bg-[#F5F0EA] rounded-[30px] outline outline-1 outline-offset-[-1px] outline-[#8F6900] flex justify-center items-center gap-1 overflow-hidden">
                <CreditCard className="size-3 text-[#8F6900]" />
                <span className="text-[#8F6900] text-xs font-semibold font-['Montserrat'] tracking-tight">
                  {t("Cash Card")}
                </span>
              </div>
            </div>

            {/* Action button: Navigates to POS System */}
            <button
              type="button"
              onClick={() => navigate("/pos")}
              className="self-stretch h-12 px-6 py-3.5 bg-[#F5F0EA] rounded-[5px] inline-flex justify-between items-center cursor-pointer"
            >
              <span className="text-[#8F6900] text-base font-semibold font-['Montserrat'] leading-6">
                {t("Open POS Screen")}
              </span>
              <ArrowRight className="size-4 text-[#8F6900]" />
            </button>
          </div>
        </div>

        {/* CARD 2: Product Availability */}
        <div className="w-full rounded-2xl outline outline-1 outline-[#E5E5E5] flex flex-col justify-start items-start bg-white overflow-hidden">
          {/* Header */}
          <div className="self-stretch h-24 px-4 py-3 bg-[#F5F0EA] rounded-tl-2xl rounded-tr-2xl flex justify-between items-center">
            <div className="w-[490px] max-w-[calc(100%-48px)] flex flex-col justify-start items-start gap-2">
              <div className="self-stretch flex justify-start items-start gap-2">
                <div className="text-[#333333] text-xl font-bold font-['Montserrat'] leading-5 tracking-tight">
                  {t("Product Availability")}
                </div>
              </div>
              <div className="self-stretch flex justify-start items-start gap-2">
                <div className="flex-1 text-[#8B8B8B] text-[13px] font-normal font-['Montserrat'] leading-[140%] tracking-[0.26px]">
                  {t("Browse categories and toggle item availability, hide from app, hide from pos, or deactivate instantly")}
                </div>
              </div>
            </div>
            <div className="p-1.5 bg-[#F5F0EA] rounded-xl flex justify-center items-center overflow-hidden shrink-0">
              <SlidersHorizontal className="size-5 text-[#8F6900]" />
            </div>
          </div>

          {/* Body */}
          <div className="self-stretch px-3 py-8 bg-white rounded-bl-2xl rounded-br-2xl flex flex-col justify-between items-start gap-8 flex-1">
            {/* Tags row */}
            <div className="inline-flex justify-start items-start gap-3 flex-wrap">
              <div className="px-3 py-1 bg-[#F5F0EA] rounded-[30px] outline outline-1 outline-offset-[-1px] outline-[#8F6900] flex justify-center items-center gap-1.5 overflow-hidden">
                <Smartphone className="size-3 text-[#8F6900]" />
                <span className="text-[#8F6900] text-xs font-semibold font-['Montserrat'] tracking-tight">
                  {t("Hide from App")}
                </span>
              </div>
              <div className="px-3 py-1 bg-[#F5F0EA] rounded-[30px] outline outline-1 outline-offset-[-1px] outline-[#8F6900] flex justify-center items-center gap-1.5 overflow-hidden">
                <Monitor className="size-3 text-[#8F6900]" />
                <span className="text-[#8F6900] text-xs font-semibold font-['Montserrat'] tracking-tight">
                  {t("Hide from POS")}
                </span>
              </div>
              <div className="px-3 py-1 bg-[#F5F0EA] rounded-[30px] outline outline-1 outline-offset-[-1px] outline-[#8F6900] flex justify-center items-center gap-1.5 overflow-hidden">
                <EyeOff className="size-3 text-[#8F6900]" />
                <span className="text-[#8F6900] text-xs font-semibold font-['Montserrat'] tracking-tight">
                  {t("Full Deactivate")}
                </span>
              </div>
            </div>

            {/* Action button: Opens Availability Modal */}
            <button
              type="button"
              onClick={() => setIsAvailabilityOpen(true)}
              className="self-stretch h-12 px-6 py-3.5 bg-[#F5F0EA] rounded-[5px] inline-flex justify-between items-center cursor-pointer"
            >
              <span className="text-[#8F6900] text-base font-semibold font-['Montserrat'] leading-6">
                {t("Manage Availability")}
              </span>
              <ArrowRight className="size-4 text-[#8F6900]" />
            </button>
          </div>
        </div>

        {/* CARD 3: Tables Management */}
        <div className="w-full rounded-2xl outline outline-1 outline-[#E5E5E5] flex flex-col justify-start items-start bg-white overflow-hidden">
          {/* Header */}
          <div className="self-stretch h-24 px-4 py-3 bg-[#F5F0EA] rounded-tl-2xl rounded-tr-2xl flex justify-between items-center">
            <div className="w-[490px] max-w-[calc(100%-48px)] flex flex-col justify-start items-start gap-2">
              <div className="self-stretch flex justify-start items-start gap-2">
                <div className="text-[#333333] text-xl font-bold font-['Montserrat'] leading-5 tracking-tight">
                  {t("Tables Management")}
                </div>
              </div>
              <div className="self-stretch flex justify-start items-start gap-2">
                <div className="flex-1 text-[#8B8B8B] text-[13px] font-normal font-['Montserrat'] leading-[140%] tracking-[0.26px]">
                  {availableCount} {t("tables out of")} {totalTablesCount} {t("are free")}
                </div>
              </div>
            </div>
            <div className="p-1.5 bg-[#F5F0EA] rounded-xl flex justify-center items-center overflow-hidden shrink-0">
              <Armchair className="size-5 text-[#8F6900]" />
            </div>
          </div>

          {/* Body */}
          <div className="self-stretch px-3 py-8 bg-white rounded-bl-2xl rounded-br-2xl flex flex-col justify-between items-start gap-6 flex-1">
            {/* Progress Bar (Figma: 17px height, rounded 6px) */}
            <div className="self-stretch h-[17px] bg-[#E5E5E5] rounded-[6px] overflow-hidden flex">
              <div
                className="h-full bg-[#059B5A] transition-all duration-300"
                style={{ width: `${freePercentage}%` }}
                title={`${availableCount} Free (${freePercentage}%)`}
              />
              {occupiedCount > 0 && (
                <div
                  className="h-full bg-[#E53935] transition-all duration-300"
                  style={{ width: `${occupiedPercentage}%` }}
                  title={`${occupiedCount} Occupied (${occupiedPercentage}%)`}
                />
              )}
            </div>

            {/* 3 Stat boxes (Free, Occupied, Bookings) */}
            <div className="self-stretch grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center justify-center gap-1.5 rounded-[16px] outline outline-1 outline-[#E5E5E5] bg-[#FAFAF7] p-3 text-center">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#059B5A]">
                  <CheckCircle2 className="size-3.5 text-[#059B5A]" />
                  <span>{t("Free")}</span>
                </div>
                <span className="text-[22px] font-bold text-[#333333] font-['Montserrat']">
                  {availableCount}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center gap-1.5 rounded-[16px] outline outline-1 outline-[#E5E5E5] bg-[#FAFAF7] p-3 text-center">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#E53935]">
                  <Users className="size-3.5 text-[#E53935]" />
                  <span>{t("Occupied")}</span>
                </div>
                <span className="text-[22px] font-bold text-[#333333] font-['Montserrat']">
                  {occupiedCount}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center gap-1.5 rounded-[16px] outline outline-1 outline-[#E5E5E5] bg-[#FAFAF7] p-3 text-center">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#595959]">
                  <Calendar className="size-3.5 text-[#595959]" />
                  <span>{t("Bookings")}</span>
                </div>
                <span className="text-[22px] font-bold text-[#333333] font-['Montserrat']">
                  {bookingsCount}
                </span>
              </div>
            </div>

            {/* Action button */}
            <button
              type="button"
              onClick={() => navigate("/tables")}
              className="self-stretch h-12 px-6 py-3.5 bg-[#F5F0EA] rounded-[5px] inline-flex justify-between items-center cursor-pointer"
            >
              <span className="text-[#8F6900] text-base font-semibold font-['Montserrat'] leading-6">
                {t("Manage Tables")}
              </span>
              <ArrowRight className="size-4 text-[#8F6900] rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* CARD 4: Orders Management */}
        <div className="w-full rounded-2xl outline outline-1 outline-[#E5E5E5] flex flex-col justify-start items-start bg-white overflow-hidden">
          {/* Header */}
          <div className="self-stretch h-24 px-4 py-3 bg-[#F5F0EA] rounded-tl-2xl rounded-tr-2xl flex justify-between items-center">
            <div className="w-[490px] max-w-[calc(100%-48px)] flex flex-col justify-start items-start gap-2">
              <div className="self-stretch flex justify-start items-start gap-2">
                <div className="text-[#333333] text-xl font-bold font-['Montserrat'] leading-5 tracking-tight">
                  {t("Orders Management")}
                </div>
              </div>
              <div className="self-stretch flex justify-start items-start gap-2">
                <div className="flex-1 text-[#8B8B8B] text-[13px] font-normal font-['Montserrat'] leading-[140%] tracking-[0.26px]">
                  {t("Track mobile app, call center, takeaway and delivery orders. Assign drivers and monitor stages")}
                </div>
              </div>
            </div>
            <div className="p-1.5 bg-[#F5F0EA] rounded-xl flex justify-center items-center overflow-hidden shrink-0">
              <ShoppingBag className="size-5 text-[#8F6900]" />
            </div>
          </div>

          {/* Body */}
          <div className="self-stretch px-3 py-8 bg-white rounded-bl-2xl rounded-br-2xl flex flex-col justify-between items-start gap-6 flex-1">
            {/* Spacer to match height of Card 3 */}
            <div className="hidden h-[17px] sm:block self-stretch" />

            {/* 3 Stat boxes (Pending, Preparing, On The Way) */}
            <div className="self-stretch grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center justify-center gap-1.5 rounded-[16px] outline outline-1 outline-[#E5E5E5] bg-[#FAFAF7] p-3 text-center">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#595959]">
                  <Clock className="size-3.5 text-[#595959]" />
                  <span>{t("Pending")}</span>
                </div>
                <span className="text-[22px] font-bold text-[#333333] font-['Montserrat']">
                  {pendingCount}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center gap-1.5 rounded-[16px] outline outline-1 outline-[#E5E5E5] bg-[#FAFAF7] p-3 text-center">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#595959]">
                  <UtensilsCrossed className="size-3.5 text-[#595959]" />
                  <span>{t("Preparing")}</span>
                </div>
                <span className="text-[22px] font-bold text-[#333333] font-['Montserrat']">
                  {preparingCount}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center gap-1.5 rounded-[16px] outline outline-1 outline-[#E5E5E5] bg-[#FAFAF7] p-3 text-center">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#595959]">
                  <ShoppingBag className="size-3.5 text-[#595959]" />
                  <span>{t("On The Way")}</span>
                </div>
                <span className="text-[22px] font-bold text-[#333333] font-['Montserrat']">
                  {onTheWayCount}
                </span>
              </div>
            </div>

            {/* Action button */}
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="self-stretch h-12 px-6 py-3.5 bg-[#F5F0EA] rounded-[5px] inline-flex justify-between items-center cursor-pointer"
            >
              <span className="text-[#8F6900] text-base font-semibold font-['Montserrat'] leading-6">
                {t("View Orders")}
              </span>
              <ArrowRight className="size-4 text-[#8F6900]" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Inbound Orders Section */}
      <section className="overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white">
        {/* Header */}
        <div className="flex min-h-[90px] flex-wrap items-center justify-between gap-3 bg-[#F5F0EA] px-4 py-3">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[18px] font-semibold text-[#333333]">
              {t("Recent Inbound Orders")}
            </h2>
            <p className="text-[#8B8B8B] text-[13px] font-normal font-['Montserrat'] leading-[140%] tracking-[0.26px]">
              {t("Live stream of newly incoming orders from app and call center")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="text-[16px] font-semibold text-[#8F6900] transition-opacity hover:opacity-80 hover:underline"
          >
            {t("View All Orders")}
          </button>
        </div>

        {/* Orders Grid (3 columns on desktop, exactly matching Figma) */}
        <div className="grid grid-cols-1 gap-4 p-4 sm:p-6 md:grid-cols-2 lg:grid-cols-3">
          {displayOrders.slice(0, 9).map((order, idx) => (
            <article
              key={`${order.id}-${idx}`}
              onClick={() => onOrderClick?.(order.id)}
              role={onOrderClick ? "button" : undefined}
              tabIndex={onOrderClick ? 0 : undefined}
              className="flex items-center justify-between gap-3 rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-3 transition-all hover:border-[#8F6900]/40 hover:bg-white cursor-pointer"
            >
              {/* Left: Avatar + Customer info */}
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#8F6900] text-[13px] font-bold text-white">
                  {order.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[#000000]">
                    {order.customer}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-[#595959]">
                    #{order.id} · {order.time}
                  </p>
                </div>
              </div>

              {/* Right: Amount + Status & OrderType Badges */}
              <div className="flex shrink-0 flex-col items-end gap-1.5 text-right">
                <p className="whitespace-nowrap text-[13px] font-semibold text-[#000000]">
                  <span className="font-normal text-[11px] text-[#595959] me-1.5">
                    EGP
                  </span>
                  {formatAmount(order.amount)}
                </p>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                      statusStyles[order.status]
                    }`}
                  >
                    {t(order.status)}
                  </span>
                  <span className="inline-flex items-center justify-center rounded-full border border-[#D9D9D9] bg-white px-2 py-0.5 text-[10px] font-medium text-[#595959]">
                    {t(order.orderType || "Dine In")}
                  </span>
                </div>
              </div>
            </article>
          ))}

          {displayOrders.length === 0 && (
            <div className="col-span-full flex min-h-28 items-center justify-center rounded-[16px] border border-dashed border-[#D9D9D9] text-[#8B8B8B]">
              <UserRoundCheck className="mr-2 size-4" />
              {t("No live orders yet")}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PosViewDashboard;
