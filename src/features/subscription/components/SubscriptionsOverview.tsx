import { CalendarClock, Clock4, TrendingUp, Users } from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";

interface SubscriptionsOverviewProps {
  activeSubscribers: number;
  estimatedMrr: number;
  upcomingDeliveries: number;
}

const SubscriptionsOverview = ({
  activeSubscribers,
  estimatedMrr,
  upcomingDeliveries,
}: SubscriptionsOverviewProps) => (
  <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
    <OverviewCard
      data={{
        title: "Active Subscribers",
        value: activeSubscribers,
        icon: <Users size={18} />,
        iconColor: "text-primary",
        badgeColor: "bg-[#F5F0EA]",
      }}
    />
    <OverviewCard
      data={{
        title: "Estimated MRR",
        value: estimatedMrr,
        icon: <TrendingUp size={18} />,
        iconColor: "text-[#059B5A]",
        badgeColor: "bg-[#E2F4ED]",
      }}
    />
    <OverviewCard
      data={{
        title: "Upcoming Deliveries",
        value: upcomingDeliveries,
        icon: <Clock4 size={18} />,
        iconColor: "text-[#C7861E]",
        badgeColor: "bg-[#FFF7E6]",
      }}
    />
  </div>
);

export default SubscriptionsOverview;
