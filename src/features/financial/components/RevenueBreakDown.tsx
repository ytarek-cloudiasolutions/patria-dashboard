import { Info } from "lucide-react";
import type { Transaction } from "../types";

interface Props {
  transactions: Transaction[];
}

const RevenueBreakdown = ({ transactions }: Props) => {
  // Group expenses by category
  const grouped = transactions
    .filter((t) => t.type === "expense")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.statement] = (acc[t.statement] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const maxVal = Math.max(...Object.values(grouped), 1);

  return (
    <div className="bg-white rounded-[16px] border border-[#E5E5E5] p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Info className="size-4 text-[#8B8B8B]" />
        <h3 className="text-[14px] font-semibold text-[#28293D]">
          Revenues versus expenses
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {Object.entries(grouped).map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[13px]">
              <span className="text-[#28293D] font-medium">{label}</span>
              <span className="text-[#8B8B8B]">
                EGP {value.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-[#F5F0EA] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5C4A1E] rounded-full transition-all"
                style={{ width: `${(value / maxVal) * 100}%` }}
              />
            </div>
          </div>
        ))}

        {Object.keys(grouped).length === 0 && (
          <p className="text-[13px] text-[#8B8B8B]">
            No expense data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default RevenueBreakdown;
