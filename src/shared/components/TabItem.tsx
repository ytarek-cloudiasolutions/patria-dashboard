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
        "group flex h-11 w-full items-center justify-center gap-1.5 border-b-2 px-2 text-[13px] font-semibold transition-all duration-200 ease-out cursor-pointer active:scale-[0.99] sm:h-12 sm:gap-2 sm:text-[15px]",
        isActive
          ? "border-primary text-[#333333]"
          : "border-[#8B8B8B] font-medium text-[#8B8B8B] hover:text-[#333333] hover:border-primary/50"
      )}
    >
      {Icon && <Icon className="size-5 shrink-0 transition-transform duration-200 ease-out group-hover:scale-110 sm:size-6" />}
      <span className="truncate">{label}</span>
      {count !== undefined && (
        <div className="flex items-center justify-center min-w-5 h-4.5 bg-[#F5F0EA] px-1 rounded-[50px] transition-transform duration-200 ease-out group-hover:scale-105">
          <span className="text-[8px] font-bold text-[#8B8B8B]">{count}</span>
        </div>
      )}
    </button>
  );
};

export default TabItem;
