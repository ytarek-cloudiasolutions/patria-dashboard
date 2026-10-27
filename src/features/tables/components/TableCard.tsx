import { Armchair, CalendarDays, Loader2, Trash2, Users } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Table } from "../store/tableTypes";

const STATUS_DISPLAY: Record<string, string> = {
  available: "Available",
  occupied: "Unavailable",
};

interface TableCardProps {
  table: Table;
  isTogglingStatus?: boolean;
  onDelete: (table: Table) => void;
  onToggleStatus: (table: Table) => void;
  onViewOrders: (table: Table) => void;
}

const TableCard = ({
  table,
  isTogglingStatus,
  onDelete,
  onToggleStatus,
  onViewOrders,
}: TableCardProps) => {
  const { t } = useTranslation();
  const isAvailable = table.status === "available";

  return (
    <div className="group/card flex w-[166px] flex-col items-center justify-start gap-[12px] overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white px-[30px] py-[24px] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_rgba(0,0,0,0.10)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:border-[#8F6900]/30">
      <Armchair
        size={24}
        className={cn(
          "transition-transform duration-300 ease-out group-hover/card:scale-110",
          isAvailable ? "text-[#059B5A]" : "text-[#C90000]"
        )}
      />
      <div className="flex flex-col items-center justify-start gap-[8px]">
        <div className="inline-flex items-center justify-center gap-[8px]">
          <span className="text-[24px] font-semibold tracking-[0.48px] text-black">
            {table.number}
          </span>
        </div>
        <div className="inline-flex items-center justify-start gap-[4px]">
          <Users size={14} className="text-[#595959]" />
          <div className="flex items-center justify-center gap-[8px]">
            <span className="text-[12px] font-medium tracking-[0.24px] text-[#595959]">
              {table.capacity} {t("People")}
            </span>
          </div>
        </div>
      </div>
      <div className="inline-flex items-center justify-center gap-[8px]">
        <Badge
          role="button"
          tabIndex={0}
          aria-label={`Toggle status for table ${table.number}`}
          onClick={() => onToggleStatus(table)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggleStatus(table);
            }
          }}
          className={cn(
            "flex cursor-pointer items-center justify-center gap-[12px] rounded-[5px] border-none p-[8px] text-[10px] font-semibold transition-all duration-200 select-none active:scale-95",
            isAvailable
              ? "bg-[#E2F4ED] text-[#059B5A] hover:bg-[#d0eddf]"
              : "bg-[#C90000] text-white hover:bg-[#b00000]",
            isTogglingStatus && "pointer-events-none opacity-60",
          )}
        >
          {isTogglingStatus ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            t(STATUS_DISPLAY[table.status] ?? table.status)
          )}
        </Badge>
        <button
          type="button"
          aria-label={`Delete table ${table.number}`}
          onClick={() => onDelete(table)}
          className="group/del flex cursor-pointer items-center justify-center gap-[12px] rounded-[8px] py-[8px] text-[#C90000] hover:bg-[#FFF0F0] transition-all duration-150 active:scale-90"
        >
          <Trash2 size={14} className="transition-transform duration-150 group-hover/del:scale-115" />
        </button>
        <button
          type="button"
          aria-label={`View orders for table ${table.number}`}
          onClick={() => onViewOrders(table)}
          className="group/cal flex cursor-pointer items-center justify-center gap-[12px] rounded-[8px] py-[8px] text-[#3574FF] hover:bg-[#EDF4FB] transition-all duration-150 active:scale-90"
        >
          <CalendarDays size={14} className="transition-transform duration-150 group-hover/cal:scale-115" />
        </button>
      </div>
    </div>
  );
};

export default TableCard;
