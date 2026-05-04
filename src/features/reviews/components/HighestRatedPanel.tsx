import { Truck, Zap, DollarSign, Award } from "lucide-react";
import type { HighestRatedCategory } from "../types";

interface HighestRatedPanelProps {
  categories: HighestRatedCategory[];
}

const iconMap: Record<string, React.ReactNode> = {
  truck: <Truck size={15} className="text-[#7A6518]" />,
  zap: <Zap size={15} className="text-[#5C6EAE]" />,
  dollar: <DollarSign size={15} className="text-[#1A7A45]" />,
};

const HighestRatedPanel = ({ categories }: HighestRatedPanelProps) => {
  return (
    <div className="rounded-[16px] border border-[#E5E5E5] bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[15px] font-bold text-[#28293D]">
          Highest Rated
        </span>
        <Award size={16} className="text-[#6B6B6B]" />
      </div>

      <div className="flex flex-col gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between rounded-[10px] border border-[#E5E5E5] bg-[#FAFAF8] px-4 py-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F0EA]">
                {iconMap[cat.icon]}
              </div>
              <span className="text-[13px] font-semibold text-[#28293D]">
                {cat.label}
              </span>
            </div>
            <span className="text-[13px] font-bold text-[#28293D]">
              {cat.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighestRatedPanel;
