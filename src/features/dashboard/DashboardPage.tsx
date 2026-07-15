import { useEffect, useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Coffee,
  Tag,
  Wallet,
  Users,
  DollarSign,
  Bell,
  CalendarDays,
} from "lucide-react";
import { api } from "@/config/api";
import { DASHBOARD_DATE } from "./data";
import type {
  DashboardMetric,
  LiveOrder,
  PerformanceIndicator,
  RevenuePoint,
  SoldProduct,
} from "./types";

import DashboardMetrics from "./components/DashboardMetrics";
import LiveOrderStream from "./components/LiveOrderStream";
import PerformanceIndicators from "./components/PerformanceIndicators";
import RevenueTrendChart from "./components/RevenueTrendChart";
import TopSoldProducts from "./components/TopSoldProducts";
import HeaderLayout from "@/layouts/HeaderLayout";
import { useTranslation } from "@/shared/i18n/useTranslation";
import DefaultButton from "@/shared/components/DefaultButton";
import DatePicker from "@/shared/components/DatePicker";
import CustomerNotificationDialog from "./components/CustomerNotificationDialog";

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getSevenDaysAgoDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const mapOrderStatus = (s: string): LiveOrder["status"] => {
  switch ((s ?? "").toLowerCase()) {
    case "confirmed": return "Confirmed";
    case "delivered": return "Delivered";
    case "on the way": case "on_the_way": return "On The Way";
    default: return "Pending";
  }
};

const DashboardPage = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<RevenuePoint[]>([]);
  const [topProducts, setTopProducts] = useState<SoldProduct[]>([]);
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>([]);
  const [indicators, setIndicators] = useState<PerformanceIndicator[]>([]);
  const [dateRange, setDateRange] = useState({
    from: getSevenDaysAgoDateString(),
    to: getTodayDateString(),
  });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [overviewRes, ordersRes] = await Promise.all([
          api.get("/reports/overview", {
            params: { startDate: dateRange.from, endDate: dateRange.to },
          }),
          api.get("/orders", { params: { limit: 6, sort: "-createdAt" } }),
        ]);

        const ov = overviewRes.data;
        const summary = ov.summary ?? {};

        setMetrics([
          {
            id: "revenue",
            title: "Total Revenue",
            value: (summary.totalRevenue ?? 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            icon: TrendingUp,
            iconColor: "text-primary",
            badgeColor: "bg-[#F5F0EA]",
          },
          {
            id: "orders",
            title: "Total Orders",
            value: summary.totalOrders ?? 0,
            icon: ShoppingBag,
            iconColor: "text-[#155DFC]",
            badgeColor: "bg-[#DBEAFE]",
          },
          {
            id: "products",
            title: "Total Products",
            value: ov.productCount ?? 0,
            icon: Coffee,
            iconColor: "text-[#C7861E]",
            badgeColor: "bg-[#FFF0D7]",
          },
          {
            id: "offers",
            title: "Active Offers",
            value: ov.offerCount ?? 0,
            icon: Tag,
            iconColor: "text-[#059B5A]",
            badgeColor: "bg-[#E2F4ED]",
          },
        ]);

        const dailyRevenue: RevenuePoint[] = (ov.dailyRevenue ?? []).map(
          (d: { _id: string; revenue: number }) => ({
            day: new Date(d._id).toLocaleDateString("en-US", { weekday: "short" }),
            value: d.revenue,
          }),
        );
        setRevenueTrend(dailyRevenue);

        const products: SoldProduct[] = (ov.topProducts ?? [])
          .slice(0, 5)
          .map((p: { name: string; quantity: number }, idx: number) => ({
            id: String(idx),
            rank: String(idx + 1).padStart(2, "0"),
            name: p.name,
            units: p.quantity,
          }));
        setTopProducts(products);

        setIndicators([
          {
            id: "staff",
            label: "Active Staff",
            value: ov.staffCount ?? 0,
            icon: Users,
            tone: "gold",
          },
          {
            id: "register",
            label: "Open Register",
            value: ov.openShifts ?? 0,
            icon: Wallet,
            tone: "red",
          },
          {
            id: "pos",
            label: "Pending POs",
            value: ov.pendingPOs ?? 0,
            icon: ShoppingBag,
            tone: "blue",
          },
          {
            id: "restock",
            label: "Restock Warnings",
            value: ov.restockWarnings ?? 0,
            icon: DollarSign,
            tone: "amber",
          },
        ]);

        const rawOrders: any[] = ordersRes.data?.data ?? ordersRes.data?.orders ?? [];
        const live: LiveOrder[] = rawOrders.map((o: any) => {
          const customerName =
            typeof o.customer === "string"
              ? o.customer
              : o.customer?.name ?? "Walk-in";
          return {
            id: o.orderId ?? o._id,
            customer: customerName,
            initials: customerName.charAt(0).toUpperCase(),
            amount: o.total ?? 0,
            time: o.createdAt
              ? new Date(o.createdAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
              : "--",
            status: mapOrderStatus(o.status),
          };
        });
        setLiveOrders(live);
      } catch {
        // silently fail — static fallback via initial empty state
      }
    };

    load();
  }, [dateRange.from, dateRange.to]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5 sm:mb-7">
        <HeaderLayout
          title={`${t("Welcome back")}, ${t("Admin")}`}
          description={`${t("Real-time business performance metrics")} — ${today || DASHBOARD_DATE}`}
          className="mb-0"
        />
        <div className="flex flex-wrap items-center gap-3.5">
          <DefaultButton
            data={{
              buttonText: t("Customer Notification"),
              onClick: () => setIsNotificationOpen(true),
              icon: <Bell className="size-4.5 text-white" />,
            }}
          />

          <div className="flex h-12.5 items-center rounded-full border border-[#E1E1E5] bg-white px-4.5 shadow-sm text-[14px]">
            <DatePicker
              value={dateRange.from}
              onChange={(from) => setDateRange((prev) => ({ ...prev, from }))}
              placeholder={t("From")}
              popoverPlacement="bottom-right"
              buttonClassName="border-0 bg-transparent h-auto p-0 shadow-none hover:bg-transparent text-[14px] font-semibold text-[#28293D] cursor-pointer w-auto inline-flex gap-1.5 flex-row-reverse [&>svg]:size-4.5 [&>svg]:text-primary"
            />
            <span className="mx-2 h-4 w-px bg-[#E1E1E5]" />
            <DatePicker
              value={dateRange.to}
              onChange={(to) => setDateRange((prev) => ({ ...prev, to }))}
              placeholder={t("To")}
              popoverPlacement="bottom-right"
              minDate={dateRange.from || undefined}
              buttonClassName="border-0 bg-transparent h-auto p-0 shadow-none hover:bg-transparent text-[14px] font-semibold text-[#28293D] cursor-pointer w-auto inline-flex gap-1.5 flex-row-reverse [&>svg]:size-4.5 [&>svg]:text-primary"
            />
          </div>
        </div>
      </div>

      <CustomerNotificationDialog
        open={isNotificationOpen}
        onOpenChange={setIsNotificationOpen}
      />

      <DashboardMetrics metrics={metrics} />

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[1.6fr_1fr]">
        <RevenueTrendChart data={revenueTrend} />
        <PerformanceIndicators indicators={indicators} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[1fr_1.4fr]">
        <TopSoldProducts products={topProducts} />
        <LiveOrderStream orders={liveOrders} />
      </div>
    </div>
  );
};

export default DashboardPage;
