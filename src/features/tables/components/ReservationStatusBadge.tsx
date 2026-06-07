import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { ReservationStatus } from "../types";

export const RESERVATION_STATUS_STYLES: Record<ReservationStatus, string> = {
  "On Hold": "border-[#C7861E] bg-[#FFF5DC] text-[#C7861E]",
  Sitting: "border-[#059B5A] bg-[#E2F4ED] text-[#059B5A]",
  Confirmed: "border-[#004EF9] bg-[#EDF4FB] text-[#3574FF]",
  cancelled: "border-[#C90000] bg-[#FFF0F0] text-[#C90000]",
  Ended: "border-[#624F1C] bg-[#8F6900] text-white",
};

const ReservationStatusBadge = ({ status }: { status: ReservationStatus }) => {
  const { t } = useTranslation();
  return (
    <Badge
      className={cn(
        "h-6 w-28 justify-center rounded-full border px-3 py-0 text-[11px] font-semibold capitalize",
        RESERVATION_STATUS_STYLES[status],
      )}
    >
      {t(status)}
    </Badge>
  );
};

export default ReservationStatusBadge;
