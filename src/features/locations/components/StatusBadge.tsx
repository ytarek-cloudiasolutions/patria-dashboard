import { Badge } from "@/shared/components/ui/badge";
import type { LocationStatus } from "../types";

interface StatusBadgeProps {
  status: LocationStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const isAvailable = status === "available";

  return (
    <Badge
      className={`text-[13px] border-current ${
        isAvailable
          ? "bg-[#E2F4ED] text-[#059B5A]"
          : "bg-[#DCDCDC] text-[#23252A] border-[#595959]"
      }`}
    >
      {isAvailable ? "Available" : "Inactive"}
    </Badge>
  );
};

export default StatusBadge;
