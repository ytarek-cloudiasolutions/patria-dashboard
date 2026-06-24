import { Armchair, Loader2, Trash2, Users } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Table } from "../store/tableTypes";

const SECTION_DISPLAY: Record<string, string> = {
  main_hall: "Main Hall",
  terrace: "Terrace",
  vip: "VIP",
  counter: "Counter",
};

const STATUS_DISPLAY: Record<string, string> = {
  available: "Available",
  occupied: "Unavailable",
};

interface TableCardProps {
  table: Table;
  isTogglingStatus?: boolean;
  onDelete: (table: Table) => void;
  onToggleStatus: (table: Table) => void;
}

const TableCard = ({
  table,
  isTogglingStatus,
  onDelete,
  onToggleStatus,
}: TableCardProps) => {
  const { t } = useTranslation();
  const isAvailable = table.status === "available";

  return (
    <div className="flex flex-col items-center gap-3 rounded-[16px] border border-[#E5E5E5] bg-white px-4 py-6 text-center">
      <Armchair
        size={28}
        className={isAvailable ? "text-[#059B5A]" : "text-[#C90000]"}
      />
      <p className="text-[30px] font-bold leading-none text-[#28293D]">
        {table.number}
      </p>
      <span className="flex items-center gap-1.5 text-[14px] text-[#8B8B8B]">
        <Users size={16} />
        {table.capacity} {t("People")}
      </span>
      <p className="text-[12px] text-[#8B8B8B]">
        {t(SECTION_DISPLAY[table.section] ?? table.section)}
      </p>
      <div className="mt-1 flex items-center gap-2">
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
            "h-8 cursor-pointer rounded-[8px] px-3 py-0 text-[13px] font-semibold transition-opacity select-none",
            isAvailable
              ? "bg-[#E2F4ED] text-[#059B5A] hover:bg-[#d0eddf]"
              : "bg-[#FFF0F0] text-[#C90000] hover:bg-[#ffe0e0]",
            isTogglingStatus && "pointer-events-none opacity-60",
          )}
        >
          {isTogglingStatus ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            t(STATUS_DISPLAY[table.status] ?? table.status)
          )}
        </Badge>
        <button
          type="button"
          aria-label={`Delete table ${table.number}`}
          onClick={() => onDelete(table)}
          className="flex size-8 cursor-pointer items-center justify-center rounded-[8px] bg-[#FFF0F0] text-[#C90000]"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TableCard;
