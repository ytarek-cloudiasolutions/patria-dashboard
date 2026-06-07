import { Star } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import type { RatingDistributionRow } from "../types";

interface RatingDistributionCardProps {
  rows: RatingDistributionRow[];
}

const RatingDistributionCard = ({ rows }: RatingDistributionCardProps) => {
  const total = rows.reduce((sum, r) => sum + r.count, 0);
  const max = Math.max(...rows.map((r) => r.count), 1);

  return (
    <Card className="overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white py-0 ring-0 shadow-sm">
      {/* Tinted header */}
      <div className="flex items-center justify-between bg-[#F5F0EA] px-5 py-3 sm:px-6 sm:py-4">
        <h3 className="text-[15px] font-semibold text-[#28293D] sm:text-[16px]">
          Distribution of ratings
        </h3>
        <Star className="size-6 text-[#000000]" />
      </div>

      <div className="flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6">
        {rows.map((row) => {
          const percent = total === 0 ? 0 : (row.count / max) * 100;
          return (
            <div
              key={row.stars}
              className="grid grid-cols-[2.25rem_1fr_1.75rem] items-center gap-3"
            >
              <span className="flex items-center gap-1 text-[13px] font-bold text-[#28293D]">
                {row.stars}
                <Star className="size-3 fill-[#F6B73C] text-[#F6B73C]" />
              </span>
              <div
                className={`relative h-4 w-full overflow-hidden rounded-[6px] border border-[#E5E5E5] ${
                  row.count > 0 ? "bg-[#E5E5E5]" : "bg-[#FAFAF7]"
                }`}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-[linear-gradient(90deg,#FFC76C_0%,#F68E0E_100%)]"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-right text-[13px] font-bold text-[#28293D]">
                {row.count}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RatingDistributionCard;
