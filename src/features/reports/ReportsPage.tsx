import { useState } from "react";
import {
  Plus,
  RefreshCw,
  Calendar,
  LayoutDashboard,
  Users,
  MapPin,
} from "lucide-react";
import DefaultButton from "@/shared/components/DefaultButton";

import { cn } from "@/lib/utils";
import BranchTab from "./components/BranchTab";
import EmployeeTab from "./components/EmployeeTab";
import OverviewTab from "./components/OverviewTab";
import {
  OVERVIEW_STATS,
  DAILY_REVENUE,
  TOP_PRODUCTS,
  COUPON_PERFORMANCE,
  DELIVERY_PERFORMANCE,
  ROASTING_DISTRIBUTION,
  GRINDING_DISTRIBUTION,
  EOD_SESSIONS,
  EMPLOYEE_STATS,
  EMPLOYEE_REVENUE_SHARES,
  EMPLOYEE_REQUEST_COUNTS,
  EMPLOYEE_REPORTS,
  SHIFT_DETAILS,
  BRANCH_STATS,
  REGION_REVENUES,
  REGION_DISTRIBUTION,
  BRANCH_REPORTS,
} from "./data";
import type { ReportTab } from "./types";

const TABS: { value: ReportTab; label: string; icon: React.ReactNode }[] = [
  { value: "overview", label: "Overview", icon: <LayoutDashboard size={15} /> },
  { value: "employee", label: "Employee reports", icon: <Users size={15} /> },
  { value: "branch", label: "Branch reports", icon: <MapPin size={15} /> },
];

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>("overview");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [detailedExport, setDetailedExport] = useState(false);

  return (
    <div>
      <div className="mx-auto max-w-[1200px]">
        {/* Page Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#28293D]">
              Reports and Statistics
            </h1>
            <p className="mt-0.5 text-[13px] text-[#6B6B6B]">
              Detailed Performance Data
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => console.log("Refresh")}
              className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#E5E5E5] bg-white text-[#6B6B6B] hover:bg-[#F5F0EA] transition-colors cursor-pointer"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Date Range Filters */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          {[
            { placeholder: "From", value: dateFrom, onChange: setDateFrom },
            { placeholder: "To", value: dateTo, onChange: setDateTo },
          ].map((field) => (
            <div key={field.placeholder} className="relative flex items-center">
              <input
                type="date"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                className="h-12 w-full rounded-[10px] border border-[#E5E5E5] bg-white pl-4 pr-10 text-[14px] text-[#28293D] placeholder:text-[#AAAAAA] outline-none focus:border-[#5C4A0E] transition-colors"
              />
              <Calendar
                size={16}
                className="pointer-events-none absolute right-4 text-[#6B6B6B]"
              />
            </div>
          ))}
        </div>

        {/* Tabs - styled like FinancialHubPage */}
        <div className="mb-4 grid grid-cols-3 gap-x-1.5 gap-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`relative h-auto w-full cursor-pointer rounded-none pb-3 text-center text-[16px] font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab.value
                  ? "text-[#333333] font-medium"
                  : "text-[#8B8B8B] hover:text-[#8B8B8B]"
              }`}
            >
              {tab.icon}
              {tab.label}
              <span
                className={`absolute right-0 bottom-0 left-0 h-0.5 transition-all ${
                  activeTab === tab.value ? "bg-primary" : "bg-[#8B8B8B]"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <OverviewTab
            stats={OVERVIEW_STATS}
            dailyRevenue={DAILY_REVENUE}
            topProducts={TOP_PRODUCTS}
            couponPerformance={COUPON_PERFORMANCE}
            deliveryPerformance={DELIVERY_PERFORMANCE}
            roastingDistribution={ROASTING_DISTRIBUTION}
            grindingDistribution={GRINDING_DISTRIBUTION}
            eodSessions={EOD_SESSIONS}
            detailedExport={detailedExport}
            onToggleDetailedExport={() => setDetailedExport((p) => !p)}
          />
        )}
        {activeTab === "employee" && (
          <EmployeeTab
            stats={EMPLOYEE_STATS}
            revenueShares={EMPLOYEE_REVENUE_SHARES}
            requestCounts={EMPLOYEE_REQUEST_COUNTS}
            reports={EMPLOYEE_REPORTS}
            shiftDetails={SHIFT_DETAILS}
          />
        )}
        {activeTab === "branch" && (
          <BranchTab
            stats={BRANCH_STATS}
            regionRevenues={REGION_REVENUES}
            regionDistribution={REGION_DISTRIBUTION}
            reports={BRANCH_REPORTS}
          />
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
