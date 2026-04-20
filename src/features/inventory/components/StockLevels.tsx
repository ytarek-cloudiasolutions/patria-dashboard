import { Badge } from "@/shared/components/ui/badge";
import type { StockLevelsProps } from "../types";

const StockLevels = ({ levels }: StockLevelsProps) => {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-2.5">
      <p className="text-[12px] font-medium text-[#595959]">Stocks level:</p>
      {levels.map((level) => (
        <Badge
          key={level.status}
          className="rounded-[16px] px-2 py-3 text-[13px] font-semibold"
          style={{ backgroundColor: level.bgColor, color: level.textColor }}
        >
          <span
            className="mr-1 size-[4.43px] rounded-full"
            style={{ backgroundColor: level.textColor }}
            aria-hidden
          />
          {level.label}
        </Badge>
      ))}
    </div>
  );
};

export default StockLevels;
