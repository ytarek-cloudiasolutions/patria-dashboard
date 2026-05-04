import { useState } from "react";
import { Users, ShoppingBag } from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";
import AccountSettingsForm from "./components/AccountSettingsForm";
import DateRangeFilter from "./components/DateRangeFilter";
import OrderReportsTable from "./components/OrderReportsTable";
import { defaultAccountFormData, ordersData } from "./data";
import type { AccountFormData } from "./types";

const MyAccountPage = () => {
  const [accountData, setAccountData] = useState<AccountFormData>(
    defaultAccountFormData,
  );
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleSaveAccount = (data: AccountFormData) => {
    setAccountData(data);
    // TODO: call API to save account data
    console.log("Saving account data:", data);
  };

  const handleDownloadExcel = () => {
    // TODO: implement excel download
    console.log("Downloading Excel...");
  };

  const overviewCards = [
    {
      title: "Total Orders",
      value: 52,
      icon: <Users size={20} />,
      badgeColor: "bg-[#FFF5EC]",
      iconColor: "text-[#FF8A00]",
    },
    {
      title: "Total Revenue",
      value: "EGP 8,906.8",
      icon: <ShoppingBag size={20} />,
      badgeColor: "bg-[#E8F5FF]",
      iconColor: "text-[#0099FF]",
    },
  ];

  return (
    <div className="p-6 max-w-full">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[#28293D] text-[24px] font-semibold">
          Order reports
        </h1>
        <p className="text-[#8B8B8B] text-[14px] mt-1">
          Filter by date and export to Excel
        </p>
      </div>

      {/* Date Range Filter */}
      <div className="mb-6">
        <DateRangeFilter
          from={dateFrom}
          to={dateTo}
          onFromChange={setDateFrom}
          onToChange={setDateTo}
        />
      </div>

      {/* Main Layout: Settings + Reports */}
      <div className="flex gap-5">
        {/* Left: Account Settings Form */}
        <div className="w-[280px] flex-shrink-0">
          <AccountSettingsForm data={accountData} onSave={handleSaveAccount} />
        </div>

        {/* Right: Stats + Table */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 gap-4">
            {overviewCards.map((card) => (
              <OverviewCard key={card.title} data={card} />
            ))}
          </div>

          {/* Orders Table */}
          <OrderReportsTable
            orders={ordersData}
            totalInPeriod={52}
            onDownloadExcel={handleDownloadExcel}
          />
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
