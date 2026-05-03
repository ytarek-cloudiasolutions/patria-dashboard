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

const DashboardPage = () => {
  return (
    <>
      <HeaderLayout
        title="Welcome back, Admin"
        description={`Real-time business performance metrics — ${DASHBOARD_DATE}`}
        className="mb-7"
      />
      <div className="space-y-6">
        <DashboardMetrics metrics={DASHBOARD_METRICS} />

        <div className="grid gap-7.5 xl:grid-cols-[1.55fr_1fr]">
          <RevenueTrendChart data={REVENUE_TREND} />
          <PerformanceIndicators indicators={PERFORMANCE_INDICATORS} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.25fr]">
          <TopSoldProducts products={TOP_SOLD_PRODUCTS} />
          <LiveOrderStream orders={LIVE_ORDERS} />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
