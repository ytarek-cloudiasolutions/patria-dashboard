import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TransferStatus } from "../types";

interface TransferStatusBadgeProps {
  status: TransferStatus;
}

const STATUS_STYLES: Record<TransferStatus, string> = {
  Pending: "bg-[#FFF5DC] text-[#B56C00] border-current",
  Approved: "bg-[#E2F4ED] text-[#059B5A] border-current",
  Rejected: "bg-[#FFF0F0] text-[#C90000] border-current",
  Completed: "bg-[#E3ECFF] text-[#3357B5] border-current",
};

const TransferStatusBadge = ({ status }: TransferStatusBadgeProps) => (
  <Badge
    className={cn(
      "h-7 px-3 py-1 text-[13px] font-semibold border rounded-full",
      STATUS_STYLES[status],
    )}
  >
    {status}
  </Badge>
);

export default TransferStatusBadge;
