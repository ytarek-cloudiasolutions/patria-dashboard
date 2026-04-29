import { ChevronUp, ChevronDown } from "lucide-react";

interface AdjustQuantityCellProps {
  productId: string;
  value: number;
  isActive: boolean;
  onChange: (productId: string, value: number) => void;
  onActivate: (productId: string) => void;
}

const AdjustQuantityCell = ({
  productId,
  value,
  isActive,
  onChange,
  onActivate,
}: AdjustQuantityCellProps) => {
  const increment = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(productId, value + 1);
  };

  const decrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value > 0) onChange(productId, value - 1);
  };

  if (!isActive) {
    return (
      <div
        onClick={() => onActivate(productId)}
        className="flex h-11 w-[140px] cursor-pointer items-center justify-center rounded-[10px] border border-[#E5E5E5] bg-white px-3 text-[14px] text-[#28293D] hover:border-[#5C4A0E] hover:bg-[#F5F0EA] transition-colors select-none"
      >
        {value}
      </div>
    );
  }

  return (
    <div className="flex h-11 w-[140px] items-center overflow-hidden rounded-[10px] border border-[#5C4A0E] bg-[#5C4A0E]">
      {/* Current value */}
      <span className="flex-1 text-center text-[14px] font-semibold text-white">
        {value}
      </span>

      {/* Up / Down controls */}
      <div className="flex flex-col border-l border-[#7A6518]">
        <button
          onClick={increment}
          className="flex h-[22px] w-8 items-center justify-center text-white hover:bg-[#7A6518] transition-colors cursor-pointer"
        >
          <ChevronUp size={12} strokeWidth={3} />
        </button>
        <button
          onClick={decrement}
          className="flex h-[22px] w-8 items-center justify-center border-t border-[#7A6518] text-white hover:bg-[#7A6518] transition-colors cursor-pointer"
        >
          <ChevronDown size={12} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default AdjustQuantityCell;
