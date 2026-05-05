import { Clock, UserRound } from "lucide-react";

import SearchInputField from "@/shared/components/SearchInputField";

type PosTopbarProps = {
  search: string;
  timeLabel: string;
  onSearchChange: (value: string) => void;
};

const PosTopbar = ({ search, timeLabel, onSearchChange }: PosTopbarProps) => {
  return (
    <header className="flex h-[74px] shrink-0 items-center justify-between gap-5 border-b border-[#EDEBE7] bg-white px-5">
      <SearchInputField
        value={search}
        onChange={onSearchChange}
        placeholder="Search products by name or SKU..."
       
      />

      <div className="flex items-center gap-4">
        <div className="flex h-10 min-w-[126px] items-center justify-center gap-2 rounded-[12px] border border-[#E8E6E1] bg-[#FCFBF8] px-4 text-[12px] font-semibold text-[#1F2433]">
          <Clock className="size-4" />
          {timeLabel}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#9B7200]">
            <UserRound className="size-4 text-white" />
          </div>
          <div>
            <p className="text-[12px] font-semibold leading-4 text-[#1F2433]">
              Cashier
            </p>
            <p className="text-[10px] text-[#8B8B8B]">Mariam - Staff</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PosTopbar;
