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
        "flex h-12 items-center justify-center gap-2 border-b-2 text-[15px] font-medium transition-colors cursor-pointer",
        isActive
          ? "border-primary text-[#333333]"
          : "border-[#8B8B8B] text-[#8B8B8B]"
      )}
    >
      {Icon && <Icon className="size-6" />}
      {label}
      {count !== undefined && (
        <div className="flex items-center justify-center w-5 h-4.5 bg-[#F5F0EA] p-1 rounded-[50px]">
          <span className="text-[8px] font-bold text-[#8B8B8B]">{count}</span>
        </div>
      )}
    </button>
  );
};

export default TabItem;
