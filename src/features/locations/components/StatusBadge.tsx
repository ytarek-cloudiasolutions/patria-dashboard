import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ZoneStatus } from "../types";

interface StatusBadgeProps {
  status: ZoneStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const isActive = status === "Active";

  return (
    <Badge
      className={cn(
        "h-7 px-3 py-1 text-[13px] font-semibold border rounded-full",
        isActive
          ? "bg-[#E2F4ED] text-[#059B5A] border-current"
          : "bg-[#DCDCDC] text-[#23252A] border-[#595959]",
      )}
    >
      {isActive ? "Available" : "Inactive"}
    </Badge>
  );
};

export default StatusBadge;
