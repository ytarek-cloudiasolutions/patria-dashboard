import { Pencil, Trash2 } from "lucide-react";
import type { PricingRuleCardProps } from "../types";

const PricingRuleCard = ({ rule, onEdit, onDelete }: PricingRuleCardProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-[12px] border border-[#E5E5E5] bg-white">
      {/* Left: info */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[#28293D] text-[14px] font-semibold">{rule.name}</p>
        <p className="text-[#8B8B8B] text-[12px]">
          {rule.type} • {rule.value}%
        </p>
        <span className="inline-flex w-fit items-center rounded-[30px] border border-[#C9B0F5] bg-[#F3EEFF] px-2.5 py-0.5 text-[10px] font-semibold text-[#6B3FD4]">
          MIN {rule.minimumQuantity} UNITS
        </span>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(rule)}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#F5F0EA] text-[#8B8B8B] hover:text-[#28293D] transition-colors"
          aria-label="Edit pricing rule"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => onDelete(rule.id)}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#FFF0F0] text-[#8B8B8B] hover:text-[#C90000] transition-colors"
          aria-label="Delete pricing rule"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default PricingRuleCard;
