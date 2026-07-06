import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { ZoneStatus } from "../types";

interface StatusBadgeProps {
  status: ZoneStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { t } = useTranslation();
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
      {isActive ? t("Available") : t("Inactive")}
    </Badge>
  );
};

export default StatusBadge;
