import { useState } from "react";
import { ShoppingBag, Users } from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";
import AccountSettingsForm from "./components/AccountSettingsForm";
import DateRangeFilter from "./components/DateRangeFilter";
import OrderReportsTable from "./components/OrderReportsTable";
import { defaultAccountFormData, ordersData } from "./data";
import type { AccountFormData } from "./types";
import HeaderLayout from "@/layouts/HeaderLayout";

const MyAccountPage = () => {
  const [accountData, setAccountData] = useState<AccountFormData>(
    defaultAccountFormData
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
      icon: <Users size={22} />,
      badgeColor: "bg-[#FFF5EC]",
      iconColor: "text-primary",
    },
    {
      title: "Total Revenue",
      value: "EGP 8,906.8",
      icon: <ShoppingBag size={22} />,
      badgeColor: "bg-[#DDF6EB]",
      iconColor: "text-[#00A85A]",
    },
  ];

  return (
    <div className="space-y-6">
      <HeaderLayout
        title="Order reports"
        description="Filter by date and export to Excel"
      />
      <DateRangeFilter
        from={dateFrom}
        to={dateTo}
        onFromChange={setDateFrom}
        onToChange={setDateTo}
      />
      <div className="grid gap-[32px] xl:grid-cols-[345px_minmax(0,1fr)]">
        <div className="min-w-0">
          <AccountSettingsForm data={accountData} onSave={handleSaveAccount} />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid grid-cols-1 gap-[25px] lg:grid-cols-2">
            {overviewCards.map((card) => (
              <OverviewCard key={card.title} data={card} />
            ))}
          </div>

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
