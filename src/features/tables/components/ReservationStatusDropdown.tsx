import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { RESERVATION_STATUS_OPTIONS } from "../data";
import type { ReservationStatus } from "../types";

interface ReservationStatusDropdownProps {
  value: ReservationStatus;
  onChange: (status: ReservationStatus) => void;
}

const statusClasses: Record<ReservationStatus, string> = {
  "On Hold": "bg-[#FFF2DF] text-[#B78023]",
  Sitting: "bg-[#E7F7EE] text-[#059B5A]",
  cancelled: "bg-[#FFE8E8] text-[#D62424]",
  Confirmed: "bg-[#E4ECFF] text-[#2B62D6]",
  Ended: "bg-[#8F6900] text-white",
};

const ReservationStatusDropdown = ({
  value,
  onChange,
}: ReservationStatusDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex w-33 items-center justify-between"
          aria-label="Toggle reservation status options"
        >
          <span
            className={`w-24 rounded-[999px] px-3 py-1 text-center text-[11px] font-semibold ${statusClasses[value]}`}
          >
            {value}
          </span>
          <span className="flex size-4 items-center justify-center text-[#232336]">
            <ChevronDown size={16} />
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" sideOffset={8} className="w-40 p-1.5">
        {RESERVATION_STATUS_OPTIONS.map((status) => {
          const isSelected = status === value;

          return (
            <DropdownMenuItem
              key={status}
              onSelect={() => onChange(status)}
              className={`mb-1 w-full rounded-[7px] px-3 py-1.5 text-left text-[12px] font-medium last:mb-0 ${
                isSelected
                  ? "bg-primary text-white focus:bg-primary focus:text-white"
                  : "text-[#2B2B3A] focus:bg-[#F6F6F9] focus:text-[#2B2B3A]"
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
