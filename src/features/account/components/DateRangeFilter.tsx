import { Calendar } from "lucide-react";

interface DateRangeFilterProps {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}

const DateRangeFilter = ({
  from,
  to,
  onFromChange,
  onToChange,
}: DateRangeFilterProps) => {
  return (
    <div className="flex gap-4">
      {/* From */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="From"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="w-full h-12 pl-4 pr-12 rounded-[12px] border border-[#E5E5E5] bg-white text-[#23252A] text-[15px] placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#8B6914] transition-colors"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8B8B] hover:text-[#28293D] transition-colors">
          <Calendar size={18} />
        </button>
      </div>

      {/* To */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="To"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="w-full h-12 pl-4 pr-12 rounded-[12px] border border-[#E5E5E5] bg-white text-[#23252A] text-[15px] placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#8B6914] transition-colors"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8B8B] hover:text-[#28293D] transition-colors">
          <Calendar size={18} />
        </button>
      </div>
    </div>
  );
};

export default DateRangeFilter;