import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import RecentOrdersTable from "./RecentOrdersTable";

const RecentOrdersOverview = () => {
  return (
    <Card className="border border-[#CACBD4]">
      <CardHeader className="flex justify-between">
        <CardTitle className="font-semibold text-[18px] text-[#28293D] mb-3.25">
          Recent Orders
        </CardTitle>
        <a href="#" className="font-semibold text-[16px] text-primary">
          View all
        </a>
      </CardHeader>
      <CardContent>
        <RecentOrdersTable />
      </CardContent>
    </Card>
  );
};

export default RecentOrdersOverview;
