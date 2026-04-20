import TableCard from "./TableCard";
import type { DiningTable } from "../types";

interface TableCardsBoardProps {
  tables: DiningTable[];
  onDelete: (tableId: string) => void;
  onStatusToggle: (tableId: string) => void;
}

const TableCardsBoard = ({
  tables,
  onDelete,
  onStatusToggle,
}: TableCardsBoardProps) => {
  if (tables.length === 0) {
    return (
      <div className="mb-7 rounded-[12px] border border-dashed border-[#D9D9E0] bg-[#FCFCFD] px-4 py-8 text-center text-[14px] text-[#838393]">
        No tables found for this section.
      </div>
    );
  }

  return (
    <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
      {tables.map((table) => (
        <TableCard
          key={table.id}
          table={table}
          onDelete={onDelete}
          onStatusToggle={onStatusToggle}
        />
      ))}
    </div>
  );
};

export default TableCardsBoard;
