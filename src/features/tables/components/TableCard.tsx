import { Armchair, Trash2, Users } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { RestaurantTable } from "../types";

interface TableCardProps {
  table: RestaurantTable;
  onDelete: (table: RestaurantTable) => void;
}

const TableCard = ({ table, onDelete }: TableCardProps) => {
  const { t } = useTranslation();
  const isAvailable = table.status === "Available";

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
      <div className="mt-1 flex items-center gap-2">
        <Badge
          className={cn(
            "h-8 rounded-[8px] px-3 py-0 text-[13px] font-semibold",
            isAvailable
              ? "bg-[#E2F4ED] text-[#059B5A]"
              : "bg-[#FFF0F0] text-[#C90000]",
          )}
        >
          {t(table.status)}
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
