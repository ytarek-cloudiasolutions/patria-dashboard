import { useEffect, useMemo, useState } from "react";
import {
  DASHBOARD_METRICS,
  PERFORMANCE_INDICATORS,
} from "./data";

import DashboardMetrics from "./components/DashboardMetrics";
import LiveOrderStream from "./components/LiveOrderStream";
import PerformanceIndicators from "./components/PerformanceIndicators";
import RevenueTrendChart from "./components/RevenueTrendChart";
import TopSoldProducts from "./components/TopSoldProducts";
import HeaderLayout from "@/layouts/HeaderLayout";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useDashboard } from "./hooks/useDashboard";
import { api } from "@/config/api";
import type { DashboardMetric, LiveOrder, PerformanceIndicator, RevenuePoint, SoldProduct } from "./types";

interface ExtraStats {
  productsTotal: number | null;
  offersTotal: number | null;
  staffTotal: number | null;
  lowStockCount: number | null;
  recentOrders: LiveOrder[];
}

const DashboardPage = () => {
  const { t } = useTranslation();
  const { overview, getDashboardData } = useDashboard();

  const [extra, setExtra] = useState<ExtraStats>({
    productsTotal: null,
    offersTotal: null,
    staffTotal: null,
    lowStockCount: null,
    recentOrders: [],
  });

  useEffect(() => {
    getDashboardData();
  }, [getDashboardData]);

  useEffect(() => {
    const fetchExtra = async () => {
      try {
        const [productsRes, offersRes, usersRes, notifRes, ordersRes] = await Promise.allSettled([
          api.get("/products?limit=1"),
          api.get("/offers?isActive=true&limit=1"),
          api.get("/users?limit=1"),
          api.get("/notifications?limit=1"),
          api.get("/orders?limit=6"),
        ]);

        const productsTotal =
          productsRes.status === "fulfilled"
            ? (productsRes.value.data?.total ?? productsRes.value.data?.pagination?.total ?? null)
            : null;

        const offersTotal =
          offersRes.status === "fulfilled"
            ? (offersRes.value.data?.pagination?.total ?? offersRes.value.data?.total ?? null)
            : null;

        const staffTotal =
          usersRes.status === "fulfilled"
            ? (usersRes.value.data?.pagination?.total ?? usersRes.value.data?.total ?? null)
            : null;

        const lowStockCount =
          notifRes.status === "fulfilled"
            ? (notifRes.value.data?.notifications?.filter((n: { type?: string }) => n.type === "lowStock").length ?? null)
            : null;

        const rawOrders =
          ordersRes.status === "fulfilled"
            ? (ordersRes.value.data?.data ?? [])
            : [];

        const mapStatus = (s?: string): LiveOrder["status"] => {
          switch ((s ?? "").toLowerCase()) {
            case "confirmed": return "Confirmed";
            case "delivered": return "Delivered";
            case "on the way": return "On The Way";
            default: return "Pending";
          }
        };

        const recentOrders: LiveOrder[] = rawOrders.map((o: {
          _id: string;
          customer?: { name?: string } | string;
          status?: string;
          total?: number;
          createdAt?: string;
        }) => {
          const name =
            typeof o.customer === "string"
              ? o.customer
              : o.customer?.name ?? "Walk-in";
          const initials = name
            .split(" ")
            .slice(0, 2)
            .map((w: string) => w[0]?.toUpperCase() ?? "")
            .join("");
          return {
            id: o._id,
            customer: name,
            initials: initials || "WI",
            amount: o.total ?? 0,
            status: mapStatus(o.status),
            time: o.createdAt
              ? new Date(o.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
              : "--",
          };
        });

        setExtra({ productsTotal, offersTotal, staffTotal, lowStockCount, recentOrders });
      } catch {
        // silent — fallback to null values
      }
    };

    fetchExtra();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const metrics = useMemo<DashboardMetric[]>(() => {
    return DASHBOARD_METRICS.map((m) => {
      if (m.id === "revenue") {
        const val = overview?.summary?.totalRevenue ?? 0;
        return {
          ...m,
          value: val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        };
      }
      if (m.id === "orders") {
        return { ...m, value: overview?.summary?.totalOrders ?? 0 };
      }
      if (m.id === "products") {
        return { ...m, value: extra.productsTotal ?? 0 };
      }
      if (m.id === "offers") {
        return { ...m, value: extra.offersTotal ?? 0 };
      }
      return m;
    });
  }, [overview, extra]);

  const revenueTrend = useMemo<RevenuePoint[]>(() => {
    if (!overview?.dailyRevenue?.length) return [];
    return overview.dailyRevenue.map((entry) => ({
      day: new Date(entry._id).toLocaleDateString("en-US", { weekday: "short" }),
      value: entry.revenue,
    }));
  }, [overview]);

  const topProducts = useMemo<SoldProduct[]>(() => {
    if (!overview?.topProducts?.length) return [];
    return overview.topProducts.map((p, idx) => ({
      id: p.name,
      rank: String(idx + 1).padStart(2, "0"),
      name: p.name,
      units: p.quantity,
    }));
  }, [overview]);

  const performanceIndicators = useMemo<PerformanceIndicator[]>(() => {
    return PERFORMANCE_INDICATORS.map((ind) => {
      if (ind.id === "staff" && extra.staffTotal != null) {
        return { ...ind, value: extra.staffTotal };
      }
      if (ind.id === "restock" && extra.lowStockCount != null) {
        return { ...ind, value: extra.lowStockCount };
      }
      return ind;
    });
  }, [extra]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <HeaderLayout
        title={`${t("Welcome back")}, ${t("Admin")}`}
        description={`${t("Real-time business performance metrics")} — ${today}`}
        className="mb-5 sm:mb-7"
      />

      <DashboardMetrics metrics={metrics} />

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[1.6fr_1fr]">
        <RevenueTrendChart data={revenueTrend} />
        <PerformanceIndicators indicators={performanceIndicators} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[1fr_1.4fr]">
        <TopSoldProducts products={topProducts} />
        <LiveOrderStream orders={extra.recentOrders} />
      </div>
    </div>
  );
};

export default DashboardPage;
