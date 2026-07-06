import {
  DASHBOARD_DATE,
  DASHBOARD_METRICS,
  LIVE_ORDERS,
  PERFORMANCE_INDICATORS,
  REVENUE_TREND,
  TOP_SOLD_PRODUCTS,
} from "./data";

import DashboardMetrics from "./components/DashboardMetrics";
import LiveOrderStream from "./components/LiveOrderStream";
import PerformanceIndicators from "./components/PerformanceIndicators";
import RevenueTrendChart from "./components/RevenueTrendChart";
import TopSoldProducts from "./components/TopSoldProducts";
import HeaderLayout from "@/layouts/HeaderLayout";
import { useTranslation } from "@/shared/i18n/useTranslation";

const DashboardPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <HeaderLayout
        title={`${t("Welcome back")}, ${t("Admin")}`}
        description={`${t("Real-time business performance metrics")} — ${DASHBOARD_DATE}`}
        className="mb-5 sm:mb-7"
      />

      {/* Metrics */}
      <DashboardMetrics metrics={DASHBOARD_METRICS} />

      {/* Row 1: Revenue Chart + Performance Indicators */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[1.6fr_1fr]">
        <RevenueTrendChart data={REVENUE_TREND} />
        <PerformanceIndicators indicators={PERFORMANCE_INDICATORS} />
      </div>

      {/* Row 2: Top Products + Live Orders */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[1fr_1.4fr]">
        <TopSoldProducts products={TOP_SOLD_PRODUCTS} />
        <LiveOrderStream orders={LIVE_ORDERS} />
      </div>
    </div>
  );
};

export default DashboardPage;
