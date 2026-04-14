import HeaderLayout from "@/layouts/HeaderLayout";
import DashboardOverview from "../components/DashboardOverview";
import QuickActionsOverview from "../components/QuickActionsOverview";
import RecentOrdersOverview from "../components/RecentOrdersOverview";

const DashboardPage = () => {
  return (
    <div className="flex flex-col">
      <HeaderLayout
        title="Welcome back, Admin"
        description="Here's what's happening at Patria today."
      />
      <DashboardOverview />
      <div className="grid grid-cols-3 gap-7.25 mt-8">
        <div className="col-span-2">
          <RecentOrdersOverview />
        </div>
        <div className="col-span-1">
          <QuickActionsOverview />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
