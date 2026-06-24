import { ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { RESERVATION_STATUS_OPTIONS } from "../data";
import type { ReservationStatus } from "../types";
import ReservationStatusBadge from "./ReservationStatusBadge";

interface ReservationStatusSelectProps {
  status: ReservationStatus;
  isLoading?: boolean;
  onChange: (status: ReservationStatus) => void;
  onOpenChange: (open: boolean) => void;
}

const ReservationStatusSelect = ({
  status,
  isLoading,
  onChange,
  onOpenChange,
}: ReservationStatusSelectProps) => {
  const { t } = useTranslation();
  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <button
          type="button"
          disabled={isLoading}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 outline-none transition-opacity",
            isLoading && "pointer-events-none opacity-60",
          )}
        >
          <ReservationStatusBadge status={status} />
          {isLoading ? (
            <Loader2 size={16} className="animate-spin text-[#8B8B8B]" />
          ) : (
            <ChevronDown className="size-4.5 text-[#000000]" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="z-70 space-y-1 rounded-[16px] p-2 ring-0"
      >
        {RESERVATION_STATUS_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => onChange(option.value)}
            className={cn(
              "cursor-pointer rounded-[10px] px-3 py-2 text-[13px] font-medium",
              status === option.value
                ? "pointer-events-none bg-primary text-primary-foreground"
                : "text-[#28293D] data-highlighted:bg-[#F5F0EA]",
            )}
          >
            {t(option.label)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReservationStatusSelect;
