import { Armchair, Trash2, Users } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { DiningTable } from "../types";

interface TableCardProps {
  table: DiningTable;
  onDelete: (tableId: string) => void;
  onStatusToggle: (tableId: string) => void;
}

const TableCard = ({ table, onDelete, onStatusToggle }: TableCardProps) => {
  const isAvailable = table.status === "Available";

  return (
    <Card className="rounded-[16px]">
      <CardContent className="px-7.5 py-6">
        <div className="mb-3 flex justify-center">
          <Armchair
            size={24}
            className={isAvailable ? "text-[#059B5A]" : "text-[#C90000]"}
          />
        </div>

        <div className="flex flex-col items-center gap-2 mb-3">
          <p className=" text-[24px] font-semibold ">{table.tableNumber}</p>
          <p className="flex items-center gap-1 text-[12px] font-medium text-[#595959]">
            <Users size={14} className="text-[#595959]" />
            {table.capacity} People
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Badge
            asChild
            className={`h-auto cursor-pointer rounded-[5px] px-2 py-1 text-[10px] font-semibold transition-colors ${
              isAvailable
                ? "bg-[#E2F4ED] text-[#059B5A]"
                : "bg-[#FFF0F0] text-[#C90000]"
            }`}
          >
            <button type="button" onClick={() => onStatusToggle(table.id)}>
              {table.status}
            </button>
          </Badge>

          <Badge
            asChild
            className="h-auto cursor-pointer rounded-[5px] bg-[#FFF0F0] px-2 py-1 text-[#C90000] transition-colors hover:bg-[#FFE7E7]"
          >
            <button
              type="button"
              onClick={() => onDelete(table.id)}
              aria-label={`Delete table ${table.tableNumber}`}
            >
              <Trash2 size={14} />
            </button>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableCard;
