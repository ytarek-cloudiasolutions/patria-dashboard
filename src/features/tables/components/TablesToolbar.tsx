import { CalendarDaysIcon, Plus, Search } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface TablesToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenNewReservation: () => void;
  onOpenAddTable: () => void;
}

const TablesToolbar = ({
  searchTerm,
  onSearchChange,
  onOpenNewReservation,
  onOpenAddTable,
}: TablesToolbarProps) => {
  return (
    <div className="mb-6">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-[32px]">Tables</h1>
          <p className="text-[16px] text-[#595959]">
            Manage and track table and reservation status
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="h-14 rounded-[5px] px-7.5 py-4 font-semibold text-[16px] text-primary border-[#F5F0EA] bg-[#F5F0EA] hover:text-primary hover:bg-[#F5F0EA]"
            onClick={onOpenNewReservation}
          >
            <div className="flex gap-3 items-center">
              <CalendarDaysIcon size={18} />
              New Reservation
            </div>
          </Button>

          <Button
            type="button"
            className="h-14 rounded-[5px] px-7.5 py-4 font-semibold text-[16px]"
            onClick={onOpenAddTable}
          >
            <div className="flex gap-3 items-center">
              <Plus size={18} />
              Add New Table
            </div>
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search
          size={20}
          className="absolute top-1/2 left-4 -translate-y-1/2 text-[#8B8B8B]"
        />
        <Input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tables, reservations..."
          className="h-12.5 border border-[#CACBD4] pl-11 text-[16px] placeholder:text-[#8B8B8B]"
        />
      </div>
    </div>
  );
};

export default TablesToolbar;
