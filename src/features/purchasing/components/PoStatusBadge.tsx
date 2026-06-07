import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PoStatus } from "../types";

interface PoStatusBadgeProps {
  status: PoStatus;
}

const STATUS_STYLES: Record<PoStatus, string> = {
  Paid: "bg-[#E2F4ED] text-[#059B5A] border-current",
  Unpaid: "bg-[#FFF0F0] text-[#C90000] border-current",
  Pending: "bg-[#FFF5DC] text-[#B56C00] border-current",
  Canceled: "bg-[#EAEAEA] text-[#5A5A66] border-current",
};

const PoStatusBadge = ({ status }: PoStatusBadgeProps) => (
  <Badge
    className={cn(
      "h-7 px-3 py-1 text-[13px] font-semibold border rounded-full",
      STATUS_STYLES[status],
    )}
  >
    {status}
  </Badge>
);

export default PoStatusBadge;
