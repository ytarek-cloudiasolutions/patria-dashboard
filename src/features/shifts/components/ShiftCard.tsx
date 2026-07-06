import { Clock, SquarePen, Trash2 } from "lucide-react";
import type { Shift } from "../types";
import { formatShiftRange, shiftInitial } from "../utils";

interface ShiftCardProps {
  shift: Shift;
  onEdit: (shift: Shift) => void;
  onDelete: (shift: Shift) => void;
}

const ShiftCard = ({ shift, onEdit, onDelete }: ShiftCardProps) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[16px] border border-[#E5E5E5] bg-white px-4 py-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold text-white"
          style={{ backgroundColor: shift.color }}
        >
          {shiftInitial(shift.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-[#28293D] sm:text-[16px]">
            {shift.name}
          </p>
          <p
            className="mt-1 flex items-center gap-1.5 text-[13px] text-[#8B8B8B]"
            dir="ltr"
          >
            <Clock className="size-3.5 shrink-0" />
            {formatShiftRange(shift.startTime, shift.endTime)}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => onEdit(shift)}
          className="cursor-pointer text-[#28293D] transition-colors hover:text-primary"
          aria-label={`Edit ${shift.name}`}
        >
          <SquarePen className="size-4.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(shift)}
          className="cursor-pointer text-[#C90000] transition-colors hover:opacity-80"
          aria-label={`Delete ${shift.name}`}
        >
          <Trash2 className="size-4.5" />
        </button>
      </div>
    </div>
  );
};

export default ShiftCard;
