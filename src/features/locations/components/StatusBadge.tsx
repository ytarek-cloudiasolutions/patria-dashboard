import { Badge } from "@/shared/components/ui/badge";
import type { LocationStatus } from "../types";

interface StatusBadgeProps {
  status: LocationStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const isAvailable = status === "available";

  return (
    <Badge
      className={`${
        isAvailable
          ? "bg-[#EDF8F0] text-[#059B5A]"
          : "bg-[#DCDCDC] text-[#23252A]"
      }`}
    >
      {isAvailable ? "Available" : "Inactive"}
    </Badge>
  );
};

export default StatusBadge;
