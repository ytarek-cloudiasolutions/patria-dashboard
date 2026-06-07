import { cn } from "@/lib/utils";
import type { TabItemProps } from "../types/TabItem.types";

const TabItem = ({
  value,
  label,
  icon: Icon,
  count,
  isActive,
  onClick,
}: TabItemProps) => {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={cn(
        "flex h-11 items-center justify-center gap-1.5 border-b-2 px-2 text-[13px] font-semibold transition-colors cursor-pointer sm:h-12 sm:gap-2 sm:text-[15px]",
        isActive
          ? "border-primary text-[#333333]"
          : "border-[#8B8B8B] font-medium text-[#8B8B8B]"
      )}
    >
      {Icon && <Icon className="size-5 shrink-0 sm:size-6" />}
      <span className="truncate">{label}</span>
      {count !== undefined && (
        <div className="flex items-center justify-center min-w-5 h-4.5 bg-[#F5F0EA] px-1 rounded-[50px]">
          <span className="text-[8px] font-bold text-[#8B8B8B]">{count}</span>
        </div>
      )}
    </button>
  );
};

export default TabItem;
