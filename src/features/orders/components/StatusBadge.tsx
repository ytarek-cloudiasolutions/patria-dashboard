import { Badge } from "@/shared/components/ui/badge";
import type { OrderStatus } from "../types";

interface StatusBadgeProps {
  status: OrderStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-[#FFF8E6] text-[#F9A825]";
      case "Preparing":
        return "bg-[#F5F0EA] text-[#6B5E4B]";
      case "Delivered":
        return "bg-[#EDF8F0] text-[#059B5A]";
      case "Cancelled":
        return "bg-[#FFF0F0] text-[#C90000]";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} font-medium`}>{status}</Badge>
  );
};

export default StatusBadge;
