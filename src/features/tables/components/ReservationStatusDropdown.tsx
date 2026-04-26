import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { RESERVATION_STATUS_OPTIONS } from "../data";
import type { ReservationStatus } from "../types";

interface ReservationStatusDropdownProps {
  value: ReservationStatus;
  onChange: (status: ReservationStatus) => void;
}

const statusClasses: Record<ReservationStatus, string> = {
  "On Hold": "bg-[#FFF2DF] text-[#B78023]",
  Sitting: "bg-[#E2F4ED] text-[#059B5A]",
  cancelled: "bg-[#FFF0F0] text-[#C90000]",
  Confirmed: "bg-[#EDF4FB] text-[#3574FF]",
  Ended: "bg-primary border-[#624F1C]",
};

const ReservationStatusDropdown = ({
  value,
  onChange,
}: ReservationStatusDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-7 rounded-[6px] px-0 text-left hover:bg-transparent focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
          aria-label="Toggle reservation status"
        >
          <Badge
            className={`h-6 min-w-24 justify-center whitespace-nowrap rounded-[999px] border border-current px-2 text-center font-semibold text-[12px] ${statusClasses[value]}`}
          >
            {value}
          </Badge>
          <ChevronDown className="ml-1 size-4.5 text-[#000000]" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="z-70 w-[145.67px] rounded-[16px] p-2 ring-0 [&>[data-slot=dropdown-menu-item]+[data-slot=dropdown-menu-item]]:mt-2"
      >
        {RESERVATION_STATUS_OPTIONS.map((status) => {
          const isSelected = status === value;

          return (
            <DropdownMenuItem
              key={status}
              onSelect={() => onChange(status)}
              className={`rounded-[16px] px-3 py-2 text-[12px] font-medium ${
                isSelected
                  ? "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                  : "text-[#28293D]"
              }`}
            >
              {status}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReservationStatusDropdown;
