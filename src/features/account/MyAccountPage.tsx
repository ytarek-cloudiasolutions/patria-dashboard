import { useState } from "react";
import HeaderLayout from "@/layouts/HeaderLayout";

import AccountDateRange from "./components/AccountDateRange";
import AccountSettingsCard from "./components/AccountSettingsCard";
import AccountStats from "./components/AccountStats";
import OrderReportsTable from "./components/OrderReportsTable";

import { ACCOUNT_STATS, DEFAULT_ACCOUNT, ORDER_REPORTS } from "./data";
import type {
  AccountDateRange as AccountDateRangeType,
  AccountFormData,
} from "./types";

const MyAccountPage = () => {
  const [form, setForm] = useState<AccountFormData>(DEFAULT_ACCOUNT);
  const [dateRange, setDateRange] = useState<AccountDateRangeType>({
    from: "",
    to: "",
  });

  const handleChange = (key: keyof AccountFormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <>
      <div className="mb-6">
        <HeaderLayout
          title="Order reports"
          description="Filter by date and export to Excel"
        />
      </div>

      <AccountDateRange value={dateRange} onChange={setDateRange} />

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[322px_1fr]">
        <AccountSettingsCard
          form={form}
          onChange={handleChange}
          onSave={() => {}}
        />

        <div className="flex flex-col gap-4">
          <AccountStats
            totalOrders={ACCOUNT_STATS.totalOrders}
            totalRevenue={ACCOUNT_STATS.totalRevenue}
          />
          <OrderReportsTable
            orders={ORDER_REPORTS}
            count={ACCOUNT_STATS.totalOrders}
          />
        </div>
      </div>
    </>
  );
};

export default MyAccountPage;
